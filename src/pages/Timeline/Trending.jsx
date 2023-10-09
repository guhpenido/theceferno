import React, { useEffect, useState } from 'react';
import { app } from '../../services/firebaseConfig';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

function Trending() {
  const [trendingData, setTrendingData] = useState([]);

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
        setTrendingData(timelineData);
      } catch (error) {
        console.error("Erro ao buscar documentos da coleção 'timeline':", error);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div>
      <h1>Trending</h1>
      <ul>
        {trendingData.map((post) => (
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
