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
import { Acessibilidade } from "../Acessibilidade/index";
import AddPost from "./AddPost";
import Header from "./Header";
import MenuLateral from "../MenuLateral/MenuLateral";
import {
  getDatabase,
  ref,
  orderByKey,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import perfilIcon from "../../assets/perfil-icon.svg";
import setaPostar from "../../assets/seta-postar.svg";

import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import PostDisplay from "./post";

import { addDoc } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./stylesTimeline.css";

export function Timeline() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const db = getFirestore(app);
  const db2 = getDatabase(app);
  const [posts, setPosts] = useState([]);
  const auth = getAuth(app);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null); // Estado para armazenar o perfil selecionado
  const [postMode, setPostMode] = useState("public"); //estado p armazenar modo
  const [addPostClass, setAddPostClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const nodeRef = useRef(null);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [hasLoadedPosts, setHasLoadedPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedCurso] = useState("");
  const [selectedInstituicao] = useState("");
  const [nextPostId, setNextPostId] = useState(0);
  const [isMobileLateralVisible, setIsMobileLateralVisible] = useState(false);
  
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    // Defina um limite inferior para acionar a busca por mais posts
    const triggerLimit = 100; // Você pode ajustar isso conforme necessário

    if (
      windowHeight + scrollTop >= documentHeight - triggerLimit &&
      !isFetching
    ) {
      setIsFetching(true);
    }
  };

  useEffect(() => {
    // Adicione um ouvinte de rolagem quando o componente for montado
    window.addEventListener("scroll", handleScroll);

    return () => {
      // Remova o ouvinte de rolagem quando o componente for desmontado
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isFetching) {
      carregaTml().then(() => {
        setIsFetching(false);
      });
    }
  }, [isFetching]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUserId(user.uid);
        console.log(user);
        fetchUserDataAndSetState(user.uid);
        carregaTml();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScrollStyle = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
        console.log("Scrollando");
      } else {
        setScrolling(false);
      }
    };

    // Adicionar um ouvinte de rolagem quando o componente é montado
    window.addEventListener("scroll", handleScrollStyle);

    // Remover o ouvinte de rolagem quando o componente é desmontado
    return () => {
      window.removeEventListener("scroll", handleScrollStyle);
    };
  }, []);

  const headerStyle = {
    opacity: scrolling ? 0.5 : 1, // Altere as cores conforme necessário
    transition: "opacity 0.3s",
  };

  const [newPost, setNewPost] = useState({
    deslikes: 0,
    likes: 0,
    mode: "public",
    text: "",
    time: "",
    userMentioned: "",
    userSent: userId,
  });

  const carregaTml = async () => {

    if (isFetching) {
      return;
    }
  
    setIsFetching(true);
    const postsCollectionRef = collection(db, "timeline");
  
    let postsQuery = query(
      postsCollectionRef,
      orderBy("postId", "desc"), // Ordene por postId em ordem decrescente
      limit(15)
    );
  
    try {
      const postsData = await getPostsFromFirestore(postsQuery);
  
      if (postsData.length === 0) {
        console.log("Você já chegou ao fim");
      } else {
        const postsWithUserData = [];
  
        for (const post of postsData) {
          const userSentData = await fetchUserData(post.userSent);
          let userMentionedData = null;
  
          if (post.userMentioned !== null) {
            userMentionedData = await fetchUserData(post.userMentioned);
          }
  
          postsWithUserData.push({
            post,
            userSentData,
            userMentionedData,
          });
        }
  
        // Substitua o estado de loadedPosts com os novos posts carregados
        setLoadedPosts(postsWithUserData);
        console.log("Novos posts carregados!");
      }
    } catch (error) {
      console.error("Erro ao obter os posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDataAndSetState(userId);
    }
  }, [userId]);

  useEffect(() => {
    // Lógica para determinar quando aplicar a classe
    if (userLoggedData && selectedProfile === userLoggedData.usuario) {
      setAddPostClass("anon");
    } else {
      setAddPostClass("");
    }
  }, [selectedProfile, userLoggedData]);

  //pega o id do post para incrementar
  const fetchLatestPostId = async () => {
    try {
      const postsRef = collection(db, "timeline");
      const querySnapshot = await getDocs(
        query(postsRef, orderBy("postId", "desc"), limit(1))
      ); // Obtém o último post com o ID mais alto
      if (!querySnapshot.empty) {
        const latestPost = querySnapshot.docs[0].data();
        const postIdAsNumber = parseInt(latestPost.postId, 10);
        console.log(postIdAsNumber);
        setNextPostId(postIdAsNumber + 1); // Define o próximo ID disponível com base no último ID
      }
    } catch (error) {
      console.error("Error fetching latest post ID:", error.message);
    }
  };

  useEffect(() => {
    fetchLatestPostId();
  }, []);

  const fetchUserDataAndSetState = async (userId) => {
    console.log(userId);
    try {
      const userLoggedDataResponse = await fetchUserData(userId);
      setUserLoggedData(userLoggedDataResponse);
      setSelectedProfile(userLoggedDataResponse.usuario);
      setIsLoadingUser(false); // Data has been fetched, no longer loading
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      //setIsLoading(false); // Even if there's an error, stop loading
    }
  };

  const getPostsFromFirestore = async (query) => {
    const querySnapshot = await getDocs(query);
    console.log("Query Snapshot:", querySnapshot);
    const postsData = [];

    querySnapshot.forEach((doc) => {
      const postData = {
        id: doc.data().postId,
        ...doc.data(),
      };
      postsData.push(postData);
    });
    console.log("Posts Data:", postsData);
    return postsData;
  };

  const fetchUserData = async (userId) => {
    try {
      if (!userId) {
        console.error("Invalid userId");
        return null;
      }

      const userDocRef = doc(db, "users", userId);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };

  const toggleVisibility = () => {
    setSelectedProfile(userLoggedData.usuario);
    setIsVisible(!isVisible);
    setIsUserListVisible(!isUserListVisible);
  };

  if (isLoadingUser) {
    return <p>Carregando...</p>;
  }
  function ProfileImage() {
    // Determine qual perfil está selecionado e use o URL da imagem correspondente
    const profileImageUrl =
      selectedProfile === userLoggedData.usuario
        ? userLoggedData.imageUrl
        : profile.photoURL;

    return <img src={profileImageUrl} alt="Perfil" />;
  }

  const profile = {
    username: userLoggedData.pseudonimo,
    photoURL:
      "https://cdn.discordapp.com/attachments/812025565615882270/1142990318845821058/image.png",
  };

  const toggleMobileLateral = () => {
    setIsMobileLateralVisible(!isMobileLateralVisible);
    console.log("clicou");
    console.log(isMobileLateralVisible);
  };
  const recarregarTml = async () => {
    // Limpe o estado dos posts carregados
    setLoadedPosts([]);
    setHasLoadedPosts(false);
    // Chame a função carregaTml para carregar novamente os últimos 15 posts
    carregaTml();
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value.trim();

    setSearchTerm(searchValue);

    // Create a Firestore query to search for users by name
    if (searchValue !== "") {
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
          id: doc.data,
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
        setIsUserListVisible(true); // Mostrar a lista de usuários
      });
    } else {
      setSearchResults([]); // Limpar os resultados da pesquisa se o termo de pesquisa estiver vazio
      setIsUserListVisible(false); // Ocultar a lista de usuários
    }
  };

  return (
    <>
      <div className="tl-screen">
        <div className="tl-container">
          <Header
            userLogged={userLoggedData}
            toggleMobileLateral={toggleMobileLateral}
            carregatml={carregaTml}
          />
          <MenuLateral
            isMobileLateralVisible={isMobileLateralVisible}
            toggleMobileLateral={toggleMobileLateral}
            carregatml={recarregarTml}
          />
          
          <div className="tl-main">
            <div className="tl-box">
              {loadedPosts.map(({ post, userSentData, userMentionedData }) => (
                <PostDisplay
                  key={post.id}
                  post={post}
                  userSentData={userSentData}
                  userId={userId}
                  userMentionedData={userMentionedData}
                  userLoggedData={userLoggedData}
                />
              ))}
            </div>
          </div>
          <div className="tl-ladoDireito">
            {/* <div className="tl-ladoDireito-procurar">
              <div className="procurar-box">
                <div className="img-procurar-box">
                  <div className="img-procurar-box-in">
                    <img
                      src="https://cdn.discordapp.com/attachments/871728576972615680/1167934652267368488/6328608.png?ex=654feee8&is=653d79e8&hm=15078133d7bcc63b14665f301890a83cf549dba37a671c8827a8c9c6e8c50c11&"
                      alt=""
                    />
                  </div>
                </div>
                <div className="procurar-box-input">
                  <input
                    placeholder="Procurar"
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchInputChange} />
                </div>
                {isUserListVisible && ( // Verifica se a lista de usuários deve ser exibida
                  <div className="tl-search-list-container">
                    <TransitionGroup component="ul">
                      {searchResults.map((user) => (
                        <CSSTransition
                          nodeRef={nodeRef}
                          timeout={500}
                          classNames="my-node"
                          key={user.id + "1"}
                        >
                          <Link to="">
                          <li
                            className="tl-search-list-item"
                            key={user.id}
                            ref={nodeRef}
                          >
                            <img
                              className="tl-search-list-profilePic"
                              src={user.imageUrl}
                            ></img>
                            <div className="tl-search-list-dadosPessoais">
                              <p className="tl-search-list-nome bold">
                                {user.nome}
                              </p>
                              <p className="tl-search-list-user ">
                                @{user.usuario}
                              </p>
                            </div>
                          </li>
                          </Link>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                  </div>
                )}
              </div>
            </div> */}
            <div className="tl-ladoDireito-doar">
              <h1>Deseja doar para o CEFERNO?</h1>
              <p>
                O CEFERNO é um projeto estudantil, e para mantermos ele online
                precisamos das doações.
              </p>
              <Link to="https://media.discordapp.net/attachments/944149522177724467/1168375178351353966/image.png?ex=6551892d&is=653f142d&hm=7d05dea6af65bd29a93f20f6b8baee33dda6a2feb41d29705790a41baf7f9938&=">
              <button>Doar</button>
              </Link>
            </div>
          </div>
          <AddPost />
        </div>
        {/*<div className="tl-menu">
          <div className="tl-menu-header">
            <div className="tl-menu-header-profile">
              <div className="tl-menu-foto"></div>
              <div className="tl-menu-nomes"></div>
              <div className="tl-menu-follows"></div>
            </div>
          </div>
          <div className="tl-menu-body">
            <div className="tl-menu-options">
              <div className="tl-menu-option">
              <a href="">Perfil</a>
              </div>     
              <div className="tl-menu-option">
              <a href="">Whispers privados</a>
              </div>
              <div className="tl-menu-option">
              <a href="">Configurações</a>
              </div>
              <div className="tl-menu-option">
              <a href="">Notificações</a>
              </div>
              <div className="tl-menu-option">
              <a href="">Pesquisar</a>
              </div>
            </div>            
          </div>
          <div className="tl-menu-footer"></div>
  </div>*/}
      </div>
      <Acessibilidade />
    </>
  );
}
