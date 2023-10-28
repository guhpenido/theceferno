import React from 'react';

import Main from '../Main';
import MenuBar from '../MenuBar';
import SideBar from '../SideBar';
import { Acessibilidade } from "../../Acessibilidade/index";

import { Container, Wrapper } from './styles';

const Layout: React.FC = () => {
  return (
    <Container>
    <Wrapper>
        <MenuBar />
        <Main />
        <SideBar />
        <Acessibilidade />
    </Wrapper>
    </Container>
  );

  
}

export default Layout;