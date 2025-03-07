import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Registro from './components/registro/registro';
import Home from './components/home/home'; 
import { auth } from './lib/firebase'; 
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import './iniciar_sesion.css';

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
    <div className="content">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <span className="fas fa-user"></span>
          <input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
      <div>
        <nav className="sidebar">
          <h2 className="logo">
            <i className="fas fa-headphones"></i> <span>Disco</span>
          </h2>
          <ul>
            <li>
              <a href="/"> <i className="fas fa-home"></i> <span>Inicio</span> </a>
            </li>
            <li>
              <a href="/registro"> <i className="fas fa-user"></i> <span>CrearCuenta</span> </a>
            </li>
            <li>
              <a href="/registro"> <i className="fas fa-cog"></i> <span>Configuración</span> </a>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={user ? <Home /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
