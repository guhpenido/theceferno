import React from 'react';
import Button from '../Button';

import { Container, TopSide, Logo, MenuButton, SearchIcon, IconWhisper, IconBell, EmailIcon, IconConfig, BotSide, Avatar, ProfileData } from './styles';
const MenuBar: React.FC = () => {
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
                <Button>
                    <span>Postar</span>
                </Button>       
        </TopSide>
        <BotSide>
            <Avatar />
            <ProfileData>
                <strong>Nome do Usuário</strong>
                <span>@nome_do_usuario</span>
            </ProfileData>
        </BotSide>
    </Container>
  );
}

export default MenuBar;