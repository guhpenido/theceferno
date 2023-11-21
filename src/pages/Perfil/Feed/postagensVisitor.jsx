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
import { app } from "../../../services/firebaseConfig";
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
    Footer,
    PostInfo,
} from "../Post/styles";
import { parseISO, formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown, faComment, faThumbsDown, faThumbsUp } from "@fortawesome/fontawesome-free-solid";



const PostagensVisitor = ({ userPId }) => {
    console.log(userPId);
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [currentUser, setCurrentUser] = useState(null);

    const [timelineItems, setTimelineItems] = useState([]);

    const [userId, setUserId] = useState(null);

    const [isUserSent, setUsersent] = useState(null);
    const [likes, setLikes] = useState(null);
    const [deslikes, setDesLikes] = useState([]);

    const [userLoggedData, setUserLoggedData] = useState(null); // Adjust the type accordingly
    const [selectedProfile, setSelectedProfile] = useState(null); // Adjust the type accordingly
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [noItemsFound, setNoItemsFound] = useState(false);
    const [isMetionedDataAndPropsPosts, setMetionedDataAndPropsPosts] = useState([]);
    const db = getFirestore(app);
    const storage = getStorage(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(userPId);
                setUsersent(userPId);
                fetchUserDataAndSetState(userPId);
                fetchTimelineItemsForUser(userPId);
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
                    setUserName(userLoggedDataResponse.nome);
                    setNickname(userLoggedDataResponse.usuario);
                    setNewAvatar(userLoggedDataResponse.imageUrl);
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
            //limit(10)
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

            const timelineItems = [];
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

    const handleLikeClick = async (itemLike, IdPost) => {
        const postLikes = posts.map((post) => {
            const { likes, deslikes, postId } = post;

            return {
                likes,
                deslikes,
                postId,
            };
        });

        const filterLike = postLikes.filter((post) => post.postId === IdPost);

        const sumeLikes = filterLike.map((post) => {
            const { postId } = post;

            let sumLikes = post.likes + 1;

            return { sumLikes, postId };
        });

        const q = query(
            collection(db, "timeline"),
            where("postId", "==", sumeLikes[0].postId)
        );

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0];

                await updateDoc(doc(db, "timeline", postDoc.id), {
                    likes: sumeLikes[0].sumLikes,
                });

                console.log("Likes atualizados no Firebase com sucesso!");
            } else {
                console.error("Post não encontrado no Firebase.");
                setLikes(likes);
            }
        } catch (error) {
            console.error("Erro ao atualizar likes no Firebase: ", error);
            setLikes(likes);
        }
    };


    const handleDeslikes = async (itemLike, IdPost) => {

        console.log({ posts });

        const postLikes = posts.map((post) => {
            const { likes, deslikes, postId } = post;

            return {
                likes,
                deslikes,
                postId,
            };
        });

        const filterLike = postLikes.filter((post) => post.postId === IdPost);

        const sumeDeslikes = filterLike.map((post) => {
            const { postId } = post;

            let sumDeslikes = post.deslikes + 1;

            return { sumDeslikes, postId };
        });

        const q = query(
            collection(db, "timeline"),
            where("postId", "==", sumeDeslikes[0].postId)
        );

        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0];

                await updateDoc(doc(db, "timeline", postDoc.id), {
                    deslikes: sumeDeslikes[0].sumDeslikes,
                });

                console.log("Deslikes atualizados no Firebase com sucesso!");
            } else {
                console.error("Post não encontrado no Firebase.");
                setDesLikes(deslikes);
            }
        } catch (error) {
            console.error("Erro ao atualizar Deslikes no Firebase: ", error);
            setDesLikes(deslikes);
        }
    };

    // Renderize o array combinado
    return (
        <div className="container-wrapper">
            {combinedData.length === 0 ? (
                <div>{/* Renderize a mensagem de "Nada Encontrado" aqui */}</div>
            ) : (
                combinedData.map((item) => (
                    <Container key={item.id}>
                        <Body>
                            <Icons>
                                <Header>
                                    <Avatar as="img" src={newAvatar || ""} alt="Novo Avatar" />
                                    <PostInfo>
                                        <HeaderName>
                                            <div>{userName}</div>
                                            <div>@{nickname}</div>
                                            <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                                            {item.userMentionedData && (
                                                <div>

                                                    <HeaderNameMentioned>
                                                        <Avatar>
                                                            {item.userMentionedData.imageUrl ? (
                                                                <ImgConteiner
                                                                    src={item.userMentionedData.imageUrl}
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <ImgConteiner src={defaultUserImageURL} alt="" />
                                                            )}
                                                        </Avatar>
                                                        <div>{item.userMentionedData.nome}</div>
                                                        <div className="tl-ps-userReceived">
                                                            @{item.userMentionedData.usuario}
                                                        </div>
                                                    </HeaderNameMentioned>
                                                </div>
                                            )}
                                            {item.userMentioned && !item.userMentionedData && (
                                                // Renderize algo se o usuário mencionado não for encontrado
                                                <span>Usuário mencionado não encontrado</span>
                                            )}
                                        </HeaderName>
                                        <Posts>
                                            <div>
                                                {item.text}
                                            </div>
                                        </Posts>
                                    </PostInfo>
                                </Header>
                                <div className="tl-ps-opcoes footer-profile">
                                    <div className="tl-ps-reply">
                                        <FontAwesomeIcon icon={faComment} />
                                        <span> {item.replysCount}</span>
                                    </div>
                                    <div className="tl-ps-like">
                                        <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleLikeClick(item.likes, item.postId)} />
                                        <span> {item.likes}</span>
                                    </div>
                                    <div className="tl-ps-deslike">
                                        <FontAwesomeIcon icon={faThumbsDown} onClick={() => handleDeslikes(item.deslikes, item.postId)} />
                                        <span> {item.deslikes}</span>
                                    </div>
                                    <div>
                                        <Postdays>
                                            <div>
                                                {item.time
                                                    ? `${formatDistanceToNow(
                                                        parseISO(item.time),
                                                        {
                                                            addSuffix: true,
                                                        }
                                                    )}`
                                                    : "Tempo não disponível"}
                                            </div>
                                        </Postdays>
                                    </div>
                                </div>
                            </Icons>
                        </Body>
                    </Container>
                ))
            )}
        </div>
    );
};

export default PostagensVisitor;
