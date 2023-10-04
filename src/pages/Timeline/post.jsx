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
  orderBy, updateDoc,
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
import "./stylesDenuncia.css";
import ReplyDisplay from "./reply";
import VisitorPage from "../Perfil/ProfilePage/VisitorPage";
import { AppRoutes } from "../../routes/AppRoutes";

function PostDisplay({ post, userSentData, userMentionedData, userId }) {
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes);
  const postDate = new Date(post.time);
  const now = new Date();
  let timeAgo;
  {/*function PostDisplay({ post, userSentData, userMentionedData }) {
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes); // Estado fpara controlar o número de likes

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


  const [selectedOption, setSelectedOption] = useState(null);
  const [box1Visible, setBox1Visible] = useState(false); //para mostrar a div denuncia conteudo indevido
  const [box2Visible, setBox2Visible] = useState(false); //para mostrar a div denuncia ser outra pessoa
  const [h1Visible, setH1Visible] = useState(false); //mostra os h1s que chamam as divs
  const [fundoVisible, setfundoVisible] = useState(false); //mostra os h1s que chamam as divs

  const [denunciaId, setDenunciaId] = useState("");
  const [messageReportedId, setMessageReportedId] = useState("");
  const [motive, setMotive] = useState("");
  const [userReported, setUserReported] = useState("");
  const [userReporting, setUserReporting] = useState("");
  const [denuncias, setDenuncias] = useState([]);

  const db = getFirestore(app);
  const denunciaCollectionRef = collection(db, "denuncia");

  async function CriarDenuncia() {
    const currentTime = new Date();

    const denuncia = await addDoc(denunciaCollectionRef, {
      messageReportedId: post.postId,
      motive,
      time: currentTime.toString(),
      userReported: userSentData.id,
      userReporting: userId
    });

    const newDenunciaId = denuncia.id;
    await updateDoc(denuncia, { denunciaId: newDenunciaId });
    toggleh1Visibility();
  }



  useEffect(() => {
    const getDenuncia = async () => {
      const data = await getDocs(denunciaCollectionRef);
      setDenuncias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getDenuncia();
  }, []);

  //deixa e tira a visibilidade da div denuncia conteudo indevido
  const toggleBox1Visibility = () => {
    setBox1Visible(!box1Visible);
    setBox2Visible(false); // Hide box2 when showing box1
  };

  //deixa e tira a visibilidade da div denuncia ser outra pessoa
  const toggleBox2Visibility = () => {
    setBox2Visible(!box2Visible);
    setBox1Visible(false); // Hide box1 when showing box2
  };

  //deixa e tira a visibilidade dos h1s
  const toggleh1Visibility = () => {
    // console.log("entrou")
    setH1Visible(!h1Visible);
    setBox1Visible(false);
    setBox2Visible(false);
    setFundoVisible(!fundoVisible);
  };

  const handleMotiveChange = (event) => {
    setMotive(event.target.value);
  };

  const renderDivStructure = () => {
    return (
      <div className={`denuncia ${h1Visible ? 'visible' : 'DenunciaInvisible'}`}>
        <h1>Denúncia <button onClick={toggleh1Visibility}>X</button></h1>
        <label className={`${h1Visible ? 'visible' : 'DenunciaInvisible'}`} htmlFor='box1'> Está publicando conteúdo que não deveria estar no Ceferno  <button className="alternaOpcao" onClick={toggleBox1Visibility}> <img src="src\pages\Timeline\assets\icone.png" /> </button></label>
        <select className={`opcoesDenuncia box1 ${box1Visible ? 'visible' : 'DenunciaInvisible'}`} id="box1" name="box1" value={motive} onChange={handleMotiveChange}>
          <option></option>
          <option value="Eh_Spam"> É spam </option>
          <option value="Nao_Gostei"> Simplesmente não gostei </option>
          <option value="Suicidio_Automutilacao_Disturbios"> Suicidio, automutilação ou disturbios alimentares </option>
          <option value="Produtos_ilicitos"> Venda de produtos ilicitos </option>
          <option value="Nudez"> Nudez ou atividade sexual </option>
          <option value="Discurso_de_Odio"> Símbolos ou discurso de ódio </option>
          <option value="Violencia"> Violência ou organizações perigosas </option>
          <option value="Bullying"> Bullying ou assédio </option>
          <option value="Violacao_Intelectual"> Violação de propriedade intelectual </option>
          <option value="Golpe"> Golpe ou fraude </option>
          <option value="Fake_News"> Informação falsa </option>
        </select>

        <br></br>
        <label className={`${h1Visible ? 'visible' : 'DenunciaInvisible'}`} htmlFor='box2'> Está fingindo ser outra pessoa  <button className="alternaOpcao" onClick={toggleBox2Visibility}> <img src="src\pages\Timeline\assets\icone.png" /> </button></label>
        <select className={`opcoesDenuncia box2 ${box2Visible ? 'visible' : 'DenunciaInvisible'}`} id="box2" name="box2" value={motive} onChange={handleMotiveChange}>
          <option></option>
          <option value="fingindo_Ser_Eu"> Eu </option>
          <option value="fingindo_Ser_Alguem_que_Sigo"> Alguém que sigo </option>
          <option value="fingindo_Ser_Uma_Celebridade_Figura_Publica"> Uma celebridade ou figura pública </option>
          <option value="fingindo_Ser_Empresa"> Uma empresa ou organização </option>
        </select>
        <button className={`enviar ${h1Visible ? 'visible' : 'DenunciaInvisible'}`} onClick={CriarDenuncia}>Enviar</button>

      </div>
    );
  };

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
      userReplyed: userMentionedData !== null ? userMentionedData.id : userSentData.id,
      userSent: userSentData.id,
    };

    try {
      const response = await addDoc(collection(db, "replys"), newReplyData);;
      // console.log("Resposta enviada com sucesso com ID: ", response.id);
      setIsReplying(false);
      setReplyText("");
    } catch (error) {
      console.error("Erro ao enviar a resposta: ", error);
    }
  };



  useEffect(() => {
    const trendingTimeLine = async () => {
      try {
        const db = getFirestore(app);
        const trendingTimelineCollectionRef = collection(db, "timeline");

        // Criar uma consulta que ordena os documentos por "deslikes" em ordem decrescente
        const q = query(trendingTimelineCollectionRef, orderBy("deslikes", "desc"));

        const snapshot = await getDocs(q);

        // Processar os documentos da coleção "timeline"
        const timelineData = [];
        snapshot.forEach((doc) => {
          timelineData.push({ id: doc.id, ...doc.data() });
        });

        // Agora você tem os documentos da coleção "timeline" ordenados por "deslikes"
        console.log("Documentos da coleção 'timeline' ordenados por 'deslikes':", timelineData);
      } catch (error) {
        console.error("Erro ao buscar documentos da coleção 'timeline':", error);
      }
    };

    trendingTimeLine();
  }, []);


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
                <Link to="/VisitorPage" state={{ objetoUsuario: userSentData, modo: post.mode }} style={{ color: 'white' }}>
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
              <div className="tl-ps-like" onClick={handleLikeClick}>
                <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes}</span>
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
            <img className='iconeDenuncia' onClick={toggleh1Visibility} src="src\pages\Timeline\assets\alerta.png" alt="imagem de um ícone de denúncia" />
            {renderDivStructure()}
          </div>
        </div>
      </div >
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
      )
      }
    </>
  );
}

export default PostDisplay;
