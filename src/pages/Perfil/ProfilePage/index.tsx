import React from "react";


import {
  Container,
  Banner,
  Avatar,
  ProfileData,
  EditButton,
} from "./styles";

import Feed from "../Feed";

const ProfilePage: React.FC = () => {
  return (
    <Container>
      <Banner>
        <svg
          viewBox="0 0 1138 173"
          fill="none"
          style={{
            transform: "scale(1, 2) translateY(2px)"
          }}
        >
          <path
            d="M43.9028 13.8761C49.2177 6.12963 58.0087 1.5 67.4032 1.5H1066.54C1076.53 1.5 1085.8 6.73646 1090.95 15.2997L1131.7 82.9753C1137.96 93.3804 1136.94 106.612 1129.16 115.937L1091.34 161.262C1085.92 167.75 1077.91 171.5 1069.45 171.5H68.2251C58.402 171.5 49.2712 166.441 44.0622 158.113L6.69754 98.3736C0.682828 88.7571 0.943014 76.4895 7.36006 67.1367L43.9028 13.8761Z"
            fill="var(--ceferno)"
          />
          <defs>
            <pattern
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            ></pattern>
          </defs>
        </svg>
          <Avatar />
      </Banner>

      <ProfileData>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting...
        </p>
        <EditButton outlined>Editar Perfil</EditButton>

        <h1>Nome do Usuário</h1>
        <h2>@nome_do_usuario</h2>
      </ProfileData>
      <Feed />
    </Container>
  );
};

export default ProfilePage;
