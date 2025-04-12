import React from 'react';
import './dms.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faUpload } from '@fortawesome/free-solid-svg-icons';

const Mensajes = () => {
  return (
    <>
      <div className="container">
        {/* Sidebar */}
        <nav className="sidebar">
          <h2 className="logo">
            <i className="fas fa-headphones"></i> <span>Disco</span>
          </h2>
          <ul>
          <li><a href="/home"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li><a href="/perfil"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li><a href="/mensajes"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li><a href="/new-post"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
            <li><a href="#"><i className="fas fa-sign-out-alt"></i> <span>Salir</span></a></li>
            <li><a href="/configuration"><i className="fas fa-cog"></i> <span>Configuración</span></a></li>
          </ul>
        </nav>

        {/* Contenedor de mensajes */}
        <div className="messages-container">

          {/* Lista de contactos */}
          <div className="contacts">
            <h3>Contactos</h3>
            <ul>
              <li>
                <img src="IMGs/ref.png" alt="Usuario1" className="contact-img" />
                <span>Usuario1</span>
              </li>
              <li>
                <img src="IMGs/ref.png" alt="Usuario2" className="contact-img" />
                <span>Usuario2</span>
              </li>
              <li>
                <img src="IMGs/usuaraio.jpg" alt="Usuario3" className="contact-img" />
                <span>Usuario3</span>
              </li>
              <li>
                <img src="IMGs/usuaraio.jpg" alt="Usuario4" className="contact-img" />
                <span>Usuario4</span>
              </li>
              <li>
                <img src="IMGs/arte.png" alt="Usuario5" className="contact-img" />
                <span>Usuario5</span>
              </li>
            </ul>
          </div>

          {/* Sección de chat */}
          <div className="chat">
            <div className="message-box">
              <div className="message left">
                <span className="sender">Usuario1:</span>
                <p>klk</p>
              </div>
              <div className="message right">
                <span className="sender">Tú:</span>
                <p>Ejemplo</p>
              </div>
              <div className="message left">
                <span className="sender">Usuario1:</span>
                <p>aaaaaaaaaa</p>
              </div>
              <div className="message right">
                <span className="sender">Tú:</span>
                <p>A poco si</p>
              </div>
            </div>

            {/* Caja para escribir */}
            <div className="input-message">
              <input type="text" placeholder="Escribe un mensaje..." />
              <button><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Mensajes;
