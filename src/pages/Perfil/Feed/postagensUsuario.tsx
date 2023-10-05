import React from "react";
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ModalReact from 'react-modal';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where, doc } from 'firebase/firestore';
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
interface TimelineItem {
    postId: string;
    userSent: string;
    userMentioned: string;
    text: string;
    time: string;
    replysCount: number;
    likes: number;
    dislikes: number;
}

const PostagensUsuario: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [userName, setUserName] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);

    const [currentUser, setCurrentUser] = useState<any | null>(null);

    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]); // Corrigido o tipo
    const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [noItemsFound, setNoItemsFound] = useState<boolean>(false);

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

    //pegar os whispers (mensagens que aquela pessoa postou/direcionou na página de alguém.)
    useEffect(() => {
        const q = query(collection(db, 'timeline'), where('userSent', '==', currentUser), orderBy('time', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: TimelineItem[] = [];
            snapshot.forEach(async (documento) => {
                const data = documento.data();
                const ref = doc(db, "users", data.userSent);
                const docSnap = await getDoc(ref);
                    if (docSnap.exists()) {
                     const usr = docSnap.data();
                     setUserName(usr.nome);
                     setNickname(usr.usuario);
                     setNewAvatar(usr.imageUrl);
                     console.log(usr);
                    }
                    
                items.push({
                    postId: documento.id,
                    userSent: data.userSent,
                    userMentioned: data.userMentioned,
                    text: data.text,
                    time: data.time,
                    replysCount: data.replysCount,
                    likes: data.likes,
                    dislikes: data.dislikes,
                });
            });
            setTimelineItems(items);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div>
            {timelineItems.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 16px',
                    borderBottom: '1px solid #4763E4',
                    maxWidth: '100%',
                    flexShrink: 0,
                    borderRadius: '5px',
                    border: '2px solid #4763e4',
                    background: 'rgba(71, 99, 228, 0.2)',
                    marginBottom: '15px',
                    color: 'whitesmoke',
                    textAlign: 'center', 
                }}>
                    Nada Encontrado
                </div>
            ) : (
                timelineItems.map((item) => (
                    <Container key={item.postId}>
                        {<Body>
                            <Avatar as="img" src={newAvatar || " "} alt="Novo Avatar" />
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

export default PostagensUsuario;

function fetchUserDataAndSetState(uid: string) {
    throw new Error("Function not implemented.");
}