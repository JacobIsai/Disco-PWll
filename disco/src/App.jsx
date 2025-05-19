import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Registro from './components/registro/registro';
import Home from './components/home/home'; 
import Configuracion from './components/configuration/configuration';
import NuevaPublicacion from './components/new-post/new_post';
import Dms from './components/dms/dms';
import Perfil from './components/perfil/perfil';
import PostDetail from './components/verpublicacion/PostDetail';
import { auth } from './lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import './iniciar_sesion.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faHeadphones } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); 
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="login-content">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="login-input-box">
          <span className="fas fa-user"></span>
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="login-input-box">
          <span className="fas fa-lock"></span>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-btn">
          Ingresar
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <div className="app-body">
        <nav className="app-sidebar">
          <h2 className="app-logo">
            <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
          </h2>
          <ul>
            <li>
              <a href="/"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a>
            </li>
            <li>
              <a href="/registro"><FontAwesomeIcon icon={faUser} /> <span>CrearCuenta</span></a>
            </li>
            <li>
              <a href="/registro"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={user ? <Home /> : <Login />} />
          <Route path="/configuration" element={<Configuracion />} />
          <Route path="/new-post" element={<NuevaPublicacion />} />
          <Route path="/mensajes" element={<Dms />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/post/:postId" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;