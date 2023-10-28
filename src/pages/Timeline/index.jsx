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
import {
  getDatabase,
  ref,
  orderByKey,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
import Trending from "./Trending";


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
  const [activeTab, setActiveTab] = useState('timeline');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [sortedTrendingPosts, setSortedTrendingPosts] = useState([]);



  const handleTabChange = (tab) => {
    setActiveTab(tab); // Função para alterar a aba ativa
  };



  const [nextPostId, setNextPostId] = useState(0);
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
    const lastLoadedPost =
      loadedPosts.length > 0 ? loadedPosts[loadedPosts.length - 1].post : null;
    const lastLoadedPostId = lastLoadedPost ? lastLoadedPost.id : "";
    let postsQuery = null;
    console.log(selectedInstituicao);
    console.log(selectedCurso);

    if (lastLoadedPostId) {
      console.log("Latest post:" + lastLoadedPostId);
      // Se houver um último post carregado, use startAfter para obter os próximos posts
      postsQuery = query(
        postsCollectionRef,
        orderBy("postId", "desc"),
        startAfter(lastLoadedPostId),
        limit(10)
      );
    } else {
      // Se não houver último post carregado, simplesmente carregue os 10 posts mais recentes
      postsQuery = query(
        postsCollectionRef,
        orderBy("postId", "desc"),
        limit(10)
      );
    }
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

        // Aqui, substitua todo o estado de loadedPosts com os novos posts carregados
        setLoadedPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
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
      setIsLoading(false); // Even if there's an error, stop loading
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

  const profile = {
    username: userLoggedData.pseudonimo,
    photoURL:
      "https://cdn.discordapp.com/attachments/812025565615882270/1142990318845821058/image.png",
  };

  return (
    <>
      <div className="tl-screen">
        <div className="tl-container">
          <Header />
          <div className="tl-ladoEsquerdo"></div>
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
            <div className="tl-ladoDireito-procurar">
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
                <input type="text" placeholder="Procurar" />
                </div>
              </div>
            </div>
            <div className="tl-ladoDireito-doar">
              <h1>Deseja doar para o CEFERNO?</h1>
              <p>O CEFERNO é um projeto estudantil, e para mantermos ele online precisamos das doações.</p>
              <button>Doar</button>
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
