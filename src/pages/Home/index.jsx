import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../../assets/logo.png";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import "./styles.css";

export function Home() {
  return (
    <>
      <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">
            <img src={logoImg} alt="Workflow" className="logoImg" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Sobre nós
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Tutorial
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="home">
          <div className="logo">
            <img src={logoImg} alt="Workflow" className="logoImg" />
            <span>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </span>
          </div>
          <div className="botoes">
            <button id="register" type="button" class="btn btn-primary">
              <Link to="/register">Registrar</Link>
            </button>
            <button id="login" type="button" class="btn btn-primary">
              <Link to="/login">Fazer Login</Link>
            </button>
          </div>
        </div>
      </body>
    </>
  );
}
