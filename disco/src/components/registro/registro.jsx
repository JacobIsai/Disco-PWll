import React, { useState } from 'react';
import axios from 'axios';
import './registro.css';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faCog, 
  faHeadphones, 
  faMailBulk, 
  faLock 
} from '@fortawesome/free-solid-svg-icons';

const NuevoUsuario = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Previsualizar imagen seleccionada
  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'disco_preset'); 

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsvj7sufo/image/upload`, // Reemplaza con tu cloud name
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  };

  // Manejar el registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Subir imagen si existe
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // 2. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Guardar datos en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        username,
        profileImage: imageUrl || null,
        uid: user.uid,
        createdAt: new Date()
      });

      alert('¡Registro exitoso!');
      navigate('/home');
    } catch (error) {
      let errorMessage = 'Error en el registro: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'El correo ya está registrado.';
          break;
        case 'auth/weak-password':
          errorMessage += 'La contraseña debe tener al menos 6 caracteres.';
          break;
        default:
          errorMessage += error.message;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-body">
      <nav className="app-sidebar">
        <h2 className="app-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul>
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} /> <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/registro">
              <FontAwesomeIcon icon={faUser} /> <span>CrearCuenta</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <FontAwesomeIcon icon={faCog} /> <span>Configuración</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="register-content">
        <h2>Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="register-input-box">
            <FontAwesomeIcon icon={faUser} className="fas" />
            <input 
              type="text" 
              placeholder="Nombre Completo" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="register-input-box">
            <FontAwesomeIcon icon={faMailBulk} className="fas" />
            <input 
              type="email" 
              placeholder="Correo" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="register-input-box">
            <FontAwesomeIcon icon={faUser} className="fas" />
            <input 
              type="text" 
              placeholder="Usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="register-input-box">
            <FontAwesomeIcon icon={faLock} className="fas" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
          </div>
          
          <div className="register-profile-section">
            <label htmlFor="profile-pic" className="register-upload-btn">
              {profileImage ? 'Cambiar imagen' : 'Seleccionar imagen de perfil'}
            </label>
            <input 
              type="file" 
              id="profile-pic" 
              accept="image/*" 
              onChange={previewImage} 
              style={{ display: 'none' }} 
            />
            {profileImage && (
              <img 
                src={profileImage} 
                alt="Vista previa" 
                className="register-profile-preview"
              />
            )}
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoUsuario;