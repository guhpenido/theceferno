import React, { useEffect, useState, useRef, useCallback } from 'react';
import voltarIcon from "../../assets/voltar-icon.svg";
import enviarIcon from "../../assets/enviar-icon.svg";
// import "./chatStyles.css";
// import "./stylesChat.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion , setDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import VLibras from "@djpfs/react-vlibras";

// Conexão com o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
  authDomain: "auth-ceferno.firebaseapp.com",
  projectId: "auth-ceferno",
  storageBucket: "auth-ceferno.appspot.com",
  messagingSenderId: "388861107940",
  appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


function Chat() {
  const { userId } = useParams();
  const mensagemRef = useRef(null);
  const inputRef = useRef(null);
  //const userUid = "lEHi9cUB9TO5yWCmA2ocbt5fhq02";
  const userUidSelected = userId;
  const [needScroll, setNeedScroll] = useState(false);
  const [dados, setDados] = useState([]);
  const auth = getAuth(app);
  const [userUid, setUserId] = useState(null);
  const navigate = useNavigate();
  const [userLoggedData, setUserLoggedData] = useState(null);

  let idCombinado = "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserDataAndSetState(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (userUid) {
      fetchUserDataAndSetState(userUid);
    }
  }, [userUid]);

  const fetchUserDataAndSetState = async (userUid) => {
    try {
      const userLoggedDataResponse = await fetchUserData(userUid);
      setUserLoggedData(userLoggedDataResponse);
      console.log(userLoggedData);

    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setIsLoading(false); // Even if there's an error, stop loading
    }
  };

  const fetchUserData = async (userUid) => {
    const userDoc = await getDoc(doc(db, "users", userUid));
    if (userDoc.exists()) {
      console.log('effect')
      const unSub = onSnapshot(doc(db, "chat", idCombinado), (doc) => {
        setDados(doc.data().mensagem);
      });
      return userDoc.data();
    } else {
      console.log("User not found");
      return null;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      enviarMensagem();
      event.target.value = "";
    }
  };

  if (userUid > userUidSelected) {
    idCombinado = userUid + userUidSelected;
  } else {
    idCombinado = userUidSelected + userUid;
  }

  /*const scrollToBottom = useCallback( () => {
    if (mensagemRef.current) {
      mensagemRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log("scroll");
    }
  }, []);*/

  function AtualizaChat({ currentUserProfilePic, chatPartnerProfilePic }) {


    useEffect(() => {

      scrollToBottom()
    }, [dados]);

    return (
      <div className="mensagem" ref={mensagemRef}>
        {dados.map((elemento, index) => (
          <div
            className={`message ${userUid === elemento.idUserSent ? 'sentDm' : 'receivedDm'}`}
            key={index}
          >
            {userUid === elemento.idUserSent ? (
              <img className="profilePicDm" src={currentUserProfilePic} alt="Imagem de perfil" />
            ) : (
              <img className="profilePicDm" src={chatPartnerProfilePic} alt="Imagem de perfil" />
            )}
            <p className='mensagemChatPv'>{elemento.text}</p>
          </div>
        ))}
      </div>
    );
  }

  const [inputValue, setInputValue] = useState('');
  const [chatPartnerName, setChatPartnerName] = useState('');
  const [chatPartnerProfilePic, setChatPartnerProfilePic] = useState('');
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const enviarMensagem = () => {
    const trimmedInputValue = inputRef.current.value.trim();
    const currentTime = new Date().toLocaleString();
    const idCombinado = userId > userUid
        ? userId + userUid
        : userUid + userId;
      console.log(idCombinado);
    const unSub = onSnapshot(doc(db, "chat", idCombinado), async (docUnSub) => {
    try {
      const res = await getDoc(doc(db, "chat", idCombinado));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chat", idCombinado), { mensagem: [] , id1: userId , id2: userUid});
        updateDoc(doc(db, "chat", idCombinado), {
          mensagem: arrayUnion({
            text: trimmedInputValue,
            idUserSent: userUid,
            idUserReceived: userUidSelected,
            time: currentTime,
          }),
          time: currentTime
        });

     /* if (!doc.exists()) {
        console.log("alo");
        if (userUid > userUidSelected) {
          idCombinado = userUid + userUidSelected;
        } else {
          idCombinado = userUidSelected + userUid;
        }
        await setDoc(doc(db, "chat", idCombinado), { mensagem: [], id1: userUid, id2: userUidSelected});
      }*/
    }
    } catch (err) {console.log(err);}
    });

    if (trimmedInputValue !== '') {

      try {
        updateDoc(doc(db, "chat", idCombinado), {
          mensagem: arrayUnion({
            text: trimmedInputValue,
            idUserSent: userUid,
            idUserReceived: userUidSelected,
            time: currentTime,
          }),
          time: currentTime
        });

        console.log('Mensagem enviada com sucesso!');

        setInputValue('');
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }
    }

  };


  const scrollToBottom = () => {
    console.log('scroll fora')
    if(mensagemRef.current.childNodes.length > 0){
      console.log('scroll dentro')
      const current2 = mensagemRef.current.childNodes
      current2[current2.length - 1].scrollIntoView(true, {behavior: 'smooth'})
    }
  };

  const fetchChatInfo = async () => {
    console.log('chatinfo')
    try {
      const userPartnerRef = doc(db, "users", userUidSelected);
      const userPartnerSnapshot = await getDoc(userPartnerRef);

      const userDocRef = doc(db, "users", userUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userPartnerSnapshot.exists()) {
        const partnerData = userPartnerSnapshot.data();
        setChatPartnerName(partnerData.nome);
        setChatPartnerProfilePic(partnerData.imageUrl);
      }
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setCurrentUserProfilePic(userData.imageUrl);
      }

    } catch (error) {
      console.error('Erro ao obter informações do parceiro de chat:', error);
    }
  };

  useEffect(() => {
     console.log('effect')
     const unSub = onSnapshot(doc(db, "chat", idCombinado), (doc) => {
       setDados(doc.data().mensagem);
     });
    return () => unSub();
   }, []);

  fetchChatInfo()

  return (
    <>
      <div>
        <div className="headerDm">
          <Link to={`/dm`}><img id="voltarChat" className="iconDm" src={voltarIcon} alt="Voltar" /></Link>
          <img className="profilePicDm" src={chatPartnerProfilePic} alt="Imagem de perfil" />
          <p className="nomeUserDm boldDm">{chatPartnerName}</p>
        </div>
        <AtualizaChat currentUserProfilePic={currentUserProfilePic} chatPartnerProfilePic={chatPartnerProfilePic} />
        <div className="enviarMensagem">
          <input className="inputPesquisaDm" onKeyDown={handleKeyDown} ref={inputRef} />
          <img id="enviarChat" className="iconDm" src={enviarIcon}  onKeyDown={handleKeyDown} tabIndex="0" alt="Enviar" onClick={enviarMensagem} />
        </div>
      </div>
      <VLibras forceOnload={true} />
    </>
  );
}

export default Chat;