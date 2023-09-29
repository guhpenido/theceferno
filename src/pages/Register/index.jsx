import React, { useState } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
//import "./stylesRegister.scss";
import "./stylesRegister.css"; //descomentar apenas esse
import { useNavigate } from 'react-router-dom';
import { app } from "../../services/firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  doc, setDoc } from "firebase/firestore"; // Import the doc function

const db = getFirestore(app);

export function Register() {
  const history = useNavigate();
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
    imageSrc:
      "https://cdn.discordapp.com/attachments/871728576972615680/1133946789343531079/logo.png",
    bannerSrc: "https://media.discordapp.net/attachments/1100381589805998080/1147535718642614322/Cabecalho_do_Twitter_1500x500_px..jpeg?width=1025&height=342",
    etapa: 1,
    isEmailValid: true,
    isPasswordMatch: true,
  });

  // Função para verificar se o email é válido
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && isEmailAvailable(email);
  };

  // Função para verificar a força da senha
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  // Função para verificar se o celular tem 11 caracteres numéricos
  const isValidCelular = (celular) => {
    if (celular && celular.length >= 11) {
      return true;
    } else {
      return false;
    }
  };
  // Função para verificar se curso e instituição não estão vazios
  const isCursoValid = (curso = "") => {
    // Remove espaços em branco do início e do fim do curso
    const trimmedCurso = curso.trim();

    // Verifica se o curso tem mais de 5 caracteres
    if (trimmedCurso.length > 5) {
      return true;
    } else {
      return false;
    }
  };
  const isInstituicaoValid = (instituicao = "") => {
    // Remove espaços em branco do início e do fim da instituição
    const trimmedInstituicao = instituicao.trim();

    // Verifica se a instituição tem mais de 5 caracteres
    if (trimmedInstituicao.length > 5) {
      return true;
    } else {
      return false;
    }
  };

  // Função para verificar se o nome e pseudônimo não estão em branco
  const isNomeValid = (nome = "") => {
    // Remove espaços em branco do início e do fim do nome
    const trimmedNome = nome.trim();

    // Verifica se o nome tem mais de um caractere e não tem mais de 25 caracteres
    if (trimmedNome.length >= 1 && trimmedNome.length <= 25) {
      return true;
    } else {
      return false;
    }
  };

  const isPseudonimoValid = async (pseudonimo) => {
    try {
      // Verifica se o usuário é uma string e não está vazia
      if (typeof pseudonimo !== "string" || pseudonimo.trim() === "") {
        throw new Error("pseudonimo inválido. Deve ser uma palavra não vazia.");
      }

      // Verifica se o usuário tem menos de 20 caracteres e não contém espaços
      if (pseudonimo.length >= 20 || /\s/.test(pseudonimo)) {
        throw new Error(
          "O pseudonimo deve ter menos de 20 caracteres e não conter espaços."
        );
      }

      // Get a reference to the 'users' collection
      const usersCollectionRef = collection(db, "users");
      const q = query(
        usersCollectionRef,
        where("pseudonimo", "==", pseudonimo)
      );
      const querySnapshot = await getDocs(q);
      if (pseudonimo.length > 5 && querySnapshot.empty) return true;
    } catch (error) {
      console.error("Error checking pseudonimo validity:", error);
      return false;
    }
  };

  const isDtNascimentoValid = (dtNascimento) => {
    const today = new Date();
    const birthDate = new Date(dtNascimento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if the birth date has not occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age >= 16) {
      return true;
    } else {
      return false;
    }
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
      // Verifica se o usuário é uma string e não está vazia
      if (typeof usuario !== "string" || usuario.trim() === "") {
        return false;
      }

      // Verifica se o usuário tem menos de 20 caracteres e não contém espaços
      if (usuario.length >= 20 || /\s/.test(usuario)) {
        throw new Error(
          "O usuário deve ter menos de 20 caracteres e não conter espaços."
        );
      }

      // Get a reference to the 'users' collection
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("usuario", "==", usuario));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking usuario validity:", error);
      return false;
    }
  };

  // Função para avançar para a próxima etapa do cadastro
  const avancarEtapa = () => {
    setState((prevState) => ({
      ...prevState,
      etapa: Math.min(prevState.etapa + 1, 4), // Ensure the etapa doesn't go beyond 4
    }));
  };

  // Função para retroceder para a etapa anterior do cadastro
  const retrocederEtapa = () => {
    setState((prevState) => ({
      ...prevState,
      etapa: Math.max(prevState.etapa - 1, 1), // Ensure the etapa doesn't go below 1
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
  const handleImagemPerfilChange = async (event) => {
    const imageFile = event.target.files[0];
  
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, 'profile_images/' + imageFile.name);
  
      try {
        // Faz o upload do arquivo para o Firebase Storage
        const snapshot = await uploadBytes(storageRef, imageFile);
  
        // Obtém a URL de download do arquivo
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Atualiza o estado do componente com a URL de download da imagem
        setState((prevState) => ({
          ...prevState,
          imageSrc: downloadURL,
        }));
  
        console.log('Upload concluído. URL de download:', downloadURL);
      } catch (error) {
        console.error('Erro ao fazer o upload da imagem:', error);
      }
    }
  };

  // Função para tratar a mudança de imagem de perfil no input
  const handleBannerPerfilChange = async (event) => {
    const bannerFile = event.target.files[0];
  
    if (bannerFile) {
      const storage = getStorage();
      const storageRef = ref(storage, 'profile_images/' + bannerFile.name);
  
      try {
        // Faz o upload do arquivo para o Firebase Storage
        const snapshot = await uploadBytes(storageRef, bannerFile);
  
        // Obtém a URL de download do arquivo
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Atualiza o estado do componente com a URL de download da imagem
        setState((prevState) => ({
          ...prevState,
          bannerSrc: downloadURL,
        }));
  
        console.log('Upload concluído. URL de download:', downloadURL);
      } catch (error) {
        console.error('Erro ao fazer o upload da imagem:', error);
      }
    }
  };

  // Função para verificar se a etapa 1 é válida
  const isEtapa1Valid = () => {
    return (
      isValidEmail(state.email) &&
      state.isEmailValid &&
      isStrongPassword(state.password) &&
      state.isPasswordMatch &&
      isEmailAvailable(state.email) &&
      state.isEmailValid
    );
  };

  // Função para verificar se a etapa 2 é válida
  const isEtapa2Valid = () => {
    return (
      isValidCelular(state.celular) &&
      isInstituicaoValid(state.instituicao) &&
      isCursoValid(state.curso) &&
      isDtNascimentoValid(state.dtNascimento)
    );
  };

  // Função para verificar se a etapa 3 é válida
  const isEtapa3Valid = () => {
    return isNomeValid(state.nome);
  };

  const isEtapa4Valid = () => {
    return isPseudonimoValid(state.pseudonimo);
  };
  // Função para verificar se todas as etapas foram preenchidas corretamente
  const isFormValid = () => {
    if (
      isEtapa1Valid() &&
      isEtapa2Valid() &&
      isEtapa3Valid() &&
      isEtapa4Valid()
    ) {
      return true;
    } else return false;
  };

  // Função para tratar o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifique se todas as etapas foram preenchidas corretamente
    if (!isFormValid()) {
      alert("Preencha corretamente todas as etapas antes de cadastrar.");
      return;
    } else if (isFormValid()) {
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
        bannerSrc, 
      } = state;

      // Cadastre o usuário no Firebase Authentication
      try {
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Envie um email de verificação para o usuário

        // Upload da imagem de perfil para o Firebase Storage (se tiver uma imagem selecionada)
        let imageUrl = null;
        if (imageSrc) {
          imageUrl = imageSrc;
        }

        let bannerUrl = null;
        if (bannerSrc) {
          bannerUrl =  bannerSrc; 
        }

        // Cadastre os detalhes do usuário na coleção 'users' com o ID do usuário autenticado
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          id: user.uid, // Store the user ID as a variable inside the document
          email,
          celular,
          instituicao,
          curso,
          dtNascimento,
          nome,
          usuario,
          pseudonimo,
          imageUrl,
          bannerUrl,
        });

        alert("Usuario cadastrado!");
        history.push('/login');
      } catch (error) {
        alert("Erro ao cadastrar usuário: " + error.message);
        history.push('/register');
      }
    }
  };

  return (

    <div className="login">
      <div className="registr-borda">
      <div className="container">
      <br></br><br></br>
        <header className="header">
          <img src={logoImg} alt="CEFERNO" className="logoImg" />
          <span>Por favor digite suas informações de cadastro</span>
        </header>
        <form>
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
              {!state.isEmailValid && (
                <p style={{ color: "red" }}>E-mail inválido</p>
              )}
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
            <h1
              onClick={() => isEtapa1Valid() && avancarEtapa()} // Click is only triggered if the step is valid
              className={`button ${!isEtapa1Valid() ? "invalid" : ""}`}
              style={{
                cursor: !isEtapa1Valid() ? "not-allowed" : "pointer",
                backgroundColor: !isEtapa1Valid() ? "#24054C" : "green",
              }}
            >
              Continuar <img src={arrowImg} alt="->" />
            </h1>

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
                style={{ borderColor: isValidCelular() ? "green" : "red" }}
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
            <h1
              onClick={() => isEtapa2Valid() && avancarEtapa()} // Click is only triggered if the step is valid
              className={`button ${!isEtapa2Valid() ? "invalid" : ""}`}
              style={{
                cursor: !isEtapa2Valid() ? "not-allowed" : "pointer",
                backgroundColor: !isEtapa2Valid() ? "red" : "green",
              }}
            >
              Continuar <img src={arrowImg} alt="->" />
            </h1>
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
                {state.imageSrc && (
                  <img id="output" src={state.imageSrc} alt="Preview" />
                )}
              </div>
              <div className="profile-pic">
                <label className="-label" htmlFor="file">
                  <span className="glyphicon glyphicon-camera"></span>
                  <span>Mudar banner</span>
                </label>
                <input
                  id="file"
                  type="file"
                  name="fotoPerfilBanner"
                  accept="image/*"
                  onChange={handleBannerPerfilChange}
                />
                {state.bannerSrc && (
                  <img id="output" src={state.bannerSrc} alt="Preview" />
                )}
              </div>
            </div>
            <h1
              onClick={() => isEtapa3Valid() && avancarEtapa()} // Click is only triggered if the step is valid
              className={`button ${!isEtapa3Valid() ? "invalid" : ""}`}
              style={{
                cursor: !isEtapa3Valid() ? "not-allowed" : "pointer",
                backgroundColor: !isEtapa3Valid() ? "red" : "green",
              }}
            >
              Continuar <img src={arrowImg} alt="->" />
            </h1>
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
              type="submit"
              onClick={handleSubmit}
              className="button"
              disabled={!isFormValid()}
              style={{
                cursor: !isEtapa4Valid() ? "not-allowed" : "pointer",
                backgroundColor: !isEtapa4Valid() ? "red" : "green",
              }}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
