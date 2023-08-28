import React, { useEffect } from "react";
import { Container, Tab, Whispers, TabContainer } from "./styles";
import Post from "../Post";

interface FeedProps {
  avatarUrl: string | null;
}

const Feed: React.FC<FeedProps> = ({ avatarUrl }) => {

  

  return (
    <Container>
      <TabContainer>
        <Tab>Perfil</Tab>
        <Tab>Postagens</Tab>
        <Tab>Whispers</Tab>
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
