import React, { useEffect, useState, useRef } from 'react';
import voltarIcon from "../../assets/voltar-icon.svg";
import enviarIcon from "../../assets/enviar-icon.svg";
import "./styles.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, onSnapshot, addDoc, collection, arrayUnion, updateDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";

// Conexao com o firebase

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



/*

const inputComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

}

function enviarMensagem() {

  const currentTime = new Date().toLocaleString();

  db.collection('mensagem').add({
    text: inputValue,
    idUserSent: userUid,
    idUserReceived: userUidSelected,
    time: currentTime,
  }).then(() => {
    console.log('Mensagem enviada com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao enviar a mensagem:', error);
  });

  // Limpar o input após enviar a mensagem
  setInputValue('');
}

 const inputComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

} 

*/

/*await setDoc(doc(db, "chat", idcombinado), {

});*/

function Chat() {
  const { userId } = useParams();

  // Id Do Usuário Logado (pegar com o firebaseAuth) = auth.currentUser.Uid;
  const userUid = "ovTWKzRPZmaAsluan0Fkr6elhn02";
    
  // Id Do Usuário que está recebendo as mensagens
  const userUidSelected = userId;
  
  // Cria o ID Combinado (Armazena o Maior ID primeiro)
  let idCombinado = "";
  
  if (userUid > userUidSelected) {
    idCombinado = userUid + userUidSelected;
  } else idCombinado = userUidSelected + userUid;

  
  // Atualiza o Chat com 
  function AtualizaChat({ currentUserProfilePic, chatPartnerProfilePic }) {
    const [dados, setDados] = useState([]);
    const mensagemRef = useRef(null);

    useEffect(() => {
      const unSub = onSnapshot(doc(db, "chat", idCombinado), (doc) => {
        if (doc.exists()) {
          setDados(doc.data().mensagem);
          scrollToBottom();
        }
      });

      return () => unSub();
    }, []);

    const scrollToBottom = () => {
      if (mensagemRef.current) {
        mensagemRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

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

  //const { userId } = useParams();
  //console.log(userId);
  const [inputValue, setInputValue] = useState('');
  const [chatPartnerName, setChatPartnerName] = useState(''); // To store the name of the chat partner
  const [chatPartnerProfilePic, setChatPartnerProfilePic] = useState(''); // To store the profile picture of the chat partner
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(''); // To store the profile picture of the chat partner

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const enviarMensagem = () => {
    const currentTime = new Date().toLocaleString();

    const idCombinado = userUid > userUidSelected ? userUid + userUidSelected : userUidSelected + userUid;

    try {
      updateDoc(doc(db, "chat", idCombinado), {
        mensagem: arrayUnion({
          text: inputValue,
          idUserSent: userUid,
          idUserReceived: userUidSelected,
          time: currentTime,
        }),
      });

      console.log('Mensagem enviada com sucesso!');
      setInputValue('');
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
    };
    // Limpar o input após enviar a mensagem
    setInputValue('');
  };

  useEffect(() => {
    // Fetch the user information for the chat partner (userUidSelected)
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
        console.error('Error fetching chat partner information:', error);
      }
    };

    fetchChatInfo();
  }, []);

  return (
    <>
     <div>
        <div className="header centralizar">
        <Link to={`/`}><img id="voltar" className="icon" src={voltarIcon} ></img></Link>
            <img className="profilePicDm" src={chatPartnerProfilePic} alt="Profile Pic" />
            <p className="nome bold">{chatPartnerName}</p>
        </div>
        <AtualizaChat currentUserProfilePic={currentUserProfilePic} chatPartnerProfilePic={chatPartnerProfilePic} />
        {/* <div className="mensagem">
          <AtualizaChat />
          <div className="message sent">
            <img className="profilePicDm" src="https://pbs.twimg.com/profile_images/1653051776298360833/bUymYMlt_400x400.jpg"></img>
            <p></p>
          </div>
          </div> */}
          <div className="enviarMensagem">
            <input className="input" onChange={handleInputChange} value={inputValue}></input>
            <img id="enviar" className="icon" src={enviarIcon} onClick={enviarMensagem}></img>
          </div>
    </div> 
    </>
  );
}

export default Chat;
