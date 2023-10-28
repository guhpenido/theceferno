import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import perfilIcon from "../../assets/perfil-icon.svg";
import setaPostar from "../../assets/seta-postar.svg";
import "./menuLateral.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  or,
  orderBy,
} from "firebase/firestore";

function MenuLateral(ProfileImage, selectedProfile ) {

  return (
    <>
      <div className="lateral-wrapper">
        <div className="lateral-estatica-dm">
          <div className="imgProfilePic">
            <Link to="/perfil">
              <ProfileImage selectedProfile={selectedProfile} />
            </Link>
          </div>
          <div className="menu-lateral-dm">
            <Link className="botaoAcessar iconDm" to="/timeline">
              <div className="cada-icone-img-nome-dm">
                <img id="home" src={homeIcon} alt="Botão ir para Home"></img>
                <div className="escrita-lateral-dm">
                  <p className="escrita-lateral-dm">Timeline</p>
                </div>
              </div>
            </Link>
            <Link className="botaoAcessar iconDm" to="/perfil">
              <div className="cada-icone-img-nome-dm">
                <img
                  id="dm"
                  src={perfilIcon}
                  alt="Botão ir para o perfil"
                ></img>
                <div className="escrita-lateral-dm">
                  <p className="escrita-lateral-dm">Perfil</p>
                </div>
              </div>
            </Link>
            <Link className="botaoAcessar iconDm" to="/dm">
              <div className="cada-icone-img-nome-dm">
                <img
                  id="dm"
                  src={dmIcon}
                  alt="Botão ir para DM, chat conversas privadas"
                ></img>
                <div className="escrita-lateral-dm">
                  <p className="escrita-lateral-dm">DM</p>
                </div>
              </div>
            </Link>
            <Link className="botaoAcessar a-postar-menu-lateral" to="/dm">
              <div className="botao-buscar-menu">
                <div className="postar-menu-lateral">
                  <img
                    id="img-postar-menu-lateral-medio"
                    src={setaPostar}
                    alt="Botão ir para DM, chat conversas privadas"
                  ></img>
                  <p id="p-postar-menu-lateral">Postar</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuLateral;
