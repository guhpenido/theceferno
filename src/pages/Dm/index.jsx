import { useState, useRef } from "react";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import notificacaoIcon from "../../assets/notificacao-icon.svg";
import pesquisaIcon from "../../assets/pesquisa-icon.svg";
// import "./stylesDm.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { doc, getDoc, onSnapshot, collection, query, where} from "firebase/firestore";
import { Link } from "react-router-dom";

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


function Dm() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const nodeRef = useRef(null);

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

    /*function AbrirChat(uid){
        return <Link to={`/Chat/${uid}`}></Link>;
    }*/

  return (
    <>
      <div className="header">
        <img className="profilePicDm" src="https://pbs.twimg.com/profile_images/1653051776298360833/bUymYMlt_400x400.jpg"></img>
        <p id="msg">Mensagens</p>
      </div>
      <div id="blocoPesquisa" className="centraliza">
        <input type="search" placeholder="Quem você está procurando?" value={searchTerm} onChange={handleSearchInputChange}></input>
        <TransitionGroup component="ul">
        {searchResults.map((user) => (<CSSTransition nodeRef={nodeRef} timeout={500} classNames="my-node" key={user.uid + "1"}><Link to={`./Chat/${user.uid}`}><li  className="listaResultadosPesquisa" key={user.uid} ref={nodeRef}><img className="profilePicDm" src={user.imageSrc}></img><div className="dadosPessoaisDm"><p className="nome bold" >{user.nome}</p><p className="user light" >@{user.usuario}</p></div></li></Link></CSSTransition>))}
        </TransitionGroup>
      </div>
      <div className="mensagens">
        <div className="chat">
          <div className="imgProfilePic">
            <img className="profilePicDm" src="https://pbs.twimg.com/profile_images/1679116755115954176/EwWvEOC5_400x400.jpg"></img>
          </div>
          <div className="tudoMenosImg">
            <div className="dadosPessoaisDm">
              <p className="nome bold" >Gustavo</p>
              <p className="user light">@hawktop</p>
              <p className="light">•</p>
              <p className="horaUltimaMensagem light">1min</p>
            </div>
            <div className="mensagemDm">
              <p className="ultimaMensagem light">oiiiiiiiiiiiiiiiiiiiiiii</p>
            </div>
          </div>
        </div>
      </div>
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