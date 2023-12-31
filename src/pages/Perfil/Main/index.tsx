import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { Container, Header, BackIcon, ProfileInfo, BottomMenu, HomeIcon, SearchIcon, DmIcon, Whisper, Config } from './styles';
import ProfilePage from '../ProfilePage';
import { Link, Route } from "react-router-dom";
import { app } from "../../../services/firebaseConfig";




const Main: React.FC = () => {

  const [currentUser, setCurrentUser] = useState<any | null>(null); // Defina o tipo apropriado aqui
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('Usuário atual:', user);
        setCurrentUser(user);
      } else {
        console.log('Nenhum usuário autenticado.');
      }
    });
  }, []);

  const handleButtonClick = () => {
    // Redirecionar para "/timeline" quando o botão for clicado
    window.location.href = "/timeline";
  };

  return (
    <Container>
      <Header>
        <button onClick={handleButtonClick}>
          <BackIcon />
        </button>
        <ProfileInfo>
          <strong>{currentUser ? currentUser.displayName : 'Nome do Usuário'}</strong>
        </ProfileInfo>
      </Header>

      <ProfilePage />
    </Container>
  );
};

export default Main;
