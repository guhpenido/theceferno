import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../services/firebaseConfig";

function Pesquisa() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [postsUsuario, setPostsUsuario] = useState([]);
  const [postsMencionamUsuario, setPostsMencionamUsuario] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const termoPesquisaLowerCase = termoPesquisa ? termoPesquisa.toLowerCase() : '';

    if (termoPesquisa) {
      // Pesquisa por usuários
      const usuariosCollection = collection(db, "users");
      const usuariosQuery = query(usuariosCollection);
      getDocs(usuariosQuery).then((snapshot) => {
        const resultadosUsuarios = [];
        snapshot.forEach((doc) => {
          const usuario = doc.data();
          if (
            usuario.nome.toLowerCase().includes(termoPesquisaLowerCase) ||
            usuario.usuario.toLowerCase().includes(termoPesquisaLowerCase)
          ) {
            resultadosUsuarios.push(usuario);
          }
        });
        setUsuarios(resultadosUsuarios);

        // Obter os IDs dos usuários que correspondem ao termo de pesquisa
        const idsUsuarios = resultadosUsuarios.map((usuario) => usuario.id);

        // Pesquisa por posts do usuário
        const postsUsuarioPromises = idsUsuarios.map((id) => {
          const timelineCollection = collection(db, "timeline");
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

        // Aguardar todas as consultas de posts do usuário e consolidar os resultados
        Promise.all(postsUsuarioPromises).then((resultados) => {
          const postsUsuario = resultados.flat();
          setPostsUsuario(postsUsuario);
        });

        // Pesquisa por posts que mencionam o usuário
        const timelineCollection = collection(db, "timeline");
        const postsMencionamUsuarioQuery = query(
          timelineCollection,
          where("userMentioned", "array-contains-any", idsUsuarios)
        );

        getDocs(postsMencionamUsuarioQuery).then((snapshot) => {
          const resultadosPostsMencionamUsuario = [];
          snapshot.forEach((doc) => {
            const post = doc.data();
            resultadosPostsMencionamUsuario.push(post);
          });
          setPostsMencionamUsuario(resultadosPostsMencionamUsuario);
        });
      });
    } else {
      setUsuarios([]);
      setPostsUsuario([]);
      setPostsMencionamUsuario([]);
    }
  }, [termoPesquisa]);

  return (
    <div>
      <input
        type="text"
        placeholder="Digite um termo de pesquisa"
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
      />

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
          <li key={post.id}>{post.conteudo}</li>
        ))}
      </ul>

      <h3>Posts que mencionam o Usuário:</h3>
      <ul>
        {postsMencionamUsuario.map((post) => (
          <li key={post.id}>{post.conteudo}</li>
        ))}
      </ul>
    </div>
  );
}

export default Pesquisa;
