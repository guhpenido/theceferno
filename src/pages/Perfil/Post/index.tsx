import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faComment } from "@fortawesome/fontawesome-free-solid";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { useState, useEffect } from "react";
import { faEnvelope } from "@fortawesome/fontawesome-free-solid";
//import { faMagnifyingGlassArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faBell } from "@fortawesome/fontawesome-free-solid";
import { faQuestion } from "@fortawesome/fontawesome-free-solid";
import { faPaperPlane } from "@fortawesome/fontawesome-free-solid";
//import { faXmark } from "@fortawesome/fontawesome-free-solid";

import {
  Avatar,
  Body,
  Container,
  Header,
  HeaderName,
  HeaderNameMentioned,
  Icons,
  ImgConteiner,
  NomeHeaderTw,
  Postdays,
  Posts,
  Status,
} from "./styles";

import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
} from "date-fns";

function PostDisplay({ post, userSentData, userMentionedData, setRendState }) {
  const [isRendStateCss, setRendStateCss] = useState(false);

  console.log(setRendState);

  useEffect(() => {
    if (setRendState) {
      setRendStateCss(true);
    }
  }, [isRendStateCss]);

  if (!post) {
    return null; // Ou outra ação apropriada, como exibir uma mensagem de erro
  }
  const postDate = new Date(post.time ?? new Date());
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

  const defaultUserImageURL =
    "https://media.discordapp.net/attachments/871728576972615680/1148261217840926770/logoanon.png?width=473&height=473";

  return (
    <div>
      {isRendStateCss ? (
        <Container className="">
          <Body className="">
            {imageSent && (
              <Avatar
                as="img"
                height="60px"
                src={imageSent}
                alt="Novo Avatar"
              />
            )}
          </Body>
          <div>
            {post.userMentioned !== null && (
              <Icons>
                <Header className="">
                  <HeaderName>
                    <div>{nomeEnvio}</div>
                    <div>@{userEnvio}</div>
                  </HeaderName>
                  <FontAwesomeIcon className="arrow" icon={faArrowDown} />

                  {userMentionedData && (
                    <div>
                      {userMentionedData.avatar ? (
                        <ImgConteiner src={userMentionedData.avatar} alt="" />
                      ) : (
                        <ImgConteiner src={defaultUserImageURL} alt="" />
                      )}
                      <HeaderNameMentioned>
                        <div>{userMentionedData.nome}</div>
                        <div className="tl-ps-userReceived">
                          @{userMentionedData.usuario}
                        </div>
                      </HeaderNameMentioned>
                      <Posts>
                        <span>
                          O usuario {nomeEnvio} disse {post.text}
                        </span>
                      </Posts>
                    </div>
                  )}

                  {userMentionedData && !userMentionedData && (
                    <span>Usuário mencionado não encontrado</span>
                  )}
                </Header>
                <Status>
                  <FontAwesomeIcon icon={faComment} /> {post.replyCount}
                </Status>
                <Status>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  {post.likes}
                </Status>
                <Status>
                  <FontAwesomeIcon icon={faThumbsUp} /> {post.deslikes}
                </Status>
              </Icons>
            )}
            <Status>
              <Postdays>
                <div>Postado há {timeAgo}</div>
              </Postdays>
            </Status>
          </div>
        </Container>
      ) : (
        <div className="tl-box" key={post.id}>
          <div className="tl-post">
            <div className="tl-ps-header">
              <div className="tl-ps-foto">
                {imageSent && <img src={imageSent} alt="" />}
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
                  <FontAwesomeIcon icon={faThumbsUp} />{" "}
                  <span>{post.likes}</span>
                </div>
                <div className="tl-ps-deslike">
                  <FontAwesomeIcon icon={faThumbsDown} />{" "}
                  <span>{post.deslikes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDisplay;
