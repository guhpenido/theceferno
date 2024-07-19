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
          src="https://i.postimg.cc/bY5TG9Xv/logo-Livre2.png"
          alt="Logo CEFERNO"
          className="acc-btn-img1"
        />
        <img
          src="https://cdn.discordapp.com/attachments/871728576972615680/1263675810586296372/07145744_9079_GDO.png?ex=669b194f&is=6699c7cf&hm=efb78637015994dee4f3899e9be7e5d30f68cf1e735487a33a46cafb81b52c98&"
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
                src="https://cdn.discordapp.com/attachments/871728576972615680/1263676311180673124/d3826a943b0d3a9d54ec3d3cba01d0ef.png?ex=669b19c6&is=6699c846&hm=13c44c3a6328bec96854ae11dad2b2a6a6932fc4ddba08d6b8e6dfda40d1ff76&"
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
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1263676029936078878/Increase_Font_icon-icons.png?ex=669b1983&is=6699c803&hm=91f1cdeab22757006642ec39ef0aeb6808f30fca8f118278a5b9b336f54908bc&"
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
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1263676113226432645/12379211.png?ex=669b1997&is=6699c817&hm=2710f0e40d51a7dd5a00ff6d34a10ecfcbdc814b4f64e28dbcf8209888f185cf&"
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
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1263676237684015166/row_height_icon_154882.png?ex=669b19b5&is=6699c835&hm=3c2caca11b766f0b30c67585161d493b8b38e976ef4268e37029f53386946088&"
                  alt="Altura linha"
                />
                <h3>Aumentar altura</h3>
              </div>
            </div>
          </div>
          
        </div>
      )}
            <VLibras forceOnload={true} />
    </>
  );
}
