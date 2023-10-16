import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs, DocumentData, QuerySnapshot, where, getDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ModalReact from 'react-modal';
import { useNavigate } from 'react-router-dom';
import PostDisplay from '../../Timeline/post';
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
} from '../Post/styles';

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
interface TimelineItem {
    postId: string;
    userMentioned: string;
    userSent: string; // Adicione esta linha se 'userSent' existir
    text: string;
    time: string;
    replysCount: number;
    likes: number;
    dislikes: number;
}

const PerfilUsuario: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState<any | null>(null);

    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    const [userLoggedData, setUserLoggedData] = useState<any | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [noItemsFound, setNoItemsFound] = useState<boolean>(false);
    const [nextPostId, setNextPostId] = useState<number>(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchUserDataAndSetState(user.uid);
                fetchTimelineItemsForUser(user.uid);
                searchUserFields(user.uid);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    useEffect(() => {
        fetchLatestPostId();
    }, []);

    const searchUserFields = async (userId) => {
        try {
            if (userId) {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const newAvatarValue = userData['avatar'] || ''; // Campo avatar
                    const nicknameValue = userData['usuario'] || '';
                    const userNameValue = userData['nome'] || '';

                    setNickname(nicknameValue);
                    setUserName(userNameValue);
                    setNewAvatar(newAvatarValue);
                } else {
                    console.log('User not found');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const fetchUserDataAndSetState = async (userId: string) => {
        try {
            if (userId) {
                const userLoggedDataResponse = await fetchUserData(userId);
                if (userLoggedDataResponse) {
                    setUserLoggedData(userLoggedDataResponse);
                    setSelectedProfile(userLoggedDataResponse.usuario);
                    setIsLoadingUser(false);
                } else {
                    alert('Dados do usuário não encontrados!');
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error.message);
        }
    };

    const getPostsFromFirestore = async () => {
        try {
            const postsCollectionRef = collection(db, 'timeline');
            const postsQuery = query(
                postsCollectionRef,
                orderBy('time', 'desc'),
                limit(10)
            );

            const querySnapshot = await getDocs(postsQuery);
            const postsData: TimelineItem[] = [];

            querySnapshot.forEach((doc) => {
                const postData = {
                    postId: doc.id,
                    ...doc.data(),
                };
                postsData.push(postData as TimelineItem);
            });

            return postsData;
        } catch (error) {
            throw error;
        }
    };

    const fetchUserData = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.log('Usuário não encontrado');
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error.message);
            return null;
        }
    };

    const fetchLatestPostId = async () => {
        try {
            const postsRef = collection(db, 'timeline');
            const querySnapshot = await getDocs(
                query(postsRef, orderBy('postId', 'desc'), limit(1))
            );
            if (!querySnapshot.empty) {
                const latestPost = querySnapshot.docs[0].data();
                const postIdAsNumber = parseInt(latestPost.postId, 10);
                console.log(postIdAsNumber);
                setNextPostId(postIdAsNumber + 1);
            }
        } catch (error) {
            console.error('Erro ao buscar o último ID do post:', error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsData: TimelineItem[] = await getPostsFromFirestore();
                const postsWithUserData: any[] = [];

                for (const post of postsData) {
                    const userSentData = post.userSent
                        ? await fetchUserData(post.userSent)
                        : null;
                    const userMentionedData = post.userMentioned
                        ? await fetchUserData(post.userMentioned)
                        : null;

                    postsWithUserData.push({
                        post,
                        userSentData,
                        userMentionedData,
                    });
                }

                setPosts(postsWithUserData);

                if (userLoggedData) {
                    const { photoURL, userName, nickname } = userLoggedData;
                    setNewAvatar(photoURL);
                    setUserName(userName);
                    setNickname(nickname);
                }
            } catch (error) {
                console.error('Erro ao obter os posts:', error);
            }
        };

        fetchData();
    }, []);

    //na qual o usuario logado foi quem mandou pra alguem
    const fetchTimelineItemsForUser = async (
        userId: string
    ): Promise<TimelineItem[]> => {
        try {
            const q = query(
                collection(db, 'timeline'),
                where('userSent', '==', userId),
                where('userMentioned', '!=', null), 
                orderBy('userMentioned'), 
                orderBy('time', 'desc')
            );
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
                    userSent: data.userSent,
                });
            });

            setTimelineItems(timelineItems);

            return timelineItems;
        } catch (error) {
            console.error('Erro ao buscar itens da linha do tempo:', error.message);
            throw error;
        }
    };


    return (
        <div>
            {timelineItems.length === 0 ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '14px 16px',
                        borderBottom: '1px solid #4763E4',
                        maxWidth: '100%',
                        flexShrink: '0',
                        borderRadius: '5px',
                        border: '2px solid #4763e4',
                        background: 'rgba(71, 99, 228, 0.2)',
                        marginBottom: '15px',
                        color: 'whitesmoke',
                        textAlign: 'center',
                    }}
                >
                    Nada Encontrado
                </div>
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
                                    <p>{item.text}</p>
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