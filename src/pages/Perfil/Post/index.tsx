import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuário atual:', user);
        setCurrentUser(user);
      } else {
        console.log('Nenhum usuário autenticado.');
      }
    });
  }, []);

  return (
    <Container>
      <Body>
        <Avatar as="img" src={avatarUrl || ''} alt="Novo Avatar" />
        <Content>
          <Header>
            <strong>{currentUser ? currentUser.displayName : 'Nome do Usuário'}</strong>
            <span>@{currentUser ? currentUser.username : 'nome_do_usuario'}</span>
          </Header>

          

          <Posts>
            Lorem Ipsum is simply dummy text of the printing and typesetting...
          </Posts>
          <Icons>
            <Status>
              <CommentIcon />
              20
            </Status>
            <Status>
              <RepublicationIcon />5
            </Status>
            <Status>
              <LikeIcon />
              300
            </Status>
          </Icons>
        </Content>
      </Body>
    </Container>
  );
};

export default Post;