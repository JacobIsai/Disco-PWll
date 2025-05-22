import React, { useEffect, useState } from 'react';
import './dms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadphones, faHome, faUser, faComments, 
  faPen, faCog, faPaperPlane 
} from '@fortawesome/free-solid-svg-icons';

import { collection, getDocs, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { auth } from '../../lib/firebase';

const Mensajes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [chatActivo, setChatActivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const currentUserId = auth.currentUser?.uid;

  // Obtener lista de usuarios
  useEffect(() => {
    const obtenerUsuarios = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => doc.data()).filter(u => u.uid !== currentUserId);
      setUsuarios(data);
    };
    obtenerUsuarios();
  }, [currentUserId]);

  const agregarContacto = () => {
    const user = usuarios.find(u => u.uid === usuarioSeleccionado);
    if (user && !contactos.some(c => c.uid === user.uid)) {
      setContactos(prev => [...prev, user]);
    }
  };

  const abrirChat = (contacto) => {
    setChatActivo(contacto);
  };

  useEffect(() => {
    if (!chatActivo || !currentUserId) return;

    const q = query(
      collection(db, 'messages'),
      where('participants', 'in', [
        [currentUserId, chatActivo.uid],
        [chatActivo.uid, currentUserId]
      ]),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mensajesData = snapshot.docs.map(doc => doc.data());
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, [chatActivo, currentUserId]);

  const enviarMensaje = async () => {
    if (!mensaje.trim() || !chatActivo) return;

    await addDoc(collection(db, 'messages'), {
      senderId: currentUserId,
      receiverId: chatActivo.uid,
      participants: [currentUserId, chatActivo.uid],
      content: mensaje,
      timestamp: serverTimestamp()
    });

    setMensaje('');
  };

  return (
    <div className="dms-container">
      <nav className="dms-sidebar">
        <h2 className="dms-logo">
          <FontAwesomeIcon icon={faHeadphones} /> <span>Disco</span>
        </h2>
        <ul className="dms-nav-list">
          <li className="dms-nav-item"><a href="/home" className="dms-nav-link"><FontAwesomeIcon icon={faHome} /> <span>Inicio</span></a></li>
          <li className="dms-nav-item"><a href="/perfil" className="dms-nav-link"><FontAwesomeIcon icon={faUser} /> <span>Perfil</span></a></li>
          <li className="dms-nav-item"><a href="/mensajes" className="dms-nav-link active"><FontAwesomeIcon icon={faComments} /> <span>Mensajes</span></a></li>
          <li className="dms-nav-item"><a href="/new-post" className="dms-nav-link"><FontAwesomeIcon icon={faPen} /> <span>Crear</span></a></li>
          <li className="dms-nav-item"><a href="/configuration" className="dms-nav-link"><FontAwesomeIcon icon={faCog} /> <span>Configuración</span></a></li>
        </ul>
      </nav>

      <main className="dms-main-content">
        <div className="dms-contacts-container">
          <h3 className="dms-contacts-title">Contactos</h3>

          <div className="dms-combo-box">
            <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)} className="dms-select">
              <option value="">Selecciona un usuario</option>
              {usuarios.map((user) => (
                <option key={user.uid} value={user.uid}>{user.username}</option>
              ))}
            </select>
            <button onClick={agregarContacto} className="dms-add-button">Agregar</button>
          </div>

          <ul className="dms-contacts-list">
            {contactos.map((contacto) => (
              <li key={contacto.uid} className="dms-contact-item" onClick={() => abrirChat(contacto)}>
                <img src={contacto.profileImage || 'IMGs/default.png'} alt={contacto.username} className="dms-contact-avatar" />
                <div>
                  <span className="dms-contact-name">{contacto.username}</span><br/>
                  <small>{contacto.email}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="dms-chat-container">
          {chatActivo ? (
            <>
              <h4 className="dms-chat-title" style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={chatActivo.profileImage || 'IMGs/default.png'} 
                  alt={chatActivo.username} 
                  className="dms-chat-avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                />
                Conversación con {chatActivo.username}
              </h4>
<div className="dms-messages-box">
  {mensajes.map((msg, idx) => {
    const fecha = msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp;
    const fechaTexto = fecha ? new Date(fecha).toLocaleString() : '';
    return (
      <div 
        key={idx} 
        className={`dms-message ${msg.senderId === currentUserId ? 'dms-message-right' : 'dms-message-left'}`}
      >
        <span className="dms-message-sender">
          {msg.senderId === currentUserId ? 'Tú' : chatActivo.username}:
        </span>
        <p className="dms-message-content">{msg.content}</p>
        {fechaTexto && (
          <small 
            className="dms-message-date" 
            style={{ 
              fontSize: '0.7rem', 
              color: '#999', 
              display: 'block', 
              marginTop: '4px', 
              textAlign: msg.senderId === currentUserId ? 'right' : 'left' 
            }}
          >
            {fechaTexto}
          </small>
        )}
      </div>
    );
  })}
</div>

              <div className="dms-message-input">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje..." 
                  className="dms-message-input-field"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                />
                <button className="dms-send-button" onClick={enviarMensaje}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </>
          ) : (
            <div className="dms-no-chat">Selecciona un contacto para comenzar a chatear.</div>
          )}
        </div>
      </main>

      <footer className="dms-footer">
        <p className="dms-footer-text">&copy; 2025 Disco. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Mensajes;
