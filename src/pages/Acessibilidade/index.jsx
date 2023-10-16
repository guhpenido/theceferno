import React, { useState, useRef, useEffect } from "react";
import "./stylesAcessibilidade.css";
import { Link } from "react-router-dom";
import VLibras from "@djpfs/react-vlibras";

export function Acessibilidade() {
  const [isAccContainerOpen, setIsAccContainerOpen] = useState(false);

  const toggleAccContainer = () => {
    setIsAccContainerOpen(!isAccContainerOpen);
  };
  const [clickCountF, setClickCountF] = useState(0);
  const [activeLevelF, setActiveLevelF] = useState(0);

  const aumentarFonte = () => {
    setClickCountF(clickCountF + 1);
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      const currentFontSize = window.getComputedStyle(element).fontSize;
      if (currentFontSize) {
        const currentSize = parseFloat(currentFontSize);
        if (clickCountF < 3) {
          element.style.fontSize = `${currentSize + 1}px`;
        } else {
          element.style.fontSize = `${currentSize - 3}px`;
        }
      }
    });
  };

  const [clickCountE, setClickCountE] = useState(0);
  const [activeLevelE, setActiveLevelE] = useState(0);

  const aumentarEspacamentoLetras = () => {
    setClickCountE(clickCountE + 1);
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {

        if (clickCountE < 1) {
          element.style.letterSpacing = `5px`;
        } else {
          element.style.letterSpacing = `1px`;
        }
    });
  };

  const controlarCliqueDivE = () => {
    aumentarEspacamentoLetras();
    if (clickCountE < 2) {
      setClickCountE(clickCountE + 1);
    } else {
      setClickCountE(0);
    }
  };

  useEffect(() => {
    if (clickCountE < 3) {
      setActiveLevelE(clickCountE + 1);
    } else {
      setActiveLevelE(0);
    }
  }, [clickCountE]);

  const controlarCliqueDivF = () => {
    aumentarFonte();
    if (clickCountF < 3) {
      setClickCountF(clickCountF + 1);
    } else {
      setClickCountF(0);
    }
  };
  useEffect(() => {
    if (clickCountF < 3) {
      setActiveLevelF(clickCountF + 1);
    } else {
      setActiveLevelF(0);
    }
  }, [clickCountF]);

  
  const [clickCountL, setClickCountL] = useState(0);
  const [activeLevelL, setActiveLevelL] = useState(0);

  const aumentarEspacamentoLinhas = () => {
    setClickCountL(clickCountF + 1);
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      const currentLineHeight = window.getComputedStyle(element).lineHeight;
      if (currentLineHeight) {
        console.log(currentLineHeight);
        const currentSpacing = parseFloat(currentLineHeight);
        console.log(currentSpacing);
        if (clickCountL < 3) {
          element.style.lineHeight = `${currentSpacing + 2}px`;
        } else {
          element.style.lineHeight = `${currentSpacing - 6}px`;
        }
      }
    });
  };

  const controlarCliqueDivL = () => {
    aumentarEspacamentoLinhas();
    if (clickCountL < 3) {
      setClickCountL(clickCountL + 1);
    } else {
      setClickCountL(0);
    }
  };

  useEffect(() => {
    if (clickCountL < 3) {
      setActiveLevelL(clickCountL + 1);
    } else {
      setActiveLevelL(0);
    }
  }, [clickCountL]);

  return (
    <>
      <div className="acc-btn-menu" onClick={toggleAccContainer}>
        <img
          src="https://cdn.discordapp.com/attachments/871728576972615680/1142352433352294482/asa.png?ex=653cb19b&is=652a3c9b&hm=65990ae9be81fbaaa9ddb580196ca2f21fdd9f2e5d12dd8e53979164ec5dda13&"
          alt="Logo CEFERNO"
          className="acc-btn-img1"
        />
        <img
          src="https://cdn.discordapp.com/attachments/871728576972615680/1163441952683991080/icon-Acessibilidade.png?ex=653f96c1&is=652d21c1&hm=70decd6e9eec47200c5bce148cb471b63a3686498ccacbbd7204d435e10ffda2&"
          alt="Acessibilidade"
          className="acc-btn-img2"
        />
      </div>
      {isAccContainerOpen && (
        <div className="acc-container">
          <div className="acc-header">
            <div className="acc-title">
              <h3>Menu de Acessibilidade</h3>
            </div>
            <div className="acc-close" onClick={toggleAccContainer}>
              <img
                src="https://cdn.discordapp.com/attachments/871728576972615680/1163446720408059944/signs-close-icon-png.png?ex=653f9b31&is=652d2631&hm=e3648557c0a15979e5464a85cdb74a82246e55b2d9b2d0a06222fa9060fecc6d&"
                alt=""
                className="acc-close-img"
              />
            </div>
          </div>
          <div className="acc-in-container">
            <div
              className="acc-item acc-textoMaior"
              onClick={controlarCliqueDivF}
            >
              {activeLevelF === 1 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                </div>
              )}
              {activeLevelF === 2 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                  <div className="acc-item-active acc-active2 active"></div>
                </div>
              )}
              {activeLevelF === 3 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                  <div className="acc-item-active acc-active2 active"></div>
                  <div className="acc-item-active acc-active3 active"></div>
                </div>
              )}
              <div className="acc-item-body">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1163445320479428629/font-size-increase-icon.png?ex=653f99e4&is=652d24e4&hm=6652e44edb9cf24aeca0178179bad6ce2c5c90dd923d42ebca8c5eec64cc7ea7&"
                  alt="Aumentar Texto"
                />
                <h3>Aumentar fonte</h3>
              </div>
            </div>
            <div className="acc-item acc-espaçamento" onClick={controlarCliqueDivE}>
            {activeLevelE === 1 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                </div>
              )}
              {activeLevelE === 2 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                  <div className="acc-item-active acc-active2 active"></div>
                </div>
              )}
              <div className="acc-item-body">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1163445459306680440/text_spacing_horizontal_icon_148693.png?ex=653f9a05&is=652d2505&hm=733b8464ef9aec5deedb9e04e5e84a1b308c0e30b43d689f5f371ece5be19d6e&"
                  alt="Espaçamento letras"
                />
                <h3>Aumentar espaçamento</h3>
              </div>
            </div>
            <div className="acc-item acc-alturaLinha" onClick={controlarCliqueDivL}>
            {activeLevelL === 1 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                </div>
              )}
              {activeLevelL === 2 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                  <div className="acc-item-active acc-active2 active"></div>
                </div>
              )}
              {activeLevelL === 3 && (
                <div className="acc-actives">
                  <div className="acc-item-active acc-active1 active"></div>
                  <div className="acc-item-active acc-active2 active"></div>
                  <div className="acc-item-active acc-active3 active"></div>
                </div>
              )}
              <div className="acc-item-body">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1163445606602264646/1994261.png?ex=653f9a28&is=652d2528&hm=b3b3bbcb7daea1eecb0846ed3d6d9a6ad6d59e51c28becb087d19e3e4ab7d3ac&"
                  alt="Altura linha"
                />
                <h3>Aumentar altura</h3>
              </div>
            </div>
            <div className="acc-item acc-cursor">
              <div className="acc-actives">
                <div className="acc-item-active acc-active1"></div>
                <div className="acc-item-active acc-active2"></div>
                <div className="acc-item-active acc-active3"></div>
              </div>
              <div className="acc-item-body">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1163445773783015424/3119186.png?ex=653f9a50&is=652d2550&hm=d247012f2670f4a2d6d5ee77929ce2be3a4837479e7b8a4d64939be3774ce9cf&"
                  alt="Alterar cursor"
                />
                <h3>Cursor</h3>
              </div>
            </div>
          </div>
          
        </div>
      )}
            <VLibras forceOnload={true} />
    </>
  );
}
