import React, { useState, useEffect } from 'react';
import './perfil.css';
import { db, collection, query, where, getDocs } from '../../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/default.jpg'; // Asegúrate de tener esta imagen

const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Obtener datos del usuario
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('uid', '==', user.uid));
          const userSnapshot = await getDocs(userQuery);
  
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            setUserData({
              username: userDoc.data().username,
              profileImage: userDoc.data().profileImage || defaultProfileImage,
              bio: userDoc.data().bio || 'Explorador de ideas...'
            });
          }
  
          // Obtener posts del usuario
          const postsQuery = query(
            collection(db, 'posts'),
            where('uid', '==', user.uid)
          );
          const postsSnapshot = await getDocs(postsQuery);
  
          const posts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date()
          })).sort((a, b) => b.date - a.date);
  
          setUserPosts(posts);
        } catch (error) {
          console.error("Error al obtener datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-body">
      {/* Sidebar */}
      <nav className="app-sidebar">
        <h2 className="app-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul>
          <li><a href="/home"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li><a href="/perfil"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li><a href="/mensajes"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li><a href="/new-post"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
          <li><a href="/configuration"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a></li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="profile-container">
        <div className="profile-main-content">
          {/* Sección de usuario */}
          <div className="profile-user-section">
            <img 
              src={userData?.profileImage} 
              alt="Foto de perfil" 
              className="profile-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfileImage;
              }}
            />
            <h3>@{userData?.username || 'Usuario'}</h3>
            <p className="profile-bio">{userData?.bio}</p>
          </div>

          {/* Sección de publicaciones */}
          <div className="profile-posts-section">
            <h2>Tus Publicaciones</h2>
            
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post.id} className="profile-post">
                  <div className="profile-post-header">
                    <span className="profile-post-date">
                      {post.date.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="profile-post-content">
                    <p>{post.text}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        className="profile-post-image" 
                        alt="Contenido de publicación"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {post.video && (
                      <video controls className="profile-post-image">
                        <source src={post.video} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                      </video>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="profile-no-posts">No tienes publicaciones aún.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="app-footer">LEVELUP LEARNING 2024 © Todos los derechos reservados</div>
    </div>
  );
};

export default ProfilePage;