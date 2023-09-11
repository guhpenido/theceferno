import React, { useEffect, useState } from "react";
import { Container, Tab, Whispers, TabContainer } from "./styles";
import Post from "../Post";
// import PostagensUsuario from "./postagensUsuario";
import PerfilUsuario from "./whispersUsuario";

interface FeedProps {
  avatarUrl: string | null;
}

const Feed: React.FC<FeedProps> = ({ avatarUrl }) => {

  // const [mostrarComponente, setMostrarComponente] = useState(false);
  const [visibilityPerfil, setVisibilityPerfil] = useState(false);
  const [visibilityPostagens, setVisibilityPostagens] = useState(true);
  const [visibilityWhispers, setVisibilityWhispers] = useState(false);

  const handleWhisper = () => {
    // setMostrarComponente(!mostrarComponente);
    setVisibilityPerfil(true); // Fechar o componente de Perfil ao clicar em Whispers
    setVisibilityPostagens(false);
    setVisibilityWhispers(false);
  }

  const handlePostagens = () => {
    // setMostrarComponente(!mostrarComponente);
    setVisibilityPerfil(false); // Fechar o componente de Perfil ao clicar em Postagens
    setVisibilityWhispers(false);
    setVisibilityPostagens(true);
  }

  const handlePerfil = () => {
    setVisibilityPerfil(true); // Manter o componente de Perfil sempre visível
    setVisibilityPostagens(false);
    setVisibilityWhispers(false);
  }

  return (
    <Container>
      <TabContainer>
        <Tab onClick={handlePostagens}>Postagens</Tab>
        <Tab onClick={handlePerfil}>Perfil</Tab>
        <Tab onClick={handleWhisper}>Whispers</Tab>
      </TabContainer>
      <Whispers>
        {/* Passando avatarUrl como avatarUrl para o componente Post */}
        {/* {visibilityPostagens && <PostagensUsuario />} */}
        {visibilityPerfil && <PerfilUsuario />}
        {/* {visibilityWhispers && <WhispersUsuario />} */}
        {/* <Post avatarUrl={avatarUrl} />   */}
      </Whispers>
    </Container>
  );
};

export default Feed;
