import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import perfilIcon from "../../assets/perfil-icon.svg";
import setaPostar from "../../assets/seta-postar.svg";
import "./menuLateral.css";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function MenuLateral({ isMobileLateralVisible, toggleMobileLateral }) {
console.log("No menu" + isMobileLateralVisible);
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState(null);
  const [userUsuario, setUserUsuario] = useState(null);
  useEffect(() => {
    async function getUserImageUrl() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const usersCollection = collection(db, "users");

        const q = query(usersCollection, where("id", "==", user.uid));

        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const imageUrl = userData.imageUrl;
            const user = userData.usuario;
            setUserUsuario(user);
            const nome = userData.nome;
            setNomeUsuario(nome);
            setUserImageUrl(imageUrl);
            console.log(userImageUrl);
          } else {
            console.log("Usuário não encontrado na coleção 'users'.");
          }
        } catch (error) {
          console.error(
            "Erro ao buscar informações de imagem do usuário:",
            error
          );
        }
      } else {
        console.log("Usuário não autenticado.");
      }
    }

    getUserImageUrl();
  }, []);

  return (
    <>
      <div className="lateral-wrapper">
        <div className="menu-lateral-wrapper">
          <div className="menu-lateral-header">
            <div className="imgProfilePic">
              <Link to="/perfil">
                <img className="imgProfilePicFoto" src={userImageUrl} alt="" />
              </Link>
            </div>
            <div className="menu-header-infos">
              <h1>{nomeUsuario}</h1>
              <h2>@{userUsuario}</h2>
            </div>
          </div>
          <div className="menu-lateral">
            <Link className="botaoAcessar iconMenu" to="/timeline">
              <div className="cada-icone-img-nome">
                <img id="home" src={homeIcon} alt="Botão ir para Home"></img>
                <div className="escrita-lateral">
                  <p className="escrita-lateral">Timeline</p>
                </div>
              </div>
            </Link>
            <Link className="botaoAcessar iconMenu" to="/perfil">
              <div className="cada-icone-img-nome">
                <img
                  id="perfil"
                  src={perfilIcon}
                  alt="Botão ir para o perfil"
                ></img>
                <div className="escrita-lateral">
                  <p className="escrita-lateral">Perfil</p>
                </div>
              </div>
            </Link>
            <Link className="botaoAcessar iconMenu" to="/dm">
              <div className="cada-icone-img-nome">
                <img
                  id="dm"
                  src={dmIcon}
                  alt="Botão ir para DM, chat conversas privadas"
                ></img>
                <div className="escrita-lateral">
                  <p className="escrita-lateral">Mensagens</p>
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
          <div className="menu-footer">
            <img
              className="imagemBottom"
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png?ex=654f16a6&is=653ca1a6&hm=47f7d679b329ecf5cc49ea053019ef5d019999ddb77a0ba1a3dda31532ab55da&"
              alt=""
            />
          </div>
        </div>
      </div>
      {isMobileLateralVisible && (
      <div className="mobile-lateral-wrapper">
        <div className="mobile-menu-lateral-wrapper">
        <div onClick={toggleMobileLateral} className="close-mobile-menu"><h1>x</h1></div>
          <div className="mobile-menu-lateral-header">
            <div className="mobile-imgProfilePic">
              <Link to="/perfil">
                <img
                  className="mobile-imgProfilePicFoto"
                  src={userImageUrl}
                  alt=""
                />
              </Link>
            </div>
            <div className="mobile-menu-header-infos">
              <h1>{nomeUsuario}</h1>
              <h2>@{userUsuario}</h2>
            </div>
          </div>
          <div className="mobile-menu-lateral">
            <Link
              className="mobile-botaoAcessar mobile-iconMenu"
              to="/timeline"
            >
              <div className="mobile-cada-icone-img-nome">
                <img
                  id="mobile-home"
                  src={homeIcon}
                  alt="Botão ir para Home"
                ></img>
                <div className="mobile-escrita-lateral">
                  <p className="mobile-escrita-lateral">Timeline</p>
                </div>
              </div>
            </Link>
            <Link className="mobile-botaoAcessar mobile-iconMenu" to="/perfil">
              <div className="mobile-cada-icone-img-nome">
                <img
                  id="mobile-perfil"
                  src={perfilIcon}
                  alt="Botão ir para o perfil"
                ></img>
                <div className="mobile-escrita-lateral">
                  <p className="mobile-escrita-lateral">Perfil</p>
                </div>
              </div>
            </Link>
            <Link className="mobile-botaoAcessar mobile-iconMenu" to="/dm">
              <div className="mobile-cada-icone-img-nome">
                <img
                  id="mobile-dm"
                  src={dmIcon}
                  alt="Botão ir para DM, chat conversas privadas"
                ></img>
                <div className="mobile-escrita-lateral">
                  <p className="mobile-escrita-lateral">Mensagens</p>
                </div>
              </div>
            </Link>
            <Link
              className="mobile-botaoAcessar mobile-a-postar-menu-lateral"
              to="/dm"
            >
              <div className="mobile-botao-buscar-menu">
                <div className="mobile-postar-menu-lateral">
                  <img
                    id="mobile-img-postar-menu-lateral-medio"
                    src={setaPostar}
                    alt="Botão ir para DM, chat conversas privadas"
                  ></img>
                  <p id="mobile-p-postar-menu-lateral">Postar</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="mobile-menu-footer">
            <img
              className="mobile-imagemBottom"
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142335297980477480/Ceferno_2.png?ex=654f16a6&is=653ca1a6&hm=47f7d679b329ecf5cc49ea053019ef5d019999ddb77a0ba1a3dda31532ab55da&"
              alt=""
            />
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default MenuLateral;