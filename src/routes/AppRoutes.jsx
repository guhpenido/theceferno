import { BrowserRouter, Route, Routes, Router } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";
import { Sobre } from "../pages/Sobre";
import { Contato } from "../pages/Contato";
import { Tutorial } from "../pages/Tutorial";
import   Dm  from "../pages/Dm";
import   Chat   from "../pages/Chat"; 
import Layout from '../pages/Perfil/Layout';
import Whisper from "../pages/Whisper";
import {Timeline} from "../pages/Timeline/index";
import PostPage from "../pages/Timeline/PostPage";
import VisitorPage from "../pages/Perfil/ProfilePage/VisitorPage";
import SeachPage from "../pages/Perfil/ProfilePage/SearchPage";
import { Acessibilidade } from "../pages/Acessibilidade/index";
import Trending from "../pages/Timeline/Trending";
import Notificacao from "../pages/Notificacao/Notificacao";
//
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
        <Route path="/whisper" element={<Whisper />} /> 
        <Route path="/timeline" element={<Timeline />} /> 
        <Route path="/timeline/:postId" element={<PostPage />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/VisitorPage" element={<VisitorPage />} />
        <Route path="/SeachPage" element={<SeachPage />} />
        <Route path="/acc" element={<Acessibilidade />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/savedPosts" element={<SavedPosts />} />
        <Route path="/not" element={<Notificacao />} />
      </Routes>
    </BrowserRouter>
  );
}