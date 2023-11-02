import React from "react";
import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; //modulo de autenticação
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ModalReact from "react-modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import PostDisplay from "../Post/index";
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
  apiKey: "AIzaSyAMmah5RbUcw_J9TUsxSu5PmWqi1ZU4MRk",
  authDomain: "auth-cefernotcc.firebaseapp.com",
  projectId: "auth-cefernotcc",
  storageBucket: "auth-cefernotcc.appspot.com",
  messagingSenderId: "1060989440087",
  appId: "1:1060989440087:web:439b25a3b18602ec53d312",
  measurementId: "G-45ESHWMMPR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


const WhispersVisitor = ({ userPId }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [userName, setUserName] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [posts, setPosts] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [timelineItems, setTimelineItems] = useState([]); // Corrigido o tipo
  const [userLoggedData, setUserLoggedData] = useState(null); // Adjust the type accordingly
  const [selectedProfile, setSelectedProfile] = useState(null); // Adjust the type accordingly
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [noItemsFound, setNoItemsFound] = useState(false);

  //pegar o id do usuario de outra página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(userPId);
        fetchUserDataAndSetState(userPId);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  //pegar os whispers (mensagens que aquela pessoa postou/direcionou na página de alguém.)
  useEffect(() => {
    const q = query(
      collection(db, "timeline"),
      where("userSent", "==", currentUser),
      orderBy("time", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          postId: doc.id,
          userMentioned: data.userMentioned,
          text: data.text,
          time: data.time,
          replysCount: data.replysCount,
          likes: data.likes,
          deslikes: data.deslikes,
        });
      });
      setTimelineItems(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const postsCollectionRef = collection(db, "timeline");
    const postsQuery = query(
      postsCollectionRef,
      orderBy("time", "desc"),
    );

    const fetchData = async () => {
      try {
        const postsData = await getPostsFromFirestore(postsQuery);
        const postsWithUserData = [];

        for (const post of postsData) {
          const userSentData = await fetchUserData(post.userSent);
          let userMentionedData = null;

          if (post.userMentioned !== null) {
            userMentionedData = await fetchUserData(post.userMentioned);
          }

          postsWithUserData.push({
            post,
            userSentData,
            userMentionedData,
          });
        }

        setPosts(postsWithUserData);
      } catch (error) {
        console.error("Erro ao obter os posts:", error);
      }
    };

    fetchData();
  }, [db]);

  const getPostsFromFirestore = async (query) => {
    const querySnapshot = await getDocs(query);
    const postsData = [];
    querySnapshot.forEach((doc) => {
      const postData = {
        id: doc.id,
        ...doc.data(),
      };
      postsData.push(postData);
    });

    // console.log(postsData);

    return postsData;
  };

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };

  return (
    <div>
      {timelineItems.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "14px 16px",
            borderBottom: "1px solid #4763E4",
            maxWidth: "100%",
            flexShrink: 0,
            borderRadius: "5px",
            border: "2px solid #4763e4",
            background: "rgba(71, 99, 228, 0.2)",
            marginBottom: "15px",
            color: "whitesmoke",
            textAlign: "center",
          }}
        >
          Nada Encontrado
        </div>
      ) : (
        <div>
          {posts
            .filter((item) => item.post.userMentioned === currentUser)
            .map(({ post, userSentData, userMentionedData }) => (
              <PostDisplay
                key={post.id}
                post={post}
                userSentData={userSentData}
                userMentionedData={userMentionedData}
                setRendState={true}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default WhispersVisitor;

