import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import ModalReact from 'react-modal';

import { useNavigate } from "react-router-dom";
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
  const [userName, setUserName] = useState('');
  const [nickname, setNickname] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [newBanner, setNewBanner] = useState<string | null>(null);
  const [userInstituicao, setUserInstituicao] = useState('');
  const [userCurso, setUserCurso] = useState('');
  const [isVisible, setIsVisible] = useState(false);
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
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const cursoValue = userData['curso'] || '';
          const instituicaoValue = userData['instituicao'] || '';
          const bannerUrlValue = userData['banner'] || ''; // Campo banner
          const newAvatarValue = userData['avatar'] || ''; // Campo avatar
          const nicknameValue = userData['usuario'] || '';
          const userNameValue = userData['userName'] || '';

          // Verifique e defina o valor padrão para bannerUrl e newAvatarValue
          if (!bannerUrlValue) {
            setNewBanner(userData['bannerUrl'] || '');
            // console.log(userData['bannerUrl']); 
          } else {
            setNewBanner(bannerUrlValue);
          }

          if (!newAvatarValue) {
            setNewAvatar(userData['imageUrl'] || '');
            console.log(userData['banner']);
          } else {
            setNewAvatar(newAvatarValue);
          }


          setNickname(nicknameValue);
          setUserName(userNameValue);
          setUserCurso(cursoValue);
          setUserInstituicao(instituicaoValue);
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };


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

  //mudar o banner
  const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        // Fazer upload da imagem para o Firebase Storage
        const storageRef = ref(storage, `banners/${currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);

        // Obter o URL da imagem do Firebase Storage
        const downloadURL = await getDownloadURL(storageRef);

        // Atualizar o URL do banner no Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { banner: downloadURL });
      }
    }
  };

  //mudar o nome
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };


  const saveChanges = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      const updatedData: any = {};

      if (newAvatar) {
        updatedData.avatar = newAvatar;
      }

      if (newBanner) {
        updatedData.banner = newBanner;
      }

      if (bio) {
        updatedData.bio = bio;
      }

      if (userName) {
        updatedData.nome = userName;
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

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const estiloInput = {
    display: 'none',
  };

  return (
    <Container>
      <Banner style={{ backgroundImage: `url(${newBanner})`, backgroundSize: 'cover', height: 'auto', width: '100%' }}>
        {newAvatar ? (
          <Avatar as="img" src={newAvatar} alt="Novo Avatar" style={{ backgroundSize: 'cover', backgroundPosition: 'center' }} />
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
            style={{ estiloInput }} // Espaçamento inferior
          />
          <input
            placeholder="Escolha uma foto de capa"
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            style={{ marginBottom: '10px' }} // Espaçamento inferior
          />
          <textarea
            value={bio}
            onChange={handleBioChange}
            style={{ marginBottom: '10px', resize: 'none', minHeight: '100px' }} // Espaçamento inferior, evita redimensionamento vertical e altura mínima
          />
          <textarea
            value={userName}
            onChange={handleNameChange}
            style={{ marginBottom: '10px', resize: 'none', minHeight: '100px' }}
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
        <h1>{userName}</h1>
        <h2>@{nickname}</h2>
        <Tags>
          <Institution>
            <p style={{ color: 'white', textAlign: 'center' }}>{userInstituicao}</p>
          </Institution>
          <Course>
            <p style={{ color: 'white', textAlign: 'center' }}>{capitalizeFirstLetter(userCurso)}</p>
          </Course>
        </Tags>
      </ProfileData>
      <Feed avatarUrl={newAvatar} />
    </Container >
  );
};

export default ProfilePage;



