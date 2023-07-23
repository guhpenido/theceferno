import React, { useEffect, useState, useRef } from 'react';
import voltarIcon from "../../assets/voltar-icon.svg";
import enviarIcon from "../../assets/enviar-icon.svg";
import "./chatStyles.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";

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
  const userUid = "ovTWKzRPZmaAsluan0Fkr6elhn02";
  const userUidSelected = userId;

  let idCombinado = "";

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      enviarMensagem();
    }
  };
  
  if (userUid > userUidSelected) {
    idCombinado = userUid + userUidSelected;
  } else {
    idCombinado = userUidSelected + userUid;
  }

  const scrollToBottom = () => {
    if (mensagemRef.current) {
      mensagemRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log("scroll");
    }
  };

  function AtualizaChat({ currentUserProfilePic, chatPartnerProfilePic }) {
    const [dados, setDados] = useState([]);
    
    useEffect(() => {
      const unSub = onSnapshot(doc(db, "chat", idCombinado), (doc) => {
        if (doc.exists()) {
          setDados(doc.data().mensagem);
          scrollToBottom();
        }
      });
  
      return () => unSub();
    }, []);
  
    return (
      <div className="mensagem">
        {dados.map((elemento, index) => (
          <div
            className={`message ${userUid === elemento.idUserSent ? 'sent' : 'received'}`}
            key={index}
          >
            {userUid === elemento.idUserSent ? (
              <img className="profilePicDm" src={currentUserProfilePic} alt="Profile Pic" />
            ) : (
              <img className="profilePicDm" src={chatPartnerProfilePic} alt="Profile Pic" />
            )}
            <p className='mensagemChatPv'>{elemento.text}</p>
          </div>
        ))}
        <div ref={mensagemRef} />
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
    const trimmedInputValue = inputValue.trim();
    
    if (trimmedInputValue !== '') {
      const currentTime = new Date().toLocaleString();

      const idCombinado = userUid > userUidSelected ? userUid + userUidSelected : userUidSelected + userUid;

      try {
        updateDoc(doc(db, "chat", idCombinado), {
          mensagem: arrayUnion({
            text: trimmedInputValue,
            idUserSent: userUid,
            idUserReceived: userUidSelected,
            time: currentTime,
          }),
        });

        console.log('Mensagem enviada com sucesso!');
        setInputValue('');
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }
    }
  };

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const userPartnerRef = doc(db, "users", userUidSelected);
        const userPartnerSnapshot = await getDoc(userPartnerRef);

        const userDocRef = doc(db, "users", userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userPartnerSnapshot.exists()) {
          const partnerData = userPartnerSnapshot.data();
          setChatPartnerName(partnerData.nome);
          setChatPartnerProfilePic(partnerData.imageSrc);
        }
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setCurrentUserProfilePic(userData.imageSrc);
        }
      } catch (error) {
        console.error('Erro ao obter informações do parceiro de chat:', error);
      }
    };

    fetchChatInfo();
  }, []);

  return (
    <>
      <div>
        <div className="header centralizar">
          <Link to={`/`}><img id="voltar" className="icon" src={voltarIcon} alt="Voltar" /></Link>
          <img className="profilePicDm" src={chatPartnerProfilePic} alt="Profile Pic" />
          <p className="nome bold">{chatPartnerName}</p>
        </div>
        <AtualizaChat currentUserProfilePic={currentUserProfilePic} chatPartnerProfilePic={chatPartnerProfilePic} />
        <div className="enviarMensagem">
          <input className="input" onChange={handleInputChange} onKeyDown={handleKeyDown} value={inputValue} />
          <img id="enviar" className="icon" src={enviarIcon}  onKeyDown={handleKeyDown} tabIndex="0" alt="Enviar" onClick={enviarMensagem} />
        </div>
      </div> 
    </>
  );
}

export default Chat;