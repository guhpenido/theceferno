import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
import { app } from "../../services/firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function Login() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      handleSignIn();
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/timeline");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  function handleSignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        navigate("/timeline");
      })
      .catch((error) => {
        console.error("Error signing in:", error.message);
      });
  }
  return (
    <div className="login">
      <div className="container">
        <header className="header">
          <div id="recaptcha-container"></div>
          <img src={logoImg} alt="CEFERNO" className="logoImg" />
          <span>Por favor digite suas informações de login</span>
        </header>

        <form>
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
          <a href="#">Esqueceu sua senha ?</a>

          <button className="button" id="sign-in-button" onClick={handleSignIn}>
            Entrar <img src={arrowImg} alt="->" />
          </button>
          <div className="footer">
            <p>Você não tem uma conta?</p>
            <Link to="/register">Crie a sua conta aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
