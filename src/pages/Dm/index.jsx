import { useState, useRef, useEffect } from "react";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import notificacaoIcon from "../../assets/notificacao-icon.svg";
import pesquisaIcon from "../../assets/pesquisa-icon.svg";
import "./dmStyles.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { doc, getDoc, onSnapshot, collection, query, where, collectionGroup, getDocs} from "firebase/firestore";
import { Link } from "react-router-dom";
import { render } from "react-dom";

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

// Id Do Usuário Logado (pegar com o firebaseAuth) = auth.currentUser.Uid;
const userUid = "lEHi9cUB9TO5yWCmA2ocbt5fhq02";

// Id Do Usuário que está recebendo as mensagens
const userUidSelected = "ovTWKzRPZmaAsluan0Fkr6elhn02";


/*function AbrirChat(uid){
    return <Link to={`/Chat/${uid}`}></Link>;
}*/
// Function to render user chats

function Dm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chats, setChats] = useState([]);

    const nodeRef = useRef(null);

    const renderUserChats = async () => {
      // Firestore collection reference for the "chat" collection
      const chatDivs = [];
    
      // Create an array to hold the chat divs
    
      // Get the current user's ID (replace this with your actual method to get the user ID)
      const currentUserID = "ovTWKzRPZmaAsluan0Fkr6elhn02";
    
      const chatRef = collection(db, "chat");
     
      // Query the "chat" collection for chats that include the current user's ID
      const chatQuery = query(chatRef, where('id1', '==', currentUserID));
    
      const q = query(collection(db, "chat"), where("id1", "==", currentUserID));
    
      let partnerImg= '';
      let partnerNome = '';
      let partnerUsuario = '';
    
      
      // Attach a snapshot listener to get real-time updates on the chat
    
        onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach(async (doc2) => {
            const chatData = doc2.data();
    
            // Check if the current user is either the sender or the receiver of the last message
            const lastMessage = chatData.mensagem[chatData.mensagem.length - 1];
            if (lastMessage) {
              const chatPartnerID = lastMessage.idUserSent === currentUserID ? lastMessage.idUserReceived : lastMessage.idUserSent;
              try {
                const userPartnerRef = doc(db, "users", chatPartnerID);
                const userPartnerSnapshot = await getDoc(userPartnerRef);
      
                const userDocRef = doc(db, "users", currentUserID);
                const userDocSnapshot = await getDoc(userDocRef);
    
                  const partnerData2 = userPartnerSnapshot.data();
                  partnerImg = partnerData2.imageSrc;
                  partnerNome = partnerData2.nome;
                  partnerUsuario = partnerData2.usuario;
    
                  const userData2 = userDocSnapshot.data();
                  
              } catch (error) {
                console.error('Erro ao obter informações do parceiro de chat:', error);
              }
    
              // Create the chat div and add it to the array
              chatDivs.push(
                <div className="chat" key={chatData.id1}>
                  {/* Replace the following lines with appropriate data */}
                  <div className="imgProfilePic">
                    <img className="profilePicDm" src={partnerImg} alt="Profile Pic" />
                  </div>
                  <div className="tudoMenosImg">
                    <div className="dadosPessoaisDm">
                      <p className="nome bold">{partnerNome}</p>
                      <p className="user light">@{partnerUsuario}</p>
                      <p className="light">•</p>
                      <p className="horaUltimaMensagem light">{lastMessage.time}</p>
                    </div>
                    <div className="mensagemDm">
                      <p className="ultimaMensagem light">{lastMessage.text}</p>
                    </div>
                  </div>
                </div>
              );
            }
          });
           // console.log("oi gustavo te amo vc é o melhro namorado que eu poderia ter e eu te amo muito murtito hj e sempre")
          // Update the state with the chat divs
          setChats(chatDivs);
          console.log(chatDivs)
        });
    }
    
    useEffect(() => {
      renderUserChats();
    }, []);

    // Function to handle search input change
    const handleSearchInputChange = (event) => {
      const searchValue = event.target.value.trim();

        setSearchTerm(searchValue);
  
      // Create a Firestore query to search for users by name
      const usersRef = collection(db, "users");
    
      // const searchQuery = query(usersRef, or( where("usuario", "==", searchValue), where("nome", "==", searchValue)));
      const searchQuery = query(usersRef, where("usuario", ">=", searchValue), where("usuario", "<=", searchValue + '\uf8ff'));
      const searchQuery2 = query(usersRef, where("nome", ">=", searchValue), where("nome", "<=", searchValue + '\uf8ff'));

      // Listen for real-time updates and update searchResults state
      onSnapshot(searchQuery, (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSearchResults(results);
      });

      onSnapshot(searchQuery2, (snapshot) => {
        const results2 = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSearchResults((prevResults) => prevResults.concat(results2));
      });
      
    };


  return (
    
    <>
      <div className="header">
        <img className="profilePicDm" src="https://pbs.twimg.com/profile_images/1653051776298360833/bUymYMlt_400x400.jpg"></img>
        <p id="msg">Mensagens</p>
      </div>
      <div id="blocoPesquisa" className="centraliza">
        <input className="input" type="search" placeholder="Quem você está procurando?" value={searchTerm} onChange={handleSearchInputChange}></input>
        <TransitionGroup component="ul">
        {searchResults.map((user) => (<CSSTransition nodeRef={nodeRef} timeout={500} classNames="my-node" key={user.uid + "1"}><Link to={`./Chat/${user.uid}`}><li  className="listaResultadosPesquisa" key={user.uid} ref={nodeRef}><img className="profilePicDm" src={user.imageSrc}></img><div className="dadosPessoaisDm"><p className="nome bold" >{user.nome}</p><p className="user light" >@{user.usuario}</p></div></li></Link></CSSTransition>))}
        </TransitionGroup>
      </div>
      {chats.map((chatDiv) => (
          <div key={chatDiv}>{chatDiv}</div>
        ))}
      <div className="footer">
        <div>
          <img id="home" src={homeIcon}></img>
        </div>
        <div>
          <img id="pesquisa" src={pesquisaIcon}></img>
        </div>
        <div>
          <img id="notificacao" src={notificacaoIcon}></img>
        </div>
        <div>
          <img id="dm" src={dmIcon}></img>
        </div>
      </div>
    </>
  );   
}

export default Dm;