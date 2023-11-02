import React from "react";
import "./stylesContato.css";
import { Link } from "react-router-dom";
import cefernoTextoImg from "../../assets/ceferno_texto.png";
import VLibras from "@djpfs/react-vlibras";
import { diminuir} from './fonte';
import { aumentar } from './fonte';
import { Acessibilidade } from "../Acessibilidade/index";

export function Contato() {
  return (
    <>
      <div className="contato-screen">
        <header className="header-sobre" id="header">
            <div className="div-img-logo-sobre"><img className="sobre-cefernoTextoImg" src={cefernoTextoImg} alt="logo ceferno"></img></div>
            <div className="sobre-botao-acesse-itens-header"><div className="div-botao-acesse-sobre">
            <Link style={{ textDecoration: 'none' }} to="/register">
              <p href="" className="header-link-sobre">
                Acesse TheCeferno
              </p>
            </Link></div>
          <div className="header-items">
          <div className="header-item">
              <Link style={{ textDecoration: 'none' }} to="/">
                <div className="item-title">
                  <h2 className="title-text-sobre">Home</h2>
                </div>
              </Link>
            </div>
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
                  <h2 className="title-text-sobre ">Tutorial</h2>
                </div>
              </Link>
            </div>
            <div className="header-item">
              <Link style={{ textDecoration: 'none' }} to="/contato">
                <div className="item-title">
                  <h2 className="title-text-sobre underline-text">Contato</h2>
                </div>
              </Link>
            </div>
            </div>
          </div>
        </header>
        <main className="main-contato-page" id="main">
            <div className="centralizar contato-page-main">
              <div className="boxContato">
                <div className="faleCmg">
                  <div>
                    <h3>Fale Conosco</h3>
                    <p className="margin0Top">
                      Seu feedback é muito importante para nós! Deixe seu elogio, reclamação ou sugestão através do box ao lado.
                    </p>
                  </div>
                </div>
                <div className="mandaMsg">
                  <h4 style={{ fontWeight: 'bold' }}>Deixe sua mensagem</h4>
                  <form action="https://formsubmit.co/ajax/isafflorencio@gmail.com" method="POST" data-form>
                    <input id="nome-contato-page" className="" type="text" name="name" placeholder="Seu nome*" required />
                    <input id="email-contato-page" name="email" placeholder="Seu email*" required />
                    <textarea id="mensagem-contato-page" type="text" name="mensagem" placeholder="Sua mensagem*" required />
                    <button type="submit" data-button className="botao-manda-msg-contato">
                      Enviar Mensagem
                    </button>
                  </form>
                </div>
              </div>
            </div>

        </main>
      </div>
      <Acessibilidade />
    </>
  );
}
