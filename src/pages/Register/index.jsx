import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
import { auth } from "../../services/firebaseConfig";
import "./styles.css";

export function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Função para verificar se as senhas são iguais
  const checkPasswordMatch = () => {
    setIsPasswordMatch(password === confirmPassword);
  };

  const [email, setEmail] = useState("");

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  function handleSignOut(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  }

  if (loading) {
    return <p>carregando...</p>;
  }
  return (
    <div className="login">
      <div className="container">
        <header className="header">
          <img src={logoImg} alt="Workflow" className="logoImg" />
          <span>Por favor digite suas informações de cadastro</span>
        </header>

        <form>
          <span>Etapa 01/05</span>
          <div className="inputContainer">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="email@provedor.com"
              onChange={(e) => setEmail(e.target.value)}
            />
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
              id="password"
              placeholder="********************"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={checkPasswordMatch}
            />
          </div>
          <button onClick={handleSignOut} className="button" disabled={!isPasswordMatch}>
            Continuar <img src={arrowImg} alt="->" />
          </button>
          <div className="footer">
            <p>Você já tem uma conta?</p>
            <Link to="/login">Acesse sua conta aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
