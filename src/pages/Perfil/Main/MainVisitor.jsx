import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Header, BackIcon, ProfileInfo, BottomMenu, HomeIcon, SearchIcon, DmIcon, Whisper, Config }
    from './styles';
import ProfilePageVisitor from '../ProfilePage/ProfilePageVisitor';


const MainVisitor = ({ objetoUsuario }) => {
    // console.log(objetoUsuario);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Usuário atual:', user);
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


            <ProfilePageVisitor objetoUsuario={objetoUsuario} />

            <BottomMenu>
                <HomeIcon />
                <SearchIcon />
                <Whisper />
                <DmIcon />
                <Config />
            </BottomMenu>
        </Container>
    );
};

export default MainVisitor;




