import React, { useState } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
//import "./stylesRegister.scss";
//import "./stylesRegister.css";

import { app } from "../../services/firebaseConfig";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);

export function Register() {
  // Estado inicial do formulário
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    celular: "",
    instituicao: "",
    curso: "",
    dtNascimento: "",
    nome: "",
    usuario: "",
    pseudonimo: "",
    imageSrc: null,
    etapa: 1,
    isEmailValid: true,
    isPasswordMatch: true,
  });

  // Função para verificar se o email é válido
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (emailRegex.test(email) && isEmailAvailable(email));
  };

  // Função para verificar a força da senha
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  // Função para verificar se o celular tem 11 caracteres numéricos
  const isValidCelular = (celular) => {
    const celularRegex = /^\d{11}$/;
    return celularRegex.test(celular);
  };

  // Função para verificar se curso e instituição não estão vazios
  const isCursoValid = (curso = "") => {
    return curso.trim() !== "";
  };

  const isInstituicaoValid = (instituicao = "") => {
    return instituicao.trim() !== "";
  };

  // Função para verificar se o nome e pseudônimo não estão em branco
  const isNomeValid = (nome = "") => {
    return nome.trim() !== "";
  };

  const isPseudonimoValid = (pseudonimo = "") => {
    return pseudonimo.trim() !== "";
  };
  const isDtNascimentoValid = (dtNascimento) => {
    const today = new Date();
    const birthDate = new Date(dtNascimento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if the birth date has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 16;
  };


  // Função para verificar se o email e o pseudônimo já existem no banco de dados
  const isEmailAvailable = async (email) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    return querySnapshot.empty;
  };

  const isUsuarioValid = async (usuario) => {
    try {
      // Get a reference to the 'users' collection
      const usersCollectionRef = collection(db, "users"); 
      const q = query(usersCollectionRef, where("usuario", "==", usuario));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking usuario validity:", error);
      return false; 
    }
  }

  const isPseudonimoAvailable = async (pseudonimo) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("pseudonimo", "==", pseudonimo))
    );
    return querySnapshot.empty;
  };

  // Função para avançar para a próxima etapa do cadastro
  const avancarEtapa = () => {
    const { etapa } = state;
    if (etapa === 1 && !isEtapa1Valid()) {
      alert("Preencha corretamente a etapa 1 antes de avançar.");
    } else if (etapa === 2 && !isEtapa2Valid()) {
      alert("Preencha corretamente a etapa 2 antes de avançar.");
    } else if (etapa === 3 && !isEtapa3Valid()) {
      alert("Preencha corretamente a etapa 3 antes de avançar.");
    } else {
      setState((prevState) => ({
        ...prevState,
        etapa: etapa + 1,
      }));
    }
  };

  // Função para retroceder para a etapa anterior do cadastro
  const retrocederEtapa = () => {
    setState((prevState) => ({
      ...prevState,
      etapa: prevState.etapa - 1,
    }));
  };

  // Função para tratar a mudança de email no input
  const handleEmailChange = (event) => {
    const email = event.target.value;
    setState((prevState) => ({
      ...prevState,
      email,
      isEmailValid: isValidEmail(email),
    }));
  };

  // Função para tratar a mudança de senha no input
  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setState((prevState) => ({
      ...prevState,
      password,
    }));
  };

  // Função para tratar a mudança de confirmação de senha no input
  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setState((prevState) => ({
      ...prevState,
      confirmPassword,
      isPasswordMatch: prevState.password === confirmPassword,
    }));
  };

  const renderPasswordRules = () => {
    return (
      <ul>
        <li>Deve ter ao menos um número ou caractere especial</li>
        <li>Deve conter pelo menos uma letra maiúscula</li>
        <li>Deve ter no mínimo 8 caracteres</li>
      </ul>
    );
  };
  const isPasswordMatch = state.password === state.confirmPassword;

  // Function to render password validation messages
  const renderValidationMessages = () => {
    if (!isPasswordMatch) {
      return <p style={{ color: "red" }}>As senhas não coincidem</p>;
    }
    return null;
  };

  // Função para tratar a mudança de celular no input
  const handleCelularChange = (event) => {
    const celular = event.target.value;
    setState((prevState) => ({
      ...prevState,
      celular,
    }));
  };
  const handleUsuarioChange = (event) => {
    const usuario = event.target.value;
    setState((prevState) => ({
      ...prevState,
      usuario,
    }));
  };

  // Função para tratar a mudança de instituição no input
  const handleInstituicaoChange = (event) => {
    const instituicao = event.target.value;
    setState((prevState) => ({
      ...prevState,
      instituicao,
    }));
  };

  // Função para tratar a mudança de curso no input
  const handleCursoChange = (event) => {
    const curso = event.target.value;
    setState((prevState) => ({
      ...prevState,
      curso,
    }));
  };

  // Função para tratar a mudança de data de nascimento no input
  const handleDtNascimentoChange = (event) => {
    const dtNascimento = event.target.value;
    setState((prevState) => ({
      ...prevState,
      dtNascimento,
    }));
  };

  // Função para tratar a mudança de nome no input
  const handleNomeChange = (event) => {
    const nome = event.target.value;
    setState((prevState) => ({
      ...prevState,
      nome,
    }));
  };

  // Função para tratar a mudança de pseudônimo no input
  const handlePseudonimoChange = (event) => {
    const pseudonimo = event.target.value;
    setState((prevState) => ({
      ...prevState,
      pseudonimo,
    }));
  };

  // Função para tratar a mudança de imagem de perfil no input
  const handleImagemPerfilChange = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setState((prevState) => ({
        ...prevState,
        imageSrc: reader.result,
      }));
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  // Função para verificar se a etapa 1 é válida
  const isEtapa1Valid = () => {
    return isValidEmail(state.email) && state.isEmailValid && isStrongPassword(state.password) && state.isPasswordMatch;
  };

  // Função para verificar se a etapa 2 é válida
  const isEtapa2Valid = () => {
    return isValidCelular(state.celular) && isInstituicaoValid(state.instituicao) && isCursoValid(state.curso) && state.dtNascimento.trim() !== "";
  };

  // Função para verificar se a etapa 3 é válida
  const isEtapa3Valid = () => {
    return isNomeValid(state.nome) && isPseudonimoValid(state.pseudonimo);
  };

  // Função para verificar se todas as etapas foram preenchidas corretamente
  const isFormValid = () => {
    return isEtapa1Valid() && isEtapa2Valid() && isEtapa3Valid();
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifique se todas as etapas foram preenchidas corretamente
    if (!isFormValid()) {
      alert("Preencha corretamente todas as etapas antes de cadastrar.");
      return;
    }

    const {
      email,
      password,
      celular,
      instituicao,
      curso,
      dtNascimento,
      nome,
      usuario,
      pseudonimo,
      imageSrc,
    } = state;

    // Cadastre o usuário no Firebase Authentication
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Envie um email de verificação para o usuário
      sendEmailVerification(user);

      // Upload da imagem de perfil para o Firebase Storage (se tiver uma imagem selecionada)
      let imageUrl = null;
      if (imageSrc) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, imageSrc);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Cadastre os detalhes do usuário na coleção 'users'
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email,
        celular,
        instituicao,
        curso,
        dtNascimento,
        nome,
        usuario,
        pseudonimo,
        imageUrl,
      });
      
      alert("Usuario cadastrado!");
      history.push("/dm");

    } catch (error) {
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <header className="header">
          <img src={logoImg} alt="CEFERNO" className="logoImg" />
          <span>Por favor digite suas informações de cadastro</span>
        </header>
        <form onSubmit={handleSubmit}>
          <div
            className="etapa01"
            style={{ display: state.etapa === 1 ? "block" : "none" }}
          >
            <h2>Etapa 01/04</h2>
            <br></br>
            <div className="inputContainer">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="email@provedor.com"
                value={state.email}
                onChange={handleEmailChange}
                style={{ borderColor: state.isEmailValid ? "green" : "red" }}
              />
              {!state.isEmailValid && <p style={{ color: "red" }}>E-mail inválido</p>}
            </div>

            <div className="inputContainer">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="********************"
                value={state.password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="password">Confirmar senha</label>
              <input
                type="password"
                name="password"
                id="password2"
                placeholder="********************"
                value={state.confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={state.checkPasswordMatch}
                style={{ borderColor: state.isPasswordMatch ? "green" : "red" }}
              />
              {!state.isPasswordMatch && (
                <p style={{ color: "red" }}>As senhas não coincidem</p>
              )}
              {!state.isPasswordMatch && renderValidationMessages()}
              {renderPasswordRules()}
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapa1Valid()}
            >
              Continuar <img src={arrowImg} alt="->" />
            </button>

            <div className="footer">
              <p>Você já tem uma conta?</p>
              <Link to="/login">Acesse sua conta aqui</Link>
            </div>
          </div>
          <div
            className="etapa02"
            style={{ display: state.etapa === 2 ? "block" : "none" }}
          >
            <span>
              <a onClick={retrocederEtapa} href="#">
                - Voltar
              </a>
            </span>
            <h2>Etapa 02/04</h2>
            <br></br>
            <h3>Informações</h3>
            <br></br>
            <div className="inputContainer">
              <label htmlFor="celular">Celular</label>
              <input
                type="text"
                name="celular"
                id="celular"
                placeholder="(xx) xxxxx-xxxx"
                value={state.celular}
                onChange={handleCelularChange}
                style={{ borderColor: isValidCelular()  ? "green" : "red" }}
              />
              {!isValidCelular() && (
                <p style={{ color: "red" }}>Celular inválido</p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="instituicao">Instituição de Ensino</label>
              <input
                type="text"
                name="instituicao"
                id="instituicao"
                placeholder="Nome da instituição"
                value={state.instituicao}
                onChange={handleInstituicaoChange}
                style={{ borderColor: isInstituicaoValid() ? "green" : "red" }}
              />
              {!isInstituicaoValid() && (
                <p style={{ color: "red" }}>Instituição inválida</p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="curso">Curso</label>
              <input
                type="text"
                name="curso"
                id="curso"
                placeholder="Nome do curso"
                value={state.curso}
                onChange={handleCursoChange}
                style={{ borderColor: isCursoValid() ? "green" : "red" }}
              />
              {!isCursoValid() && (
                <p style={{ color: "red" }}>Curso inválido</p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="dtNascimento">Data de Nascimento</label>
              <input
                type="date"
                name="dtNascimento"
                id="dtNascimento"
                value={state.dtNascimento}
                onChange={handleDtNascimentoChange}
                style={{ borderColor: isDtNascimentoValid() ? "green" : "red" }}
              />
              {!isDtNascimentoValid() && (
                <p style={{ color: "red" }}>Data de nascimento inválida</p>
              )}
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapa2Valid()}
            >
              Continuar <img src={arrowImg} alt="->" />
            </button>
          </div>
          <div
            className="etapa03"
            style={{ display: state.etapa === 3 ? "block" : "none" }}
          >
            <span>
              <a onClick={retrocederEtapa} href="#">
                - Voltar
              </a>
            </span>
            <h2>Etapa 03/04</h2>
            <br></br>
            <h3>Informações</h3>
            <br></br>
            <div className="inputContainer">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                name="nome"
                id="nome"
                placeholder="Nome completo"
                value={state.nome}
                onChange={handleNomeChange}
                style={{ borderColor: isNomeValid() ? "green" : "red" }}
              />
              {!isNomeValid() && <p style={{ color: "red" }}>Nome inválido</p>}
            </div>
            <div className="inputContainer">
              <label htmlFor="usuario">Usuário</label>
              <input
                type="text"
                name="usuario"
                id="usuario"
                placeholder="Usuário"
                value={state.usuario}
                onChange={handleUsuarioChange}
                style={{ borderColor: isUsuarioValid() ? "green" : "red" }}
              />
              {!isUsuarioValid() && (
                <p style={{ color: "red" }}>Usuário inválido</p>
              )}
            </div>
            <h3>Foto</h3>
            <br></br>
            <div>
              <div className="profile-pic">
                <label className="-label" htmlFor="file">
                  <span className="glyphicon glyphicon-camera"></span>
                  <span>Mudar imagem</span>
                </label>
                <input
                  id="file"
                  type="file"
                  name="fotoPerfil"
                  accept="image/*"
                  onChange={handleImagemPerfilChange}
                />
                {state.imageSrc && <img id="output" src={state.imageSrc} alt="Preview" />}
              </div>
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapa3Valid()}
            >
              Continuar <img src={arrowImg} alt="->" />
            </button>
          </div>
          <div
            className="etapa04"
            style={{ display: state.etapa === 4 ? "block" : "none" }}
          >
            <span>
              <a onClick={retrocederEtapa} href="#">
                - Voltar
              </a>
            </span>
            <h2>Etapa 04/04</h2>
            <br></br>
            <h3>Informações</h3>
            <br></br>
            <div className="inputContainer">
              <label htmlFor="pseudonimo">Pseudônimo</label>
              <input
                type="text"
                name="pseudonimo"
                id="pseudonimo"
                placeholder="Pseudônimo"
                value={state.pseudonimo}
                onChange={handlePseudonimoChange}
                style={{ borderColor: isPseudonimoValid() ? "green" : "red" }}
              />
              {!isPseudonimoValid() && (
                <p style={{ color: "red" }}>Pseudônimo inválido</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="button"
              disabled={!isFormValid()}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
