import React, { useState } from "react";
import "./configuration.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faUpload } from '@fortawesome/free-solid-svg-icons';

const Configuracion = () => {
  const [previewSrc, setPreviewSrc] = useState("");

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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

      <div className="content">
        <h2>Configuracion</h2>
        <form action="#">
          <div className="input-box">
            <span className="fas fa-user"></span>
            <input type="text" placeholder="Nombre Completo" required />
          </div>
          <div className="input-box">
            <span className="fas fa-mail-bulk"></span>
            <input type="text" placeholder="Correo" required />
          </div>
          <div className="input-box">
            <span className="fas fa-user"></span>
            <input type="text" placeholder="Usuario" required />
          </div>
          <div className="input-box">
            <span className="fas fa-lock"></span>
            <input type="password" placeholder="Contraseña" required />
          </div>
          <div className="profile-section">
            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              onChange={previewImage}
            />
            <div className="profile-preview">
              {previewSrc && (
                <img
                  id="profile-img"
                  src={previewSrc}
                  alt="Vista previa"
                  style={{ display: "block" }}
                />
              )}
            </div>
          </div>
          <button type="submit" className="login-btn">Editar</button>
          <button type="submit" className="login-btn">Cancelar</button>
        </form>
      </div>

      {/* <footer>
        <p>&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer> */}
    </>
  );
};

export default Configuracion;
