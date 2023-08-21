import { useState, useRef, useEffect, useCallback } from "react";
import homeIcon from "./assets/home-icon.svg";
import dmIcon from "./assets/dm-icon.svg";
import notificacaoIcon from "./assets/notificacao-icon.svg";
import pesquisaIcon from "./assets/pesquisa-icon.svg";
import "./dmStyles.css"; 
import "./stylesDm.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  or,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";


// Conexao com o firebase

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

// Id Do Usuário Logado (pegar com o firebaseAuth) = auth.currentUser.id;
const userUid = "lEHi9cUB9TO5yWCmA2ocbt5fhq02";

// Id Do Usuário que está recebendo as mensagens
const userUidSelected = "ovTWKzRPZmaAsluan0Fkr6elhn02";

/*function AbrirChat(id){
    return <Link to={`/Chat/${id}`}></Link>;
}*/

function Dm(this: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const nodeRef = useRef(null);

  function RenderUserChats() {
    // Firestore collection reference for the "chat" collection
    const chatDivs = [];

    // Create an array to hold the chat divs

    // Get the current user's ID (replace this with your actual method to get the user ID)
    const currentUserID = "ovTWKzRPZmaAsluan0Fkr6elhn02";

    const chatRef = collection(db, "chat");

    // Query the "chat" collection for chats that include the current user's ID

    const q = query(
      collection(db, "chat"),
      or(where("id1", "==", currentUserID), where("id2", "==", currentUserID)),
      orderBy("time", "desc")
    );

    let partnerImg = "";
    let partnerNome = "";
    let partnerUsuario = "";

    // Attach a snapshot listener to get real-time updates on the chat
    let num = 0;
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(async (doc2) => {
        const chatData = doc2.data();
        console.log("aaaa");

        // Check if the current user is either the sender or the receiver of the last message
        const lastMessage = chatData.mensagem[chatData.mensagem.length - 1];
        if (lastMessage) {
          const chatPartnerID =
            lastMessage.idUserSent === currentUserID
              ? lastMessage.idUserReceived
              : lastMessage.idUserSent;
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
            console.error(
              "Erro ao obter informações do parceiro de chat:",
              error
            );
          }

          const converterHora = () => {
            const partes = lastMessage.time.split(", ");

            // A primeira parte contém a data, e a segunda parte contém o horário
            const dataParte = partes[0];
            const horarioParte = partes[1];

            // Use uma expressão regular para extrair os componentes da data e do horário
            const regexData = /(\d{2})\/(\d{2})\/(\d{4})/;
            const regexHorario = /(\d{2}):(\d{2}):(\d{2})/;

            const matchData = dataParte.match(regexData);
            const matchHorario = horarioParte.match(regexHorario);

            if (matchData && matchHorario) {
              const [, dia, mes, ano] = matchData;
              const [, hora, minutos, segundos] = matchHorario;

              // Formate a data no formato aceito pelo objeto Date (ano, mês - 1, dia, hora, minutos, segundos)
              const dataFormatada = new Date(
                ano,
                mes - 1,
                dia,
                hora,
                minutos,
                segundos
              );
              return dataFormatada;
              console.log(dataFormatada); // Data no formato de objeto Date
            } else {
              return console.error("Formato de data ou horário inválido.");
            }
          };
          const tempo = new Date(converterHora());

          // Obtém a hora e os minutos da data
          const hora = tempo.getHours();
          const minutos = tempo.getMinutes();

          // Formata a hora e os minutos em uma string no formato "HH:MM"
          const horaFormatada = String(hora).padStart(2, "0"); // Adiciona um zero à esquerda, se necessário
          const minutosFormatados = String(minutos).padStart(2, "0");

          // A hora final no formato "HH:MM"
          const horaEMinutos = `${horaFormatada}:${minutosFormatados}`;

          // Create the chat div and add it to the array
          chatDivs.push(
            <Link to={`./Chat/${chatPartnerID}`}>
            <div className="chat" key={num}>
              {/* Replace the following lines with appropriate data */}
              <div className="imgProfilePic">
                <img
                  className="profilePicDm"
                  src={partnerImg}
                  alt="Profile Pic"
                />
              </div>
              <div className="tudoMenosImg">
                <div className="dadosPessoaisDm">
                  <p className="nome bold">{partnerNome.split(' ')[0]}</p>
                  <p className="user light">@{partnerUsuario}</p>
                  <p className="light">•</p>
                  <p className="horaUltimaMensagem light">{horaEMinutos}</p>
                </div>
                <div className="mensagemDm">
                  <p className="ultimaMensagem light">{lastMessage.text}</p>
                </div>
              </div>
            </div></Link>
          );
          num++;
          setIsLoading(false);
        }
      });
      // Update the state with the chat divs

      setChats(chatDivs);
    });
  }

  useEffect(() => {
    console.log("1");

    RenderUserChats();
  }, []);

  console.log(chats);

  /*useEffect(() => {
      const unSub = onSnapshot(q, (doc) => {
        renderUserChats();
        console.log("4");
      });
  
      return () => {
        unSub();
        console.log("5");
      };
    }, []);*/

  /*useEffect(() => {
      const getChats = () => {
        const unsub = onSnapshot(q, (doc) => {
          renderUserChats();
        });
        return () => {
          unsub();
        };
      } 
  
      return () => {
        getChats();
      };
    }, []);*/

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value.trim();
    console.log("1");

    setSearchTerm(searchValue);

    // Create a Firestore query to search for users by name
    const usersRef = collection(db, "users");

    // const searchQuery = query(usersRef, or( where("usuario", "==", searchValue), where("nome", "==", searchValue)));
    const searchQuery = query(
      usersRef,
      where("usuario", ">=", searchValue),
      where("usuario", "<=", searchValue + "\uf8ff")
    );
    const searchQuery2 = query(
      usersRef,
      where("nome", ">=", searchValue),
      where("nome", "<=", searchValue + "\uf8ff")
    );

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
        <img
          className="profilePicDm"
          src="https://pbs.twimg.com/profile_images/1653051776298360833/bUymYMlt_400x400.jpg"
        ></img>
        <p id="msg">Mensagens</p>
      </div>
      <div id="blocoPesquisa" className="centraliza">
        <input
          className="input"
          type="search"
          placeholder="Quem você está procurando?"
          value={searchTerm}
          onChange={handleSearchInputChange}
        ></input>
        <TransitionGroup component="ul">
          {searchResults.map((user) => (
            <CSSTransition
              nodeRef={nodeRef}
              timeout={500}
              classNames="my-node"
              key={user.id + "1"}
            >
              <Link to={`./Chat/${user.id}`}>
                <li
                  className="listaResultadosPesquisa"
                  key={user.id}
                  ref={nodeRef}
                >
                  <img className="profilePicDm" src={user.imageSrc}></img>
                  <div className="dadosPessoaisDm">
                    <p className="nome bold">{user.nome}</p>
                    <p className="user light">@{user.usuario}</p>
                  </div>
                </li>
              </Link>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      {chats.map((chatDiv, index) => (
        <div key={index + 1}>{chatDiv}</div>
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