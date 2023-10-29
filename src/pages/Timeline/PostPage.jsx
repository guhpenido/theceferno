import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faShare } from "@fortawesome/fontawesome-free-solid";
//import { faMagnifyingGlassArrowRight } from "@fortawesome/fontawesome-free-solid";

//import { faXmark } from "@fortawesome/fontawesome-free-solid";
import { app } from "../../services/firebaseConfig";
import { getFirestore, startAfter } from "firebase/firestore";
//import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import {
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    collection,
    where,
    query,
    orderBy, updateDoc,
    limit,
} from "firebase/firestore";

import { addDoc } from "firebase/firestore";
import {
    formatDistanceToNow,
    isToday,
    isYesterday,
    differenceInDays,
} from "date-fns";
import ReplyDisplay from "./reply";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function PostPage() {
    const location = useLocation();
    const { userSentData, userMentionedData, userLoggedData } = location.state;
    const { postId } = useParams();
    const postIdInt = parseInt(postId, 10);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
    const [isFetching, setIsFetching] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [likes, setLikes] = useState(null);
    const [deslikes, setDeslikes] = useState(null);
    const [text, setText] = useState(null);
    const [mode, setMode] = useState(null);
    const [userSent, setUserSent] = useState(null);
    const [userMentioned, setUserMentioned] = useState(null);
    const [time, setTime] = useState(null);
    const [modoResposta, setModoResposta] = useState("public");
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    useEffect(() => {
        console.log("useEffect está sendo executado!");
        if (isFetching) {
            fetchPostAndComments().then(() => {
                setIsFetching(false);
            });
        }
    }, [isFetching]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                setUserId(user.uid);
                console.log(user);
                fetchPostAndComments();
            } else {
                navigate("/login");
            }
        });


        return () => unsubscribe();
    }, [auth, navigate]);

    const fetchPostAndComments = async () => {
        if (!postIdInt) {
            console.log("postId não está definido.");
            return;
        }
        const q = query(collection(db, "timeline"), where("postId", "==", postIdInt));
        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0];

                const postData = postDoc.data();

                console.log("Dados do post:", postData);
                setLikes(postData.likes);
                setDeslikes(postData.deslikes);
                setText(postData.text);
                setMode(postData.mode);
                setUserSent(postData.userSent);
                setUserMentioned(postData.userMentioned);
                setTime(postData.time);
            } else {
                console.log("Post não encontrado.");
                setPost(null);
            }

        } catch (error) {
            console.error("Erro ao obter o post e os comentários: ", error);
        }
    };
    fetchPostAndComments();

    const postDate = new Date(time);
    const now = new Date();
    let timeAgo;

    const copyToClipboard = () => {
        const postLink = window.location.href; // Obtém o URL da página
        navigator.clipboard.writeText(postLink); // Copia o URL para a área de transferência
        alert("Link copiado para a área de transferência: " + postLink); // Exibe um alerta informando que o link foi copiado
    };

    const handleLikeClick = async (e) => {
        // Incrementar o número de likes localmente
        const newLikes = likes + 1;
        setLikes(newLikes);

        // Atualizar o número de likes no Firebase
        const q = query(collection(db, "timeline"), where("postId", "==", postIdInt));

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

                // Atualizar o campo "likes" no documento
                await updateDoc(doc(db, "timeline", postDoc.id), { likes: newLikes });
                console.log("Likes atualizados no Firebase com sucesso!");
            } else {
                console.error("Post não encontrado no Firebase.");
                // Reverter a contagem local de likes em caso de erro
                setLikes(likes);
            }
        } catch (error) {
            console.error("Erro ao atualizar likes no Firebase: ", error);
            // Reverter a contagem local de likes em caso de erro
            setLikes(likes);
        }
    };
    // Calcule a diferença em segundos entre as datas
    const secondsAgo = Math.floor((now - postDate) / 1000);

    if (secondsAgo < 60) {
        timeAgo = `${secondsAgo} segundo${secondsAgo !== 1 ? "s" : ""} atrás`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        timeAgo = `${minutesAgo} minuto${minutesAgo !== 1 ? "s" : ""} atrás`;
    } else if (isToday(postDate)) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        timeAgo = `${hoursAgo} hora${hoursAgo !== 1 ? "s" : ""} atrás`;
    } else if (isYesterday(postDate)) {
        timeAgo = "Ontem";
    } else {
        const daysAgo = differenceInDays(now, postDate);
        timeAgo = `${daysAgo} dia${daysAgo !== 1 ? "s" : ""} atrás`;
    }

    let imageSent = null;
    let nomeEnvio = null;
    let userEnvio = null;
    if (mode == "anon") {
        imageSent =
            "https://media.discordapp.net/attachments/871728576972615680/1148261217840926770/logoanon.png?width=473&height=473";
        nomeEnvio = userSentData.pseudonimo;
        userEnvio = "ceferno 😈";
    } else {
        nomeEnvio = userSentData.nome;
        imageSent = userSentData.imageUrl;
        userEnvio = userSentData.usuario;
    }

    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(true);
    const [replies, setReplies] = useState([]);
    const [nextReplyId, setNextReplyId] = useState(0);

    const fetchLatestReplyId = async () => {
        try {
            const postsRef = collection(db, "timeline");
            const querySnapshot = await getDocs(
                query(postsRef, orderBy("replyId", "desc"), limit(1))
            ); // Obtém o último reply com o ID mais alto
            if (!querySnapshot.empty) {
                const latestReply = querySnapshot.docs[0].data();
                const replyIdAsNumber = parseInt(latestReply.replyId, 10);
                console.log(replyIdAsNumber);
                setNextReplyId(replyIdAsNumber + 1); // Define o próximo ID disponível com base no último ID
            }
        } catch (error) {
            console.error("Error fetching latest post ID:", error.message);
        }
    };

    useEffect(() => {
        fetchLatestReplyId();
    }, []);

    const handleModoRespostaChange = (modo) => {
        setModoResposta(modo);
    };


    // Função para buscar e definir as respostas do post
    const fetchReplies = async () => {
        const db = getFirestore(app);
        const repliesQuery = query(
            collection(db, "replys"),
            where("messageReplyed", "==", postIdInt)
        );
        const repliesSnapshot = await getDocs(repliesQuery);
        const repliesData = [];

        repliesSnapshot.forEach((doc) => {
            repliesData.push({ id: doc.id, ...doc.data() });
        });

        setReplies(repliesData);
    };

    // UseEffect para buscar as respostas quando showReplies mudar
    useEffect(() => {
        if (showReplies) {
            fetchReplies();
        }
    }, [showReplies]);


    const toggleReply = () => {
        setIsReplying(!isReplying);
    };

    const handleReply = async () => {
        const db = getFirestore(app);
        const date = new Date();
        const timestamp = date.getTime();
        const newReplyData = {
            deslikes: 0,
            likes: 0,
            mode: modoResposta,
            time: timestamp,
            messageReplyed: postIdInt,
            replyId: nextReplyId,
            text: replyText, // O texto da resposta
            userReplyed: userSentData.id,
            userSent: userLoggedData.id,
        };

        try {
            const response = await addDoc(collection(db, "replys"), newReplyData);;
            console.log("Resposta enviada com sucesso com ID: ", response.id);
            setIsReplying(false);
            setReplyText("");
        } catch (error) {
            console.error("Erro ao enviar a resposta: ", error);
        }
    };

    const handleSavePost = async (e, postId) => {
        try {
            // Obtém o usuário atualmente autenticado
            const user = userId;
            console.log(user);
            if (user) {
                // Obtém a referência do documento do usuário no banco de dados
                const userDocRef = doc(db, "users", user);

                // Obtém o documento do usuário
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                // Verifica se o savedPosts existe no documento do usuário
                if (userData.savedPosts) {
                    // Verifica se o postId já existe no array savedPosts
                    if (!userData.savedPosts.includes(postId)) {
                        // Cria uma nova array com o postId adicionado
                        const updatedSavedPosts = [...userData.savedPosts, postId];

                        // Atualiza o documento do usuário com o novo array savedPosts
                        await updateDoc(userDocRef, {
                            savedPosts: updatedSavedPosts
                        });

                        console.log("Post salvo com sucesso!");
                    } else {
                        console.log("Post já está salvo.");
                    }
                } else {
                    // Se savedPosts não existe, cria um novo array com o postId
                    await updateDoc(userDocRef, {
                        savedPosts: [postId]
                    });

                    console.log("Post salvo com sucesso!");
                }
            } else {
                console.log("Usuário não autenticado.");
            }
        } catch (error) {
            console.error("Erro ao salvar o post: ", error);
        }
    };



    return (
        <>
            <div className="tl-screen">
                <div className="tl-container">
                    <div className="tl-header">
                        <div className="tl-header1">
                            <Link className="tl-foto" to="/perfil">
                                <div>
                                    <img src={userLoggedData.imageUrl} alt="Perfil" />
                                </div>
                            </Link>
                            <div className="tl-logo">
                                <img
                                    src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="tl-titulo">
                            <h1>Timeline</h1>
                        </div>
                    </div>
                    <div className="tl-main">
                        <div className="tl-container">
                            <div className="tl-box">
                                <div className="tl-post">
                                    <div className="tl-ps-header">
                                        <div className="tl-ps-foto">
                                            {imageSent && (
                                                <img src={imageSent} alt="" />
                                            )}
                                        </div>
                                        {userMentioned !== null ? (
                                            <div className="tl-ps-nomes">
                                                <p className="tl-ps-nome">
                                                    {nomeEnvio}{" "}
                                                    <span className="tl-ps-user">@{userEnvio} </span>
                                                    <span className="tl-ps-tempo">• {timeAgo}</span>
                                                    <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                                                    {userMentionedData && (
                                                        <img src={userMentionedData.imageUrl} alt="" />
                                                    )}
                                                    {userMentionedData && (
                                                        <>
                                                            {" "}
                                                            {userMentionedData.nome}{" "}
                                                            <span className="tl-ps-userReceived">
                                                                @{userMentionedData.usuario}{" "}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="tl-ps-nomes">
                                                <p className="tl-ps-nome">
                                                    {nomeEnvio}{" "}
                                                    <span className="tl-ps-user">@{userEnvio} </span>
                                                    <span className="tl-ps-tempo">• {timeAgo}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="tl-ps-texto">
                                        <p>{text}</p>
                                    </div>
                                    <div className="tl-ps-footer">
                                        <div className="tl-ps-opcoes">
                                            <div className="tl-ps-reply">
                                                <FontAwesomeIcon icon={faComment} onClick={toggleReply} />
                                                <span></span>
                                            </div>
                                            <div className="tl-ps-like" onClick={(e) => {
                                                e.stopPropagation();
                                                handleLikeClick(e);
                                            }}>
                                                <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes}</span>
                                            </div>
                                            <div className="tl-ps-deslike">
                                                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                                                <span>{deslikes}</span>
                                            </div>
                                            <div className="tl-ps-salvar" onClick={(e) => { handleSavePost(e, postIdInt) }}>
                                                <FontAwesomeIcon icon={faBookmark} />{" "}
                                            </div>
                                            <div className="tl-ps-share" onClick={copyToClipboard}>
                                                <FontAwesomeIcon icon={faShare} />{" "}
                                            </div>
                                        </div>
                                    </div>
                                    {isReplying && (
                                        <div className="tl-reply-section">
                                            <div className="tl-modo-resposta">
                                                <label className="tl-modo-resposta-label">
                                                    <input type="radio" value="publico" checked={modoResposta === "public"} onChange={() => handleModoRespostaChange("public")} />
                                                    Público
                                                </label>
                                                <label className="tl-modo-resposta-label">
                                                    <input type="radio" value="anonimo" checked={modoResposta === "anon"} onChange={() => handleModoRespostaChange("anon")} />
                                                    Anônimo
                                                </label>
                                            </div>
                                            <textarea className="tl-reply-textarea" placeholder="Escreva sua resposta..." value={replyText} onChange={(e) => setReplyText(e.target.value)}></textarea>
                                            <button className="tl-reply-button" onClick={handleReply}>Responder</button>
                                        </div>

                                    )}

                                </div>
                            </div>
                            {showReplies && (
                                <div className="replies-container">
                                    {replies.map((reply) => (
                                        <ReplyDisplay
                                            key={reply.id}
                                            reply={reply}
                                            user={userLoggedData}
                                            mode={modoResposta}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {isFetching && <p>Carregando mais posts...</p>}
                    </div>
                </div>

            </div>

        </>
    );
};

export default PostPage;