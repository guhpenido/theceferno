import Button from '../Button';
// import { Postagem } from '../Whisper/styles';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import ModalReact from 'react-modal';
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";

import { Container, TopSide, Logo, MenuButton, SearchIcon, IconWhisper, IconBell, EmailIcon, IconConfig, BotSide, Avatar, ProfileData } from './styles';

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

const MenuBar: React.FC = () => {

    const [postagemVisible, setPostagemVisible] = useState(false);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);

    const navigate = useNavigate();
    const auth = getAuth(app);

    const [isVisible, setIsVisible] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [posts, setPosts] = useState<any[]>([]); // Adjust the type accordingly

    //função para abrir div
    const OpenWhisperPage = () => {
        setPostagemVisible(true);

        //PEGAR ELEMENTO 
        const postagemElement = document.getElementById('post');

        //ALTERAR ESTILO
        if (postagemElement) {
            postagemElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

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
                    const newAvatarValue = userData['avatar'] || '';

                    if (!newAvatarValue) {
                        setNewAvatar(userData['imageUrl'] || '');
                    }
                    else {
                        setNewAvatar(newAvatarValue);
                    }

                } else {
                    console.log('User not found');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    return (
        <Container>
            <TopSide>
                <Link to="/timeline">
                    {/* <Logo as="img" src={newAvatar} alt="Novo Avatar" style={{ backgroundSize: 'cover', backgroundPosition: 'center' }} /> */}
                </Link>
                <MenuButton>
                    <IconWhisper />
                    <span>Sussurro</span>
                </MenuButton>
                <MenuButton>
                    <IconBell />
                    <span>Notificações</span>
                </MenuButton>
                <Link to="/dm" style={{ textDecoration: 'none' }}>
                    <MenuButton>
                        <EmailIcon />
                        <span>Mensagens</span>
                    </MenuButton>
                </Link>
                <MenuButton>
                    <IconConfig />
                    <span>Configurações</span>
                </MenuButton>
                <Button >
                    <span>Postar</span>
                </Button>
            </TopSide>
        </Container>
    );
}

export default MenuBar;