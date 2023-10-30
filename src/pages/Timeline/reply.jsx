import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faEnvelope } from "@fortawesome/fontawesome-free-solid";
//import { faMagnifyingGlassArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faBell } from "@fortawesome/fontawesome-free-solid";
import { faQuestion } from "@fortawesome/fontawesome-free-solid";
import { faPaperPlane } from "@fortawesome/fontawesome-free-solid";
//import { faXmark } from "@fortawesome/fontawesome-free-solid";
import { addDoc } from "firebase/firestore";
import { app } from "../../services/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import {
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    onSnapshot,
    collection,
    where,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import {
    formatDistanceToNow,
    isToday,
    isYesterday,
    differenceInDays,
} from "date-fns";



const db = getFirestore(app);



function ReplyDisplay({ reply, userId, mode }) {
    const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
    const [likes, setLikes] = useState(reply.likes);
    const [dislikes, setDislikes] = useState(reply.deslikes);
    const postDate = new Date(reply.time);
    console.log(postDate)
    const now = new Date();
    let timeAgo;
    const [imageSent, setImageSent] = useState(null);
    const [nomeEnvio, setNomeEnvio] = useState(null);
    const [userEnvio, setUserEnvio] = useState(null);
    const [modo, setModo] = useState(mode);
    const [modoResposta, setModoResposta] = useState("publico");

    // const handleModoRespostaChange = (modo) => {
    //     setModoResposta(modo);
    // };

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
    
        // Verificar se o usuário já curtiu a postagem na coleção "interactions"
        const userAlreadyLiked = await checkUserInteraction(userId, reply.replyId);
        console.log(userAlreadyLiked);
    
        if (!userAlreadyLiked) {
          // Incrementar o número de likes localmente
          const newLikes = likes + 1;
          setLikes(newLikes);
    
          const q = query(
            collection(db, "replys"),
            where("replyId", "==", reply.replyId)
          );
    
          try {
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
              const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente
    
              // Atualizar o campo "likes" no documento
              await updateDoc(doc(db, "replys", postDoc.id), { likes: newLikes });
              console.log("Likes atualizados no Firebase com sucesso!");
    
              // Adicionar a interação na coleção "interactions"
              await addInteraction(userId, reply.replyId, "like");
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
            where("replyId", "==", reply.replyId),
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
                collection(db, "replys"),
                where("replyId", "==", reply.replyId)
              );
              const querySnapshotTimeline = await getDocs(qTimeline);
    
              if (!querySnapshotTimeline.empty) {
                const postDocTimeline = querySnapshotTimeline.docs[0];
                await updateDoc(doc(db, "replys", postDocTimeline.id), {
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
    
      // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
      const checkUserInteraction = async (userId, postId) => {
        try {
          const db = getFirestore(app);
          const interactionsRef = collection(db, "interactions");
          const queryInteraction = query(
            interactionsRef,
            where("userId", "==", userId),
            where("replyId", "==", postId),
            where("interaction", "==", "like")
          );
    
          const querySnapshot = await getDocs(queryInteraction);
    
          return !querySnapshot.empty;
        } catch (error) {
          console.error("Erro ao verificar interação: ", error);
          return false;
        }
      };
    
      // Função para adicionar a interação na coleção "interactions"
      const addInteraction = async (userId, postId, interactionType) => {
        try {
          const db = getFirestore(app);
          const interactionsRef = collection(db, "interactions");
          const newInteraction = {
            userId: userId,
            replyId: postId,
            interaction: interactionType,
          };
    
          await addDoc(interactionsRef, newInteraction);
          console.log("Interação registrada com sucesso.");
        } catch (error) {
          console.error("Erro ao registrar interação: ", error);
        }
      };

      const checkUserDislikeInteraction = async (userId, postId) => {
        try {
          const db = getFirestore(app);
          const interactionsRef = collection(db, "interactions");
          const queryInteraction = query(
            interactionsRef,
            where("userId", "==", userId),
            where("replyId", "==", postId),
            where("interaction", "==", "dislike")
          );
    
          const querySnapshot = await getDocs(queryInteraction);
    
          return !querySnapshot.empty;
        } catch (error) {
          console.error("Erro ao verificar interação de deslike: ", error);
          return false;
        }
      };
    
      // Função para adicionar ou remover a interação de deslike na coleção "interactions"
      const addOrRemoveDislikeInteraction = async (
        userId,
        postId,
        interactionType
      ) => {
        const db = getFirestore(app);
        const interactionsRef = collection(db, "interactions");
    
        // Verificar se o usuário já interagiu com a postagem
        const existingDislikeInteraction = await checkUserDislikeInteraction(
          userId,
          postId
        );
    
        if (existingDislikeInteraction) {
          // Se já houver uma interação de deslike, remova-a
          const queryRemoveInteraction = query(
            interactionsRef,
            where("userId", "==", userId),
            where("replyId", "==", postId),
            where("interaction", "==", interactionType)
          );
    
          const querySnapshotRemove = await getDocs(queryRemoveInteraction);
    
          if (!querySnapshotRemove.empty) {
            const interactionDoc = querySnapshotRemove.docs[0];
            setDislikes(dislikes - 1);
            await deleteDoc(interactionDoc.ref);
    
            console.log(`Deslike removido com sucesso!`);
          }
        } else {
          // Se o usuário ainda não interagiu com a postagem, adicione a interação de deslike
          const newInteraction = {
            userId: userId,
            replyId: postId,
            interaction: interactionType,
          };
    
          await addDoc(interactionsRef, newInteraction);
          console.log(`Deslike registrado com sucesso!`);
        }
      };
    
      // Função para adicionar a interação de deslike na coleção "interactions"
      const addDislikeInteraction = async (userId, postId) => {
        addOrRemoveDislikeInteraction(userId, postId, "dislike");
      };
    
      // Função para lidar com o clique em "deslike"
      const handleDislikeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
    
        // Verificar se o usuário já interagiu com a postagem na coleção "interactions"
        const userAlreadyDisliked = await checkUserDislikeInteraction(
          userId,
          reply.replyId
        );
    
        if (!userAlreadyDisliked) {
          // Atualizar o número de deslikes localmente
          const newDislikes = dislikes + 1;
          setDislikes(newDislikes);
    
          // Adicionar a interação de deslike na coleção "interactions"
          addDislikeInteraction(userId, reply.replyId);
        } else {
          // Remover a interação de deslike da coleção "interactions"
          const db = getFirestore(app);
          const interactionsRef = collection(db, "interactions");
          const queryInteraction = query(
            interactionsRef,
            where("userId", "==", userId),
            where("replyId", "==", reply.replyId),
            where("interaction", "==", "dislike")
          );
    
          try {
            const querySnapshotInteraction = await getDocs(queryInteraction);
    
            if (!querySnapshotInteraction.empty) {
              const interactionDoc = querySnapshotInteraction.docs[0];
              await deleteDoc(interactionDoc.ref);
              console.log("Deslike removido com sucesso!");
              const newDislikes = dislikes - 1;
              setDislikes(newDislikes);
              console.log("Deslike removido com sucessoaaa!");
            }
          } catch (error) {
            console.error("Erro ao remover deslike: ", error);
          }
        }
      };

    const getUserData = async () => {
        try {
            const db = getFirestore(); // Obtenha a instância do Firestore do seu arquivo de configuração do Firebase
            const userDocRef = doc(db, "users", reply.userSent); // Referência para o documento do usuário com base no ID

            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();

                if (reply.mode == "anon") {
                    setImageSent("https://media.discordapp.net/attachments/871728576972615680/1148261217840926770/logoanon.png?width=473&height=473");
                    setNomeEnvio(userData.pseudonimo);
                    setUserEnvio("ceferno 😈");
                } else {
                    setImageSent(userData.imageUrl);
                    setNomeEnvio(userData.nome);
                    setUserEnvio(userData.usuario);
                }
                return userData;
            } else {
                // O usuário não foi encontrado
                return null;
            }
        } catch (error) {
            console.error("Erro ao obter dados do usuário:", error);
            throw error; // Você pode optar por tratar o erro aqui ou lançá-lo para ser tratado onde a função for chamada
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

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



    // const [isReplying, setIsReplying] = useState(false);
    // const [replyText, setReplyText] = useState("");
    // const [showReplies, setShowReplies] = useState(false);
    // const [replies, setReplies] = useState([]);

    // // Função para buscar e definir as respostas do post
    // const fetchReplies = async () => {
    //     const repliesQuery = query(
    //         collection(db, "replys"),
    //         where("messageReplyed", "==", post.id)
    //     );
    //     const repliesSnapshot = await getDocs(repliesQuery);
    //     const repliesData = [];

    //     repliesSnapshot.forEach((doc) => {
    //         repliesData.push({ id: doc.id, ...doc.data() });
    //     });

    //     setReplies(repliesData);
    // };

    // // UseEffect para buscar as respostas quando showReplies mudar
    // useEffect(() => {
    //     if (showReplies) {
    //         fetchReplies();
    //     }
    // }, [showReplies]);

    // // Função para mostrar/ocultar as respostas
    // const toggleReplies = () => {
    //     setShowReplies(!showReplies);
    // };


    // const toggleReply = () => {
    //     setIsReplying(!isReplying);
    // };

    // const handleReply = async () => {
    //     const date = new Date();
    //     const timestamp = date.getTime();
    //     const newReplyData = {
    //         deslikes: 0,
    //         likes: 0,
    //         mode: modoResposta,
    //         time: timestamp,
    //         messageReplyed: reply.messageReplyed,
    //         replyId: 1,
    //         text: replyText, // O texto da resposta
    //         userReplyed: reply.userSent,
    //         userSent: userLoggedData.id,
    //     };

    //     try {
    //         const response = await addDoc(collection(db, "replys"), newReplyData);;
    //         console.log("Resposta enviada com sucesso com ID: ", response.id);
    //         setIsReplying(false);
    //         setReplyText("");
    //     } catch (error) {
    //         console.error("Erro ao enviar a resposta: ", error);
    //     }
    // };


    

    return (
        <>
            <div className="reply tl-box" key={reply.id}>
                <div className="tl-post">
                    <div className="tl-ps-header">
                        <div className="tl-ps-foto">
                            {imageSent && (
                                <img src={imageSent} alt="" />
                            )}
                        </div>
                        <div className="tl-ps-nomes">
                            <p className="tl-ps-nome">
                                {nomeEnvio}{" "}
                                <span className="tl-ps-user">@{userEnvio} </span>
                                <span className="tl-ps-tempo">• {timeAgo}</span>
                            </p>
                        </div>
                    </div>
                    <div className="tl-ps-texto">
                        <br />
                        <p>{reply.text}</p>
                        <br />
                    </div>
                    <div className="tl-ps-footer">
                        <div className="tl-ps-opcoes">
                            <div className="tl-ps-reply">
                                <FontAwesomeIcon icon={faComment} />
                                <span>{reply.replyCount}</span>
                            </div>
                            <div className="tl-ps-like" onClick={handleLikeClick}>
                                <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes}</span>
                            </div>
                            <div className="tl-ps-deslike" onClick={handleDislikeClick}>
                                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                                <span>{dislikes}</span>
                            </div>
                        </div>
                    </div>
                    {/* {isReplying && (
                        <div className="tl-reply">
                            <textarea
                                placeholder="Escreva sua resposta..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            ></textarea>
                            <button onClick={handleReply}>Responder</button>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
}

export default ReplyDisplay;
