import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/fontawesome-free-solid";
import { faComment } from "@fortawesome/fontawesome-free-solid";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { faShare } from "@fortawesome/fontawesome-free-solid";
import { faThumbsDown as regularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as solidThumbsDown } from "@fortawesome/fontawesome-free-solid";
import { faCaretDown } from "@fortawesome/fontawesome-free-solid";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/fontawesome-free-solid";
import { faFire } from "@fortawesome/fontawesome-free-solid";
//import { faCircleCheck } from "@fortawesome/fontawesome-free-solid";
//import { faMagnifyingGlassArrowRight } from "@fortawesome/fontawesome-free-solid";
import { faBell } from "@fortawesome/fontawesome-free-solid";
import { faQuestion } from "@fortawesome/fontawesome-free-solid";
import { faPaperPlane } from "@fortawesome/fontawesome-free-solid";
//import { faXmark } from "@fortawesome/fontawesome-free-solid";
import { app } from "../../services/firebaseConfig";
import { getFirestore, startAfter } from "firebase/firestore";
//import { getStorage, ref, getDownloadURL } from "firebase/storage";
import homeIcon from "../../assets/home-icon.svg";
import dmIcon from "../../assets/dm-icon.svg";
import notificacaoIcon from "../../assets/notificacao-icon.svg";
import pesquisaIcon from "../../assets/pesquisa-icon.svg";
import {
  getDatabase,
  ref,
  orderByKey,
  limitToLast,
  onChildAdded,
} from "firebase/database";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import likeIcon from "../../assets/thumbs-up-regular.svg";

import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  where,
  query,
  orderBy,
  updateDoc,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { addDoc } from "firebase/firestore";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  differenceInDays,
} from "date-fns";
import ReplyDisplay from "./reply";
import VisitorPage from "../Perfil/ProfilePage/VisitorPage";
import { AppRoutes } from "../../routes/AppRoutes";
import Denuncia from "../Denuncia/Denuncia";
import toast, { Toaster } from "react-hot-toast";

