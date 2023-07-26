import React from "react";
import { Container, Header, BackIcon, ProfileInfo, BottomMenu, HomeIcon, SearchIcon, DmIcon, Whisper, Config} from './styles';
import ProfilePage from '../ProfilePage';

const Main: React.FC = () => {
  return (
    <Container>
      <Header>
        <button>
          <BackIcon />
        </button>
        <ProfileInfo>
          <strong>nome_de_usuario</strong>
        </ProfileInfo>
      </Header>

      <ProfilePage />
      <BottomMenu>
        <HomeIcon />
        <SearchIcon />
        <Whisper />
        <DmIcon />
        <Config/>
      </BottomMenu>
    </Container>
  );
};

export default Main;
