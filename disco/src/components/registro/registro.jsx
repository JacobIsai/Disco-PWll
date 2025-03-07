import React, { useState } from 'react';
import './registro.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { db } from '../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Importa la función de registro de Firebase
import { auth } from '../../lib/firebase';  // Asegúrate de tener la configuración de Firebase aquí

const NuevoUsuario = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Para redirigir a la página de inicio después del registro

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Primero creamos el usuario en Firebase Authentication
    try {
      // Registro de usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // Obtienes el usuario recién creado

      // Crear un nuevo documento en la colección "usuarios" en Firestore
      await addDoc(collection(db, 'user'), {
        name,
        email,
        username,
        profileImage,
        uid: user.uid, // Agrega el UID de Firebase Authentication para asociar el usuario con el documento
      });

      console.log('Usuario agregado correctamente');
      alert('Usuario registrado con éxito');
      navigate('/home');  // Redirige a la página principal (Home) después del registro
    } catch (e) {
      console.error('Error al registrar el usuario: ', e);
      alert('Error al registrar el usuario: ' + e.message);
    }
  };

  return (
    <div>
      <nav className="sidebar">
        <h2 className="logo">
          <i className="fas fa-headphones"></i> <span>Disco</span>
        </h2>
        <ul>
          <li><Link to="/"> {/* Regresar a la página principal */} 
            <i className="fas fa-home"></i> <span>Inicio</span>
          </Link></li>
          <li><Link to="/registro"> {/* Crear Cuenta */} 
            <i className="fas fa-user"></i> <span>CrearCuenta</span>
          </Link></li>
          <li><Link to="#"> {/* Configuración link */} 
            <i className="fas fa-cog"></i> <span>Configuración</span>
          </Link></li>
        </ul>
      </nav>

      <div className="content">
        <h2>Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <span className="fas fa-user"></span>
            <input 
              type="text" 
              placeholder="Nombre Completo" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-box">
            <span className="fas fa-mail-bulk"></span>
            <input 
              type="email" 
              placeholder="Correo" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-box">
            <span className="fas fa-user"></span>
            <input 
              type="text" 
              placeholder="Usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-box">
            <span className="fas fa-lock"></span>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="profile-section">
            <input type="file" id="profile-pic" accept="image/*" onChange={previewImage} />
            {/* <div className="profile-preview">
              {profileImage && <img id="profile-img" src={profileImage} alt="Vista previa" />}
            </div> */}
          </div>
          <button type="submit" className="login-btn">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoUsuario;
