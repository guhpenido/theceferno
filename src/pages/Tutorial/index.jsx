import React from "react";
import "./stylesTutorial.css";
import { Link } from "react-router-dom";
import cefernoTextoImg from "../../assets/ceferno_texto.png";
import VLibras from "@djpfs/react-vlibras";

export function Tutorial() {
  return (
    <>
      <div className="tutorial-screen">
        <header className="header-sobre" id="header">
            <div className="div-img-logo-sobre"><img className="sobre-cefernoTextoImg" src={cefernoTextoImg} alt="Logo ceferno"></img></div>
            <div className="sobre-botao-acesse-itens-header"><div className="div-botao-acesse-sobre">
            <Link style={{ textDecoration: 'none' }} to="/register">
              <p href="" className="header-link-sobre">
                Acesse TheCeferno
              </p>
            </Link></div>
          <div className="header-items">
            <div className="header-item">
              <Link style={{ textDecoration: 'none' }} to="/sobre">
                <div className="item-title">
                  <h2 className="title-text-sobre">Sobre</h2>
                </div>
              </Link>
            </div>
            <div className="header-item">
              <Link style={{ textDecoration: 'none' }} to="/tutorial">
                <div className="item-title">
                  <h2 className="title-text-sobre underline-text">Tutorial</h2>
                </div>
              </Link>
            </div>
            <div className="header-item">
              <Link style={{ textDecoration: 'none' }} to="/contato">
                <div className="item-title">
                  <h2 className="title-text-sobre">Contato</h2>
                </div>
              </Link>
            </div>
            </div>
          </div>
        </header>
        <main className="main" id="main">
            <div className="container1 container-fluid parte-tutorial-pagina" data-aos="fade-up">
            <div className="section-header parte-tutorial-pagina">
                <h2 className="text-center">Como utilizar o CEFERNO?</h2>
                <h4>
                  Nesta página iremos mostrar tudo que vocês usuários devem
                  saber para utilizar a plataforma.
                </h4>
            </div>
            </div>
            <div className="container-fluid " data-aos="fade-up">
              <div className="section-header my-2">
                <h2 className="text-center">"Whispar"</h2>
                <div>
                  <div>
                    <h5 className="text-center">Utilizando da conta anônima</h5>
                  </div>
                  <div>
                    <h5 className="text-center">Utilizando da conta pública</h5>
                  </div>
                </div>
                <div className="row">
                  <div>
                    <h5 className="text-center">
                      Diferentes tipos de whispers
                    </h5>
                  </div>
                  <div>
                    <h5 className="text-center">Como whispar?</h5>
                  </div>
                </div>
                <div className="row ">
                  <div>
                    <button type="button" className="botao-tutorial-vermais">
                      Ver mais
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            </div>
            <div className="parte-tutorial-pagina">
              <div>
                <h2 className="text-center">Bloquear e silenciar</h2>
                <div className="row mt-4">
                  <div className="text-center">
                    <h5 className="text-center">Como silenciar usuários</h5>
                  </div>
                  <div className="text-center">
                    <h5 className="text-center">Como bloquear contas</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="">
                    <h5 className="text-center">Fui bloqueado?</h5>
                  </div>
                  <div className="">
                    <h5 className="text-center">Lista de bloqueios</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="text-center">
                    <button type="button" className="botao-tutorial-vermais">
                      Ver mais
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            </div>
            <div cclassName="parte-tutorial-pagina" data-aos="fade-up">
              <div className="section-header my-2">
                <h2 className="text-center">Seguir e deixar de seguir</h2>
                <div className="">
                  <div className="">
                    <h5 className="text-center">
                      Como aprovar ou recusar pedidos de seguidores
                    </h5>
                  </div>
                  <div className="">
                    <h5 className="text-center">
                      Perguntas frequentes sobre o recurso Seguir
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="">
                    <h5 className="text-center">
                      Sobre a ação de seguir no CEFERNO
                    </h5>
                  </div>
                  <div className="">
                    <h5 className="text-center">Como deixar de seguir</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="text-center">
                    <button type="button" className="botao-tutorial-vermais">
                      Ver mais
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            </div>
        </main>
      </div>
      <VLibras forceOnload={true} />
    </>
  );
}
