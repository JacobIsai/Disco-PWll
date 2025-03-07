import React from 'react';
import './home.css'; 
import { FaHome, FaUser, FaComments, FaPen, FaSignOutAlt, FaCog } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 

const Home = () => {
  return (
    <div>
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="logo">
          <i className="fas fa-headphones"></i> <span>Disco</span>
        </h2>
        <ul>
          <li><a href="#"><FaHome /> <span>Inicio</span></a></li>
          <li><a href="#"><FaUser /> <span>Perfil</span></a></li>
          <li><a href="#"><FaComments /> <span>Mensajes</span></a></li>
          <li><a href="#"><FaPen /> <span>Crear</span></a></li>
          <li><a href="#"><FaSignOutAlt /> <span>Salir</span></a></li>
          <li><a href="#"><FaCog /> <span>Configuración</span></a></li>
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

          {/* Post 1 */}
          <div className="post">
            <img src="IMGs/arte.png" className="profile-pic" alt="Perfil" />
            <div className="post-content">
              <p><strong>Usuario1:</strong> ¡Hoy es un gran día!</p>
              <img src="IMGs/BG.png" className="post-image" alt="Publicación" />
            </div>
          </div>

          {/* Post 2 */}
          <div className="post">
            <img src="IMGs/arte.png" className="profile-pic" alt="Perfil" />
            <div className="post-content">
              <p><strong>Usuario2:</strong> Disfrutando del atardecer.</p>
            </div>
          </div>
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
