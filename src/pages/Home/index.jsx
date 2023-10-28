import React, { useState } from "react";
import "./stylesHome.css";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import cefernoTextoImg from "../../assets/ceferno_texto.png";
import cefernoFullImg from "../../assets/ceferno_icon_full.png";
import VLibras from "@djpfs/react-vlibras";
import { Acessibilidade } from "../Acessibilidade/index";

export function Home() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <div className="home-super-screen">
        <div className="div-home-cefernoFullImg">
          <img className="home-cefernoFullImg" src={cefernoFullImg} alt="Logo Ceferno"></img>
        </div>
        <div className="home-screen">
          <header className="header-home" id="header">
            <div className="header-logo-home">
              <img
                src={logoImg}
                alt="Logo Ceferno"
                className="home-logo"
                id="home-logo-Tlpequena"
              ></img>
            </div>
          </header>
          <main className="main-home" id="main">
            <section className="home-section" id="home">
              <div className="div-home-cefernoTextoImg">
                <img
                  className="home-cefernoTextoImg"
                  src={cefernoTextoImg}
                  alt="Logo Ceferno"
                ></img>
              </div>
              <div>
                <h1 className="home-titulo-Tlgrande">
                  Tudo que deseja sussurar...
                </h1>
              </div>
              <div className="home-main-Tlgrande">
                {/* <div className="home-img-logo-Tlgrande"><img className="logo-home-header" src="src\assets\logoLivre2.png" id="home-logo-Tlgrande" alt="" /></div> */}
                <div className="home-div-centro-Tlgrande">
                  <h2 className="home-title">
                    Rede Social Estudantil que permite a postagem de mensagens
                    de texto de forma pública ou anônima
                  </h2>
                  <Link className="botaoAcessar" to="/register">
                    <button className="home-button home-botao-Tlpequena">
                      Acesse TheCeferno
                    </button>
                  </Link>
                  <Link className="botaoAcessar" to="/register">
                    <button
                      className="home-button home-botao-Tlgrande"
                      id="home-botao-criar-conta-Tlgrande"
                    >
                      Criar Conta
                    </button>
                  </Link>
                  <p className="home-p-Tlgrande">
                    Ao se inscrever você concorda com os{" "}
                    <Link className="span-home" to="/sobre">
                      Termos de condição
                    </Link>
                  </p>
                  <p
                    className="home-p-ou-Tlgrande"
                    id="p-home-Tlgrande-centralizar"
                  >
                    ou
                  </p>
                  <Link className="botaoAcessar" to="/login">
                    <button
                      className="home-button home-botao-Tlgrande"
                      id="home-botao-entrar"
                    >
                      Entrar
                    </button>
                  </Link>
                </div>
              </div>
            </section>
            <div className="home-footer">
              <div>
                <Link to="/sobre">
                  <p className="title-text-home">Sobre</p>
                </Link>
              </div>
              <div>
                <Link to="/tutorial">
                  <p className="title-text-home">Tutorial</p>
                </Link>
              </div>
              <div>
                <Link to="/contato">
                  <p className="title-text-home">Contato</p>
                </Link>
              </div>
            </div>
          </main>
        </div>
        <VLibras forceOnload={true} />
        <Acessibilidade />
      </div>
    </>
  );
}
