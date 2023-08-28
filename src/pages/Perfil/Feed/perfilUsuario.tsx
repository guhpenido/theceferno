import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, orderBy, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ModalReact from 'react-modal';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from 'firebase/firestore';
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
} from "../Post/styles";

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

// Definindo uma interface para os itens da timeline
type TimelineItem = {
    postId: string;
    userMentioned: string;
    text: string;
    time: string;
    replysCount: number;
    likes: number;
    dislikes: number;
};


const PerfilUsuario: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState<any | null>(null);

    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]); // Corrigido o tipo

    const [userId, setUserId] = useState<string | null>(null);

    const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [posts, setPosts] = useState<any[]>([]); // Adjust the type accordingly
    const [userName, setUserName] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [noItemsFound, setNoItemsFound] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchUserDataAndSetState(user.uid);
                fetchTimelineItemsForUser(user.uid); 
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

    //pegar os whispers (mensagens que aquela pessoa foi direcionada)
    const fetchTimelineItemsForUser = async (userId: string): Promise<TimelineItem[]> => {
        try {
            const q = query(collection(db, 'timeline'), where('userMentioned', '==', userId), orderBy('time', 'desc'));
            const querySnapshot = await getDocs(q);

            const timelineItems: TimelineItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                timelineItems.push({
                    postId: doc.id,
                    userMentioned: data.userMentioned,
                    text: data.text,
                    time: data.time,
                    replysCount: data.replysCount,
                    likes: data.likes,
                    dislikes: data.dislikes,
                });
            });

            return timelineItems;
        } catch (error) {
            console.error('Error fetching timeline items:', error.message);
            return [];
        }
    };

    return (
        <div>
            {noItemsFound ? (
                <div>Nada Encontrado</div>
            ) : (
                timelineItems.map((item) => (
                    <Container key={item.postId}>
                        {<Body>
                            <Avatar as="img" src={newAvatar || ''} alt="Novo Avatar" />
                            <Content>
                                <Header>
                                    <strong>{userName}</strong>
                                    <span>@{nickname}</span>
                                </Header>
                                <Posts>
                                    <p>{item.text}</p> {/* Adjust this according to your needs */}
                                </Posts>
                                <Icons>
                                    <Status>
                                        <CommentIcon />
                                        {item.replysCount}
                                    </Status>
                                    <Status>
                                        <RepublicationIcon />
                                        {item.likes}
                                    </Status>
                                    <Status>
                                        <LikeIcon />
                                        {item.dislikes}
                                    </Status>
                                </Icons>
                            </Content>
                        </Body>}
                    </Container>
                ))
            )}
        </div>
    );
};

export default PerfilUsuario;

