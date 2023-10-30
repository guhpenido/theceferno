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
  Footer,
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
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
  authDomain: "auth-ceferno.firebaseapp.com",
  projectId: "auth-ceferno",
  storageBucket: "auth-ceferno.appspot.com",
  messagingSenderId: "388861107940",
  appId: "1:388861107940:web:0bf718602145d96cc9d6f1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function PostDisplay({ post, userSentData, userMentionedData, setRendState }) {
  const [isRendStateCss, setRendStateCss] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [deslikes, setDesLikes] = useState<string | null>(null);
  // console.log(setRendState);

  useEffect(() => {
    if (setRendState) {
      setRendStateCss(true);
    }
  }, [isRendStateCss, likes, db]);

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

  const handleLikeClick = async (itemLike, IdPost) => {

    const { likes, deslikes } = post;

    let sumLikes = likes + 1;

    const sumeLikes = { sumLikes, IdPost };
    setLikes(sumLikes);

    const q = query(
      collection(db, "timeline"),
      where("postId", "==", sumeLikes.IdPost)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const postDoc = querySnapshot.docs[0];

        await updateDoc(doc(db, "timeline", postDoc.id), {
          likes: sumeLikes.sumLikes,
        });

        console.log("Likes atualizados no Firebase com sucesso!");
      } else {
        console.error("Post não encontrado no Firebase.");
        setLikes(sumeLikes.sumLikes);
      }
    } catch (error) {
      console.error("Erro ao atualizar likes no Firebase: ", error);
      setLikes(sumeLikes.sumLikes);
    }
  };

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
                height="0px"
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
                    <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                    {userMentionedData && (
                      <div>
                        <HeaderNameMentioned>
                          <Avatar>
                            {userMentionedData.imageUrl ? (
                              <ImgConteiner src={userMentionedData.imageUrl} alt="" />
                            ) : (
                              <ImgConteiner src={defaultUserImageURL} alt="" />
                            )}
                          </Avatar>
                          <div>{userMentionedData.nome}</div>
                          <div className="tl-ps-userReceived">
                            @{userMentionedData.usuario}
                          </div>
                        </HeaderNameMentioned>
                      </div>
                    )}

                    {userMentionedData && !userMentionedData && (
                      <span>Usuário mencionado não encontrado</span>
                    )}
                  </HeaderName>
                </Header>
                <Posts>
                  <span>
                    {post.text}
                  </span>
                </Posts>
                <Footer>
                  <Status>
                    <FontAwesomeIcon icon={faComment} /> {post.replyCount}
                  </Status>
                  <Status>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleLikeClick(post.likes, post.postId)} />
                    {likes}
                  </Status>
                  <Status>
                    <FontAwesomeIcon icon={faThumbsDown} /> {post.deslikes}
                  </Status>
                  <Status>
                    <Postdays>
                      <div>{timeAgo}</div>
                    </Postdays>
                  </Status>
                </Footer>
              </Icons>
            )}

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