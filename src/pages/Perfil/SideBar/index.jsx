import React, { useEffect, useState, useRef } from "react";
import { Container, SearchWrapper, SearchInput, SearchIcon } from "./styles";
import { initializeApp } from "firebase/app";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  doc,
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
  or,
  orderBy,
} from "firebase/firestore";
import ViewUsers from "./viewUsers";

const firebaseConfig = {
  apiKey: "AIzaSyAMmah5RbUcw_J9TUsxSu5PmWqi1ZU4MRk",
  authDomain: "auth-cefernotcc.firebaseapp.com",
  projectId: "auth-cefernotcc",
  storageBucket: "auth-cefernotcc.appspot.com",
  messagingSenderId: "1060989440087",
  appId: "1:1060989440087:web:439b25a3b18602ec53d312",
  measurementId: "G-45ESHWMMPR"
};

import './'

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const SideBar = ({ objetoUsuario }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const nodeRef = useRef(null);
  const imageref = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState([]);

  useEffect(() => {
    // console.log("cheguei");
    if (isFetching) {
      carregaTml().then(() => {
        setIsFetching(false);
      });
    }
  }, [isFetching]);

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value;
    // console.log("1");
    setSearchTerm(searchValue);
    if (searchValue > "") {
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
        // console.log(results2);
        setSearchResults((prevResults) => prevResults.concat(results2));
      });
    } else {
      setSearchResults([]);
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

  const carregaTml = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    const postsCollectionRef = collection(db, "timeline");
    const lastLoadedPost =
      loadedPosts.length > 0 ? loadedPosts[loadedPosts.length - 1].post : null;
    const lastLoadedPostId = lastLoadedPost ? lastLoadedPost.id : "";
    let postsQuery;

    if (lastLoadedPostId) {
      // console.log("Latest post:" + lastLoadedPostId);
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
      // console.log({ postsData });
      if (postsData.length === 0) {
        // console.log("Você já chegou ao fim");
      } else {
        const postsWithUserData = [];

        // Aqui, substitua todo o estado de loadedPosts com os novos posts carregados
        setLoadedPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
        // console.log("Novos posts carregados!");
      }
    } catch (error) {
      console.error("Erro ao obter os posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Container>
      <SearchWrapper style={{ display: "block", marginTop: "1em" }}>
        <div style={{ flexDirection: 'column', padding: '2%' }}>
          <input
            style={{
              display: "block", marginBottom: "2em", padding: '0.7rem 2rem 0.7rem 2rem',
              borderRadius: '15px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0)',
              border: '1px solid #4763E4',
              color: '#ffffff',
              outlineColor: '#4763E4'
            }}
            type="search"
            placeholder="Procure no CEFERNO"
            value={searchTerm}
            onChange={handleSearchInputChange}
          ></input>
          <TransitionGroup component="ul" className="ulDm" style={{
            padding: '0',
            margin: '0!important',
            /*width: '90%',*/
            backgroundColor: '#3d3c3c',
            borderRadius: '0 0 10px 10px'
          }}>
            <div
              style={{
                marginBottom: '1em',
                marginTop: '1em',
                padding: '5px',
                borderRadius: '10px',
              }}
            >
              <Link
                to="/SeachPage"
                state={{ searchTerm: searchTerm, modo: "public" }}
                style={{
                  color: "white",
                  display: "block",
                  width: "100%",
                  height: "100%",
                  borderRadius: "15px",
                }}
              >
                <div>Pesquisar por: {searchTerm}</div>
              </Link>
            </div>
            {searchResults.map((user) => (
              <CSSTransition
                nodeRef={nodeRef}
                timeout={500}
                classNames="my-node"
                key={user.id ? user.id : user.uid + "1"}
              >
                <Link
                  to="/VisitorPage"
                  state={{ objetoUsuario: user, modo: "public" }}
                  style={{ color: "white" }}
                >
                  <li
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px'
                    }}
                    key={user.id ? user.id : user.uid}
                    noderef={nodeRef}
                  >
                    <img style={{
                      width: '50px',
                      borderRadius: '50%'
                    }} src={user.imageUrl}></img>
                    <div style={{
                      width: '100%',
                      display: 'flex',
                      gap: '5%'
                    }}>
                      <p style={{paddingLeft: '5%', fontWeight: 'bolder'}}>{user.nome}</p>
                      <p style={{paddingLeft: '5%', fontWeight: 'lighter'}}>@{user.usuario}</p>
                    </div>
                  </li>
                </Link>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </SearchWrapper>
    </Container>
  );
};

export default SideBar;
