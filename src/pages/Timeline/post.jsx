import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  orderBy,updateDoc,
  limit,
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

function PostDisplay({ post, userSentData, userMentionedData }) {
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes);
  const postDate = new Date(post.time);
  const now = new Date();
  let timeAgo;
  {/*function PostDisplay({ post, userSentData, userMentionedData }) {
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes); // Estado para controlar o número de likes

  // Função para verificar se o usuário já curtiu o post
  const checkIfUserLikedPost = async () => {
    const user = firebase.auth().currentUser; // Obtém o usuário autenticado (você deve ter configurado a autenticação com Firebase)
    if (user) {
      // Usuário autenticado

      // Referência para a coleção de likes do post
      const likesCollectionRef = firebase.firestore().collection(`posts/${post.id}/likes`);

      // Query para verificar se o usuário já curtiu o post
      const querySnapshot = await likesCollectionRef.where("userId", "==", user.uid).get();

      if (!querySnapshot.empty) {
        // O usuário já curtiu o post
        setLiked(true);
      } else {
        // O usuário não curtiu o post
        setLiked(false);
      }
    }
  };

  // Resto do código...

  return (
    // Seu código restante...
  );
}*/}
  const handleLikeClick = async () => {
    // Incrementar o número de likes localmente
    const newLikes = likes + 1;
    setLikes(newLikes);

    // Atualizar o número de likes no Firebase
    const db = getFirestore(app);
    const q = query(collection(db, "timeline"), where("postId", "==", post.id));

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
  return (
    <div className="tl-box" key={post.id}>
      <div className="tl-post">
        <div className="tl-ps-header">
          <div className="tl-ps-foto">
            {imageSent && <img src={imageSent} alt="" />}
          </div>
          {post.userMentioned !== null ? (
            <div className="tl-ps-nomes">
              <p className="tl-ps-nome">
                {nomeEnvio} <span className="tl-ps-user">@{userEnvio} </span>
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
                {nomeEnvio} <span className="tl-ps-user">@{userEnvio} </span>
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
              <FontAwesomeIcon icon={faComment} />
              <span>{post.replyCount}</span>
            </div>
            <div className="tl-ps-like" onClick={handleLikeClick}>
              <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes}</span>
            </div>
            <div className="tl-ps-deslike">
              <FontAwesomeIcon icon={faThumbsDown} />{" "}
              <span>{post.deslikes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDisplay;
