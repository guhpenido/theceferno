import React, { useState, useEffect } from "react";
import "./notificacaocss.css";
import check from "../../assets/circle-check-regular.svg";
function Notificacao() {
  return (
    <>
      <div class="center">
        <div class="check">
          <img src={check} alt="" />
          <span>Nailed It!</span>
        </div>
      </div>
    </>
  );
}

export default Notificacao;
