import { BrowserRouter, Route, Routes, Router } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";
import { Sobre } from "../pages/Sobre";
import { Contato } from "../pages/Contato";
import { Tutorial } from "../pages/Tutorial";
import   Dm  from "../pages/Dm";
import   Chat   from "../pages/Chat"; 
import  Layout  from '../pages/Perfil/Layout';
import  GlobalStyles  from '../pages/Perfil/styles/GlobalStyles';
import  Tml  from '../pages/Tml';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/dm" element={<Dm/>} />
        <Route path="/chat/:userId" element={<Chat/>} />
        <Route path="/perfil" element={<Layout/>} />
        <Route path="/perfil" element={<GlobalStyles/>} />
        <Route path="/timeline" element={<Tml/>} />
      </Routes>
    </BrowserRouter>
  );
}
