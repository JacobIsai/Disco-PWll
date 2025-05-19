import React, { useState, useEffect } from "react";
import "./configuration.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faComments, 
  faPen, 
  faCog, 
  faHeadphones,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updateEmail } from "firebase/auth";
import axios from 'axios';
import cld from '../../lib/cloudinary'; // Importa tu configuración existente
import { AdvancedImage } from '@cloudinary/react';

const Configuracion = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    profileImage: ""
  });
  const [previewSrc, setPreviewSrc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            name: userData.name || "",
            email: userData.email || user.email || "",
            username: userData.username || "",
            profileImage: userData.profileImage || ""
          });
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.match('image.*')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido (JPEG, PNG, etc.).');
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'disco_preset'); // Usa tu upload preset
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsvj7sufo/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new Error('No se pudo subir la imagen. Intenta nuevamente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl = formData.profileImage;
      
      // Subir nueva imagen si existe
      if (file) {
        imageUrl = await uploadImageToCloudinary(file);
      }

      // Actualizar email en Auth si cambió
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Actualizar datos en Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        profileImage: imageUrl,
        updatedAt: new Date()
      });

      alert("¡Perfil actualizado con éxito!");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert(error.message || "Ocurrió un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Extraer el ID público de la imagen de Cloudinary para AdvancedImage
  const getCloudinaryImageId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    return parts.slice(uploadIndex + 2).join('/').split('.')[0];
  };

  return (
    <div className="configuracion-container">
      <nav className="sidebar">
        <h2 className="logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul>
          <li><a href="/home"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li><a href="/perfil"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li><a href="/mensajes"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li><a href="/new-post"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
          <li><a href="/configuration" className="active">
            <FontAwesomeIcon icon={faCog} /> <span>Configuración</span>
          </a></li>
        </ul>
      </nav>

      <div className="content">
        <h2>Configuración del Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input 
              type="text" 
              name="name"
              placeholder="Nombre Completo" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="input-box">
            <input 
              type="email" 
              name="email"
              placeholder="Correo Electrónico" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="input-box">
            <input 
              type="text" 
              name="username"
              placeholder="Nombre de Usuario" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="profile-section">
            <label className="upload-label">
              <FontAwesomeIcon icon={faUpload} /> Cambiar foto de perfil
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            
            {(previewSrc || formData.profileImage) && (
              <div className="image-preview">
                {previewSrc ? (
                  <img src={previewSrc} alt="Vista previa" />
                ) : (
                  <AdvancedImage 
                    cldImg={cld.image(getCloudinaryImageId(formData.profileImage))}
                    className="profile-img"
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="buttons">
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Guardando...
                </>
              ) : "Guardar Cambios"}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate("/perfil")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracion;