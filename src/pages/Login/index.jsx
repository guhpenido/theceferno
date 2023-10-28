import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../../services/firebaseConfig"; // Import your Firebase configuration
import { useNavigate } from "react-router-dom";
import cefernoFullImg from "../../assets/ceferno_icon_full.png";
import "./stylesLogin.css";
import VLibras from "@djpfs/react-vlibras";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  useEffect(() => {
    // Observar mudanças de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se um usuário estiver logado, redirecione para a página de timeline
        navigate("/timeline");
      }
    });

    return () => unsubscribe(); // Limpa o observador quando o componente é desmontado
  }, [auth, navigate]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; 
      alert("Usuário logado!");
      navigate("/timeline");
    } catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
      alert(error.message);
    }
  };
  return (
    <div className="login">
      <div className="registro-full-screen">
        <div className="div-registro-cefernoFullImg">
          <img className="registro-cefernoFullImg" src={cefernoFullImg} alt="Logo Ceferno"></img>
        </div>
        <div className="login-border">
          <div className="container">
            <header className="header">
              <img src={logoImg} alt="Logo Ceferno" className="login-logoImg" />
              <span>Por favor digite suas informações de login</span>
            </header>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="inputContainer">
                <label htmlFor="email">E-mail</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="seuemail@provedor.com"
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <a href="#" className="login-a-esqueceu">
                Esqueceu sua senha ?
              </a>

              <button className="button" onClick={handleSignIn}>
                Entrar <img src={arrowImg} alt="seta entrar" />
              </button>
              <div className="footer">
                <p>Você não tem uma conta?</p>
                <Link to="/register">Crie a sua conta aqui</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <VLibras forceOnload={true} />
    </div>
  );
}
