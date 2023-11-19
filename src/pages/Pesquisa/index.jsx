import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../services/firebaseConfig";
import { Link } from "react-router-dom";
import "./estilosPesquisa.css"

function Pesquisa() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [postsUsuario, setPostsUsuario] = useState([]);
  const [postsMencionamUsuario, setPostsMencionamUsuario] = useState([]);
  const db = getFirestore(app);

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
      } else {
        setUsuarios([]);
        setPostsUsuario([]);
        setPostsMencionamUsuario([]);
      }
    };

    fetchData();
  }, [termoPesquisa, db]);

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
                    placeholder="Procurar"
                    type="text"
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tl-ladoDireito-boxProcura">
              
            </div>
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

      <h2>Resultados da pesquisa:</h2>

      <h3>Perfis de Usuários:</h3>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            Nome: {usuario.nome}, User: {usuario.usuario}
          </li>
        ))}
      </ul>

      <h3>Posts do Usuário:</h3>
      <ul>
        {postsUsuario.map((post) => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>

      <h3>Posts que mencionam o Usuário:</h3>
      <ul>
        {postsMencionamUsuario.map((post) => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default Pesquisa;
