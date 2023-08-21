import React, {useState} from 'react';
import Button from '../Button';
import { Postagem } from '../Whisper/styles';

import { Container, TopSide, Logo, MenuButton, SearchIcon, IconWhisper, IconBell, EmailIcon, IconConfig, BotSide, Avatar, ProfileData } from './styles';
const MenuBar: React.FC = () => {

    const [postagemVisible, setPostagemVisible] = useState(false);

    //função para abrir div
    const OpenWhisperPage = () => {
        setPostagemVisible(true);

        //PEGAR ELEMENTO 
        const postagemElement = document.getElementById('post'); 

        //ALTERAR ESTILO
        if (postagemElement ) {
            postagemElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';  
        }
    }

  return(
    <Container>
        <TopSide>
            <Logo />
                <MenuButton>
                    <SearchIcon />
                    <span>Pesquisa</span>
                </MenuButton>
                <MenuButton>
                    <IconWhisper />
                    <span>Sussurro</span>
                </MenuButton>
                <MenuButton>
                    <IconBell />
                    <span>Notificações</span>
                </MenuButton>
                <MenuButton>
                    <EmailIcon />
                    <span>Mensagens</span>
                </MenuButton>
                <MenuButton>
                    <IconConfig />
                    <span>Configurações</span>
                </MenuButton>
                <Button onClick={OpenWhisperPage}>
                    <span>Postar</span>
                </Button>       
        </TopSide>
    </Container>
);
}

export default MenuBar;