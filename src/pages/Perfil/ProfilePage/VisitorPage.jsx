import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import SideBar from '../SideBar';
import { Container, Wrapper } from '../Layout/styles';
import MainVisitor from '../Main/MainVisitor';
import { Link } from "react-router-dom";
import MenuLateral from "../../MenuLateral/MenuLateral"
import { app } from "../../../services/firebaseConfig";
import Pesquisa from '../../Pesquisa';

const VisitorPage = () => {
  const userId = useParams();
  return (
    <Container >
      <Wrapper>
        <MenuLateral />
          <MainVisitor userPId={userId.perfilId} />
        <Pesquisa/>
      </Wrapper>
    </Container>
  );
};

export default VisitorPage;




