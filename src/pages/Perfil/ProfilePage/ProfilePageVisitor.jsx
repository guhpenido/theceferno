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

    console.log(objetoUsuario); 
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

    const [userLoggedData, setUserLoggedData] = useState(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState(null);
    const [posts, setPosts] = useState([]); // Adjust the type accordingly

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
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
                setCurrentUser(objetoUsuario);

                const userDocRef = doc(db, 'users', objetoUsuario.id);
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
                </Tags>
            </ProfileData>
            <FeedVisitor objetoUsuario={objetoUsuario}/>
        </Container >
    );
};

export default ProfilePageVisitor;



