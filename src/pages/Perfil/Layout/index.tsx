import React from "react";

import Main from "../Main";
import { MenuLateral } from "../../MenuLateral/MenuLateral";
import SideBar from "../SideBar";
import { Acessibilidade } from "../../Acessibilidade/index";
import { Container, Wrapper } from "./styles";
import { Link } from "react-router-dom";
import homeIcon from "../../../assets/home-icon.svg";
import dmIcon from "../../../assets/dm-icon.svg";
import perfilIcon from "../../../assets/perfil-icon.svg";
import Pesquisa from "../../Pesquisa";


const Layout: React.FC = () => {
	return (
		<Container>
			<Wrapper>
				<MenuLateral />
				<div className="footerDm">
					<Link className="botaoAcessar" to="/timeline">
						<div>
							<img id="home" src={homeIcon} alt="Botão ir para Home"></img>
						</div>
					</Link>
					<Link className="botaoAcessar" to="/perfil">
						<div>
							<img
								id="pesquisa"
								src={perfilIcon}
								alt="Botão para pesquisa"
							></img>
						</div>
					</Link>
					<Link className="botaoAcessar" to="/dm">
						<div>
							<img
								id="dm"
								src={dmIcon}
								alt="Botão ir para DM, chat conversas privadas"
							></img>
						</div>
					</Link>
				</div>
				<Main />
				<Pesquisa/>
				<Acessibilidade />
			</Wrapper>
		</Container>
	);
};

export default Layout;
