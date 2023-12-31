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
import PostDisplay from "../../Timeline/post";
import { app } from "../../../services/firebaseConfig";
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

const PostagensUsuario: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [userName, setUserName] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [posts, setPosts] = useState<TimelineItem[]>([]);

  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]); // Corrigido o tipo
  const [userLoggedData, setUserLoggedData] = useState<any>(null); // Adjust the type accordingly
  const [selectedProfile, setSelectedProfile] = useState<any>(null); // Adjust the type accordingly
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [noItemsFound, setNoItemsFound] = useState<boolean>(false);
  const db = getFirestore(app);
  const storage = getStorage(app);

  //pegar o id do usuario de outra página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.uid);
        setCurrentUser(user.uid);
        console.log(user);
  
        // Certifique-se de que fetchUserData retorna uma promessa
        const userLoggedData = await fetchUserData(user.uid);
        setUserLoggedData(userLoggedData);
  
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
      where("mode", "==", "public"),
      orderBy("time", "desc")
    );

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

  useEffect(() => {
    const postsCollectionRef = collection(db, "timeline");
    const postsQuery = query(
      postsCollectionRef,
      where("mode", "==", "public"),
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
              .filter((item) => item.post.userSent === currentUser)
              .map(({ post, userSentData, userMentionedData }) => (
                <PostDisplay
                  key={post.id}
                  post={post}
                  userId={currentUser}
                  userSentData={userSentData}
                  userMentionedData={userMentionedData}
                  userLoggedData={userLoggedData}
                  setRendState={true}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default PostagensUsuario;

function fetchUserDataAndSetState(uid: string) {
  throw new Error("Function not implemented.");
}