function PostDisplay({
  post,
  userSentData,
  userMentionedData,
  userId,
  userLoggedData,
}) {
  const [liked, setLiked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [disliked, setDisliked] = useState(false); // Estado para controlar se o usuário curtiu o post
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.deslikes);
  const [saveIcon, setSaveIcon] = useState("regular");
  const [likeIcon, setLikeIcon] = useState("regular");
  const [dislikeIcon, setDislikeIcon] = useState("regular");
  const [isBeatingL, setIsBeatingL] = useState(false);
  const [isBeatingD, setIsBeatingD] = useState(false);
  const [isBeatingB, setIsBeatingB] = useState(false);
  const [denunciaIsOpen, setDenunciaIsOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    deslikes: post.deslikes,
    likes: post.likes,
    mode: post.mode,
    postId: post.id,
    text: post.text,
    time: post.time,
    userMentioned: post.userMentioned,
    userSent: post.userSent,
  });
  const iconToUse = saveIcon === "solid" ? solidBookmark : regularBookmark;
  const likeToUse = likeIcon === "solid" ? solidThumbsUp : regularThumbsUp;
  const dislikeToUse =
    dislikeIcon === "solid" ? solidThumbsDown : regularThumbsDown;
  const postDate = new Date(post.time);
  const now = new Date();
  let timeAgo;
  const db = getFirestore(app);

  const openDenuncia = () => {
    setDenunciaIsOpen(true);
    setOptionsOpen(false); // Fechar as opções quando abrir a denúncia
  };

  const toggleOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleIconClickB = () => {
    setIsBeatingB(!isBeatingB);
    setTimeout(() => {
      setIsBeatingB(false);
    }, 1000);
  };

  const handleIconClickD = () => {
    setIsBeatingD(!isBeatingD);
    setTimeout(() => {
      setIsBeatingD(false);
    }, 1000);
  };

  const handleIconClickL = () => {
    setIsBeatingL(!isBeatingL);
    setTimeout(() => {
      setIsBeatingL(false);
    }, 1000);
  };

  useEffect(() => {
    if (liked) {
      setLikeIcon("solid");
    } else setLikeIcon("regular");
  }, [liked]);

  useEffect(() => {
    if (disliked) {
      setDislikeIcon("solid");
    } else setDislikeIcon("regular");
  }, [disliked]);

  useEffect(() => {
    const fetchData = async () => {
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", post.id),
        where("interaction", "==", "like")
      );

      const querySnapshot = await getDocs(queryInteraction);

      if (!querySnapshot.empty) {
        setLikeIcon("solid");
      }
    };
    fetchData();
  }, [userLoggedData, post]);

  useEffect(() => {
    const fetchData = async () => {
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", post.id),
        where("interaction", "==", "dislike")
      );

      const querySnapshot = await getDocs(queryInteraction);
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        setDislikeIcon("solid");
      }
    };
    fetchData();
  }, [userLoggedData, post]);

  useEffect(() => {
    if (
      userLoggedData &&
      userLoggedData.savedPosts &&
      userLoggedData.savedPosts.includes(post.id)
    ) {
      setSaveIcon("solid");
    }
  }, [userLoggedData, post]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Verificar se o usuário já curtiu a postagem na coleção "interactions"
    const userAlreadyLiked = await checkUserInteraction(userId, post.id);

    if (!userAlreadyLiked) {
      // Incrementar o número de likes localmente
      const newLikes = likes + 1;
      setLikes(newLikes);

      // Atualizar o número de likes no Firebase na coleção "timeline"
      const db = getFirestore(app);
      const q = query(
        collection(db, "timeline"),
        where("postId", "==", post.postId)
      );

      try {
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);

        if (!querySnapshot.empty) {
          const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

          // Atualizar o campo "likes" no documento
          await updateDoc(doc(db, "timeline", postDoc.id), { likes: newLikes });
          console.log("Likes atualizados no Firebase com sucesso!");

          // Adicionar a interação na coleção "interactions"
          await addInteraction(userId, post.id, "like");
          setLiked(true);
          setLikeIcon("solid");
        } else {
          console.error("Post não encontrado no Firebase.");
          // Reverter a contagem local de likes em caso de erro
          setLikes(likes);
        }
      } catch (error) {
        console.error("Erro ao atualizar likes no Firebase: ", error);
        // Reverter a contagem local de likes em caso de erro
        setLikes(likes);
      }
    } else {
      // Remover a interação da coleção "interactions"
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", post.id),
        where("interaction", "==", "like")
      );

      try {
        const querySnapshotInteraction = await getDocs(queryInteraction);

        if (!querySnapshotInteraction.empty) {
          const interactionDoc = querySnapshotInteraction.docs[0];
          await deleteDoc(interactionDoc.ref);
          console.log("Like removido com sucesso!");
          setLiked(false);
          setLikeIcon("regular");
          // Decrementar o número de likes na coleção "timeline"
          const newLikes = likes - 1;
          setLikes(newLikes);
          const qTimeline = query(
            collection(db, "timeline"),
            where("postId", "==", post.id)
          );
          const querySnapshotTimeline = await getDocs(qTimeline);

          if (!querySnapshotTimeline.empty) {
            const postDocTimeline = querySnapshotTimeline.docs[0];
            await updateDoc(doc(db, "timeline", postDocTimeline.id), {
              likes: newLikes,
            });
            console.log("Likes atualizados no Firebase com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao remover like: ", error);
      }
    }
  };

  // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
  const checkUserInteraction = async (userId, postId) => {
    try {
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", postId),
        where("interaction", "==", "like")
      );

      const querySnapshot = await getDocs(queryInteraction);

      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar interação: ", error);
      return false;
    }
  };

  // Função para adicionar a interação na coleção "interactions"
  const addInteraction = async (userId, postId, interactionType) => {
    try {
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const newInteraction = {
        userId,
        postId,
        interaction: interactionType,
      };

      await addDoc(interactionsRef, newInteraction);
      console.log("Interação registrada com sucesso.");
    } catch (error) {
      console.error("Erro ao registrar interação: ", error);
    }
  };

  const handleDislikeClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Verificar se o usuário já curtiu a postagem na coleção "interactions"
    const userAlreadyDisliked = await checkUserDislikeInteraction(
      userId,
      post.id
    );

    if (!userAlreadyDisliked) {
      // Incrementar o número de likes localmente
      const newDislikes = dislikes + 1;
      setDislikes(newDislikes);

      // Atualizar o número de likes no Firebase na coleção "timeline"
      const db = getFirestore(app);
      const q = query(
        collection(db, "timeline"),
        where("postId", "==", post.postId)
      );

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const postDoc = querySnapshot.docs[0]; // Supondo que haja apenas um documento correspondente

          // Atualizar o campo "likes" no documento
          await updateDoc(doc(db, "timeline", postDoc.id), {
            deslikes: newDislikes,
          });
          console.log("Likes atualizados no Firebase com sucesso!");

          // Adicionar a interação na coleção "interactions"
          await addInteraction(userId, post.id, "dislike");
          setDisliked(true);
          setDislikeIcon("solid");
        } else {
          console.error("Dislike não encontrado no Firebase.");
          // Reverter a contagem local de likes em caso de erro
          setDislikes(dislikes);
        }
      } catch (error) {
        console.error("Erro ao atualizar Dislikes no Firebase: ", error);
        // Reverter a contagem local de likes em caso de erro
        setDislikes(dislikes);
      }
    } else {
      // Remover a interação da coleção "interactions"
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", post.id),
        where("interaction", "==", "dislike")
      );

      try {
        const querySnapshotInteraction = await getDocs(queryInteraction);

        if (!querySnapshotInteraction.empty) {
          const interactionDoc = querySnapshotInteraction.docs[0];
          await deleteDoc(interactionDoc.ref);
          console.log("Dislikes removido com sucesso!");
          setDisliked(false);
          setDislikeIcon("regular");
          // Decrementar o número de likes na coleção "timeline"
          const newDislikes = dislikes - 1;
          setDislikes(newDislikes);
          const qTimeline = query(
            collection(db, "timeline"),
            where("postId", "==", post.id)
          );
          const querySnapshotTimeline = await getDocs(qTimeline);

          if (!querySnapshotTimeline.empty) {
            const postDocTimeline = querySnapshotTimeline.docs[0];
            await updateDoc(doc(db, "timeline", postDocTimeline.id), {
              deslikes: newDislikes,
            });
            console.log("Dislikes atualizados no Firebase com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao remover Dislikes: ", error);
      }
    }
  };

  // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
  const checkUserDislikeInteraction = async (userId, postId) => {
    try {
      const db = getFirestore(app);
      const interactionsRef = collection(db, "interactions");
      const queryInteraction = query(
        interactionsRef,
        where("userId", "==", userId),
        where("postId", "==", postId),
        where("interaction", "==", "dislike")
      );

      const querySnapshot = await getDocs(queryInteraction);

      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar interação: ", error);
      return false;
    }
  };

  // Calcule a diferença em segundos entre as datas
  const secondsAgo = Math.floor((now - postDate) / 1000);

  if (secondsAgo < 60) {
    timeAgo = `${secondsAgo} segundo${secondsAgo !== 1 ? "s" : ""} atrás`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    timeAgo = `${minutesAgo} minuto${minutesAgo !== 1 ? "s" : ""} atrás`;
  } else if (isToday(postDate)) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    timeAgo = `${hoursAgo} hora${hoursAgo !== 1 ? "s" : ""} atrás`;
  } else if (isYesterday(postDate)) {
    timeAgo = "Ontem";
  } else {
    const daysAgo = differenceInDays(now, postDate);
    timeAgo = `${daysAgo} dia${daysAgo !== 1 ? "s" : ""} atrás`;
  }
  let imageSent = null;
  let nomeEnvio = null;
  let userEnvio = null;
  let userEnvioId = null;
  if (post.mode == "anon") {
    imageSent =
      "https://i.postimg.cc/bY5TG9Xv/logo-Livre2.png";
    nomeEnvio = userSentData.pseudonimo;
    userEnvio = "ceferno 😈";
  } else {
    nomeEnvio = userSentData.nome;
    imageSent = userSentData.imageUrl;
    userEnvio = userSentData.usuario;
    userEnvioId = userSentData.id;
  }

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // Estado para rastrear a exibição do post em detalhes
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    const fetchReplyCount = async () => {
      const count = await countRepliesWithMessageReplyed(post.id);
      setReplyCount(count);
    };

    fetchReplyCount();
  }, [post.id]);

  // Função para buscar e definir as respostas do post
  const fetchReplies = async () => {
    const db = getFirestore(app);
    const repliesQuery = query(
      collection(db, "replys"),
      where("messageReplyed", "==", post.id)
    );
    const repliesSnapshot = await getDocs(repliesQuery);
    const repliesData = [];

    repliesSnapshot.forEach((doc) => {
      repliesData.push({ id: doc.id, ...doc.data() });
    });

    setReplies(repliesData);
  };

  // UseEffect para buscar as respostas quando showReplies mudar
  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies]);

  const toggleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleSavePost = async (e, postId) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      // Obtém o usuário atualmente autenticado
      const user = userId;
      console.log(user);
      if (user) {
        // Obtém a referência do documento do usuário no banco de dados
        const userDocRef = doc(db, "users", user);

        // Obtém o documento do usuário
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        // Verifica se o savedPosts existe no documento do usuário
        if (userData.savedPosts) {
          // Verifica se o postId já existe no array savedPosts
          if (userData.savedPosts.includes(postId)) {
            // Cria um novo array com o postId removido
            const updatedSavedPosts = userData.savedPosts.filter(
              (savedPost) => savedPost !== postId
            );

            // Atualiza o documento do usuário com o novo array savedPosts
            await updateDoc(userDocRef, {
              savedPosts: updatedSavedPosts,
            });

            setSaveIcon("regular");

            console.log("Post removido dos salvos com sucesso!");
          } else {
            // Caso contrário, o postId não está no array, então o adicionamos
            const updatedSavedPosts = [...userData.savedPosts, postId];

            // Atualiza o documento do usuário com o novo array savedPosts
            await updateDoc(userDocRef, {
              savedPosts: updatedSavedPosts,
            });

            setSaveIcon("solid");

            console.log("Post salvo com sucesso!");
          }
        } else {
          // Se savedPosts não existe, cria um novo array com o postId
          await updateDoc(userDocRef, {
            savedPosts: [postId],
          });

          console.log("Post salvo com sucesso!");
        }
      } else {
        console.log("Usuário não autenticado.");
      }
    } catch (error) {
      console.error("Erro ao salvar o post: ", error);
    }
  };

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };
  // Função para verificar se o usuário já interagiu com a postagem na coleção "interactions"
  // const checkUserDislikeInteraction = async (userId, postId) => {
  //   try {
  //     const db = getFirestore(app);
  //     const interactionsRef = collection(db, "interactions");
  //     const queryInteraction = query(
  //       interactionsRef,
  //       where("userId", "==", userId),
  //       where("postId", "==", postId),
  //       where("interaction", "==", "dislike")
  //     );

  //     const querySnapshot = await getDocs(queryInteraction);

  //     return !querySnapshot.empty;
  //   } catch (error) {
  //     console.error("Erro ao verificar interação de deslike: ", error);
  //     return false;
  //   }
  // };

  // // Função para adicionar ou remover a interação de deslike na coleção "interactions"
  // const addOrRemoveDislikeInteraction = async (
  //   userId,
  //   postId,
  //   interactionType
  // ) => {
  //   const db = getFirestore(app);
  //   const interactionsRef = collection(db, "interactions");

  //   // Verificar se o usuário já interagiu com a postagem
  //   const existingDislikeInteraction = await checkUserDislikeInteraction(
  //     userId,
  //     postId
  //   );

  //   if (existingDislikeInteraction) {
  //     // Se já houver uma interação de deslike, remova-a
  //     const queryRemoveInteraction = query(
  //       interactionsRef,
  //       where("userId", "==", userId),
  //       where("postId", "==", postId),
  //       where("interaction", "==", interactionType)
  //     );

  //     const querySnapshotRemove = await getDocs(queryRemoveInteraction);

  //     if (!querySnapshotRemove.empty) {
  //       const interactionDoc = querySnapshotRemove.docs[0];
  //       setDislikes(dislikes - 1);
  //       await deleteDoc(interactionDoc.ref);

  //       console.log(`Deslike removido com sucesso!`);
  //     }
  //   } else {
  //     // Se o usuário ainda não interagiu com a postagem, adicione a interação de deslike
  //     const newInteraction = {
  //       userId,
  //       postId,
  //       interaction: interactionType,
  //     };

  //     await addDoc(interactionsRef, newInteraction);
  //     console.log(`Deslike registrado com sucesso!`);
  //     setDisliked(true);
  //     setDislikeIcon('solid');
  //   }
  // };

  // // Função para adicionar a interação de deslike na coleção "interactions"
  // const addDislikeInteraction = async (userId, postId) => {
  //   addOrRemoveDislikeInteraction(userId, postId, "dislike");
  // };

  // Função para lidar com o clique em "deslike"
  // const handleDislikeClick = async (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   // Verificar se o usuário já interagiu com a postagem na coleção "interactions"
  //   const userAlreadyDisliked = await checkUserDislikeInteraction(
  //     userId,
  //     post.id
  //   );

  //   if (!userAlreadyDisliked) {
  //     // Atualizar o número de deslikes localmente
  //     const newDislikes = dislikes + 1;
  //     setDislikes(newDislikes);

  //     // Adicionar a interação de deslike na coleção "interactions"
  //     addDislikeInteraction(userId, post.id);
  //   } else {
  //     // Remover a interação de deslike da coleção "interactions"
  //     const db = getFirestore(app);
  //     const interactionsRef = collection(db, "interactions");
  //     const queryInteraction = query(
  //       interactionsRef,
  //       where("userId", "==", userId),
  //       where("postId", "==", post.id),
  //       where("interaction", "==", "dislike")
  //     );

  //     try {
  //       const querySnapshotInteraction = await getDocs(queryInteraction);

  //       if (!querySnapshotInteraction.empty) {
  //         const interactionDoc = querySnapshotInteraction.docs[0];
  //         await deleteDoc(interactionDoc.ref);
  //         console.log("Deslike removido com sucesso!");
  //         const newDislikes = dislikes - 1;
  //         setDislikes(newDislikes);
  //         console.log("Deslike removido com sucessoaaa!");
  //         setDisliked(false);
  //         setDislikeIcon('regular');
  //       }
  //     } catch (error) {
  //       console.error("Erro ao remover deslike: ", error);
  //     }
  //   }
  // };
  // async function countRepliesWithMessageReplyed(postId) {
  //   const db = getFirestore(app);
  //   const repliesCollectionRef = collection(db, "replys");
  //   const queryRef = query(
  //     repliesCollectionRef,
  //     where("messageReplyed", "==", postId)
  //   );

  //   try {
  //     const querySnapshot = await getDocs(queryRef);
  //     const replyCount = querySnapshot.size;
  //     return replyCount;
  //   } catch (error) {
  //     console.error("Erro ao contar as respostas:", error);
  //     return 0; // Retorna 0 em caso de erro
  //   }
  // }

  const deletePost = async () => {
    try {
      // Obter referência do documento na coleção "timeline"
      const timelineDocRef = collection(db, "timeline");
      const queryInteraction = query(
        timelineDocRef,
        where("postId", "==", post.id)
      );
      const querySnapshotRemove = await getDocs(queryInteraction);

      if (!querySnapshotRemove.empty) {
        const interactionDoc = querySnapshotRemove.docs[0];
        await deleteDoc(interactionDoc.ref);

        console.log(`Deslike removido com sucesso!`);
      }

      const postsexcluidosCollectionRef = collection(db, "postsexcluidos");
      await addDoc(postsexcluidosCollectionRef, newPost);

      console.log("Post excluído e adicionado aos postsexcluidos com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir e adicionar post:", error);
    }
    setOptionsOpen(false);
  };

  const notiPostExcluido = () =>
    toast.success("O Post será excluído com sucesso !", {
      duration: 7000,

      iconTheme: {
        primary: "#4763E4",
        secondary: "#fff",
      },
    });

  const excluiENotifica = (event) => {
    notiPostExcluido();
    setTimeout(() => {
      deletePost();
      reaload();
    }, 3000);

    const reaload = () => {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <>
      <div className="tl-box" key={post.postId}>
        <div className="tl-post">
          <FontAwesomeIcon
            className="iconeDenuncia"
            onClick={toggleOptions}
            icon={faEllipsisVertical}
          />
          {optionsOpen && (
            <div className="options-menu-post">
              {post.userSent === userId && (
                <div className="option-post" onClick={excluiENotifica}>
                  Excluir Post
                  <Toaster position="top-center" reverseOrder={false} />
                </div>
              )}
              <div className="option-post" onClick={openDenuncia}>
                Denunciar Post
              </div>
              <div
                className="option-post"
                onClick={() => setOptionsOpen(false)}
              >
                Fechar
              </div>
            </div>
          )}
          {denunciaIsOpen && (
            <Denuncia
              postId={post.id}
              userId={userId}
              userSentData={userSentData}
            />
          )}
          <Link
            style={linkStyle}
            state={{
              userSentData: userSentData,
              userMentionedData: userMentionedData,
              userLoggedData: userLoggedData,
            }}
            to={`/timeline/${post.postId}`}
          >
            <div className="tl-ps-header">
              {post.mode !== "anon" ? (
                <Link
                  to={`/VisitorPage/${userSentData.id}`}
                  style={{ color: "white" }}
                >
                  <div className="tl-ps-foto">
                    {imageSent && <img src={imageSent} alt="" />}
                  </div>
                </Link>
              ) : (
                <div className="tl-ps-foto">
                  {imageSent && <img src={imageSent} alt="" />}
                </div>
              )}

              {post.userMentioned !== "" ? (
                <div className="tl-ps-nomes">
                  <p className="tl-ps-nome">
                    {nomeEnvio}{" "}
                    <span className="tl-ps-user">@{userEnvio} </span>
                    <span className="tl-ps-tempo">• {timeAgo}</span>
                    <FontAwesomeIcon className="arrow" icon={faArrowRight} />
                    {userMentionedData && (
                      <img src={userMentionedData.imageUrl} alt="" />
                    )}
                    {userMentionedData && (
                      <>
                        {" "}
                        {userMentionedData.nome}{" "}
                        <span className="tl-ps-userReceived">
                          @{userMentionedData.usuario}{" "}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div className="tl-ps-nomes">
                  <Link to={`/VisitorPage/${userEnvioId}`}>
                    <p className="tl-ps-nome">
                      {nomeEnvio}{" "}
                      <span className="tl-ps-user">@{userEnvio} </span>
                      <span className="tl-ps-tempo">• {timeAgo}</span>
                    </p>
                  </Link>
                </div>
              )}
            </div>
            <div className="tl-ps-texto">
              <p>{post.text}</p>
            </div>
            <div className="tl-ps-footer">
              <div className="tl-ps-opcoes">
                <div className="tl-ps-reply">
                  <FontAwesomeIcon icon={faComment} onClick={toggleReply} />
                  <span> {replyCount}</span>
                </div>
                <div
                  className="tl-ps-like"
                  onClick={(e) => {
                    handleLikeClick(e);
                    handleIconClickL();
                  }}
                >
                  <FontAwesomeIcon icon={likeToUse} beat={isBeatingL} />{" "}
                  <span>{likes}</span>
                </div>
                <div
                  className="tl-ps-deslike"
                  onClick={(e) => {
                    handleDislikeClick(e);
                    handleIconClickD();
                  }}
                >
                  <FontAwesomeIcon icon={dislikeToUse} beat={isBeatingD} />{" "}
                  <span>{dislikes}</span>
                </div>
                <div
                  className="tl-ps-salvar"
                  onClick={(e) => {
                    handleSavePost(e, post.postId);
                    handleIconClickB();
                  }}
                >
                  <FontAwesomeIcon icon={iconToUse} beat={isBeatingB} />{" "}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PostDisplay;
