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
import VLibras from "@djpfs/react-vlibras";

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

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    // Defina um limite inferior para acionar a busca por mais posts
    const triggerLimit = 100; // Você pode ajustar isso conforme necessário

    if (windowHeight + scrollTop >= documentHeight - triggerLimit && !isFetching) {
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
    if(isFetching){
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

    // if(selectedCurso !== "" && selectedInstituicao !== ""){
    //   console.log(selectedInstituicao); 
    //   console.log(selectedCurso);
    //   const usersCollectionRef = collection(db, "users");
    //   const usersQuery = query(usersCollectionRef, where("curso", "==", selectedCurso), where("instituicao", "==", selectedInstituicao));

    //   try {
    //     const usersSnapshot = await getDocs(usersQuery);
    //     const userIds = [];

    //     usersSnapshot.forEach((userDoc) => {
    //       userIds.push(userDoc.id);
    //     });

    //     const postsCollectionRef = collection(db, "timeline");
    //     postsQuery = query(
    //       postsCollectionRef,
    //       where("userSent", "in", userIds),
    //       orderBy("postId", "desc"),
    //       limit(10)
    //     );
    //     }catch (error) {
    //       console.error("Erro ao buscar posts por curso:", error);
    //     }
    //   }


    //   else if(selectedCurso !== ""){
    //   const usersCollectionRef = collection(db, "users");
    //   const usersQuery = query(usersCollectionRef, where("curso", "==", selectedCurso));

    //   try {
    //     const usersSnapshot = await getDocs(usersQuery);
    //     const userIds = [];

    //     usersSnapshot.forEach((userDoc) => {
    //       userIds.push(userDoc.id);
    //     });

    //     const postsCollectionRef = collection(db, "timeline");
    //     postsQuery = query(
    //       postsCollectionRef,
    //       where("userSent", "in", userIds),
    //       orderBy("postId", "desc"),
    //       limit(10)
    //     );
    //     }catch (error) {
    //       console.error("Erro ao buscar posts por curso:", error);
    //     }
    //   }


    //   else if(selectedInstituicao !== ""){
    //   const usersCollectionRef = collection(db, "users");
    //   const usersQuery = query(
    //     usersCollectionRef,
    //     where("instituicao", "==", selectedInstituicao)
    //   );

    //   try {
    //     const usersSnapshot = await getDocs(usersQuery);
    //     const userIds = [];

    //     usersSnapshot.forEach((userDoc) => {
    //       userIds.push(userDoc.id);
    //     });


    //     const postsCollectionRef = collection(db, "timeline");
    //     postsQuery = query(
    //       postsCollectionRef,
    //       where("userSent", "in", userIds),
    //       orderBy("postId", "desc"),
    //       limit(10)
    //     );
    //   } catch (error) {
    //     console.error("Erro ao buscar posts por instituição:", error);
    //   }
    //   }
    
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
    }finally{
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

  const handleProfileChange = (e) => {
    setSelectedProfile(e);
  };

  const handlePostChange = (e) => {
    const currentTime = new Date().toISOString();
    if (selectedProfile === userLoggedData.usuario) setPostMode("public");
    else setPostMode("anon");
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value,
      userSent: userId,
      time: currentTime,
      mode: postMode,
      userMentioned: selectedId,
      postId: nextPostId,
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    // Crie um novo documento na coleção "timeline" com os dados do novo post
    setNewPost({
      ...newPost,
      postId: nextPostId,
    });
    try {
      const docRef = await addDoc(collection(db, "timeline"), newPost);
      console.log("Post adicionado com sucesso! ID do documento: ", docRef.id);
      // Limpe o estado do novo post após a submissão bem-sucedida
      setNewPost({
        deslikes: 0,
        likes: 0,
        mode: "public",
        text: "",
        time: "",
        userMentioned: "",
        userSent: userId,
      });
      setNextPostId(nextPostId + 1);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar o post: ", error);
    } 
  };

  // Function to handle search input change
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

  const handleUserSelection = (id, usuario) => {
    setSelectedUser(usuario);
    setSelectedId(id);
    setIsUserListVisible(false); // Feche a lista de usuários após a seleção
  };

  const clearSelectedUser = () => {
    setSelectedUser(""); // Define o usuário selecionado como vazio
    setSearchTerm(""); // Redefine o termo de pesquisa como vazio
    setIsUserListVisible(false); // Abre a lista de usuários
  };

  function ProfileImage() {
    // Determine qual perfil está selecionado e use o URL da imagem correspondente
    const profileImageUrl =
      selectedProfile === userLoggedData.usuario
        ? userLoggedData.imageUrl
        : profile.photoURL;

    return <img src={profileImageUrl} alt="Perfil" />;
  }

  function MudarClasse() {
    const classe = selectedProfile === userLoggedData.pseudonimo ? "anon" : "";

    return `tl-addPost ${classe}`;
  }

  
  // const handleCursoChange = async (e) => {
  //     const curso = e.target.value;
  //     setSelectedCurso(curso);
  //     carregaTml();
  // };

  // const handleInstituicaoChange = async (e) => {      
  //     const instituicao = e.target.value;
  //     setSelectedInstituicao(instituicao);
  //     console.log(instituicao);
  //     carregaTml();
  // };
  


  return (
    <>
    {/* <div className="tl-filters">
        <select
          className="tl-filter-select"
          onChange={handleCursoChange}
          value={selectedCurso}
        >
          <option value="">Filtrar por Curso</option>
          <option value="Informática">Informática</option>
          <option value="Eletrônica">Eletrônica</option>
          <option value="Meio Ambiente">Meio Ambiente</option>
          {/* Adicione outras opções de cursos aqui */}
        {/* </select>

        <select
          className="tl-filter-select"
          onChange={handleInstituicaoChange}
          value={selectedInstituicao}
        >
          <option value="">Filtrar por Instituição</option>
          <option value="CEFET-MG">CEFET-MG</option>
          <option value="UFMG">UFMG</option>
          {/* Adicione outras opções de instituições aqui */}
        {/* </select>
        <button onClick={() => carregaTml()}>Aplicar Filtro</button>
      </div> */}
      <div className="tl-screen">
        {isVisible && (
          <div className={MudarClasse()}>
            <div className="tl-addPost-header">
              <div className="tl-addPost-close" onClick={toggleVisibility}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </div>
              <div className="tl-addPost-mode">
                <div className="tl-addPost-foto">
                  <ProfileImage selectedProfile={selectedProfile} />
                </div>
                <select
                  className="tl-addPost-modeSelect"
                  name="postMode"
                  onChange={(e) => handleProfileChange(e.target.value)}
                >
                  <option
                    className="tl-addPost-modeSelect-option"
                    value={userLoggedData.usuario}
                  >
                    {userLoggedData.usuario}
                  </option>
                  <option
                    className="tl-addPost-modeSelect-option"
                    value={userLoggedData.pseudonimo}
                  >
                    {userLoggedData.pseudonimo}
                  </option>
                </select>
                <FontAwesomeIcon
                  className="tl-addPost-arrow"
                  icon={faArrowRight}
                />
                <div className="tl-addPost-list-input">
                  <FontAwesomeIcon
                    className="tl-addPost-clear-icon"
                    icon={faTimes}
                    onClick={clearSelectedUser}
                  />
                  {selectedUser ? (
                    <span className="tl-addPost-mark-input">
                      {selectedUser}
                    </span>
                  ) : (
                    <input
                      className="tl-addPost-mark-input"
                      type="search"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                    />
                  )}
                  {selectedUser && (
                    <FontAwesomeIcon
                      className="tl-addPost-clear-icon"
                      icon={faTimes}
                      onClick={clearSelectedUser}
                    />
                  )}
                  {isUserListVisible && ( // Verifica se a lista de usuários deve ser exibida
                    <div className="tl-addPost-list-container">
                      <TransitionGroup component="ul">
                        {searchResults.map((user) => (
                          <CSSTransition
                            nodeRef={nodeRef}
                            timeout={500}
                            classNames="my-node"
                            key={user.id + "1"}
                          >
                            <li
                              className="tl-addPost-list-item"
                              key={user.id}
                              ref={nodeRef}
                              onClick={() =>
                                handleUserSelection(user.id, user.usuario)
                              }
                            >
                              <img
                                className="tl-addPost-list-profilePic"
                                src={user.imageUrl}
                              ></img>
                              <div className="tl-addPost-list-dadosPessoais">
                                <p className="tl-addPost-list-nome bold">
                                  {user.nome}
                                </p>
                                <p className="tl-addPost-list-user light">
                                  @{user.usuario}
                                </p>
                              </div>
                            </li>
                          </CSSTransition>
                        ))}
                      </TransitionGroup>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="tl-addpost-body">
              <form onSubmit={handleSubmitPost}>
                <div className="tl-textInput">
                  <textarea
                    className="tl-textInput-input"
                    placeholder="O que você deseja susurrar alto hoje?"
                    name="text"
                    value={newPost.text}
                    onChange={handlePostChange}
                  ></textarea>
                </div>
                <div className="tl-confirmPost">
                  <button type="submit">
                    <FontAwesomeIcon icon={faPaperPlane} /> Wispar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="tl-container">
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
              <h1>Timeline</h1>
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
              {loadedPosts.map(({ post, userSentData, userMentionedData }) => (
                
                <PostDisplay
                  key={post.id}
                  post={post}
                  userSentData={userSentData}
                  userId = {userId}
                  userMentionedData={userMentionedData}
                  userLoggedData={userLoggedData}
                />
              ))}
            </div>
            {isFetching && <p>Carregando mais posts...</p>}
          </div>
        </div>
        <div className="tl-addpost" onClick={toggleVisibility}>
          <img
            src="https://cdn.discordapp.com/attachments/871728576972615680/1142352433352294482/asa.png"
            alt=""
          />
        </div>
        <div className="tl-footer">
          <div className="footerDm">
            <Link className="botaoAcessar" to="/timeline">
              <div>
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
            <Link className="botaoAcessar" to="/dm">
              <div>
                <img id="dm" src={dmIcon}></img>
              </div>
            </Link>
          </div>
        </div>
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
      <VLibras forceOnload={true} />
    </>
  );
}
