import React, { useEffect, useState } from "react";
import { Container, Tab, Whispers, TabContainer } from "./styles";
import Post from "../Post";
import PerfilUsuario from "./perfilUsuario";
import WhispersUsuario from "./whispersUsuario";
import PostagensUsuario from "./postagensUsuario";

interface FeedProps {
  avatarUrl: string | null;
}

const Feed: React.FC<FeedProps> = ({ avatarUrl }) => {

  // const [mostrarComponente, setMostrarComponente] = useState(false);
  const [visibilityPostagens, setVisibilityPostagens] = useState(true);
  const [visibilityWhispers, setVisibilityWhispers] = useState(false);

  const handleWhisper = () => {
    setVisibilityPostagens(false);
    setVisibilityWhispers(true);
  }

  const handlePostagens = () => {
    setVisibilityWhispers(false);
    setVisibilityPostagens(true);
  }

  return (
    <Container>
      <TabContainer>
        <Tab onClick={handlePostagens}>Postagens</Tab>
        {/* <Tab onClick={handlePerfil}>Perfil</Tab> */}
        <Tab onClick={handleWhisper}>Whispers</Tab>
      </TabContainer>
      <div className="whispers-container">
        {/* Passando avatarUrl como avatarUrl para o componente Post */}
        {visibilityPostagens && <PostagensUsuario />}
        {visibilityWhispers && <WhispersUsuario />}
        {/* {visibilityPerfil && <PerfilUsuario />} */}
        {/* <Post avatarUrl={avatarUrl} />   */}
      </div>
    </Container>
  );
};

export default Feed;
