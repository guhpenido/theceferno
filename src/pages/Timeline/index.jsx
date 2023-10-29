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
<<<<<<< HEAD
import Trending from "./Trending";
import Denuncia from "../Denuncia/Denuncia";

=======
>>>>>>> origin/prodGustavo

export function Timeline() {

  const [mostrarComponente, setMostrarComponente] = useState(false);

  const handleClick = () => {
    setMostrarComponente(true);
  }




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
  const userDocRef = doc(db, "users", userId);
  async function getSavedPosts() {
  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // O documento do usuário existe, agora você pode acessar o vetor 'savedPosts'
      const userData = userDocSnapshot.data();
      const savedPosts = userData.savedPosts;
      console.log(savedPosts);
      // 'savedPosts' é um vetor de inteiros que você pode usar como quiser
    } else {
      console.log('Documento não encontrado!');
    }
  } catch (error) {
    console.error('Erro ao obter o documento do usuário:', error);
  }
}

  const toggleMobileLateral = () => {
    setIsMobileLateralVisible(!isMobileLateralVisible);
    console.log("clicou");
    console.log(isMobileLateralVisible);
  };

  const toggleMobileLateral = () => {
    setIsMobileLateralVisible(!isMobileLateralVisible);
    console.log("clicou");
    console.log(isMobileLateralVisible);
  };

  return (
    <>
      <div className="tl-screen">
        <div className="tl-container">
<<<<<<< HEAD
<<<<<<< HEAD
          <div className="tl-header">
            <div className="tl-header1">
              <Link className="tl-foto" to="/perfil">
                <div>
                  <ProfileImage selectedProfile={selectedProfile} />
                </div>
              </Link>
              <div className="tl-logo">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png"
                  alt="Logo Ceferno"
                />
              </div>
            </div>
            <div className="tl-titulo">
            <button className="tlBotaoTroca" onClick={() => handleTabChange("timeline")}>Timeline</button>
            <p style={{color: '#193cd8'}}>|</p>
            <button className="tlBotaoTroca" onClick={handleClick}>Trending</button> {mostrarComponente && <Denuncia />}
            </div>
          </div>
          </div>
          <div className="tl-main">
            <div className="tl-box">
              {/*{posts.map(async (post) => {
                const userSentData = await fetchUserData(post.userSent);
                const userMentionedData = await fetchUserData(
                  post.userMentioned
                );

                const userSentImage = await fetchUserImage(userSentData);
                const userMentionedImage = await fetchUserImage(
                  userMentionedData
                );

                return (
                  <div className="tl-box" key={post.id}>
                    <div className="tl-post">
                      <div className="tl-ps-header">
                        <div className="tl-ps-foto">
                          {userSentImage && <img src={userSentImage} alt="" />}
                        </div>
                        <div className="tl-ps-nomes">
                          <p className="tl-ps-nome">
                            {userSentData.nome}{" "}
                            <span className="tl-ps-user">
                              @{userSentData.usuario}{" "}
                            </span>
                            <span className="tl-ps-tempo">• {post.time}</span>
                            <FontAwesomeIcon
                              className="arrow"
                              icon={faArrowRight}
                            />
                            {post.userMentioned !== null && (
                              <div>
                                {userMentionedImage && (
                                  <img src={userMentionedImage} alt="" />
                                )}
                                {userMentionedData.nome}{" "}
                                <span className="tl-ps-userReceived">
                                  @{userMentionedData.usuario}{" "}
                                </span>
                              </div>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="tl-ps-texto">
                        <p>{post.text}</p>
                      </div>
                      <div className="tl-ps-footer">
                        <div className="tl-ps-opcoes">
                          <div className="tl-ps-reply">
                            <FontAwesomeIcon icon={faComment} />
                            <span>{post.replyCount}</span>
                          </div>
                          <div className="tl-ps-like">
                            <FontAwesomeIcon icon={faThumbsUp} />{" "}
                            <span>{post.likes}</span>
                          </div>
                          <div className="tl-ps-deslike">
                            <FontAwesomeIcon icon={faThumbsDown} />{" "}
                            <span>{post.deslikes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}*/}

              <div className="tl-post">
                <div className="tl-ps-header">
                  <div className="tl-ps-foto">
                    <img
                      src="https://cdn.discordapp.com/attachments/871728576972615680/1142349089133047868/image.png"
                      alt="Imagem perfil"
                    />
                  </div>
                  <div className="tl-ps-nomes">
                    <p className="tl-ps-nome">
                      Stella <span className="tl-ps-user">@tellaswift </span>
                      <span className="tl-ps-tempo">• 42s</span>
                      <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                      <img
                        src="https://cdn.discordapp.com/attachments/871728576972615680/1142348920949833829/image.png"
                        alt="Imagem perfil"
                      />{" "}
                      Kettles{" "}
                      <span className="tl-ps-userReceived">@eokettles </span>
                    </p>
                  </div>
                </div>
                <div className="tl-ps-texto">
                  <p>Ain apelaummmm!</p>
                </div>
                <div className="tl-ps-footer">
                  <div className="tl-ps-opcoes">
                    <div className="tl-ps-reply">
                      <FontAwesomeIcon icon={faComment} />
                      <span>10</span>
                    </div>
                    <div className="tl-ps-like">
                      <FontAwesomeIcon icon={faThumbsUp} /> <span>10</span>
                    </div>
                    <div className="tl-ps-deslike">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tl-post">
                <div className="tl-ps-header">
                  <div className="tl-ps-foto">
                    <img
                      src="https://cdn.discordapp.com/attachments/871728576972615680/1142349089133047868/image.png"
                      alt="Imagem perfil"
                    />
                  </div>
                  <div className="tl-ps-nomes">
                    <p className="tl-ps-nome">
                      Stella <span className="tl-ps-user">@tellaswift </span>
                      <span className="tl-ps-tempo">• 1h</span>
                    </p>
                  </div>
                </div>
                <div className="tl-ps-texto">Esse é meu primeiro post.</div>
                <div className="tl-ps-footer">
                  <div className="tl-ps-opcoes">
                    <div className="tl-ps-reply">
                      <FontAwesomeIcon icon={faComment} />
                      <span>10</span>
                    </div>
                    <div className="tl-ps-like">
                      <FontAwesomeIcon icon={faThumbsUp} /> <span>10</span>
                    </div>
                    <div className="tl-ps-deslike">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tl-addpost" onClick={toggleVisibility}>
            <img
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142352433352294482/asa.png"
              alt="Imagem perfil"
            />
          </div>
          <div className="tl-footer">
            <div>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <FontAwesomeIcon icon={faBell} />
            </div>
            <div>
              <FontAwesomeIcon icon={faQuestion} />
            </div>
            <div>
              <FontAwesomeIcon icon={faQuestion} />
            <div className="tl-container">
            {activeTab === "timeline" && (
                <div className="tl-posts">
                {loadedPosts.map(({ post, userSentData, userMentionedData }) => (
                  <PostDisplay
                    key={post.id}
                    userId = {userId}
                    post={post}
                    userSentData={userSentData}
                    userMentionedData={userMentionedData}
                  />
                ))}
              </div>
            )}
            {activeTab === "trending" && (
              
                <Trending />
              
              )}
=======
=======
>>>>>>> origin/prodLucas
          <Header
            userLogged={userLoggedData}
            toggleMobileLateral={toggleMobileLateral}
          />
          <MenuLateral
            isMobileLateralVisible={isMobileLateralVisible}
            toggleMobileLateral={toggleMobileLateral}
          />
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
>>>>>>> origin/prodGustavo
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
              <p>
                O CEFERNO é um projeto estudantil, e para mantermos ele online
                precisamos das doações.
              </p>
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
