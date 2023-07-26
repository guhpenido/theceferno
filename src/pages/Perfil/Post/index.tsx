import React from "react";
import {
  Container,
  Body,
  Avatar,
  Content,
  Header,
  Posts,
  Icons,
  Status,
  CommentIcon,
  RepublicationIcon,
  LikeIcon,
} from "./styles";

const Post: React.FC = () => {
  return (
    <Container>
      <Body>
        <Avatar />
        <Content>
          <Header>
            <strong>Nome do Usuário</strong>
            <span>@nome_do_usuario</span>
          </Header>
          <Posts>
            ultima mensagem bla bla oqiejas sei la o que bla ableble aoja
            apululu cringe pau
          </Posts>
          <Icons>
            <Status>
              <CommentIcon />
              20
            </Status>
            <Status>
              <RepublicationIcon />5
            </Status>
            <Status>
              <LikeIcon />
              300
            </Status>
          </Icons>
        </Content>
      </Body>
    </Container>
  );
};

export default Post;
