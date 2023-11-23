import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../../services/firebaseConfig";

import PostDisplay from "./post";
import Header from "./Header";
import MenuLateral from "../MenuLateral/MenuLateral";
import { Acessibilidade } from "../Acessibilidade/index";
import { Link } from "react-router-dom";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import perfilIcon from "../../assets/perfil-icon.svg";
import faBookmark  from "../../assets/saved.svg";
import searchIcon from "../../assets/search.svg";

// import "./stylesTrending.css"; // Estilo personalizado para a seção "Trending"

function Trending() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const db = getFirestore(app);

  const [userSentData, setUserSentData] = useState(null);
  const [userMentionedData, setUserMentionedData] = useState(null);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      const postsCollectionRef = collection(db, "timeline");
      const trendingPostsQuery = query(
        postsCollectionRef,
        orderBy("deslikes", "desc") // Ordene por deslikes em ordem decrescente
      );

      const trendingPostsData = await getPostsFromFirestore(trendingPostsQuery);
      if (trendingPostsData.length == 0) {
        console.log("Você já chegou ao fim");
      } else {
        const postsWithUserData = [];

        for (const post of trendingPostsData) {
          const userSentData = await fetchUserData(post.userSent);
          let userMentionedData = null;

          if (post.userMentioned !== "") {
            userMentionedData = await fetchUserData(post.userMentioned);
          }

          postsWithUserData.push({
            post,
            userSentData,
            userMentionedData,
          });
        }

        setTrendingPosts(postsWithUserData);
      }
    } catch (error) {
      console.error("Erro ao obter os posts em tendência:", error);
    }
  };

  const getPostsFromFirestore = async (query) => {
    const querySnapshot = await getDocs(query);
    const postsData = [];

    querySnapshot.forEach((doc) => {
      const postData = {
        id: doc.data().postId,
        ...doc.data(),
      };
      postsData.push(postData);
    });
    return postsData;
  };

  // console.log("trendingPosts:", trendingPosts);

  const auth = getAuth(app);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userLoggedData, setUserLoggedData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUserId(user.uid);
        console.log(user);
        fetchUserDataAndSetState(user.uid);
        // carregaTml();
        // fetchTrendingPosts();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchUserDataAndSetState = async (userId) => {
    console.log(userId);
    try {
      const userLoggedDataResponse = await fetchUserData(userId);
      setUserLoggedData(userLoggedDataResponse);
      console.log(userLoggedData);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      //setIsLoading(false); // Even if there's an error, stop loading
    }
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

  const toggleMobileLateral = () => {
    setIsMobileLateralVisible(!isMobileLateralVisible);
    console.log("clicou");
    console.log(isMobileLateralVisible);
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
          <div className="tl-header">
            <Link className="tl-header-div1" to="/timeline">
              <h1>Para Você</h1>
            </Link>

            <div className="tl-header-div2">
              <h1>
                <Link to="/trending"> Trending</Link>
              </h1>
              <div className="header-active-in"></div>
            </div>
            <div className="tl-header-filter">
              <div className="tl-header-filter-in">
                <img
                  src="https://cdn.discordapp.com/attachments/812025565615882270/1168379201146077205/recurring-appointment-xxl.png?ex=65518cec&is=653f17ec&hm=5bb554d4e8f281a9ca4e2e554ab14d50d1c55cc82413fef5a1372af880dd7a07&"
                  alt=""
                />
              </div>
            </div>
          </div>
          <MenuLateral />
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
          <div className="tl-main">
            <div className="tl-box">
              {trendingPosts.map(
                ({ post, userSentData, userMentionedData }) => (
                  <PostDisplay
                    key={post.id}
                    post={post}
                    userSentData={userSentData}
                    userMentionedData={userMentionedData}
                    userId={userId}
                    userLoggedData={userLoggedData}
                  />
                )
              )}
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
              <Link to="https://linktr.ee/theceferno" target="_blank">
                <button>Doar</button>
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
    </>
  );
}

export default Trending;
