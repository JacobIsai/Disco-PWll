import React, { useState, useEffect, useRef } from 'react';
import './new_post.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faHome, faUser, faComments, faPen, faSignOutAlt, faCog, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { db, auth, storage } from '../../lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const NuevaPublicacion = () => {
  const [text, setText] = useState('');
  const [uid, setUid] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' o 'video'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo (10MB máximo)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4, MOV)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande (máximo 10MB)');
      return;
    }

    setMediaFile(file);
    setMediaType(file.type.includes('image') ? 'image' : 'video');

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'disco_preset'); // Asegúrate de tener este preset configurado
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsvj7sufo/${mediaType === 'image' ? 'image' : 'video'}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error al subir a Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (!uid) {
      alert('Debes estar autenticado para publicar.');
      setIsUploading(false);
      return;
    }

    try {
      let mediaUrl = null;
      
      // Subir media si existe
      if (mediaFile) {
        mediaUrl = await uploadToCloudinary(mediaFile);
      }

      // Crear documento en Firestore
      const postData = {
        text,
        uid,
        date: Timestamp.now(),
        ...(mediaType === 'image' && { image: mediaUrl }),
        ...(mediaType === 'video' && { video: mediaUrl })
      };

      await addDoc(collection(db, 'posts'), postData);

      alert('¡Publicación creada con éxito!');
      setText('');
      removeMedia();
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al crear la publicación: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="post-body">
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
          <li><a href="#" onClick={() => signOut(auth)}><FontAwesomeIcon icon={faSignOutAlt} /> <span>Salir</span></a></li>
          <li><a href="/configuration"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a></li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="post-wrapper">
        <div className="post-content">
          <h2>¿Qué está pasando...?</h2>
          <form onSubmit={handleSubmit}>
            <div className="post-input-box">
              <textarea
                placeholder="Escribe tu publicación aquí..."
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Vista previa del media */}
            {mediaPreview && (
              <div className="media-preview-container">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Vista previa" className="media-preview" />
                ) : (
                  <video controls className="media-preview">
                    <source src={mediaPreview} type={mediaFile.type} />
                  </video>
                )}
                <button 
                  type="button" 
                  onClick={removeMedia}
                  className="remove-media-btn"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            <div className="post-buttons">
              <input 
                type="file" 
                id="mediaUpload" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*, video/*"
                hidden 
              />
              <label htmlFor="mediaUpload" className="post-upload-btn">
                <FontAwesomeIcon icon={faUpload} /> {mediaFile ? 'Cambiar archivo' : 'Subir Media'}
              </label>
              <button 
                type="submit" 
                className="post-publish-btn"
                disabled={isUploading}
              >
                {isUploading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevaPublicacion;