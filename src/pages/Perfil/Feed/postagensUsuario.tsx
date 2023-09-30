import React from "react";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    getDocs,
    limit,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ModalReact from "react-modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
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
    ImgConteiner,
    HeaderName,
    HeaderNameMentioned,
    Postdays,
} from "../Post/styles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/fontawesome-free-solid";

const firebaseConfig = {
    apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
    authDomain: "auth-ceferno.firebaseapp.com",
    projectId: "auth-ceferno",
    storageBucket: "auth-ceferno.appspot.com",
    messagingSenderId: "388861107940",
    appId: "1:388861107940:web:0bf718602145d96cc9d6f1",
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
    deslikes: number;
};

const PostagensUsuario: React.FC = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState<any | null>(null);

    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

    const [userId, setUserId] = useState<string | null>(null);

    const [isUserSent, setUsersent] = useState<string | null>(null);

    const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [posts, setPosts] = useState<any[]>([]); // Adjust the type accordingly
    const [userName, setUserName] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [noItemsFound, setNoItemsFound] = useState<boolean>(false);
    const [isMetionedDataAndPropsPosts, setMetionedDataAndPropsPosts] = useState<
        any[]
    >([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setUsersent(user.uid);
                fetchUserDataAndSetState(user.uid);
                fetchTimelineItemsForUser(user.uid);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    useEffect(() => {
        if (isUserSent) {
            const unsubscribe = getPostsFromFirestore();
            return () => unsubscribe();
        }
    }, [isUserSent]);

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
                    setUserName(userLoggedDataResponse.nome);
                    setNickname(userLoggedDataResponse.usuario);
                    setNewAvatar(userLoggedDataResponse.avatar);
                    setSelectedProfile(userLoggedDataResponse.usuario);
                    setIsLoadingUser(false);
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
        }
    };

    const getPostsFromFirestore = () => {
        const q = query(
            collection(db, "timeline"),
            where("userSent", "==", isUserSent),
            orderBy("time", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const postsDataFilter: any[] = [];
            snapshot.forEach((doc) => {
                const postData = {
                    id: doc.id,
                    ...doc.data(),
                };
                postsDataFilter.push(postData);
            });

            setPosts(postsDataFilter);
        });
    };

    useEffect(() => {
        const postsCollectionRef = collection(db, "timeline");
        const postsQuery = query(
            postsCollectionRef,
            orderBy("time", "desc"),
            limit(10)
        );

        const fetchData = async () => {
            try {
                const postsData = await getPostsFromFirestoreOnMetioneData(postsQuery);
                const filteredPostData = postsData.filter(
                    (element) => element.userMentioned !== ""
                );
                const userMentionedValues = filteredPostData.map(
                    (element) => element.userMentioned
                );

                // console.log({userMentionedValues});

                const postsWithUserDataArray = [];

                for (const post of userMentionedValues) {
                    let myUserMetioned = await fetchUserData(post);

                    if (post !== null) {
                        postsWithUserDataArray.push(myUserMetioned);
                    }
                }
                setMetionedDataAndPropsPosts(postsWithUserDataArray);
            } catch (error) {
                console.error("Erro ao obter os posts:", error);
            }
        };

        fetchData();
    }, [db, posts]);

    const getPostsFromFirestoreOnMetioneData = async (query) => {
        const querySnapshot = await getDocs(query);
        const postsData = [];
        querySnapshot.forEach((doc) => {
            const postData = {
                id: doc.id,
                ...doc.data(),
            };
            postsData.push(postData);
        });

        return postsData;
    };

    const fetchUserData = async (userId: string) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("User not found");
            return null;
        }
    };

    const fetchTimelineItemsForUser = async (
        userId: string
    ): Promise<TimelineItem[]> => {
        try {
            const q = query(
                collection(db, "timeline"),
                where("userSent", "==", userId),
                orderBy("time", "desc")
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
                    deslikes: data.deslikes,
                });
            });

            setTimelineItems(timelineItems);
            return timelineItems;
        } catch (error) {
            console.error("Error fetching timeline items:", error.message);
            return [];
        }
    };

    const defaultUserImageURL =
        "https://media.discordapp.net/attachments/871728576972615680/1148261217840926770/logoanon.png?width=473&height=473";

    const combinedData = posts.map((post) => {
        const matchedUser = isMetionedDataAndPropsPosts.find(
            (user) => user.id === post.userMentioned
        );
        return {
            ...post,
            userMentionedData: matchedUser || null,
        };
    });

    // Renderize o array combinado
    return (
        <div>
            {timelineItems.length === 0 ? (
                <div>{/* Renderize a mensagem de "Nada Encontrado" aqui */}</div>
            ) : (
                combinedData.map((item) => (
                    <Container key={item.id}>
                        <Body>
                            {/* Renderize os componentes com base em item */}
                            <Avatar as="img" src={newAvatar || ""} alt="Novo Avatar" />
                            <Icons>
                                <Header>
                                    <HeaderName>
                                        <div>{userName}</div>
                                        <div>@{nickname}</div>
                                    </HeaderName>
                                    <FontAwesomeIcon className="arrow" icon={faArrowDown} />
                                    {item.userMentionedData && (
                                        <div>
                                            {item.userMentionedData.avatar ? (
                                                <ImgConteiner
                                                    src={item.userMentionedData.avatar}
                                                    alt=""
                                                />
                                            ) : (
                                                <ImgConteiner src={defaultUserImageURL} alt="" />
                                            )}
                                            <HeaderNameMentioned>
                                                <div>{item.userMentionedData.nome}</div>
                                                <div className="tl-ps-userReceived">
                                                    @{item.userMentionedData.usuario}
                                                </div>
                                            </HeaderNameMentioned>
                                            <Posts>
                                                <span>
                                                    O usuario {item.userMentionedData.nome} disse{" "}
                                                    {item.text}
                                                </span>
                                            </Posts>
                                        </div>
                                    )}
                                    {item.userMentioned && !item.userMentionedData && (
                                        // Renderize algo se o usuário mencionado não for encontrado
                                        <span>Usuário mencionado não encontrado</span>
                                    )}
                                </Header>
                                <Status>
                                    <CommentIcon />
                                    {item.replysCount}
                                </Status>
                                <Status>
                                    <RepublicationIcon />
                                    Likes: {item.likes}
                                </Status>
                                <Status>
                                    <LikeIcon />
                                    Deslikes: {item.deslikes}
                                </Status>
                                <Status>
                                    <Postdays>
                                        <div>
                                            {item.time
                                                ? `Postado há ${formatDistanceToNow(
                                                    parseISO(item.time),
                                                    {
                                                        addSuffix: true,
                                                    }
                                                )}`
                                                : "Tempo não disponível"}
                                        </div>
                                    </Postdays>
                                </Status>
                            </Icons>
                        </Body>
                    </Container>
                ))
            )}
        </div>
    );
};

export default PostagensUsuario;
