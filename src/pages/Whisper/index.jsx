import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import 'firebase/storage';
import './styleWhisper.css'; 
import fotoUsuario from "../../assets/foto.png";

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
  // Definindo estados do componente usando o hook "useState"
  const [whisperData, setWhisperData] = useState([]); // Estado que armazena dados de mensagens Whisper
  const [showBox, setShowBox] = useState(false); // Estado para controlar a exibição da caixa de mensagem
  const [message, setMessage] = useState(''); // Estado que armazena o conteúdo da mensagem digitada
  const [currentUser, setCurrentUser] = useState(null); // Estado para armazenar o usuário atual logado
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

    // Obtem o usuario atual quando o componente é criado 
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado, e você pode acessar suas informações usando o objeto 'user'
        console.log('Usuário atual:', user);
        setCurrentUser(user);
      } 
      else {
        // O usuário não está autenticado
        console.log('Nenhum usuário autenticado.');
      }
    });

    fetchData(); // Chama a função fetchData para buscar os dados do Firestore quando o componente é montado
  
  }, []);



// Função para lidar com o envio de uma nova mensagem Whisper
  const handleSendMessage = () => {
    // Obtem a data e hora atuais
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Cria um novo objeto Whisper
    const newWhisper = {
      userName: currentUser.displayName, 
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
        
        /*After sending the message, create a new div to display the message details
          const messageDetailsDiv = (
            <div key={formattedDate + formattedTime} className="message-details">
              <img src={fotoUsuario} className='foto-perfil'></img>
              <div className='enviouRecebeu'>
                <p>@{whisper.userName} recebeu de @usuarioQueRecebe </p>
              </div>
              <p className='mensagem'>{whisper.message}</p>
              <p className='data'>Enviado em: {whisper.date} às {whisper.time}</p>
            </div>
          );
        */
          
        // Atualiza o estado "whisperData" adicionando a nova div à lista de mensagens Whisper
        setWhisperData((prevWhispers) => [...prevWhispers, messageDetailsDiv]);

      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <>
      <h1>Whispers</h1>
      <button id='mais' onClick={() => setShowBox(true)}>+</button>

      {showBox && (
       <div className="whisper-container">
         {currentUser && (
           <div className="message-box">
            <p className="userName">{currentUser.displayName}</p>
            <div className="message message-details">
              <div className="message-details">
                <img src={fotoUsuario} className='foto-perfil'></img>
                <div className='enviouRecebeu'>
                  <p>@userlogado</p>
                </div>
              </div>              
              <input
                type="text"
                placeholder="Digite seu whisper:"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    )}

          {/* Exibe as mensagens Whisper em ordem reversa */}
          {whisperData.map((whisper, index) => (
      <div key={index} className="message-details whisper">
        <img src={fotoUsuario} className='foto-perfil'></img>
        <div className='enviouRecebeu'>
        <p>@{whisper.userName} recebeu de @usuarioQueRecebe {/*whisper.userNameRecebe*/}</p>
        </div>
        <p className='mensagem'>{whisper.message}</p>
        <p className='data'>Enviado em: {whisper.date} às {whisper.time}</p>
      </div>
    ))}
    </>
  );
}

export default Whisper;




//import React, { useState } from 'react';
//import './styleWhisper.css';
//import fotoUsuario from "../../assets/foto.png";
//
//function Whisper() {
  // Definindo os estados do componente usando o Hook useState
  //const [whisperData, setWhisperData] = useState([]); // Armazena os dados dos sussurros (mensagens)
  //const [showBox, setShowBox] = useState(false); // Controla a exibição da caixa de envio de mensagens
  //const [message, setMessage] = useState(''); // Armazena o texto digitado pelo usuário para enviar como mensagem
  //const [currentUser, setCurrentUser] = useState({ displayName: 'Davi' }); // Usuário atual (pode ser substituído por um objeto de usuário real)
  //const [lastSentMessage, setLastSentMessage] = useState(null); // Armazena a última mensagem enviada para exibição

  // Função para lidar com o envio de uma mensagem
  //const handleSendMessage = () => {
    //if (message.trim() === '') {
    //  alert('Please enter a message.');
     // return;
    //}

    // Cria um novo objeto whisper
   // const currentDate = new Date();
   // const formattedDate = currentDate.toLocaleDateString();
   // const formattedTime = currentDate.toLocaleTimeString();
   // const newWhisper = {
   //   userName: currentUser.displayName,
    //  message,
    //  date: formattedDate,
    //  time: formattedTime,
   // };

    // Atualiza o estado para adicionar o novo Whisper à lista de mensagens
   // setWhisperData((prevWhispers) => [newWhisper, ...prevWhispers]);

     // Reseta o campo de entrada de mensagem
    //setMessage('');

    // Define a última mensagem enviada para exibição
   // setLastSentMessage(newWhisper);
  //};

  //return (
   // <>
    //  <h1>Whispers</h1>
     // <button id='mais' onClick={() => setShowBox(true)}>+</button>
      
        {/* Exibe a caixa de envio de mensagens quando showBox for verdadeiro */}
     // {showBox && (
       // <div className="whisper-container">
       //   {currentUser && (
        //    <div className="message-box">
         //     <p className="userName">{currentUser.displayName}</p>
         //     <div className="message message-details">
          //      <div className="message-details">
          //        <img src={fotoUsuario} className='foto-perfil'></img>
          //        <div className='enviouRecebeu'>
          //          <p>@userlogado</p>
          //        </div>
           //     </div>              
           //     <input
           //       type="text"
           //       placeholder="Digite seu whisper:"
           //       value={message}
           //       onChange={(e) => setMessage(e.target.value)}
          //      />
          //    <button onClick={handleSendMessage}>Enviar</button>
           //   </div>
          //  </div>
         // )}
       // </div>
     // )}

      {/* Exibe as mensagens Whisper em ordem reversa */}
    //  {whisperData.map((whisper, index) => (
     //   <div key={index} className="message-details whisper">
     //     <img src={fotoUsuario} className='foto-perfil'></img>
      //    <div className='enviouRecebeu'>
      //    <p>@{whisper.userName} recebeu de @usuarioQueRecebe {/*whisper.userNameRecebe*/}</p>
      //    </div>
      //    <p className='mensagem'>{whisper.message}</p>
      //    <p className='data'>Enviado em: {whisper.date} às {whisper.time}</p>
      //  </div>
    //  ))}
 //   </>
 // );
//}

//export default Whisper;
