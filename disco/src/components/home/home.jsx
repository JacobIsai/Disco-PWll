import React, { useState, useEffect } from 'react';
import './home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faHeadphones } from '@fortawesome/free-solid-svg-icons';  // Añade faHeadphones
import { db, collection, getDocs } from '../../lib/firebase'; // Importamos Firestore

const Home = () => {
  const [posts, setPosts] = useState([]); // Guardamos las publicaciones en un estado
  const [users, setUsers] = useState({});

  // Obtener las publicaciones de Firebase cuando el componente se monte
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts')); // 'posts' es el nombre de la colección
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() }); // Almacenamos la ID y los datos de cada publicación
      });
      setPosts(postsArray); // Actualizamos el estado con los datos de las publicaciones
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul>
          <li><a href="/home"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li><a href="/perfil"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li><a href="/mensajes"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li><a href="/new-post"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
          <li><a href="#"><FontAwesomeIcon icon={faSignOutAlt} /> <span>Salir</span></a></li>
          <li><a href="/configuration"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="home-container">
        <h1 className="page-title">Disco</h1>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <input type="text" placeholder="Buscar..." />
            <button>🔍</button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h2>Publicaciones</h2>

          {/* Renderizar publicaciones dinámicamente */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post">
                <img src={post.image || 'IMGs/arte.png'} className="profile-pic" alt="Perfil" />
                <div className="post-content">
                  <p><strong>{post.username || 'Usuario'}:</strong> {post.text}</p>
                  {post.image && <img src={post.image} className="post-image" alt="Publicación" />}
                  {post.video && <video src={post.video} className="post-video" controls />}
                </div>
              </div>
            ))
          ) : (
            <p>No hay publicaciones disponibles.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Tu Sitio Web. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
