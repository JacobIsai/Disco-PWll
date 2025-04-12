import React, { useState, useEffect } from 'react';
import './new_post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faUpload } from '@fortawesome/free-solid-svg-icons';

import { db, auth } from '../../lib/firebase'; // Ajusta la ruta según tu proyecto
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const NuevaPublicacion = () => {
  const [text, setText] = useState('');
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid) {
      alert('Debes estar autenticado para publicar.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        text,
        image: null,
        video: null,
        uid,
        date: Timestamp.now()
      });

      alert('¡Publicación guardada con éxito!');
      setText('');
    } catch (error) {
      console.error('Error al guardar publicación:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  return (
    <div>
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

      <div className="content">
        <h2>¿Qué está pasando...?</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <textarea
              placeholder="Escribe tu publicación aquí..."
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="buttons">
            <input type="file" id="mediaUpload" hidden />
            <label htmlFor="mediaUpload" className="upload-btn">
              <FontAwesomeIcon icon={faUpload} /> Subir Media
            </label>
            <button type="submit" className="publish-btn">Publicar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaPublicacion;