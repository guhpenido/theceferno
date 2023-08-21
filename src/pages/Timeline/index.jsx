import React, { useState, useEffect } from "react";
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
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//import "./stylesTimeline.css";

export function Timeline() {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const db = getFirestore(app);
  const [posts, setPosts] = useState([]);
  const auth = getAuth(app);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null); // Estado para armazenar o perfil selecionado
  const [addPostClass, setAddPostClass] = useState("");

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
    const unsubscribe = getPostsFromFirestore();
    return () => unsubscribe();
  }, []);

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

  const fetchUserDataAndSetState = async (userId) => {
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

  const getPostsFromFirestore = () => {
    return onSnapshot(collection(db, "timeline"), (snapshot) => {
      const postsData = [];
      snapshot.forEach((doc) => {
        const postData = {
          id: doc.id,
          ...doc.data(),
        };
        postsData.push(postData);
      });
      setPosts(postsData);
    });
  };

  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("User not found");
      return null;
    }
  };

  const toggleVisibility = () => {
    setSelectedProfile(userLoggedData.usuario);
    setIsVisible(!isVisible);
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

  return (
    <>
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
              </div>
            </div>
            <div className="tl-addpost-body">
              <div className="tl-textInput">
                <textarea
                  className="tl-textInput-input"
                  placeholder="O que você deseja susurrar alto hoje?"
                ></textarea>
              </div>
              <div className="tl-confirmPost">
                <button>
                  <FontAwesomeIcon icon={faPaperPlane} /> Wispar
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="tl-container">
          <div className="tl-header">
            <div className="tl-header1">
              <div className="tl-foto">
                <ProfileImage selectedProfile={selectedProfile} />
              </div>
              <div className="tl-logo">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png"
                  alt=""
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
                      alt=""
                    />
                  </div>
                  <div className="tl-ps-nomes">
                    <p className="tl-ps-nome">
                      Stella <span className="tl-ps-user">@tellaswift </span>
                      <span className="tl-ps-tempo">• 42s</span>
                      <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                      <img
                        src="https://cdn.discordapp.com/attachments/871728576972615680/1142348920949833829/image.png"
                        alt=""
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
                      alt=""
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
              alt=""
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
