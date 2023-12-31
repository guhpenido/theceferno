import "./stylesDenuncia.css";

import React, { useState, useEffect } from "react";
import { app } from "../../services/firebaseConfig";
import {
  getDocs,
  collection,
  updateDoc,
  getFirestore,
  addDoc
} from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';


function Denuncia ({  postId, userId, userSentData }) {
  // const [selectedOption, setSelectedOption] = useState(null);
  const [box1Visible, setBox1Visible] = useState(false); //para mostrar a div denuncia conteudo indevido
  const [box2Visible, setBox2Visible] = useState(false); //para mostrar a div denuncia ser outra pessoa
  const [h1Visible, setH1Visible] = useState(false); //mostra os h1s que chamam as divs
  const [fundoVisible, setFundoVisible] = useState(false); //mostra os h1s que chamam as divs

  // const [denunciaId, setDenunciaId] = useState("");
  const [messageReportedId, setMessageReportedId] = useState("");
  const [motive, setMotive] = useState("");
  const [userReported, setUserReported] = useState("");
  const [userReporting, setUserReporting] = useState("");
  const [denuncias, setDenuncias] = useState([]);

  const db = getFirestore(app);
  const denunciaCollectionRef = collection(db, "denuncia");

  async function CriarDenuncia() {
  const currentTime = new Date();

  const denuncia = await addDoc(denunciaCollectionRef, {
    messageReportedId: postId,
    motive,
    time: currentTime.toString(),
    userReported: userSentData.id,
    userReporting: userId
  });

  const newDenunciaId = denuncia.id;
    await updateDoc(denuncia, { denunciaId: newDenunciaId });
    toggleh1Visibility();
  }



  useEffect(() => {
    const getDenuncia = async () => {
    const data = await getDocs(denunciaCollectionRef);
    setDenuncias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getDenuncia();
  }, []);

  //deixa e tira a visibilidade da div denuncia conteudo indevido
  const toggleBox1Visibility = () => {
    setBox1Visible(!box1Visible);
    setBox2Visible(false); // Hide box2 when showing box1
  };

  //deixa e tira a visibilidade da div denuncia ser outra pessoa
  const toggleBox2Visibility = () => {
    setBox2Visible(!box2Visible);
    setBox1Visible(false); // Hide box1 when showing box2
  };

  //deixa e tira a visibilidade dos h1s
  const toggleh1Visibility = () => {
    console.log("entrou toggleh1Visibility")
    setH1Visible(!h1Visible);
    setBox1Visible(false);
    setBox2Visible(false);
    setFundoVisible(!fundoVisible);
  };


  const handleMotiveChange = (event) => {
    setMotive(event.target.value);
  };

  useEffect(() =>{
    toggleh1Visibility();
  }, [])


  const  notiDenunciaFeita = () => toast.success('O Post foi denunciado com sucesso !', {
    duration: 8000,

    iconTheme: {
      primary: '#4763E4',
      secondary: '#fff',
    },
  });

  const denunciaENotifica = (event) =>  {
    notiDenunciaFeita();
    setTimeout(() => {
      CriarDenuncia();
  }, 3000);
  };


  return (
    <div className={`denuncia ${h1Visible ? 'visible' : 'DenunciaInvisible'}`}>
      <div className="headerDenuncia">
        <h1>Denúncia </h1>
        <button className="fecharDenuncia" onClick={toggleh1Visibility}>X</button>
      </div>
      <label id="label-denuncia1" className={`${h1Visible ? 'visible' : 'DenunciaInvisible'}`} htmlFor='box1'> Está publicando conteúdo que não deveria estar no Ceferno  <button className="alternaOpcao" onClick={toggleBox1Visibility}> <img className="escolhaDenuncia" src="src\pages\Timeline\assets\icone.png" /> </button></label>
      <select className={`opcoesDenuncia box1 ${box1Visible ? 'visible' : 'DenunciaInvisible'}`} id="box1" name="box1" value={motive} onChange={handleMotiveChange}>
        <option>Selecione uma opção</option>
        <option value="Eh_Spam"> É spam </option>
        <option value="Nao_Gostei"> Simplesmente não gostei </option>
        <option value="Suicidio_Automutilacao_Disturbios"> Suicidio e automutilação  </option>
        <option value="Produtos_ilicitos"> Venda de produtos ilicitos </option>
        <option value="Nudez"> Nudez ou atividade sexual </option>
        <option value="Discurso_de_Odio"> Símbolos ou discurso de ódio </option>
        <option value="Violencia"> Violência ou organizações perigosas </option>
        <option value="Bullying"> Bullying ou assédio </option>
        <option value="Violacao_Intelectual"> Violação de propriedade intelectual </option>
        <option value="Golpe"> Golpe ou fraude </option>
        <option value="Fake_News"> Informação falsa </option>
      </select>

      <br></br>

      <label id="label-denuncia" className={`${h1Visible ? 'visible' : 'DenunciaInvisible'}`} htmlFor='box2'> Está fingindo ser outra pessoa  <button className="alternaOpcao" onClick={toggleBox2Visibility}> <img className="escolhaDenuncia" src="src\pages\Timeline\assets\icone.png" /> </button></label>
      <select className={`opcoesDenuncia box2 ${box2Visible ? 'visible' : 'DenunciaInvisible'}`} id="box2" name="box2" value={motive} onChange={handleMotiveChange}>
        <option>Selecione uma opção</option>
        <option value="fingindo_Ser_Eu"> Eu </option>
        <option value="fingindo_Ser_Alguem_que_Sigo"> Alguém que sigo </option>
        <option value="fingindo_Ser_Uma_Celebridade_Figura_Publica"> Uma celebridade ou figura pública </option>
        <option value="fingindo_Ser_Empresa"> Uma empresa ou organização </option>
      </select>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <button className={`enviarDenuncia ${h1Visible ? 'visible' : 'DenunciaInvisible'}`} onClick={denunciaENotifica}>Enviar</button>
    </div>
  );
}

export default Denuncia;