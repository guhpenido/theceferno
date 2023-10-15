import React, { useEffect, useState } from 'react';
import { app } from '../../services/firebaseConfig';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

function Trending() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const db = getFirestore(app);
        const timelineCollectionRef = collection(db, "timeline");

        // Criar uma consulta que ordena os documentos por "deslikes" em ordem decrescente
        const q = query(timelineCollectionRef, orderBy("deslikes", "desc"));

        const snapshot = await getDocs(q);

        // Processar os documentos da coleção "timeline"
        const timelineData = [];
        snapshot.forEach((doc) => {
          timelineData.push({ id: doc.id, ...doc.data() });
        });

        // Definir o estado com os documentos ordenados
        setTimelineData(timelineData);
      } catch (error) {
        console.error("Erro ao buscar documentos da coleção 'timeline':", error);
      }
    };

    fetchTimelineData();
  }, []);

  return (
    <div style={{color: "white"}}>
      <h1>Documentos da Coleção "Timeline" Ordenados por Deslikes</h1>
      
        {timelineData.map((post) => (
          <div className='tl-box' key={post.id}  style={{border: '1px solid white', marginBottom: '1vh'}}>
            {/* <h1> <strong>ID:</strong> {post.id}</h1> */}
            <p> <strong>Enviou:</strong> {post.userSent}  </p>
            <p> <strong>Recebeu:</strong> {post.userMentioned}  </p>
            <p> <strong>CONTEUDO:</strong> {post.text}  </p>
            <p> <strong>Deslikes:</strong> {post.deslikes} </p>
            <p> <strong>TIME:</strong> {post.time} </p>
          </div>
        ))}
  
    </div>
  );
}

export default Trending;


// <div className="tl-trending-posts">
    //   <ul>
    //     {sortedTrendingPosts.map((post) => (
    //       <li key={post.id}>
    //         <h3>{post.title}</h3>
    //         <p>{post.content}</p>
    //         <p>Deslikes: {post.dislikes}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>