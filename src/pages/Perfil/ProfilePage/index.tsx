import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import ModalReact from 'react-modal';
import {useNavigate} from "react-router-dom";
import {
  Container,
  Banner,
  Avatar,
  ProfileData,
  EditButton,
  Tags,
  Institution,
  Course,
} from "./styles";


import Feed from "../Feed";
import { auth } from "firebase-admin";

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

ModalReact.setAppElement('#root');

const ProfilePage: React.FC = () => {

  const navigate = useNavigate();
  const auth = getAuth(app);
  
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [userInstituicao, setUserInstituicao] = useState('');
  const [userCurso, setUserCurso] = useState('');
  

  //pegar o id do usuario de outra página 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        fetchUserDataAndSetState(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  //pegar curso e instituição
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, 'users', currentUser);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserCurso(data.userCurso);
          setUserInstituicao(data.userInstituicao);
        } else {
          console.log('Document not found');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchDocument();
  }, [currentUser]);



  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBio(event.target.value);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const avatarURL = URL.createObjectURL(file);
        setNewAvatar(avatarURL);

        // Fazer upload da imagem para o Firebase Storage
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, file);

        // Obter o URL da imagem do Firebase Storage
        const downloadURL = await getDownloadURL(storageRef);

        // Atualizar o URL do avatar no Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { avatar: downloadURL });
      }
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setBannerUrl(imageUrl);
      }
    }
  };

  const saveChanges = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      const updatedData: any = {};

      if (newAvatar) {
        updatedData.avatar = newAvatar;
      }

      if (bannerUrl) {
        updatedData.banner = bannerUrl;
      }

      if (bio) {
        updatedData.bio = bio;
      }

      await updateDoc(userDocRef, updatedData);

      closeModal();
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setBio(userDoc.data().bio || '');
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, []);



  return (
    <Container>
      <Banner style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none' }}>
        {newAvatar ? (
          <Avatar as="img" src={newAvatar} alt="Novo Avatar" />
        ) : (
          <Avatar />
        )}
      </Banner>
      <ProfileData>
        <p>
          {bio || 'Nenhuma bio disponível'} {/* Mostra a bio ou uma mensagem se não houver bio */}
        </p>
        <EditButton outlined={true} onClick={openModal}>Editar Perfil</EditButton>
        <ModalReact className="Modal" isOpen={isModalOpen} onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
              backgroundColor: '#4763E4',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              width: '90%', // Responsivo: ocupar 90% da largura disponível
              maxWidth: '400px', // Largura máxima
              maxHeight: '80%', // Altura máxima
              display: 'flex',
              flexDirection: 'column',

              // Estilos para responsividade em telas menores (até 768px)
              '@media (max-width: 768px)': {
                width: '95%', // Ocupar 95% da largura disponível
                maxHeight: '90%', // Altura máxima menor
                padding: '15px', // Espaçamento interno aumentado para telas menores
              },
            },
          }}>
          <input
            placeholder="Escolha uma foto de perfil"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ marginBottom: '10px' }} // Espaçamento inferior
          />
          <input
            placeholder="Escolha uma foto de capa"
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            style={{ marginBottom: '10px' }} // Espaçamento inferior
          />
          <textarea
            placeholder="Escreva algo sobre você..."
            value={bio}
            onChange={handleBioChange}
            style={{ marginBottom: '10px', resize: 'none', minHeight: '100px' }} // Espaçamento inferior, evita redimensionamento vertical e altura mínima
          />
          <button
            onClick={saveChanges}
            style={{
              backgroundColor: '#fff',
              color: '#4763E4',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s, color 0.3s',
              fontWeight: 'bold',
            }}
          >
            Salvar Alterações
          </button>
        </ModalReact>
        <h1>{currentUser ? currentUser.displayName : 'Nome do Usuário'}</h1>
        <h2>@{currentUser ? currentUser.username : 'nome_do_usuario'}</h2>
        <Tags>
          <Institution>
            <p>{userInstituicao}</p>
          </Institution>
          <Course>
            <p>{userCurso}</p>
          </Course>
        </Tags>
      </ProfileData>
      <Feed avatarUrl={newAvatar} />
    </Container>
  );
};

export default ProfilePage;
function fetchUserDataAndSetState(uid: string) {
  throw new Error("Function not implemented.");
}

