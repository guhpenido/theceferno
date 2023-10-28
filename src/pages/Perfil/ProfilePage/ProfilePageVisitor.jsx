import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, collection, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect, useRef } from 'react';
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
    Botao,
    Following,
    Followers
} from "./styles";

import Feed from "../Feed";
import FeedVisitor from "../Feed/feedVisitor";

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

const ProfilePageVisitor = ({ objetoUsuario }) => {

    // console.log(objetoUsuario); 
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bio, setBio] = useState('');
    const [newAvatar, setNewAvatar] = useState(null);
    const [newBanner, setNewBanner] = useState(null);
    const [userInstituicao, setUserInstituicao] = useState('');
    const [userCurso, setUserCurso] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userSeguidores, setUserSeguidores] = useState(null);
    const [userSeguindo, setUserSeguindo] = useState(null);
    const buttonFollowRef = useRef(null);
    const followingRef = useRef(null);
    const followersRef = useRef(null);

    const [userLoggedData, setUserLoggedData] = useState(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState(null);
    const [posts, setPosts] = useState([]); // Adjust the type accordingly

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if(userDoc.exists()){
                    setCurrentUser(userDoc.data());

                    if(userDoc.data().seguindo.includes(objetoUsuario.id)){
                        buttonFollowRef.current.innerHTML = "Deixar de Seguir"
                        buttonFollowRef.current.setAttribute('data-follow', 'true');
                    } else {
                        buttonFollowRef.current.innerHTML = "Seguir";
                        buttonFollowRef.current.setAttribute('data-follow', 'false');
                    }
                } 
                setUserId(objetoUsuario.id);
                fetchUserDataAndSetState(objetoUsuario.id);
                searchUserFields(objetoUsuario.id);
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

    const fetchUserDataAndSetState = async (userId) => {
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
                        setNewAvatar(objetoUsuario.imageUrl);
                    } else {
                        setNewAvatar(objetoUsuario.imageUrl);
                    }

                    setNickname(objetoUsuario.usuario);
                    setUserName(objetoUsuario.nome);
                    setUserCurso(objetoUsuario.curso);
                    setUserInstituicao(objetoUsuario.instituicao);
                    setUserSeguidores(userData.seguidores?userData.seguidores.length:"0");
                    setUserSeguindo(userData.seguindo?userData.seguindo.length:"0");

                } else {
                    console.log('User not found');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {

                const userDocSelRef = doc(db, 'users', objetoUsuario.id);
                const userSelDoc = await getDoc(userDocSelRef);
                if (userSelDoc.exists()) {
                    setBio(userSelDoc.data().bio || '');
                }
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function handleFollow() {
        const userRef = doc(db, 'users', currentUser.id);
        const userProfileRef = doc(db, 'users', objetoUsuario.id);

        // Deixa de seguir
        if(currentUser.seguindo.includes(objetoUsuario.id)){
            await updateDoc(userRef, {
                seguindo: arrayRemove(objetoUsuario.id)
            });
            await updateDoc(userProfileRef, {
                seguidores: arrayRemove(currentUser.id)
            });
            setUserSeguidores(userSeguidores - 1)
            buttonFollowRef.current.innerHTML = "Seguir";
            buttonFollowRef.current.setAttribute('data-follow', 'false');
        // Começa a Seguir
        } else {
            await updateDoc(userRef, {
                seguindo: arrayUnion(objetoUsuario.id)
            });
            await updateDoc(userProfileRef, {
                seguidores: arrayUnion(currentUser.id)
            });
            setUserSeguidores(userSeguidores + 1)
            buttonFollowRef.current.innerHTML = "Deixar de Seguir";
            buttonFollowRef.current.setAttribute('data-follow', 'true');
        }   

        // Atualiza o Documento de 'CurrentUser'
        const userDocRef = doc(db, 'users', currentUser.id);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists()){
            setCurrentUser(userDoc.data());
        }
    }

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
                <h1>{userName}</h1>
                <h2>@{nickname}</h2>
                <Tags>
                    <Institution>
                        <p style={{ color: 'white', textAlign: 'center' }}>{userInstituicao}</p>
                    </Institution>
                    <Course>
                        <p style={{ color: 'white', textAlign: 'center' }}>{capitalizeFirstLetter(userCurso)}</p>
                    </Course>
                    <Followers>
                        <p><span ref={followersRef}>{userSeguidores}</span>Seguidores</p>
                    </Followers>
                    <Following>
                        <p><span ref={followingRef}>{userSeguindo}</span>Seguindo</p>
                    </Following>
                </Tags>
                <Botao onClick={handleFollow} ref={buttonFollowRef}>Seguir</Botao>
            </ProfileData>
            <FeedVisitor objetoUsuario={objetoUsuario}/>
        </Container>
    );
};

export default ProfilePageVisitor;



