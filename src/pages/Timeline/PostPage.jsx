import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faArrowLeft } from "@fortawesome/fontawesome-free-solid";
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
    deleteDoc,
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
import homeIcon from "../../assets/home-icon.svg";
import perfilIcon from "../../assets/perfil-icon.svg";
import setaPostar from "../../assets/seta-postar.svg";
import dmIcon from "../../assets/dm-icon.svg";
import { Acessibilidade } from "../Acessibilidade/index";


function PostPage() {
    const location = useLocation();
    const { userSentData, userMentionedData } = location.state;
    const { postId } = useParams();
    const [userLoggedData, setUserLoggedData] = useState(null);
    const postIdInt = parseInt(postId, 10);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [text, setText] = useState(null);
    const [mode, setMode] = useState(null);
    const [userSent, setUserSent] = useState(null);
    const [userMentioned, setUserMentioned] = useState(null);
    const [time, setTime] = useState(null);
    const [modoResposta, setModoResposta] = useState("public");
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
    const [likes, setLikes] = useState(null);
    const [dislikes, setDislikes] = useState(null);
    const [profile, setProfile] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
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
                fetchUserDataAndSetState(user.uid);
                fetchPostAndComments();
            } else {
                navigate("/login");
            }
        });


        return () => unsubscribe();
    }, [auth, navigate]);

    const fetchUserDataAndSetState = async (userId) => {
        console.log(userId);
        try {
          const userLoggedDataResponse = await fetchUserData(userId);
          setSelectedProfile(userLoggedDataResponse.usuario);
          setUserLoggedData({
            id: userLoggedDataResponse.id,
            usuario: userLoggedDataResponse.usuario,
            pseudonimo: userLoggedDataResponse.pseudonimo,
            imageUrl: userLoggedDataResponse.imageUrl,
            nome: userLoggedDataResponse.nome,
          });
          setProfile({
            username: userLoggedDataResponse.pseudonimo,
            photoURL:
                "https://cdn.discordapp.com/attachments/812025565615882270/1142990318845821058/image.png",
        });
          setIsLoadingUser(false); // Data has been fetched, no longer loading
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          setIsLoadingUser(false); // Even if there's an error, stop loading
        }
      };

    const fetchUserData = async (userId) => {
        try {
          if (!userId) {
            console.error("Invalid userId");
            return null;
          }
    
          const userDocRef = doc(db, "users", userId);
    
          const userDoc = await getDoc(userDocRef);
    
          if (userDoc.exists()) {
            return userDoc.data();
          } else {
            console.log("User not found");
            return null;
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          return null;
        }
      };

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
                setDislikes(postData.deslikes);
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

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Verificar se o usuário já curtiu a postagem na coleção "interactions"
        const userAlreadyLiked = await checkUserInteraction(userId, postIdInt);

        if (!userAlreadyLiked) {
            // Incrementar o número de likes localmente
            const newLikes = likes + 1;
            setLikes(newLikes);

            // Atualizar o número de likes no Firebase na coleção "timeline"
            const db = getFirestore(app);
            const q = query(
                collection(db, "timeline"),
                where("postId", "==", postIdInt)
            );

            try {
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

                    // Atualizar o campo "likes" no documento
                    await updateDoc(doc(db, "timeline", postDoc.id), { likes: newLikes });
                    console.log("Likes atualizados no Firebase com sucesso!");

                    // Adicionar a interação na coleção "interactions"
                    await addInteraction(userId, postIdInt, "like");
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
        } else {
            // Remover a interação da coleção "interactions"
            const db = getFirestore(app);
            const interactionsRef = collection(db, "interactions");
            const queryInteraction = query(
                interactionsRef,
                where("userId", "==", userId),
                where("postId", "==", postIdInt),
                where("interaction", "==", "like")
            );

            try {
                const querySnapshotInteraction = await getDocs(queryInteraction);

                if (!querySnapshotInteraction.empty) {
                    const interactionDoc = querySnapshotInteraction.docs[0];
                    await deleteDoc(interactionDoc.ref);
                    console.log("Like removido com sucesso!");

                    // Decrementar o número de likes na coleção "timeline"
                    const newLikes = likes - 1;
                    setLikes(newLikes);
                    const qTimeline = query(
                        collection(db, "timeline"),
                        where("postId", "==", postIdInt)
                    );
                    const querySnapshotTimeline = await getDocs(qTimeline);

                    if (!querySnapshotTimeline.empty) {
                        const postDocTimeline = querySnapshotTimeline.docs[0];
                        await updateDoc(doc(db, "timeline", postDocTimeline.id), {
                            likes: newLikes,
                        });
                        console.log("Likes atualizados no Firebase com sucesso!");
                    }
                }
            } catch (error) {
                console.error("Erro ao remover like: ", error);
            }
        }
    };

    // Função para adicionar a interação na coleção "interactions"
    const addInteraction = async (userId, postId, interactionType) => {
        try {
            const db = getFirestore(app);
            const interactionsRef = collection(db, "interactions");
            const newInteraction = {
                userId,
                postId,
                interaction: interactionType,
            };

            await addDoc(interactionsRef, newInteraction);
            console.log("Interação registrada com sucesso.");
        } catch (error) {
            console.error("Erro ao registrar interação: ", error);
        }
    };

    // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
    const checkUserInteraction = async (userId, postId) => {
        try {
            const db = getFirestore(app);
            const interactionsRef = collection(db, "interactions");
            const queryInteraction = query(
                interactionsRef,
                where("userId", "==", userId),
                where("postId", "==", postId),
                where("interaction", "==", "like")
            );

            const querySnapshot = await getDocs(queryInteraction);

            return !querySnapshot.empty;
        } catch (error) {
            console.error("Erro ao verificar interação: ", error);
            return false;
        }
    };

    const handleDislikeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Verificar se o usuário já curtiu a postagem na coleção "interactions"
        const userAlreadyLiked = await checkUserDislikeInteraction(userId, postIdInt);

        if (!userAlreadyLiked) {
            // Incrementar o número de likes localmente
            const newDislikes = dislikes + 1;
            setDislikes(newDislikes);

            // Atualizar o número de likes no Firebase na coleção "timeline"
            const db = getFirestore(app);
            const q = query(
                collection(db, "timeline"),
                where("postId", "==", postIdInt)
            );

            try {
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

                    // Atualizar o campo "likes" no documento
                    await updateDoc(doc(db, "timeline", postDoc.id), { deslikes: newDislikes });
                    console.log("Deslikes atualizados no Firebase com sucesso!");

                    // Adicionar a interação na coleção "interactions"
                    await addInteraction(userId, postIdInt, "dislike");
                } else {
                    console.error("Post não encontrado no Firebase.");
                    // Reverter a contagem local de likes em caso de erro
                    setDislikes(dislikes);
                }
            } catch (error) {
                console.error("Erro ao atualizar likes no Firebase: ", error);
                // Reverter a contagem local de likes em caso de erro
                setDislikes(dislikes);
            }
        } else {
            // Remover a interação da coleção "interactions"
            const db = getFirestore(app);
            const interactionsRef = collection(db, "interactions");
            const queryInteraction = query(
                interactionsRef,
                where("userId", "==", userId),
                where("postId", "==", postIdInt),
                where("interaction", "==", "dislike")
            );

            try {
                const querySnapshotInteraction = await getDocs(queryInteraction);

                if (!querySnapshotInteraction.empty) {
                    const interactionDoc = querySnapshotInteraction.docs[0];
                    await deleteDoc(interactionDoc.ref);
                    console.log("Deslike removido com sucesso!");

                    // Decrementar o número de likes na coleção "timeline"
                    const newDislikes = dislikes - 1;
                    setDislikes(newDislikes);
                    const qTimeline = query(
                        collection(db, "timeline"),
                        where("postId", "==", postIdInt)
                    );
                    const querySnapshotTimeline = await getDocs(qTimeline);

                    if (!querySnapshotTimeline.empty) {
                        const postDocTimeline = querySnapshotTimeline.docs[0];
                        await updateDoc(doc(db, "timeline", postDocTimeline.id), {
                            deslikes: newDislikes,
                        });
                        console.log("Likes atualizados no Firebase com sucesso!");
                    }
                }
            } catch (error) {
                console.error("Erro ao remover like: ", error);
            }
        }
    };


    // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
    const checkUserDislikeInteraction = async (userId, postId) => {
        try {
            const db = getFirestore(app);
            const interactionsRef = collection(db, "interactions");
            const queryInteraction = query(
                interactionsRef,
                where("userId", "==", userId),
                where("postId", "==", postId),
                where("interaction", "==", "dislike")
            );

            const querySnapshot = await getDocs(queryInteraction);

            return !querySnapshot.empty;
        } catch (error) {
            console.error("Erro ao verificar interação: ", error);
            return false;
        }
    };

    const copyToClipboard = () => {
        const postLink = window.location.href; // Obtém o URL da página
        navigator.clipboard.writeText(postLink); // Copia o URL para a área de transferência
        alert("Link copiado para a área de transferência: " + postLink); // Exibe um alerta informando que o link foi copiado
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

    function ProfileImage() {
        // Determine qual perfil está selecionado e use o URL da imagem correspondente
        const profileImageUrl =
            (selectedProfile)
                ? userLoggedData.imageUrl
                : "https://cdn.discordapp.com/attachments/812025565615882270/1142990318845821058/image.png";

        return <img src={profileImageUrl} alt="Perfil" />;
    }

    const css = {
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "5px",
    };


    return (
        <>
            <div className="tl-screen">
                <div className="tl-container">
                    <div className="tl-header" style={css}>
                            <Link to="/timeline">
                                <FontAwesomeIcon className="arrow" icon={faArrowLeft} style={css} />
                            </Link>
                        <div className="tl-header-post header-active">
                            <h1>Para Você</h1>
                            <div className="header-active-in"></div>
                        </div>
                    </div>
                    <div className="tl-ladoEsquerdo">
                        <div className="lateral-wrapper">
                            <div className="lateral-estatica-dm">
                                <div className="lateral-header">
                                    <div className="imgProfilePic">
                                        <Link className="tl-foto" to="/perfil">
                                            <div>
                                                <ProfileImage selectedProfile={selectedProfile} />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="menu-lateral-dm">
                                    <Link className="botaoAcessar iconDm" to="/timeline">
                                        <div className="cada-icone-img-nome-dm">
                                            <img
                                                id="home"
                                                src={homeIcon}
                                                alt="Botão ir para Home"
                                            ></img>
                                            <div className="escrita-lateral-dm">
                                                <p className="escrita-lateral-dm">Timeline</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link className="botaoAcessar iconDm" to="/perfil">
                                        <div className="cada-icone-img-nome-dm">
                                            <img
                                                id="dm"
                                                src={perfilIcon}
                                                alt="Botão ir para o perfil"
                                            ></img>
                                            <div className="escrita-lateral-dm">
                                                <p className="escrita-lateral-dm">Perfil</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link className="botaoAcessar iconDm" to="/dm">
                                        <div className="cada-icone-img-nome-dm">
                                            <img
                                                id="dm"
                                                src={dmIcon}
                                                alt="Botão ir para DM, chat conversas privadas"
                                            ></img>
                                            <div className="escrita-lateral-dm">
                                                <p className="escrita-lateral-dm">DM</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link className="botaoAcessar a-postar-menu-lateral" to="/dm">
                                        <div className="botao-buscar-menu">
                                            <div className="postar-menu-lateral">
                                                <img
                                                    id="img-postar-menu-lateral-medio"
                                                    src={setaPostar}
                                                    alt="Botão ir para DM, chat conversas privadas"
                                                ></img>
                                                <p id="p-postar-menu-lateral">Postar</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="logoCeferno">
                                    <img
                                        src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png?ex=654f16a6&is=653ca1a6&hm=47f7d679b329ecf5cc49ea053019ef5d019999ddb77a0ba1a3dda31532ab55da&"
                                        alt=""
                                    />
                                </div>
                            </div>
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
                                        <br></br>
                                        <p>{text}</p>
                                        <br></br>
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
                                            <div className="tl-ps-deslike" onClick={(e) => {
                                                e.stopPropagation();
                                                handleDislikeClick(e);
                                            }}>
                                                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                                                <span>{dislikes}</span>
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
                        </div>
                        {isFetching && <p>Carregando mais posts...</p>}
                    </div>
                    <div className="tl-ladoDireito">
                        <div className="tl-ladoDireito-procurar">
                            <div className="procurar-box">
                                <div className="img-procurar-box">
                                    <div className="img-procurar-box-in">
                                        <img
                                            src="https://cdn.discordapp.com/attachments/871728576972615680/1167934652267368488/6328608.png?ex=654feee8&is=653d79e8&hm=15078133d7bcc63b14665f301890a83cf549dba37a671c8827a8c9c6e8c50c11&"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="procurar-box-input">
                                    <input type="text" placeholder="Procurar" />
                                </div>
                            </div>
                        </div>
                        <div className="tl-ladoDireito-doar">
                            <h1>Deseja doar para o CEFERNO?</h1>
                            <p>
                                O CEFERNO é um projeto estudantil, e para mantermos ele online
                                precisamos das doações.
                            </p>
                            <button>Doar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Acessibilidade />
        </>
    );
};

export default PostPage;