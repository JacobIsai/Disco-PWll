import React from 'react';
import './perfil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphones,
  faHome,
  faUser,
  faComments,
  faPen,
  faSignOutAlt,
  faCog,
  faPlus,
  faEye,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const RedSocial = () => {
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
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
      </aside>

      {/* Contenido Principal */}
      <main className="content">
        {/* Perfil y Bienvenida */}
        <section className="box1">
          <h3>Bienvenido a Disco</h3>
          <p>¡Hola, usuario! ¿Qué deseas compartir con el mundo hoy?</p>

          {/* Botones */}
          <div className="buttons">
            <button className="btn btn-crear">
              <FontAwesomeIcon icon={faPlus} /> Crear
            </button>
            <button className="btn btn-publicar">
              <FontAwesomeIcon icon={faEye} /> Ver mis publicaciones
            </button>
          </div>

          <div className="separator-line"></div>

          {/* Buscador */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar publicación..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>

          {/* Publicaciones */}
          <div className="posts-container">
            {[...Array(5)].map((_, index) => (
              <article className="post" key={index}>
                <div className="content-box">
                  <h3>Título</h3>
                  <p>Texto</p>
                </div>
                <div className="bottom-border"></div>
              </article>
            ))}
          </div>
        </section>

        {/* Perfil Usuario */}
        <aside className="box2">
          <div className="profile-container">
            <img
              src="IMGs/arte.png"
              alt="Perfil"
              className="profile-image"
            />
            <p className="username">Usuario</p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default RedSocial;
