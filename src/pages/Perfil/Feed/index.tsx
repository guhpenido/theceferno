import React, { useEffect, useState } from "react";
import { Container, Tab, Whispers, TabContainer } from "./styles";
import Post from "../Post";
import WhispersUsuario from "./whispersUsuario";
import PerfilUsuario from "./perfilUsuario";
import PostagensUsuario from "./postagensUsuario";

interface FeedProps {
  avatarUrl: string | null;
}

const Feed: React.FC<FeedProps> = ({ avatarUrl }) => {

  const [mostrarComponente, setMostrarComponente] = useState(false);

  const handleWhisper = () => {
    setMostrarComponente(!mostrarComponente);
  }

  const handlePerfil = () => {
    setMostrarComponente(!mostrarComponente);
  }

  const handlePostagens = () => {
    setMostrarComponente(!mostrarComponente);
  }

  return (
    <Container>
      <TabContainer>
        <Tab onClick={handlePerfil}>Perfil</Tab>
        {mostrarComponente && <PerfilUsuario/>}
        <Tab onClick={handlePostagens}>Postagens</Tab>
        {mostrarComponente && <PostagensUsuario/>}
        <Tab onClick={handleWhisper}>Whispers</Tab>
        {mostrarComponente && <WhispersUsuario/>}
      </TabContainer>
      <Whispers>
        {/* Passando avatarUrl como avatarUrl para o componente Post */}
        <Post avatarUrl={avatarUrl} />
        <Post avatarUrl={avatarUrl} />
        <Post avatarUrl={avatarUrl} />
        <Post avatarUrl={avatarUrl} />
        <Post avatarUrl={avatarUrl} />
        
      </Whispers>
    </Container>
  );
};

export default Feed;
