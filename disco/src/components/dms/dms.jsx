import React from 'react';
import './dms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadphones, 
  faHome, 
  faUser, 
  faComments, 
  faPen, 
  faCog,
  faPaperPlane 
} from '@fortawesome/free-solid-svg-icons';

const Mensajes = () => {
  return (
    <div className="dms-container">
      {/* Sidebar único */}
      <nav className="dms-sidebar">
        <h2 className="dms-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul className="dms-nav-list">
          <li className="dms-nav-item">
            <a href="/home" className="dms-nav-link">
              <FontAwesomeIcon icon={faHome} /> <span>Inicio</span>
            </a>
          </li>
          <li className="dms-nav-item">
            <a href="/perfil" className="dms-nav-link">
              <FontAwesomeIcon icon={faUser} /> <span>Perfil</span>
            </a>
          </li>
          <li className="dms-nav-item">
            <a href="/mensajes" className="dms-nav-link active">
              <FontAwesomeIcon icon={faComments} /> <span>Mensajes</span>
            </a>
          </li>
          <li className="dms-nav-item">
            <a href="/new-post" className="dms-nav-link">
              <FontAwesomeIcon icon={faPen} /> <span>Crear</span>
            </a>
          </li>
          <li className="dms-nav-item">
            <a href="/configuration" className="dms-nav-link">
              <FontAwesomeIcon icon={faCog} /> <span>Configuración</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main className="dms-main-content">
        {/* Lista de contactos */}
        <div className="dms-contacts-container">
          <h3 className="dms-contacts-title">Contactos</h3>
          <ul className="dms-contacts-list">
            <li className="dms-contact-item">
              <img src="IMGs/ref.png" alt="Usuario1" className="dms-contact-avatar" />
              <span className="dms-contact-name">Usuario1</span>
            </li>
            <li className="dms-contact-item">
              <img src="IMGs/ref.png" alt="Usuario2" className="dms-contact-avatar" />
              <span className="dms-contact-name">Usuario2</span>
            </li>
            <li className="dms-contact-item">
              <img src="IMGs/usuaraio.jpg" alt="Usuario3" className="dms-contact-avatar" />
              <span className="dms-contact-name">Usuario3</span>
            </li>
            <li className="dms-contact-item">
              <img src="IMGs/usuaraio.jpg" alt="Usuario4" className="dms-contact-avatar" />
              <span className="dms-contact-name">Usuario4</span>
            </li>
            <li className="dms-contact-item">
              <img src="IMGs/arte.png" alt="Usuario5" className="dms-contact-avatar" />
              <span className="dms-contact-name">Usuario5</span>
            </li>
          </ul>
        </div>

        {/* Área de chat */}
        <div className="dms-chat-container">
          <div className="dms-messages-box">
            <div className="dms-message dms-message-left">
              <span className="dms-message-sender">Usuario1:</span>
              <p className="dms-message-content">klk</p>
            </div>
            <div className="dms-message dms-message-right">
              <span className="dms-message-sender">Tú:</span>
              <p className="dms-message-content">Ejemplo</p>
            </div>
            <div className="dms-message dms-message-left">
              <span className="dms-message-sender">Usuario1:</span>
              <p className="dms-message-content">aaaaaaaaaa</p>
            </div>
            <div className="dms-message dms-message-right">
              <span className="dms-message-sender">Tú:</span>
              <p className="dms-message-content">A poco si</p>
            </div>
          </div>

          {/* Input para nuevos mensajes */}
          <div className="dms-message-input">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              className="dms-message-input-field"
            />
            <button className="dms-send-button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dms-footer">
        <p className="dms-footer-text">&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Mensajes;