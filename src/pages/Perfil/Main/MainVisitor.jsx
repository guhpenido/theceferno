import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Header, BackIcon, ProfileInfo, BottomMenu }
    from './styles';
import ProfilePageVisitor from '../ProfilePage/ProfilePageVisitor';
import homeIcon from "../../../assets/home-icon.svg";
import dmIcon from "../../../assets/dm-icon.svg";
import perfilIcon from "../../../assets/perfil-icon.svg";
import { Link } from "react-router-dom";
import searchIcon from "../../../assets/search.svg";
import faBookmark  from "../../../assets/saved.svg";


const MainVisitor = ({ userPId }) => {
    console.log(userPId);
    // console.log(objetoUsuario);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log('Usuário atual:', user);
                setCurrentUser(user);
            } else {
                console.log('Nenhum usuário autenticado.');
            }
        });
    }, []);

    const handleButtonClick = () => {
        window.location.href = "/timeline";
    };


    return (
        <Container >
            <Header>
                <button onClick={handleButtonClick}>
                    <BackIcon />
                </button>
            </Header>


            <ProfilePageVisitor userPId={userPId} />

            <BottomMenu>
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
                    <Link className="botaoAcessar" to="/savedPosts">
						<div>
							<img
								id="dm"
								src={faBookmark}
								alt="Botão ir para salvos."
							></img>
						</div>
					</Link>
                    <Link className="botaoAcessar" to="/pesquisa">
						<div>
							<img
								id="dm"
								src={searchIcon}
								alt="Botão ir para pesqusisa."
							></img>
						</div>
					</Link>
				</div>
            </BottomMenu>
        </Container>
    );
};

export default MainVisitor;




