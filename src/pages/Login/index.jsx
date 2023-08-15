import { useState } from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.png";
// import "./stylesLogin.css";
//import { signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  function handleSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // The user has signed in successfully
        const user = userCredential.user;
        console.log("User logged in:", user);

        // Redirect to a protected route or any other page after successful login
        navigate("/dm");
      })
      .catch((error) => {
        // Handle login error
        console.error("Error signing in:", error.message);
      });
  }
  return (
    <div className="login">
      <div className="container">
        <header className="header">
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

          <button className="button" onClick={handleSignIn}>
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
