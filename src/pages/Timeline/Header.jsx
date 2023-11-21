import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

function Header(props) {
  const [userImageUrl, setUserImageUrl] = useState(null);
  useEffect(() => {
    async function getUserImageUrl() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const usersCollection = collection(db, "users");

        const q = query(usersCollection, where("id", "==", user.uid));

        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const imageUrl = userData.imageUrl;
            setUserImageUrl(imageUrl);
            console.log(userImageUrl);
          } else {
            console.log("Usuário não encontrado na coleção 'users'.");
          }
        } catch (error) {
          console.error(
            "Erro ao buscar informações de imagem do usuário:",
            error
          );
        }
      } else {
        console.log("Usuário não autenticado.");
      }
    }

    getUserImageUrl();
  }, []);

  return (
    <>
      <div className="tl-header">
        <div className="tl-header-div1 header-active">
          <h1>Para Você</h1>
          <div className="header-active-in"></div>
        </div>

        <Link className="tl-header-div2" to="/trending">
          <h1> Trending </h1>
        </Link>
        <div className="tl-header-filter">
          <div className="tl-header-filter-in">
            <img
              src="https://cdn.discordapp.com/attachments/812025565615882270/1168379201146077205/recurring-appointment-xxl.png?ex=65518cec&is=653f17ec&hm=5bb554d4e8f281a9ca4e2e554ab14d50d1c55cc82413fef5a1372af880dd7a07&"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mobile-tl-header">
        <div className="mobile-tl-header-header">
          <div
            className="mobile-tl-header-header-foto"
            onClick={props.toggleMobileLateral}
          >
            <img src={userImageUrl} alt="" />
          </div>
          <div className="mobile-tl-header-header-logo">
            <img
              src="https://cdn.discordapp.com/attachments/871728576972615680/1142352433352294482/asa.png?ex=654f269b&is=653cb19b&hm=af9c35f1c5ffd63779b899ceacaf64ce99f8e2d2d255f8f3d08b0808e4f430c4&"
              alt=""
            />
          </div>
          <div
            className="mobile-tl-header-header-config"
            onClick={props.carregatml}
          >
            <img
              src="https://cdn.discordapp.com/attachments/871728576972615680/1167909847866560643/settings-17-xxl.png?ex=654fd7ce&is=653d62ce&hm=f0fda7a77e21a3e137d47b2556d96ff236cdbbbab707e8042f010a3a4c980a17&"
              alt=""
            />
          </div>
        </div>
        <div className="mobile-tl-header-down">
          <div className="mobile-tl-header-div1 active-mobile-role">
            <h1>Para você</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
