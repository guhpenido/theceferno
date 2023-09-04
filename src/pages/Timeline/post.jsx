import React from "react";
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
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
} from "date-fns";

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
  return (
      <div className="tl-box" key={post.id}>
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
                <FontAwesomeIcon icon={faComment} />
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
        </div>
      </div>
  );
}

export default PostDisplay;
