import React from "react";
import {
  Container,
  Tab,
  Whispers,
  TabContainer,
} from "./styles";
import Post from "../Post";
const Feed: React.FC = () => {
  return (
    <Container>
      <TabContainer>
        <Tab>Whispers</Tab>
        <Tab>Postagens</Tab>
        <Tab>Respostas</Tab>
      </TabContainer>
      <Whispers>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </Whispers>
    </Container>
  );
};

export default Feed;
