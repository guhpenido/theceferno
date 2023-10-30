import React, { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { app } from "../../services/firebaseConfig";

import PostDisplay from "./post";

// import "./stylesTrending.css"; // Estilo personalizado para a seção "Trending"

export function Trending() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      const postsCollectionRef = collection(db, "timeline");
      const trendingPostsQuery = query(
        postsCollectionRef,
        orderBy("deslikes", "desc") // Ordene por deslikes em ordem decrescente
      );

      const trendingPostsData = await getPostsFromFirestore(trendingPostsQuery);

      setTrendingPosts(trendingPostsData);
    } catch (error) {
      console.error("Erro ao obter os posts em tendência:", error);
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

  console.log("trendingPosts:", trendingPosts);

  return (
    <div className="trending-section">
      <h2>Trending Posts</h2>
      <div className="trending-posts">
        {trendingPosts.map((post) => (
          console.log("post:", post), // Adicione um log para ver os dados de cada post
          // Verificar se as propriedades necessárias estão definidas antes de renderizar
          (post.userSentData && post.userSentData.nome) && (
            <PostDisplay key={post.id} post={post} />
          )
        ))}
      </div>
    </div>
  );
}

export default Trending;