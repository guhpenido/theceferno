import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { app } from "../../services/firebaseConfig";
import { Link } from "react-router-dom";
import "./estilosPesquisa.css";
const db = getFirestore(app);
const fetchUserData = async (userId) => {
  console.log(userId);
  try {
    if (!userId) {
      console.error("Invalid userId");
      return null;
    }

    const userDocRef = doc(db, "users", userId);

    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
};

function Pesquisa() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [postsUsuario, setPostsUsuario] = useState([]);
  const [postsMencionamUsuario, setPostsMencionamUsuario] = useState([]);
  const [userDataMap, setUserDataMap] = useState({});
  const [MuserDataMap, setMUserDataMap] = useState({});
  const [inputAtivo, setInputAtivo] = useState(false);
  //const db = getFirestore(app);

  useEffect(() => {
    const fetchData = async () => {
      const termoPesquisaLowerCase = termoPesquisa
        ? termoPesquisa.toLowerCase()
        : "";

      if (termoPesquisa) {
        const usuariosCollection = collection(db, "users");
        const usuariosQuery = query(usuariosCollection);

        try {
          const snapshot = await getDocs(usuariosQuery);
          const resultadosUsuarios = [];
          snapshot.forEach((doc) => {
            const usuario = doc.data();
            if (
              (usuario.nome &&
                usuario.nome.toLowerCase().includes(termoPesquisaLowerCase)) ||
              (usuario.usuario &&
                usuario.usuario.toLowerCase().includes(termoPesquisaLowerCase))
            ) {
              resultadosUsuarios.push(usuario);
            }
          });
          setUsuarios(resultadosUsuarios);

          const idsUsuarios = resultadosUsuarios.map((usuario) => usuario.id);

          const timelineCollection = collection(db, "timeline");

          const fetchPostsUsuario = async (idsUsuarios, timelineCollection) => {
            const postsUsuarioPromises = idsUsuarios.map((id) => {
              const postsUsuarioQuery = query(
                timelineCollection,
                where("userSent", "==", id)
              );
              return getDocs(postsUsuarioQuery).then((snapshot) => {
                const resultadosPosts = [];
                snapshot.forEach((doc) => {
                  resultadosPosts.push(doc.data());
                });
                return resultadosPosts;
              });
            });

            return Promise.all(postsUsuarioPromises);
          };

          const fetchPostsMencionamUsuario = async (
            idsUsuarios,
            timelineCollection
          ) => {
            const postsMencionamUsuarioQuery = query(
              timelineCollection,
              where("userMentioned", "==", idsUsuarios[0]) // Assumindo que userMentioned é apenas um ID
            );

            const snapshot = await getDocs(postsMencionamUsuarioQuery);
            const resultadosPostsMencionamUsuario = [];

            snapshot.forEach((doc) => {
              const post = doc.data();
              resultadosPostsMencionamUsuario.push(post);
            });

            return resultadosPostsMencionamUsuario;
          };

          const resultadosPostsUsuario = await fetchPostsUsuario(
            idsUsuarios,
            timelineCollection
          );
          setPostsUsuario(resultadosPostsUsuario.flat());

          // Pesquisa por posts que mencionam o usuário
          const resultadosPostsMencionamUsuario =
            await fetchPostsMencionamUsuario(idsUsuarios, timelineCollection);
          setPostsMencionamUsuario(resultadosPostsMencionamUsuario);
        } catch (error) {
          console.error("Erro ao obter documentos:", error);
        }
        const uniqueUserIds = [
          ...new Set(postsUsuario.map((post) => post.userSent)),
        ];

        // Pré-carregar os dados do usuário uma vez
        const userDataPromises = uniqueUserIds.map((userId) =>
          fetchUserData(userId)
        );
        const userDataArray = await Promise.all(userDataPromises);

        const userDataMap = Object.fromEntries(
          userDataArray
            .filter((user) => user !== null && user !== undefined)
            .map((user) => [user.id, user])
        );

        setUserDataMap(userDataMap);

        const MuniqueUserIds = [
          ...new Set(postsMencionamUsuario.map((post) => post.userSent)),
        ];

        // Pré-carregar os dados do usuário uma vez
        const MuserDataPromises = uniqueUserIds.map((userId) =>
          fetchUserData(userId)
        );
        const MuserDataArray = await Promise.all(MuserDataPromises);

        const MuserDataMap = Object.fromEntries(
          MuserDataArray.filter(
            (user) => user !== null && user !== undefined
          ).map((user) => [user.id, user])
        );

        setMUserDataMap(MuserDataMap);
      } else {
        setUsuarios([]);
        setPostsUsuario([]);
        setPostsMencionamUsuario([]);
        setUserDataMap({});
        setMUserDataMap({});
      }
    };
    fetchData();
  }, [termoPesquisa, db, postsUsuario]);

  return (
    <div>
      <div className="tl-ladoDireito">
        <div className="tl-ladoDireito-procurar">
          <div className="procurar-box">
            <div className="img-procurar-box">
              <div className="img-procurar-box-in">
                <img
                  src="https://cdn.discordapp.com/attachments/871728576972615680/1167934652267368488/6328608.png?ex=654feee8&is=653d79e8&hm=15078133d7bcc63b14665f301890a83cf549dba37a671c8827a8c9c6e8c50c11&"
                  alt=""
                />
              </div>
            </div>
            <div className="procurar-box-input">
              <input
                id="input-pesquisa-lateral"
                placeholder="Procurar"
                type="text"
                value={termoPesquisa}
                onFocus={() => setInputAtivo(true)}
                onBlur={() => setInputAtivo(false)}
                onChange={(e) => setTermoPesquisa(e.target.value)}
              />
            </div>
          </div>
        </div>
        {inputAtivo && (
        <div className="tl-ladoDireito-boxProcura">
          <div className="tl-ladoDireito-proc-resultados">
            <h3>Perfis:</h3>
            {usuarios.map((usuario) => (
              <div className="tl-ladoDireito-proc-perfis" key={usuario.id}>
                <div className="perfis-foto">
                  <img src={usuario.imageUrl} alt="" />
                </div>
                <div className="perfis-nome">
                  <h1>{usuario.nome}</h1>
                  <h2>@{usuario.usuario}</h2>
                </div>
              </div>
            ))}
            <h3>Últimos Posts:</h3>
            {postsUsuario.slice(0, 3).map((post) => (
              <div className="tl-ladoDireito-proc-postsUser" key={post.id}>
                <div className="postUser-header">
                  <div className="postUser-header-foto">
                    <img src={userDataMap[post.userSent]?.imageUrl} alt="" />
                  </div>
                  <div className="postUser-header-nome">
                    <h1>{userDataMap[post.userSent]?.nome}</h1>
                    <h2>@{userDataMap[post.userSent]?.usuario}</h2>
                  </div>
                </div>
                <div className="postUser-body">
                  <div className="postUser-post">
                    <p>{post.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <h3>Mencionados:</h3>
            {postsMencionamUsuario.slice(0, 3).map((post) => (
            <div className="tl-ladoDireito-proc-postMentioned" key={post.id}>
              <div className="postMentioned-header">
                <div className="postMentioned-header-foto"><img src={MuserDataMap[post.userSent]?.imageUrl} alt="" /></div>
                <div className="postMentioned-header-nome">
                  <h1>{MuserDataMap[post.userSent]?.nome}</h1>
                  <h2>{MuserDataMap[post.userSent]?.nome}</h2>
                </div>
                <div className="postMentioned-header2">
                  <svg
                    className="setaUserMentioned"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                  >
                    <path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96-43 96-96l0-306.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 416c0 17.7-14.3 32-32 32l-96 0z" />
                  </svg>
                  <div className="postMentioned-header-fotoMentioned"><img src={MuserDataMap[post.userMentioned]?.imageUrl} alt="" /></div>
                  <div className="postMentioned-header-nomeMentioned">
                    <h1>{MuserDataMap[post.userMentioned]?.nome}</h1>
                    <h2>{MuserDataMap[post.userMentioned]?.usuario}</h2>
                  </div>
                </div>
              </div>
              <div className="postMentioned-body">
                <div className="postMentioned-post">
                  <p></p>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
        )}
        <div className="tl-ladoDireito-doar">
          <h1>Deseja doar para o CEFERNO?</h1>
          <p>
            O CEFERNO é um projeto estudantil, e para mantermos ele online
            precisamos das doações.
          </p>
          <Link to="https://linktr.ee/theceferno" target="_blank">
            <button>Doar</button>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Pesquisa;
