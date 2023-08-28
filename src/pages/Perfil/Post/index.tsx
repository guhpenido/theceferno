import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Body,
  Avatar,
  Content,
  Header,
  Posts,
  Icons,
  Status,
  CommentIcon,
  RepublicationIcon,
  LikeIcon,
} from "./styles";
import { useNavigate } from "react-router-dom";
import PerfilUsuario from "../Feed/perfilUsuario";

//configuração do firebase
const firebaseConfig = {
  apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
  authDomain: "auth-ceferno.firebaseapp.com",
  projectId: "auth-ceferno",
  storageBucket: "auth-ceferno.appspot.com",
  messagingSenderId: "388861107940",
  appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

interface PostProps {
  avatarUrl: string | null;
}

const Post: React.FC<PostProps> = ({ avatarUrl }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  //pegar nome e o @
  const [userName, setUserName] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
  const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [posts, setPosts] = useState<any[]>([]); // Adjust the type accordingly

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserDataAndSetState(user.uid);
        searchUserFields(user.uid);
      } else {
        navigate('/login');
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

  const fetchUserDataAndSetState = async (userId: string) => {
    try {
      if (userId) {
        const userLoggedDataResponse = await fetchUserData(userId);
        if (userLoggedDataResponse) {
          setUserLoggedData(userLoggedDataResponse);
          setSelectedProfile(userLoggedDataResponse.usuario);
          setIsLoadingUser(false); // Data has been fetched, no longer loading
        } else {
          alert("User data not found!"); // Show an alert when userLoggedDataResponse is null
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };


  const getPostsFromFirestore = () => {
    return onSnapshot(collection(db, 'timeline'), (snapshot) => {
      const postsData: any[] = [];
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

  const fetchUserData = async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('User not found');
      return null;
    }
  };

  // Função para pesquisar os campos "curso" e "instituição" com base no ID do usuário logado
  const searchUserFields = async (userId) => {
    try {
      if (userId) {
        // console.log('acessou');
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // const bannerUrlValue = userData['avatar'] || ''; 
          // const newAvatarValue = userData['imageUrl'] || ''; 
          const nicknameValue = userData['usuario'] || '';
          const userNameValue = userData['nome'] || '';
          setNickname(nicknameValue);
          setUserName(userNameValue);
          // console.log(userNameValue);
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  return (
    <PerfilUsuario/>
    // <Container>
    //   <Body>
    //     <Avatar as="img" src={avatarUrl || ''} alt="Novo Avatar" />
    //     <Content>
    //       <Header>
    //         <strong>{userName}</strong>
    //         <span>@{nickname}</span>
    //       </Header>
    //       <Posts>
    //       </Posts>
    //       <Icons>
    //         <Status>
    //           <CommentIcon />
    //           20
    //         </Status>
    //         <Status>
    //           <RepublicationIcon />5
    //         </Status>
    //         <Status>
    //           <LikeIcon />
    //           300
    //         </Status>
    //       </Icons>
    //     </Content>
    //   </Body>
    // </Container>
  );
};

export default Post;