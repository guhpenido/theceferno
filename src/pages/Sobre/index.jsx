import React from "react";
import "./stylesSobre.css";
import { Link } from "react-router-dom";
import cefernoTextoImg from "../../assets/ceferno_texto.png";
import VLibras from "@djpfs/react-vlibras";
import { diminuir } from "./fonte";
import { aumentar } from "./fonte";
import { Acessibilidade } from "../Acessibilidade/index";

export function Sobre() {
  return (
    <>
      <div className="sobre-screen">
        <header className="header-sobre" id="header">
          <div className="div-img-logo-sobre">
            <img
              className="sobre-cefernoTextoImg"
              src={cefernoTextoImg}
              alt="Logo Ceferno"
            ></img>
          </div>
          <div className="sobre-botao-acesse-itens-header">
            <div className="div-botao-acesse-sobre">
              <Link style={{ textDecoration: "none" }} to="/register">
                <p href="" className="header-link-sobre">
                  Acesse TheCeferno
                </p>
              </Link>
            </div>
            <div className="header-items">
              <div className="header-item">
                <Link style={{ textDecoration: "none" }} to="/sobre">
                  <div className="item-title">
                    <h2 className="title-text-sobre underline-text">Sobre</h2>
                  </div>
                </Link>
              </div>
              <div className="header-item">
                <Link style={{ textDecoration: "none" }} to="/tutorial">
                  <div className="item-title">
                    <h2 className="title-text-sobre ">Tutorial</h2>
                  </div>
                </Link>
              </div>
              <div className="header-item">
                <Link style={{ textDecoration: "none" }} to="/contato">
                  <div className="item-title">
                    <h2 className="title-text-sobre">Contato</h2>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="main-sobre" id="main">
          <h1 id="titulo-termos-condicoes">TERMOS E CONDIÇÕES</h1>
          <div className="container-sobre">
            <div className="conteudo-sobre">
              <br></br>
              <h3>POLÍTICA DE PRIVACIDADE</h3>
              <br></br>
              <p>
                A sua privacidade é a coisa mais importante para nós. Temos como
                nossa principal política garantir e respeitar a sua privacidade
                em relação a qualquer informação sua que coletemos no site
                CEFERNO, e outros sites que possuímos e operamos.
              </p>
              <p>
                Solicitamos informações e dados somente quando for de extrema
                importância e necessidade para fornecer o nosso serviço.
                Respeitamos os meios legais e recolhendo apenas com o seu
                consentimento e conhecimento. Nosso armazenamento protegemos em
                meios comercialmente aceitáveis ​​para evitar perdas e roubos,
                bem como acesso, divulgação, cópia, uso ou modificação não
                autorizados. Não compartilhando de forma pública ou terceiros,
                apenas se for requerido por lei. Você é livre para recusar a
                nossa solicitação de informações pessoais, entendendo que talvez
                não possamos fornecer alguns dos serviços desejados.
              </p>
              <p>
                Em nosso site são operados links externos que não são operados
                pela nossa equipe, desta forma é de sua consciência que estes
                podem conter riscos e não temos nenhuma responsabilidade sob
                qualquer dano ou prejuízo.
              </p>
              <p>
                O uso continuado de nosso site será considerado como aceitação
                de nossas práticas em torno de privacidade e informações
                pessoais. Se você tiver alguma dúvida sobre como lidamos com
                dados do usuário e informações pessoais, entre em contato
                conosco.
              </p>
            </div>
            <br></br>
            <div className="conteudo">
              <h3>UTILIZAÇÃO SERVIÇOS</h3>
              <br></br>
              <p>
                Utilizamos o serviço Google AdSense, este utiliza um cookie
                DoubleClick para veicular anúncios mais relevantes em toda a Web
                e limitar o número de vezes que um determinado anúncio é exibido
                para você.
              </p>
              <p>
                Estes serviços são utilizados para compensar e financiar os
                custos de funcionamento e para possíveis atualizações para sua
                melhor experiência no futuro. Os cookies de publicidade
                comportamental são projetados para garantir anúncios mais
                relevantes, rastreando anonimamente seus interesses e
                apresentando coisas semelhantes que possam ser do seu interesse.
              </p>
            </div>
            <br></br>
            <div className="conteudo">
              <h3>COMPROMISSO DO USUÁRIO</h3>
              <br></br>
              <p>
                O usuário se compromete a fazer uso adequado dos conteúdos e da
                informação que o CEFERNO oferece no site e com caráter
                enunciativo, mas não limitativo.
              </p>
              <p>
                Não difundir conteúdos ilegais ou contrárias à boa-fé à ordem
                pública ou materiais que contenham conteúdos ofensivos que
                ofendam a outrem, que possuam discursos de natureza racista,
                homofóbica, xenofóbica, jogos de sorte ou azar, pornografia
                ilegal (vazamento de nudes e infantil), apologia a terrorismo e
                direitos humanos.
              </p>
              <p>
                Não causar danos físicos ou lógicos do CEFERNO, de fornecedores
                ou terceiros, como introduzir ou disseminar vírus informáticos
                ou quaisquer outros sistemas de hardware, ou software que tenham
                o poder de causar danos anteriormente mencionados.
              </p>
              <p>
                Ter consciência que qualquer conteúdo consumido ou compartilhado
                é de sua responsabilidade. Deve-se respeitar toda e qualquer
                propriedade individual, intelectual e autoral, falsidade
                ideológica e conduta ilegal.
              </p>
              <p>
                Você compreende que ao utilizar o CEFERNO está suscetível a
                encontrar conteúdos ofensivos, prejudicial, impreciso ou
                inadequado. Reservamo-nos o direito de remover qualquer conteúdo
                que nossa equipe que viole as Condições de Usuário.
              </p>
              <p>
                O conteúdo disponível no CEFERNO está suscetível a sansões
                conforme a legislação do país em que está vigente, LGPD e
                Constituição Federal.
              </p>
            </div>
            <br></br>
            <div className="conteudo">
              <h3>SOBRE A UTILIZAÇÃO DOS SERVIÇOS</h3>
              <br></br>
              <p>
                Como forma de garantir a segurança de todos os seus usuários e
                evitar possíveis danos a mentalidade e efeitos morais daqueles
                que não são responsáveis por si próprio. Desta maneira você
                deve:
              </p>
              <li>
                <ul>Ser maior de 16 anos.</ul>
                <ul>Ser membro da comunidade educacional.</ul>
                <ul>Perfis serem condizentes a sua real identidade.</ul>
                <ul>Não ter sido condenado por crime sexual.</ul>
              </li>
            </div>
          </div>
        </main>
      </div>
      <VLibras forceOnload={true} />
      <Acessibilidade />
    </>
  );
}
