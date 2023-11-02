import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import { Link, useLocation } from "react-router-dom";
import { Wrapper } from "../Layout/styles";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    collection,
} from "firebase/firestore";
import SeachPost from "../SideBar/SeachPost";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { BackIcon, BottomMenu, Config, DmIcon, Header, HomeIcon, ProfileInfo, SearchIcon, Whisper } from "../Main/styles";
import { Container } from "../Layout/styles";
import { ContainerTopo } from "../Main/styles";

import FeedVisitor from "../Feed/feedVisitor";
import { Button } from "bootstrap";
import Main from "../Main";
import { Cabecalho } from "./styles";

const SeachPage = () => {
    const location = useLocation();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [nickname, setNickname] = useState(null);
    const [userInstituicao, setUserInstituicao] = useState("");
    const [userCurso, setUserCurso] = useState("");
    const [bio, setBio] = useState("");
    const [newAvatar, setNewAvatar] = useState(null);
    const [newBanner, setNewBanner] = useState(null);

    const { searchTerm } = location.state;
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                searchUserFields(user.uid);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    const searchUserFields = async (userId) => {
        try {
            if (userId) {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    console.log({ userData });
                    const bannerUrlValue = userData["banner"] || "";
                    const bio = userData["bio"] || "";
                    const newAvatarValue = userData["imageUrl"] || "";
                    setBio(bio);
                    console.log(bio);
                    setNewBanner(bannerUrlValue);
                    setNewAvatar(newAvatarValue);
                    setNickname(userData.usuario);
                    setUserName(userData.nome);
                    setUserCurso(userData.curso);
                    setUserInstituicao(userData.instituicao);
                } else {
                    console.log("User not found");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
        }
    };

    const handleButtonClick = () => {
        // Redirecionar para "/timeline" quando o botão for clicado
        window.location.href = "/timeline";
    };

    return (
        <Container>
            <Wrapper>
                <MenuBar />
                <ContainerTopo >
                    <Header>
                        <button style={{ position: 'relative', marginRight: '500px', display: 'block' }} onClick={handleButtonClick}>
                            <BackIcon />
                        </button>
                        <ProfileInfo>
                            <strong></strong>
                        </ProfileInfo>
                    </Header>
                    <SeachPost style={{marginLeft: 'vw'}} searchTerm={searchTerm} />

                    <BottomMenu >
                        <Link to="/timeline">
                            <HomeIcon />
                        </Link>
                        <SearchIcon />
                        <Whisper />
                        <Link to="/Dm">
                            <DmIcon />
                        </Link>
                        <Config />
                    </BottomMenu>
                </ContainerTopo>
                <SideBar />
            </Wrapper>
        </Container>
    );
};

export default SeachPage;
