import React, { useEffect, useState } from "react";
import { Container, Tab, Whispers, TabContainer } from "./styles";
import Post from "../Post";
import PerfilUsuario from "./perfilUsuario";
import WhispersVisitor from "./whispersVisitor";
import PostagensVisitor from "./postagensVisitor";

const FeedVisitor = ({ objetoUsuario }) => {

  const [visibilityPerfil, setVisibilityPerfil] = useState(false);
  const [visibilityPostagens, setVisibilityPostagens] = useState(true);
  const [visibilityWhispers, setVisibilityWhispers] = useState(false);

  const handleWhisper = () => {
    setVisibilityPerfil(false);
    setVisibilityPostagens(false);
    setVisibilityWhispers(true);
  }

  const handlePostagens = () => {
    setVisibilityPerfil(false);
    setVisibilityWhispers(false);
    setVisibilityPostagens(true);
  }


  return (
    <Container>
      <TabContainer>
        <Tab onClick={handlePostagens}>Postagens</Tab>
        <Tab onClick={handleWhisper}>Whispers</Tab>
      </TabContainer>
      <Whispers>
        {visibilityPostagens && <PostagensVisitor objetoUsuario={objetoUsuario} />}
        {visibilityWhispers && <WhispersVisitor objetoUsuario={objetoUsuario}/>}
      </Whispers>
    </Container>
  );
};

export default FeedVisitor;
