import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faComments, 
  faPen, 
  faCog, 
  faHeadphones, 
  faPaperPlane,
  faClock,
  faEnvelope,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import defaultProfileImage from '../../assets/default.jpg';
import './verpublicacion.css';

const Avatar = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src || defaultProfileImage);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(defaultProfileImage)}
      loading="lazy"
    />
  );
};

const PostDetail = () => {
  const { state } = useLocation();
  const { post } = state || {};
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(post?.likes || []);
  const [isLiked, setIsLiked] = useState(false);

  // Obtener usuario actual
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = {
              uid: user.uid,
              name: userDoc.data().username || user.displayName || "Usuario",
              avatar: userDoc.data().profileImage || defaultProfileImage,
              email: user.email
            };
            setCurrentUser(userData);
            
            if (post?.id && post.likes?.includes(user.uid)) {
              setIsLiked(true);
            }
          }
        }
      } catch (err) {
        setError("Error al cargar usuario");
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [post?.id, post?.likes]);

  // Obtener comentarios en tiempo real
  useEffect(() => {
    if (!post?.id) return;

    const q = query(
      collection(db, "comments"), 
      where("postId", "==", post.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        userAvatar: doc.data().userAvatar || defaultProfileImage
      }));
      setComments(commentsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => unsubscribe();
  }, [post?.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert("Escribe un comentario primero");
      return;
    }

    if (!currentUser) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    try {
      await addDoc(collection(db, "comments"), {
        postId: post.id,
        userId: currentUser.uid,
        text: newComment,
        username: currentUser.name,
        userAvatar: currentUser.avatar,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error al publicar comentario:", error);
      alert("Ocurrió un error al publicar tu comentario");
    }
  };

  const handleLike = async () => {
    if (!currentUser || !post?.id) return;
    
    try {
      const postRef = doc(db, "posts", post.id);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setLikes(likes.filter(uid => uid !== currentUser.uid));
        setIsLiked(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setLikes([...likes, currentUser.uid]);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error al actualizar likes:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "Ahora mismo";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Cargando publicación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="pd-retry-btn">
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <div className="pd-container">
      {/* Sidebar izquierdo */}
      <nav className="pd-sidebar">
        <h2 className="pd-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul className="pd-nav-list">
          <li className="pd-nav-item">
            <a href="/home" className="pd-nav-link">
              <FontAwesomeIcon icon={faHome} /> <span>Inicio</span>
            </a>
          </li>
          <li className="pd-nav-item">
            <a href="/perfil" className="pd-nav-link">
              <FontAwesomeIcon icon={faUser} /> <span>Perfil</span>
            </a>
          </li>
          <li className="pd-nav-item">
            <a href="/mensajes" className="pd-nav-link">
              <FontAwesomeIcon icon={faComments} /> <span>Mensajes</span>
            </a>
          </li>
          <li className="pd-nav-item">
            <a href="/new-post" className="pd-nav-link">
              <FontAwesomeIcon icon={faPen} /> <span>Crear</span>
            </a>
          </li>
          <li className="pd-nav-item">
            <a href="/configuration" className="pd-nav-link">
              <FontAwesomeIcon icon={faCog} /> <span>Configuración</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main className="pd-main-content">
        {/* Encabezado del post */}
        <div className="pd-post-header">
          <Avatar 
            src={post?.userProfileImage} 
            alt="Autor" 
            className="pd-author-avatar"
          />
          <div className="pd-post-info">
            <h2 className="pd-post-title">@{post?.username || 'usuario'}</h2>
            <p className="pd-author-name">{post?.text || 'Publicación'}</p>
            {post?.createdAt && (
              <p className="pd-post-date">
                <FontAwesomeIcon icon={faClock} /> {formatDate(post.createdAt)}
              </p>
            )}
          </div>
        </div>

        <div className="pd-separator"></div>

        {/* Contenido del post */}
        <div className="pd-post-content">
          {post?.image && (
            <img 
              src={post.image} 
              alt="Publicación" 
              className="pd-post-media" 
              loading="lazy"
            />
          )}
          {post?.video && (
            <video controls className="pd-post-media">
              <source src={post.video} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Acciones del post */}
        <div className="pd-post-actions">
          <button 
            onClick={handleLike}
            className={`pd-like-btn ${isLiked ? 'liked' : ''}`}
          >
            <FontAwesomeIcon icon={faHeart} /> {likes.length || 0}
          </button>
        </div>

        <div className="pd-separator"></div>

        {/* Sección de comentarios */}
        <div className="pd-comments-section">
          <h3 className="pd-comments-title">
            Comentarios <span className="pd-comments-count">({comments.length})</span>
          </h3>
          
          {/* Lista de comentarios */}
          <div className="pd-comments-list">
            {comments.length === 0 ? (
              <p className="pd-no-comments">Sé el primero en comentar</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="pd-comment">
                  <Avatar 
                    src={comment.userAvatar} 
                    alt={comment.username} 
                    className="pd-comment-avatar"
                  />
                  <div className="pd-comment-content">
                    <div className="pd-comment-header">
                      <p className="pd-comment-author">@{comment.username}</p>
                      <p className="pd-comment-time">
                        <FontAwesomeIcon icon={faClock} /> {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="pd-comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulario para nuevo comentario */}
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="pd-new-comment">
              <Avatar 
                src={currentUser.avatar} 
                alt="Tu perfil" 
                className="pd-comment-avatar"
              />
              <div className="pd-comment-form">
                <textarea 
                  placeholder="Escribe un comentario..." 
                  className="pd-comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit" className="pd-comment-submit">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          ) : (
            <div className="pd-login-to-comment">
              <a href="/login">Inicia sesión</a> para dejar un comentario
            </div>
          )}
        </div>
      </main>

      {/* Sidebar derecho */}
      <aside className="pd-user-sidebar">
        {currentUser && (
          <div className="pd-user-profile">
            <Avatar 
              src={currentUser.avatar} 
              alt={`Perfil de ${currentUser.name}`} 
              className="pd-user-avatar"
            />
            <h3 className="pd-user-name">{currentUser.name}</h3>
            <p className="pd-user-email">
              <FontAwesomeIcon icon={faEnvelope} /> {currentUser.email}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default PostDetail;