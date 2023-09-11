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

import ReplyDisplay from "./reply";

const db = getFirestore(app);

function PostDisplay({ post, userSentData, userMentionedData }) {
  const postDate = new Date(post.time);
  const now = new Date();
  let timeAgo;

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

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // Estado para rastrear a exibição do post em detalhes


  // Função para buscar e definir as respostas do post
  const fetchReplies = async () => {
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
      userReplyed: userMentionedData !== null ? userMentionedData.id : userSentData.id,
      userSent: userSentData.id,
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

  return (
    <>
      <div className="tl-box" key={post.id} onClick={toggleReplies}>
        <div className="tl-post">
          <div className="tl-ps-header">
            <div className="tl-ps-foto">
              {imageSent && (
                <img src={imageSent} alt="" />
              )}
            </div>
            {post.userMentioned !== null ? (
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
            <p>{post.text}</p>
          </div>
          <div className="tl-ps-footer">
            <div className="tl-ps-opcoes">
              <div className="tl-ps-reply">
                <FontAwesomeIcon icon={faComment} onClick={toggleReply} />
                <span>{post.replyCount}</span>
              </div>
              <div className="tl-ps-like">
                <FontAwesomeIcon icon={faThumbsUp} /> <span>{post.likes}</span>
              </div>
              <div className="tl-ps-deslike">
                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                <span>{post.deslikes}</span>
              </div>
            </div>
          </div>
          {isReplying && (
            <div className="tl-reply">
              <textarea
                placeholder="Escreva sua resposta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              <button onClick={handleReply}>Responder</button>
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
          />
          ))}
          
          <button onClick={toggleReplies}>Voltar para a timeline</button>
        </div>
      )}
    </>
  );
}

export default PostDisplay;
