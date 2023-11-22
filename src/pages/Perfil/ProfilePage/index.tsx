import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect, ChangeEvent } from 'react';
import ModalReact from 'react-modal';
import './estilo.css';
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
import { app } from "../../../services/firebaseConfig";


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
  const db = getFirestore(app);
  const storage = getStorage(app);

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
          const newAvatarValue = userData['imageUrl'] || ''; // Campo avatar
          const nicknameValue = userData['usuario'] || '';
          const userNameValue = userData['nome'] || '';

          // Verifique e defina o valor padrão para bannerUrl e newAvatarValue
          if (!bannerUrlValue) {
            setNewBanner(userData['banner'] || '');
            // console.log(userData['bannerUrl']); 
          } else {
            setNewBanner(bannerUrlValue);
          }

          if (!newAvatarValue) {
            setNewAvatar(userData['imageUrl'] || '');
            // console.log(userData['banner']);
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const avatarURL = URL.createObjectURL(file);
        setNewAvatar(avatarURL);

        // Fazer upload da imagem para o Firebase Storage
        const storageRef = ref(storage, `avatar/${currentUser.uid}`);
        await uploadBytes(storageRef, file);

        // Obter o URL da imagem do Firebase Storage
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);

        // Atualizar o URL do avatar no Firestore (substitua essa parte pelo seu código de atualização Firestore)
        const userDocRef = doc(db, 'users', currentUser.uid);
        console.log(currentUser.uid);
        await updateDoc(userDocRef, { imageUrl: downloadURL });
      }
    }
  };

  const selectImage = () => {
    const fileInput = document.getElementById('fileInputAvatar') as HTMLInputElement;
    fileInput.click();
  };

  const selectBanner = () => {
    const fileInput = document.getElementById('fileInputBanner') as HTMLInputElement;
    fileInput.click();
  };

  //mudar o banner
  const handleBannerChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        // Fazer upload da imagem para o Firebase Storage
        const storageRef = ref(storage, `banners/${currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);

        // Obter o URL da imagem do Firebase Storage
        const downloadURL = await getDownloadURL(storageRef);

        // Atualizar o URL do banner no estado
        setNewBanner(downloadURL);

        // Atualizar o URL do banner no Firestore (opcional)
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { banner: downloadURL });
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

      if (newBanner) {
        updatedData.banner = newBanner;
      }

      if (bio) {
        updatedData.bio = bio;
      }

      if(userName) {
        updatedData.username = userName; 
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
    borderRadius: '50%',
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
              backgroundColor: '#111111',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              width: '90%', // Responsivo: ocupar 90% da largura disponível
              maxWidth: '800px', // Largura máxima
              maxHeight: '80%', // Altura máxima
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',

              // Estilos para responsividade em telas menores (até 768px)
              '@media (max-width: 768px)': {
                width: '95%', // Ocupar 95% da largura disponível
                maxHeight: '90%', // Altura máxima menor
                padding: '15px', // Espaçamento interno aumentado para telas menores
              },
            },
          }}>

          <div id="pf-div-modal" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="modalContainer">
              <div>
                <div>
                  <div
                    className="bannerDiv"
                    onClick={selectBanner}
                    style={{
                      flexShrink: '0',
                      width: '100%',
                      height: 'min(33vw, 199px)',
                      padding: '60px 0 100px',
                      background: '#4763E4',
                      position: 'relative',
                      backgroundImage: `url(${newBanner || ''})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      top: '0',
                      left: '0',
                      borderRadius: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    {!newBanner && 'Selecione uma imagem de capa'}
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInputBanner"
                      style={{ display: 'none' }}
                      onChange={handleBannerChange}
                    />
                  </div>

                  <div className="container-img">
                    <div className="imageDiv" onClick={selectImage}>
                      <div
                        style={{
                          width: 'min(135px, max(45px, 22vw))',
                          height: 'min(135px, max(45px, 22vw))',
                          border: '3px solid #111111',
                          background: '#7a7a7a',
                          backgroundSize: 'cover',
                          borderRadius: '50%',
                          left: '20px',
                          position: 'absolute',
                          backgroundImage: `url(${newAvatar || ''})`,
                          zIndex: '1',
                          top: '115px',
                        }}
                      >
                        {!newAvatar && 'Selecione uma imagem de perfil'}
                        <input
                          placeholder="Escolha uma foto de perfil"
                          type="file"
                          accept="image/*"
                          id="fileInputAvatar"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <textarea
              value={bio}
              onChange={handleBioChange}
              style={{
                marginBottom: '10px',
                resize: 'none',
                minHeight: '100px',
                marginTop: '40px',
                borderRadius: '15px',
                backgroundColor: 'transparent',
                color: 'white',
                width: '100%',
                padding: '10px',
              }}
            />
            <textarea
              value={userName}
              onChange={handleNameChange}
              style={{
                marginBottom: '10px',
                resize: 'none',
                minHeight: '20px',
                marginTop: '10px',
                borderRadius: '15px',
                backgroundColor: 'transparent',
                color: 'white',
                width: '100%',
                padding: '10px',
              }}
            />
            <button
              onClick={saveChanges}
              className="pf-custom-button"
            >
              Salvar Alterações
            </button>

          </div>
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


