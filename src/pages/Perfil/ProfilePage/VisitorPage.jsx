import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import MenuBar from '../MenuBar';
import SideBar from '../SideBar';
import { Container, Wrapper } from '../Layout/styles';
import MainVisitor from '../Main/MainVisitor';
import { Link } from "react-router-dom";

const VisitorPage = () => {
  const location = useLocation()
  const { objetoUsuario, modo } = location.state;

  return (
    <Container >
      <Wrapper>
        <MenuBar />
        {
          modo === 'public' ? <MainVisitor objetoUsuario={objetoUsuario} /> : window.location.href = "/timeline"
        }
        <SideBar objetoUsuario={objetoUsuario}/>
      </Wrapper>
    </Container>
  );
};

export default VisitorPage;




