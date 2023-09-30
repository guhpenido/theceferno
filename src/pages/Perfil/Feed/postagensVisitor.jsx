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


const PostagensVisitor = ({ objetoUsuario }) => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState(null);

    const [timelineItems, setTimelineItems] = useState([]);

    const [userId, setUserId] = useState(null);

    const [isUserSent, setUsersent] = useState(null);

    const [userLoggedData, setUserLoggedData] = useState(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [noItemsFound, setNoItemsFound] = useState(false);
    const [isMetionedDataAndPropsPosts, setMetionedDataAndPropsPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(objetoUsuario.id);
                setUsersent(objetoUsuario.id);
                fetchUserDataAndSetState(objetoUsuario.id);
                fetchTimelineItemsForUser(objetoUsuario.id);
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

    const fetchUserDataAndSetState = async (userId) => {
        try {
            if (userId) {
                const userLoggedDataResponse = await fetchUserData(userId);
                if (userLoggedDataResponse) {
                    setUserLoggedData(userLoggedDataResponse);
                    setUserName(objetoUsuario.nome);
                    setNickname(objetoUsuario.usuario);
                    setNewAvatar(objetoUsuario.imageUrl);
                    setSelectedProfile(objetoUsuario.usuario);
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
            const postsDataFilter = [];
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

    const fetchUserData = async (userId) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("User not found");
            return null;
        }
    };

    const fetchTimelineItemsForUser = async (
        userId
    ) => {
        try {
            const q = query(
                collection(db, "timeline"),
                where("userSent", "==", userId),
                orderBy("time", "desc")
            );
            const querySnapshot = await getDocs(q);

            const timelineItems  = [];
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

export default PostagensVisitor;
