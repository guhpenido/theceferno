import React, { useState, useEffect, useRef } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../../services/firebaseConfig";
import { getFirestore, startAfter } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import stringSimilarity from "string-similarity";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import PostDisplay from "../Post";

const SeachPost = ({ searchTerm }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [loadedPosts, setLoadedPosts] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        featchApiPostData();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const featchApiPostData = async () => {
    const postsCollectionRef = collection(db, "timeline");
    const lastLoadedPost =
      loadedPosts.length > 0 ? loadedPosts[loadedPosts.length - 1].post : null;
    const lastLoadedPostId = lastLoadedPost ? lastLoadedPost.id : "";
    let postsQuery;

    if (lastLoadedPostId) {
      postsQuery = query(
        postsCollectionRef,
        orderBy("postId", "desc"),
        startAfter(lastLoadedPostId)
      );
    } else {
      postsQuery = query(postsCollectionRef, orderBy("postId", "desc"));
    }

    try {
      const postsData = await getPostsFromFirestore(postsQuery);

      console.log({ postsData });

      if (postsData.length === 0) {
      } else {
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

        setLoadedPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
      }
    } catch (error) {
      console.error("Erro ao obter os posts:", error);
    } finally {
    }
  };

  const getPostsFromFirestore = async (query) => {
    const querySnapshot = await getDocs(query);

    const postsData = [];

    querySnapshot.forEach((doc) => {
      const postData = {
        id: doc.data().postId,
        ...doc.data(),
      };
      postsData.push(postData);
    });

    return postsData;
  };

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);

      const userDoc = await getDoc(userDocRef);

      if (userDoc) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };

  return (
    <div>
      {loadedPosts.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "14px 16px",
            borderBottom: "1px solid #4763E4",
            maxWidth: "100%",
            flexShrink: 0,
            borderRadius: "10px",
            border: "2px solid #4763e4",
            background: "rgba(71, 99, 228, 0.2)",
            marginBottom: "15px",
            color: "whitesmoke",
            textAlign: "center",
            marginTop: "14px",
          }}
        >
          carregando...
        </div>
      ) : (
        <div>
          {loadedPosts.filter(({ post }) => {
              const similarity = stringSimilarity.compareTwoStrings(
                searchTerm.toLowerCase(),
                post.text.toLowerCase()
              );
              return similarity > 0.5;
            })
            .map(({ post, userSentData, userMentionedData }) => (
              <PostDisplay
                key={post.id}
                post={post}
                userSentData={userSentData}
                userMentionedData={userMentionedData}
                setRendState={true}
              />
            ))}
          {loadedPosts.filter(({ post }) => {

            const similarity = stringSimilarity.compareTwoStrings(
              searchTerm.toLowerCase(),
              post.text.toLowerCase()
            );
            return similarity > 0.5;
          }).length === 0 && <div 
          style={{
          textAlign: "center",
        }}>Nenhum resultado encontrado.</div>}
        </div>
      )}
    </div>
  );
};

export default SeachPost;
