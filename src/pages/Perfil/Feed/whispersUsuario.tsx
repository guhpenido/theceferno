import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ModalReact from 'react-modal';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from 'firebase/firestore';
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

// Definindo uma interface para os itens da timeline
interface TimelineItem {
    postId: string;
    userMentioned: string;
    text: string;
    time: string;
    replysCount: number;
    likes: number;
    dislikes: number;
}

const WhispersUsuario: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState<any | null>(null);

    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]); // Corrigido o tipo

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
            snapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    postId: doc.id,
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
        <div className="containerWhispers">
            {timelineItems.map((item) => (
                <div key={item.postId} className="timeline-item">
                    <p>User Mentioned: {item.userMentioned}</p>
                    <p>Text: {item.text}</p>
                    <p>Time: {item.time}</p>
                    <p>Replies Count: {item.replysCount}</p>
                    <p>Likes: {item.likes}</p>
                    <p>Dislikes: {item.dislikes}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default WhispersUsuario;

function fetchUserDataAndSetState(uid: string) {
    throw new Error("Function not implemented.");
}

