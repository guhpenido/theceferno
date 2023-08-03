import React, { useState, useEffect } from 'react';
//import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import 'firebase/storage';
import './styleWhisper.css'; 


//configuração do firebase
const firebaseConfig = {
    apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
    authDomain: "auth-ceferno.firebaseapp.com",
    projectId: "auth-ceferno",
    storageBucket: "auth-ceferno.appspot.com",
    messagingSenderId: "388861107940",
    appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
};

// Inicia o Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function Whisper() {
  const [whisperData, setWhisperData] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Armazena o usuário atual logado
  const [lastSentMessage, setLastSentMessage] = useState(null); // Estado para armazenar a última mensagem enviada

  useEffect(() => {
    // Função para buscar dados do Firestore e atualizar o estado
    const fetchData = async () => {
      try {
        const whisperCollection = await db.collection('whispers').get();
        const data = whisperCollection.docs.map((doc) => doc.data());
        setWhisperData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    /* Obtem o usuario atual quando o componente é criado
     const unsubscribe = initializeApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);

      
    }); */

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado, e você pode acessar suas informações usando o objeto 'user'
        console.log('Usuário atual:', user);
        setCurrentUser(user);
      } else {
        // O usuário não está autenticado
        console.log('Nenhum usuário autenticado.');
      }
    });

    fetchData();

     // Clean up the listener when the component unmounts
    
  }, []);

  const handleSendMessage = () => {
    // Obtem a data e hora atuais
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Cria um novo objeto Whisper
    const newWhisper = {
      userName: currentDate.displayName, 
      message,
      date: formattedDate,
      time: formattedTime,
    };

    // Salva o novo Whisper no banco
    db.collection('whispers')
      .add(newWhisper)
      .then(() => {
        // Limpa o campo depois da mensagem ser enviada
        setMessage('');
        // Esconde a caixa de mensagem
        setShowBox(false);
        // Atualizar o estado da última mensagem enviada
        setLastSentMessage(newWhisper);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <>
      <div className="whisper-container">
      <h1>Whispers</h1>
      <button onClick={() => setShowBox(true)}>Enviar Mensagem</button>
      {currentUser && showBox && (
        <div className="message-box">
          <p className="userName">{currentUser.displayName}</p>
          <div className="message">
            <input
              type="text"
              placeholder="Digite sua mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="date">
            <p>Enviado em: {new Date().toLocaleDateString()} as {new Date().toLocaleTimeString()}</p>
          </div>
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      )}

      {/* Renderizar a div com a última mensagem enviada */}
      {lastSentMessage && (
        <div className="last-sent-message">
          <p>{lastSentMessage.userName}</p>
          <p>{lastSentMessage.message}</p>
          <p>{lastSentMessage.date}</p>
          <p>{lastSentMessage.time}</p>
        </div>
      )}

      <ul>
        {whisperData.map((whisper, index) => (
          <li key={index}>
            <p>{whisper.userName}</p>
            <p>{whisper.message}</p>
            <p>{whisper.date}</p>
            <p>{whisper.time}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default Whisper;