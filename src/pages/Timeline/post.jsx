import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faShare } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faEnvelope } from "@fortawesome/fontawesome-free-solid";
//import { faMagnifyingGlassArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faBell } from "@fortawesome/fontawesome-free-solid";
import { faQuestion } from "@fortawesome/fontawesome-free-solid";
import { faPaperPlane } from "@fortawesome/fontawesome-free-solid";
//import { faXmark } from "@fortawesome/fontawesome-free-solid";
import { app } from "../../services/firebaseConfig";
import { getFirestore, startAfter } from "firebase/firestore";
//import { getStorage, ref, getDownloadURL } from "firebase/storage";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import notificacaoIcon from "../../assets/notificacao-icon.svg";
import pesquisaIcon from "../../assets/pesquisa-icon.svg";
import {
  getDatabase,
  ref,
  orderByKey,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  where,
  query,
  orderBy,
  updateDoc,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { addDoc } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
} from "date-fns";
import ReplyDisplay from "./reply";
import VisitorPage from "../Perfil/ProfilePage/VisitorPage";
import { AppRoutes } from "../../routes/AppRoutes";
import Denuncia from "../Denuncia/Denuncia"; 


function PostDisplay({
  post,
  userSentData,
  userMentionedData,
  userId,
  userLoggedData,
}) {""

  const [denunciaVisible, setDenunciaVisible] = useState(false);

  const toggleh1Visibility = () => {
    setDenunciaVisible(!denunciaVisible);
  };

  
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.deslikes);
  const postDate = new Date(post.time);
  const now = new Date();
  let timeAgo;

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Verificar se o usuário já curtiu a postagem na coleção "interactions"
    const userAlreadyLiked = await checkUserInteraction(userId, post.id);

    if (!userAlreadyLiked) {
      // Incrementar o número de likes localmente
      const newLikes = likes + 1;
      setLikes(newLikes);

      // Atualizar o número de likes no Firebase na coleção "timeline"
      const db = getFirestore(app);
      const q = query(
        collection(db, "timeline"),
        where("postId", "==", post.id)
      );

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

          // Atualizar o campo "likes" no documento
          await updateDoc(doc(db, "timeline", postDoc.id), { likes: newLikes });
          console.log("Likes atualizados no Firebase com sucesso!");

          // Adicionar a interação na coleção "interactions"
          await addInteraction(userId, post.id, "like");
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
        where("postId", "==", post.id),
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
            where("postId", "==", post.id)
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

  const copyToClipboard = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const postLink = window.location.href + "/" + post.id; // Obtém o URL da página
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
  if (post.mode == "anon") {
    imageSent =
      "https://media.discordapp.net/attachments/871728576972615680/1148261217840926770/logoanon.png?width=473&height=473";
    nomeEnvio = userSentData.pseudonimo;
    userEnvio = "ceferno 😈";
  } else {
    nomeEnvio = userSentData.nome;
    imageSent = userSentData.imageUrl;
    userEnvio = userSentData.usuario;
  }

  
  useEffect(() => {
    // Use um useEffect para atualizar a UI quando o estado dislikes mudar
    // Isso garante que a UI seja renderizada após a atualização do estado
  }, [dislikes]);
  

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // Estado para rastrear a exibição do post em detalhes

  // Função para buscar e definir as respostas do post
  const fetchReplies = async () => {
    const db = getFirestore(app);
    const repliesQuery = query(
      collection(db, "replys"),
      where("messageReplyed", "==", post.id)
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

  // Função para mostrar/ocultar as respostas
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

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
      mode: "anon",
      time: timestamp,
      messageReplyed: post.id,
      replyId: 1,
      text: replyText, // O texto da resposta
      userReplyed:
        userMentionedData !== null ? userMentionedData.id : userSentData.id,
      userSent: userSentData.id,
    };

    try {
      const response = await addDoc(collection(db, "replys"), newReplyData);
      // console.log("Resposta enviada com sucesso com ID: ", response.id);
      setIsReplying(false);
      setReplyText("");
    } catch (error) {
      console.error("Erro ao enviar a resposta: ", error);
    }
  };

  const handleSavePost = async (e, postId) => {
    e.stopPropagation();
    e.preventDefault();
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
              savedPosts: updatedSavedPosts,
            });

            console.log("Post salvo com sucesso!");
          } else {
            console.log("Post já está salvo.");
          }
        } else {
          // Se savedPosts não existe, cria um novo array com o postId
          await updateDoc(userDocRef, {
            savedPosts: [postId],
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

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
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
        where("postId", "==", postId),
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
        userId,
        postId,
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
      post.id
    );

    if (!userAlreadyDisliked) {
      // Atualizar o número de deslikes localmente
      const newDislikes = dislikes + 1;
      setDislikes(newDislikes);

      // Adicionar a interação de deslike na coleção "interactions"
      addDislikeInteraction(userId, post.id);
    } else {
      // Remover a interação de deslike da coleção "interactions"
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", post.id),
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

  return (
    <>
      <div className="tl-box" key={post.id}>

      <button onClick={toggleh1Visibility}>Denunciar</button>
      {denunciaVisible && (
        <Denuncia />
      )}


        <div className="tl-post">
          <Link
            style={linkStyle}
            state={{
              userSentData: userSentData,
              userMentionedData: userMentionedData,
              userLoggedData: userLoggedData,
            }}
            to={`/timeline/${post.id}`}
          >
            <div className="tl-ps-header">
              <div className="tl-ps-foto">
                {imageSent && <img src={imageSent} alt="" />}
              </div>
              {post.userMentioned !== "" ? (
                <Link
                  to="/VisitorPage"
                  state={{ objetoUsuario: userSentData, modo: post.mode }}
                  style={{ color: "white" }}
                >
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
                </Link>
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
              <p>{post.text}</p>
            </div>
            <div className="tl-ps-footer">
              <div className="tl-ps-opcoes">
                <div className="tl-ps-reply">
                  <FontAwesomeIcon icon={faComment} onClick={toggleReply} />
                  <span>{post.replyCount}</span>
                </div>
                <div
                  className="tl-ps-like"
                  onClick={(e) => {
                    handleLikeClick(e);
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes}</span>
                </div>
                <div
                  className="tl-ps-deslike"
                  onClick={(e) => {
                    handleDislikeClick(e);
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />{" "}
                  <span>{dislikes}</span>
                </div>
                <div
                  className="tl-ps-salvar"
                  onClick={(e) => {
                    handleSavePost(e, post.id);
                  }}
                >
                  <FontAwesomeIcon icon={faBookmark} />{" "}
                </div>
                <div
                  className="tl-ps-share"
                  onClick={(e) => {
                    copyToClipboard(e);
                  }}
                >
                  <FontAwesomeIcon icon={faShare} />{" "}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PostDisplay;
