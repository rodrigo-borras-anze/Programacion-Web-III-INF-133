import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

const Menu = ({ usuario, onLogout }) => {
  const navigate = useNavigate();
  const isAdmin = usuario?.rol === 'admin';

  const handleMenuClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <nav className="menu-nav">
      <div className="menu-header">---+
        <h2>🐾 Veterinaria</h2>
      </div>

      <ul className="menu-list">
        <li className="menu-item">
          <button 
            onClick={() => handleMenuClick(isAdmin ? '/dashboard-admin' : '/dashboard-cliente')}
            className="menu-link"
          >
            📊 Dashboard
          </button>
        </li>

        {isAdmin ? (
          <>
            <li className="menu-item">
              <button className="menu-link">👥 Clientes</button>
            </li>
            <li className="menu-item">
              <button className="menu-link">📋 Consultas</button>
            </li>
            <li className="menu-item">
              <button 
                onClick={() => handleMenuClick('/reportes')}
                className="menu-link"
              >
                📊 Reportes
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="menu-item">
              <button 
                onClick={() => handleMenuClick('/dashboard-cliente')}
                className="menu-link"
              >
                🐕 Mis Mascotas
              </button>
            </li>
            <li className="menu-item">
              <button className="menu-link">📋 Mis Consultas</button>
            </li>
            <li className="menu-item">
              <button 
                onClick={() => handleMenuClick('/reportes')}
                className="menu-link"
              >
                📊 Reportes
              </button>
            </li>
          </>
        )}

        <hr className="menu-divider" />

        <li className="menu-item">
          <button 
            onClick={onLogout}
            className="menu-link logout"
          >
            🚪 Cerrar Sesión
          </button>
        </li>
      </ul>

      <div className="menu-footer">
        <p className="user-info">{usuario?.email}</p>
        <span className="user-role">{usuario?.rol.toUpperCase()}</span>
      </div>
    </nav>
  );
};

export default Menu;
