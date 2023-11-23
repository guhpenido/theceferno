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
import Pesquisa from "../Pesquisa/index";
import toast, { Toaster } from "react-hot-toast";
import faBookmark  from "../../assets/saved.svg";
import {
  getDatabase,
  ref,
  orderByKey,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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
import searchIcon from "../../assets/search.svg";
import perfilIcon from "../../assets/perfil-icon.svg";
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
  const [instituicoes, setInstituicoes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedInstituicaoFilter, setSelectedInstituicaoFilter] =
    useState("");
  const [selectedCursoFilter, setSelectedCursoFilter] = useState("");
  const [filtroVisivel, setFiltroVisivel] = useState(false);

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
  const fetchCursos = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const cursosData = [];

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.curso && !cursosData.includes(user.curso)) {
          cursosData.push(user.curso);
        }
      });

      setCursos(cursosData);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    }
  };
  const fetchInstituicoes = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const instituicoesData = [];

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.instituicao && !instituicoesData.includes(user.instituicao)) {
          instituicoesData.push(user.instituicao);
        }
      });

      setInstituicoes(instituicoesData);
    } catch (error) {
      console.error("Erro ao obter instituições:", error);
    }
  };
  useEffect(() => {
    fetchInstituicoes();
    fetchCursos();
  }, []);

  const carregaTml = async (instituicao = "", curso = "") => {
    try {
      if (isFetching) {
        return;
      }

      setIsFetching(true);
      const postsCollectionRef = collection(db, "timeline");

      let postsQuery = query(
        postsCollectionRef,
        orderBy("postId", "desc"),
        limit(15)
      );

      if (instituicao !== "") {
        postsQuery = query(
          postsCollectionRef,
          where("userSent.instituicao", "==", instituicao),
          orderBy("postId", "desc"),
          limit(15)
        );
      }

      if (curso !== "") {
        postsQuery = query(
          postsCollectionRef,
          where("userSent.curso", "==", curso),
          orderBy("postId", "desc"),
          limit(15)
        );
      }

      if (instituicao !== "" && curso !== "") {
        postsQuery = query(
          postsCollectionRef,
          where("userSent.instituicao", "==", instituicao),
          where("userSent.curso", "==", curso),
          orderBy("postId", "desc"),
          limit(15)
        );
      }

      const postsData = await getPostsFromFirestore(postsQuery);

      if (postsData.length === 0) {
        toast.error("Não há mais posts para carregar.");
      } else {
        const postsWithUserData = [];
        setLoadedPosts(postsWithUserData);
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

        setLoadedPosts(postsWithUserData);
        toast.success("Posts carregados!");
      }
    } catch (error) {
      console.error("Erro ao obter os posts:", error);
      toast.error("Erro ao obter os posts. Por favor, tente novamente.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleFilterClick = () => {
    carregaTml(selectedInstituicaoFilter, selectedCursoFilter);
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
  
  const toggleFiltroVisivel = () => {
    setFiltroVisivel(!filtroVisivel);
  };
  return (
    <>
      <div className="tl-screen">
        <div className="tl-container">
          <Header
            userLogged={userLoggedData}
            toggleMobileLateral={toggleMobileLateral}
            abreMenu={toggleFiltroVisivel}
          />
          <MenuLateral
            isMobileLateralVisible={isMobileLateralVisible}
            toggleMobileLateral={toggleMobileLateral}
            carregatml={recarregarTml}
          />

          <div className="tl-main">
            {filtroVisivel && (
              <div className="filter-section">
                <label htmlFor="instituicaoFilter">Instituição:</label>
                <select
                  id="instituicaoFilter"
                  value={selectedInstituicaoFilter}
                  onChange={(e) => setSelectedInstituicaoFilter(e.target.value)}
                >
                  <option value="">Todas</option>
                  {instituicoes.map((instituicao, index) => (
                    <option key={index} value={instituicao}>
                      {instituicao}
                    </option>
                  ))}
                </select>

                <label htmlFor="cursoFilter">Curso:</label>
                <select
                  id="cursoFilter"
                  value={selectedCursoFilter}
                  onChange={(e) => setSelectedCursoFilter(e.target.value)}
                >
                  <option value="">Todos</option>
                  {cursos.map((curso, index) => (
                    <option key={index} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>

                <button onClick={() => handleFilterClick}>Filtrar</button>
              </div>
            )}
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
          <Pesquisa />
          <AddPost />
          <div className="footerDm">
            <Link className="botaoAcessar" to="/timeline">
              <div>
                <img id="home" src={homeIcon} alt="Botão ir para Home"></img>
              </div>
            </Link>
            <Link className="botaoAcessar" to="/perfil">
              <div>
                <img
                  id="pesquisa"
                  src={perfilIcon}
                  alt="Botão para pesquisa"
                ></img>
              </div>
            </Link>
            <Link className="botaoAcessar" to="/dm">
              <div>
                <img
                  id="dm"
                  src={dmIcon}
                  alt="Botão ir para DM, chat conversas privadas"
                ></img>
              </div>
            </Link>
            <Link className="botaoAcessar" to="/savedPosts">
						<div>
							<img
								id="dm"
								src={faBookmark}
								alt="Botão ir para salvos."
							></img>
						</div>
					</Link>
            <Link className="botaoAcessar" to="/pesquisa">
              <div>
                <img
                  id="dm"
                  src={searchIcon}
                  alt="Botão ir para pesqusisa."
                ></img>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Acessibilidade />
    </>
  );
}
