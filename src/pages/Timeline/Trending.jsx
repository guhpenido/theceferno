import React, { useEffect, useState } from 'react';
import { app } from '../../services/firebaseConfig';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';


function Trending() {
  const [sortedTrendingPosts, setSortedTrendingPosts] = useState([]);

  const sortByDislikes = () => {
    const sortedPosts = [...sortedTrendingPosts]; // Faça uma cópia dos posts para não alterar o estado diretamente
    sortedPosts.sort((a, b) => b.dislikes - a.dislikes); // Ordene os posts por deslikes em ordem decrescente
    setSortedTrendingPosts(sortedPosts); // Atualize o estado com os posts ordenados
  };
  
  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const db = getFirestore(app);
        const timelineCollectionRef = collection(db, "timeline");
        const q = query(timelineCollectionRef, orderBy("dislikes", "desc"));
        const snapshot = await getDocs(q);
        const timelineData = [];
        snapshot.forEach((doc) => {
          timelineData.push({ id: doc.id, ...doc.data() });
        });
        setSortedTrendingPosts(timelineData); // Atualize sortedTrendingPosts com os posts ordenados
        sortByDislikes(); // Chame a função para garantir que os posts estejam inicialmente ordenados
      } catch (error) {
        console.error("Erro ao buscar documentos da coleção 'timeline':", error);
      }
    };
  
    fetchTrendingData();
  }, []);
  

  useEffect(() => {
    // Chame a função sortByDislikes para ordenar os posts quando necessário
    sortByDislikes();
  }, [sortedTrendingPosts]); // Chame quando sortedTrendingPosts mudar

  return (
    <div>
      <ul>
      {sortedTrendingPosts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Deslikes: {post.dislikes}</p>
        </li>
      ))}
    </ul>
    </div>
  );
}

export default Trending;
