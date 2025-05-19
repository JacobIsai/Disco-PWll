import React, { useState, useEffect } from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faComments, 
  faPen, 
  faSignOutAlt, 
  faCog, 
  faHeadphones,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { db, collection, getDocs } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import defaultProfileImage from '../../assets/default.jpg';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const fetchPostsWithUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersMap = {};
        
        usersSnapshot.forEach(userDoc => {
          usersMap[userDoc.id] = {
            username: userDoc.data().username || userDoc.data().name,
            profileImage: userDoc.data().profileImage || null
          };
        });

        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const processedPosts = postsSnapshot.docs.map(doc => {
          const postData = doc.data();
          return {
            id: doc.id,
            ...postData,
            username: usersMap[postData.uid]?.username || 'Usuario',
            userProfileImage: usersMap[postData.uid]?.profileImage
          };
        }).sort((a, b) => b.date - a.date);

        setPosts(processedPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
      }
    };

    fetchPostsWithUsers();
  }, []);

  return (
    <div className="home-container">
      {/* Sidebar */}
      <nav className="home-sidebar">
        <h2 className="home-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul>
          <li><a href="/home" className="home-nav-link"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li><a href="/perfil" className="home-nav-link"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li><a href="/mensajes" className="home-nav-link"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li><a href="/new-post" className="home-nav-link"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
          <li>
            <a href="#" className="home-nav-link" onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Salir</span>
            </a>
          </li>
          <li><a href="/configuration" className="home-nav-link"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="home-main">
        <h1 className="home-page-title">Disco</h1>

        {/* Search Section */}
        <div className="home-search-section">
          <div className="home-search-box">
            <input type="text" placeholder="Buscar..." />
            <button><FontAwesomeIcon icon={faSearch} /></button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="home-posts-section">
          <h2>Publicaciones</h2>

          {posts.length > 0 ? (
            posts.map((post) => (
              <Link 
    to={`/post/${post.id}`} 
    state={{ post }} 
    key={post.id} 
    className="home-post-link"
  >
    <div className={`home-post ${(post.image || post.video) ? 'has-media' : ''}`}>
      <img 
        src={post.userProfileImage || defaultProfileImage}
        className="home-profile-pic" 
        alt="Perfil" 
      />
      <div className="home-post-content">
        <p><strong>{post.username || 'Usuario'}:</strong> {post.text}</p>
        {post.image && (
          <img 
            src={post.image} 
            className="home-post-image" 
            alt="Publicación" 
            loading="lazy" // Mejora el rendimiento
          />
        )}
        {post.video && (
          <video 
            src={post.video} 
            className="home-post-video" 
            controls 
            preload="metadata" // Mejora el rendimiento
          />
        )}
      </div>
    </div>
  </Link>
            ))
          ) : (
            <p>No hay publicaciones disponibles.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;