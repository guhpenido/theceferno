import { useState, useRef, useEffect, useCallback } from "react";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import notificacaoIcon from "../../assets/notificacao-icon.svg";
import pesquisaIcon from "../../assets/pesquisa-icon.svg";
//import "./dmStyles.css"; 
//import "./stylesDm.css"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
import VLibras from "@djpfs/react-vlibras";


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


/*function AbrirChat(id){
    return <Link to={`/Chat/${id}`}></Link>;
}*/

function Dm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(app);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [userLoggedData, setUserLoggedData] = useState(null);
  const imageref = useRef(null);

  const nodeRef = useRef(null);

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
    if (userId) {
      fetchUserDataAndSetState(userId);
      RenderUserChats();
    } 
  }, [userId]);

  const fetchUserDataAndSetState = async (userId) => {
    try {
      const userLoggedDataResponse = await fetchUserData(userId);
      setUserLoggedData(userLoggedDataResponse);
      console.log(userLoggedData);
      
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setIsLoading(false); // Even if there's an error, stop loading
    }
  };

  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      console.log(userDoc.data().imageUrl);
      imageref.current.src = userDoc.data().imageUrl;
      return userDoc.data();
    } else {
      console.log("User not found");
      return null;
    }
  };


  function RenderUserChats() {
    // Firestore collection reference for the "chat" collection
    const chatDivs = [];

    const chatRef = collection(db, "chat");

    // Query the "chat" collection for chats that include the current user's ID
    const q = query(
      collection(db, "chat"),
      or(where("id1", "==", userId), where("id2", "==", userId)),
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
        console.log("updates on the chat");

        // Check if the current user is either the sender or the receiver of the last message
        const lastMessage = chatData.mensagem[chatData.mensagem.length - 1];
        if (lastMessage) {
          const chatPartnerID =
            lastMessage.idUserSent === userId
              ? lastMessage.idUserReceived
              : lastMessage.idUserSent;
          try {
            const userPartnerRef = doc(db, "users", chatPartnerID);
            const userPartnerSnapshot = await getDoc(userPartnerRef);

            const userDocRef = doc(db, "users", userId);
            const userDocSnapshot = await getDoc(userDocRef);

            const partnerData2 = userPartnerSnapshot.data();
            partnerImg = partnerData2.imageUrl;
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
            <Link to={`/Chat/${chatPartnerID}`}>
            <div className="chatDm" key={num}>
              {/* Replace the following lines with appropriate data */}
              <div className="imgProfilePic">
                <img
                  className="profilePicDm"
                  src={partnerImg?partnerImg:cefernoIcon}
                  alt="Profile Pic"
                />
              </div>
              <div className="tudoMenosImg">
                <div className="dadosPessoaisDm">
                  <p className="boldDm">{partnerNome.split(' ')[0]}</p>
                  <p className="userDm lightDm">@{partnerUsuario}</p>
                  <p className="lightDm">•</p>
                  <p className="horaUltimaMensagem lightDm">{horaEMinutos}</p>
                </div>
                <div className="mensagemDm">
                  <p className="ultimaMensagem lightDm">{lastMessage.text}</p>
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

  // useEffect(() => {

  //   RenderUserChats();
  // }, []);

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
    const searchValue = event.target.value
    console.log("1");
    setSearchTerm(searchValue);
    if(searchValue > ""){
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
        // console.log(results[0].imageUrl);
        setSearchResults((prevResults) => prevResults.concat(results));
      });

      onSnapshot(searchQuery2, (snapshot) => {
        const results2 = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(results2);
        setSearchResults((prevResults) => prevResults.concat(results2));
      });
    }
    else {
      setSearchResults([])
    }
    
  };
  return (
    <>
      <div className="headerDm">
        <img
          className="profilePicDm"
          ref={imageref}
          //src={userLoggedData.imageUrl?userLoggedData.imageUrl:cefernoIcon}
          //src="https://pbs.twimg.com/profile_images/1653051776298360833/bUymYMlt_400x400.jpg"
          //src={userLoggedData.imageUrl}
          //src={userId.imageUrl}
          //src={user.imageUrl}
        ></img>
        <p id="msg">Mensagens</p>
      </div>
      <div id="blocoPesquisaDm" className="centralizarDm">
        <input
          className="inputPesquisaDm"
          type="search"
          placeholder="Quem você está procurando?"
          value={searchTerm}
          onChange={handleSearchInputChange}
        ></input>
        <TransitionGroup component="ul" className="ulDm">
          {searchResults.map((user) => (
            <CSSTransition
              nodeRef={nodeRef}
              timeout={500}
              classNames="my-node"
              key={user.id?user.id:user.uid + "1"}
            >
              <Link to={`/Chat/${user.id?user.id:user.uid}`}> 
                <li
                  className="listaResultadosPesquisaDm"
                  key={user.id?user.id:user.uid}
                  noderef={nodeRef}
                >
                  <img className="profilePicDm" src={user.imageUrl}></img>
                  <div className="dadosPessoaisDm">
                    <p className="nomeUserDm boldDm">{user.nome}</p>
                    <p className="userDm lightDm">@{user.usuario}</p>
                  </div>
                </li>
              </Link>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <div className="fullDmMessages">
      {chats.map((chatDiv, index) => (
        <div key={index + 1}>{chatDiv}</div>
      ))}
      </div>
      <div className="footerDm">
      <Link className="botaoAcessar" to="/timeline"><div>
          <img id="home" src={homeIcon}></img>
        </div>
        </Link>
        <Link className="botaoAcessar" to="/timeline">
        <div>
          <img id="pesquisa" src={pesquisaIcon}></img>
        </div>
        </Link>
        <Link className="botaoAcessar" to="/timeline">
        <div>
          <img id="notificacao" src={notificacaoIcon}></img>
        </div>
        </Link>
        <Link className="botaoAcessar" to="/dm"><div>
          <img id="dm" src={dmIcon}></img>
        </div>
        </Link>
        <VLibras forceOnload={true} />
      </div>
    </>
  );
}

export default Dm;
