import React, { useEffect } from "react";
import { useState } from "react";
//import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
//import { db, auth, storageRef } from "../../services/firebaseConfig";
import "./styles.scss";
import "./styles.css";

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
  authDomain: "auth-ceferno.firebaseapp.com",
  projectId: "auth-ceferno",
  storageBucket: "auth-ceferno.appspot.com",
  messagingSenderId: "388861107940",
  appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);

export function Register() {

  //padrão State
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Função para verificar se as senhas são iguais e atendem às regras de validação
  const checkPasswordMatch = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordMatch(
      password === confirmPassword && passwordRegex.test(password)
    );
  };

  // Renderização condicional das regras de validação da senha
  const renderPasswordRules = () => {
    return (
      <>
        <p>A senha deve ter no mínimo 8 caracteres.</p>
        <p>A senha deve conter pelo menos uma letra maiúscula.</p>
        <p>A senha deve conter pelo menos um número.</p>
        <p>A senha deve conter pelo menos um caractere especial.</p>
      </>
    );
  };

  // Renderização condicional das mensagens de validação
  const renderValidationMessages = () => {
    if (!isPasswordMatch) {
      return (
        <p style={{ color: "red" }}>
          As senhas não coincidem ou não atendem às regras de validação.
        </p>
      );
    }
    return null;
  };

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);

  //padrão Observer
  useEffect(() => {

    const checkEmailUniqueness = async () => {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();
      setIsEmailUnique(snapshot.empty);
    };

    if (email) {
      checkEmailUniqueness();
    }
  }, [email]);

  //exemplo padrão de projeto Memento
  const [etapa, setEtapa] = useState(1);

  const avancarEtapa = (e) => {
    e.preventDefault();
    if (etapa < 4) {
      setEtapa(etapa + 1);
    }
  };

  const retrocederEtapa = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  const vazio = () => {};

  const [imageSrc, setImageSrc] = useState(
    "https://uploaddeimagens.com.br/images/004/529/200/full/logo.png?1688341296"
  );

  const handleImagemPerfilChange = (event) => {
    const arquivo = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    if (arquivo) {
      reader.readAsDataURL(arquivo);
      // Upload image to Firebase Storage
      const imageRef = storageRef.child(arquivo.name);
      imageRef.put(arquivo).then(() => {
        // Get image URL
        imageRef.getDownloadURL().then((url) => {
          setImageSrc(url);
        });
      });
    } else {
      // No image selected, set default URL
      setImageSrc("https://uploaddeimagens.com.br/images/004/529/200/full/logo.png?1688341296");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      // Upload image to Firebase Storage
      const imageRef = storageRef.child(file.name);
      imageRef.put(file).then(() => {
        // Get image URL
        imageRef.getDownloadURL().then((url) => {
          setImageSrc(url);
        });
      });
    } else {
      // No file selected, set default URL
      setImageSrc(defaultImageUrl);
    }
  };
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <p>carregando...</p>;
  }

  const isEtapaValid = () => {
    switch (etapa) {
      case 1:
        return isEmailValid && isPasswordMatch;
      case 2:
        return (
          isCelularValid() &&
          isInstituicaoValid() &&
          isCursoValid() &&
          isDtNascimentoValid()
        );
      case 3:
        return isNomeValid() && isUsuarioValid();
      case 4:
        return isPseudonimoValid();
      default:
        return false;
    }
  };
  const [celular, setCelular] = useState("");
  const isCelularValid = () => {
    const celularPattern = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
    return celularPattern.test(celular);
  };

  const [instituicao, setInstituicao] = useState("");
  const isInstituicaoValid = () => {
    return !!instituicao.trim();
  };
  const [curso, setCurso] = useState("");
  const isCursoValid = () => {
    return !!curso.trim();
  };
  const [dtNascimento, setdtNascimento] = useState("");
  const isDtNascimentoValid = () => {
    if (!dtNascimento) {
      return true;
    }

    const today = new Date();
    const birthDate = new Date(dtNascimento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 16;
    }

    return age >= 16;
  };
  const [nome, setNome] = useState("");
  const isNomeValid = () => {
    return !!nome.trim();
  };
  const [usuario, setUsuario] = useState("");
  const isUsuarioValid = () => {
    const usuarioPattern = /^[^\s]{1,25}$/;
    return usuarioPattern.test(usuario);
  };

  const [pseudonimo, setPseudonimo] = useState("");
  const isPseudonimoValid = () => {
    const pseudonimoPattern = /^[^\s]{1,25}$/;
    return pseudonimoPattern.test(pseudonimo);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(validateEmail(e.target.value));
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleCelularChange = (e) => {
    setCelular(e.target.value);
  };

  const handleInstituicaoChange = (e) => {
    setInstituicao(e.target.value);
  };

  const handleCursoChange = (e) => {
    setCurso(e.target.value);
  };

  const handleDtNascimentoChange = (e) => {
    setDtNascimento(e.target.value);
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value);
  };

  const handleUsuarioChange = (e) => {
    setUsuario(e.target.value);
  };

  const handlePseudonimoChange = (e) => {
    setPseudonimo(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create user in Firebase authentication
      console.log(email, password);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user.uid);
      // Create user in Firestore
      const {
        celular,
        instituicao,
        curso,
        dtNascimento,
        nome,
        usuario,
        pseudonimo,
        imageSrc,
      } = this.state;
      console.log(celular);
      console.log(instituicao);
      console.log(curso);
      console.log(dtNascimento);
      console.log(nome);
      console.log(usuario);
      console.log(pseudonimo);
      console.log(imageSrc);
      await db.collection("users").doc("4vaspCjC5muHhx0VO1hQ").set({
        uid: user.uid,
        celular,
        instituicao,
        curso,
        dtNascimento,
        nome,
        usuario,
        pseudonimo,
        imageSrc,
        email,
      });

      // Reset form and state
      this.setState({
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

      alert("Usuário cadastrado!");
    } catch (error) {
      alert("Não foi possível cadastrar o usuário. " + error);
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
            style={{ display: etapa === 1 ? "block" : "none" }}
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
                value={email}
                onChange={handleEmailChange}
                style={{ borderColor: isEmailValid ? "green" : "red" }}
              />
              {!isEmailValid && <p style={{ color: "red" }}>E-mail inválido</p>}
            </div>

            <div className="inputContainer">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="********************"
                value={password}
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
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={checkPasswordMatch}
                style={{ borderColor: isPasswordMatch ? "green" : "red" }}
              />
              {!isPasswordMatch && (
                <p style={{ color: "red" }}>As senhas não coincidem</p>
              )}
              {!isPasswordMatch && renderValidationMessages()}
              {renderPasswordRules()}
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapaValid(1)}
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
            style={{ display: etapa === 2 ? "block" : "none" }}
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
                value={celular}
                onChange={handleCelularChange}
                style={{ borderColor: isCelularValid() ? "green" : "red" }}
              />
              {!isCelularValid() && (
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
                value={instituicao}
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
                value={curso}
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
                value={dtNascimento}
                nChange={handleDtNascimentoChange}
                style={{ borderColor: isDtNascimentoValid() ? "green" : "red" }}
              />
              {!isDtNascimentoValid() && (
                <p style={{ color: "red" }}>Data de nascimento inválida</p>
              )}
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapaValid()}
            >
              Continuar <img src={arrowImg} alt="->" />
            </button>
          </div>
          <div
            className="etapa03"
            style={{ display: etapa === 3 ? "block" : "none" }}
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
                value={nome}
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
                value={usuario}
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
                {imageSrc && <img id="output" src={imageSrc} alt="Preview" />}
              </div>
            </div>
            <button
              onClick={avancarEtapa}
              className="button"
              disabled={!isEtapaValid()}
            >
              Continuar <img src={arrowImg} alt="->" />
            </button>
          </div>
          <div
            className="etapa04"
            style={{ display: etapa === 4 ? "block" : "none" }}
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
                value={pseudonimo}
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
              disabled={!isEtapaValid()}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
