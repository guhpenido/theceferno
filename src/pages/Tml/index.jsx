import React, { useState, useEffect } from "react";
//import firebase from 'firebase/app';
import 'firebase/database';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import "./stylesTml.css"; // Importe o arquivo CSS com os estilos
import "../bootstrap/css/bootstrap.min.css";
import "../bootstrap/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

const Post = ({ post, onReply, onDeleteReply}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null); // Estado para armazenar o perfil selecionado

  const firebaseConfig = {
    apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
    authDomain: "auth-ceferno.firebaseapp.com",
    projectId: "auth-ceferno",
    storageBucket: "auth-ceferno.appspot.com",
    messagingSenderId: "388861107940",
    appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
  };
  
  const app = initializeApp(firebaseConfig);
  
  const db = getFirestore(app);

  const handleReply = () => {
    setShowReplyInput(true);
  };

  const handleInputChange = (event) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = () => {
    const date = new Date();
    const timestamp = date.getTime();
    const selected = selectedProfile || {
        username: "lucas",
        photoURL: "https://cdn.discordapp.com/attachments/892116229400195082/1133185452858429460/20230724_205409.jpg",
      };
    const replyData = {
      content: reply,
      timestamp: timestamp,
      username: selected.username, // colocar aqui o username capturado pelo BD
      userPhotoURL: selected.photoURL, // colocar aqui a foto capturada pelo BD
    };
    onReply(post.id, replyData);
    setShowReplyInput(false);
    setReply('');
  };

  const handleProfileChange = (profile) => {
    setSelectedProfile(profile);
    if (profile.username === "gordaosempc") {
        document.body.classList.add("dark-theme");
    } 
    else {
        document.body.classList.remove("dark-theme");
    }
  };

  // Definir alguns perfis disponíveis (somente para fins de demonstração)
  const profiles = [
    {
      username: "lucas",
      photoURL:
        "https://cdn.discordapp.com/attachments/892116229400195082/1133185452858429460/20230724_205409.jpg",
    },
    {
      username: "gordaosempc",
      photoURL:
        "https://cdn.discordapp.com/attachments/892116229400195082/1135644644705832980/image.png",
    },
    // Adicione mais perfis conforme necessário
  ];

  return (
    <div className="container-fluid">
      <div className="post">
        <p className="post-content">{post.content}</p>
        <button className="reply-button" onClick={handleReply}>
          Responder
        </button>
        {showReplyInput && (
          <div className={`container-fluid `}>
             {/* Selecionar um perfil antes de enviar a resposta */}
             <div className="profile-selection">
              <p>Selecione um perfil:</p>
              {profiles.map((profile, index) => (
                <button
                  key={index}
                  className={`profile-button`}
                  onClick={() => handleProfileChange(profile)}
                >
                  {profile.username}
                </button>
              ))}
            </div>
            <textarea
              className="reply-input"
              value={reply}
              onChange={handleInputChange}
              placeholder="Responda o post..."
            />
            <button className="reply-submit" onClick={handleReplySubmit}>
              Enviar resposta
            </button>
          </div>
        )}
         <p className="post-replies">{`Replies: ${post.replies.length}`}</p>
        {post.replies.map((reply) => (
          <div key={reply.timestamp} className="post-reply">
            <img src={reply.userPhotoURL} alt="User" className="user-photo" />
            <p className="username">{reply.username}</p>
            <p className="reply-content">{reply.content}</p>
            <p className="reply-timestamp">
              {new Date(reply.timestamp).toLocaleString()}
            </p>
            {/*se o username do reply for o do usuário logado, pode deletar*/}
            {selectedProfile && selectedProfile.username === reply.username && (
          <button
            className="delete-button"
            onClick={() => onDeleteReply(post.id, reply.timestamp)}
          >
            Apagar resposta
          </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Feed = () => {
  const [selectedProfile, setSelectedProfile] = useState(null); // Estado para o perfil selecionado
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "O Pepenis é muito foda vei!!",
      replies: [],
    },
    {
      id: 2,
      content: "Amo o Pepenis ele é incrível!",
      replies: [],
    },
  ]);

  const handleReply = (postId, reply) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, reply],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDeleteReply = (postId, timestamp) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedReplies = post.replies.filter(
          (reply) => reply.timestamp !== timestamp
        );
        return {
          ...post,
          replies: updatedReplies,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  return (
    <div>
      <h1>Twitter Feed</h1>
      {posts.map((post) => (
        <Post key={post.id} post={post} onReply={handleReply} onDeleteReply={handleDeleteReply} />
      ))}
    </div>
  );
};

export default Feed;
