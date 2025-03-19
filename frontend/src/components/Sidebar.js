import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = ({ user, onLogout, isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    
    // Call the onLogout callback
    onLogout();
    
    // Redirect to login page
    navigate('/login');
  };

  // Get role-specific label
  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'analyst':
        return 'Data Analyst';
      default:
        return 'User';
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Dashboard AI</h2>
      </div>
      
      <div className="user-profile">
        <div className="avatar">
          {user.name.charAt(0)}
        </div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{getRoleLabel(user.role)}</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/inventory" 
              className={location.pathname === '/inventory' ? 'active' : ''}
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link 
              to="/sales" 
              className={location.pathname === '/sales' ? 'active' : ''}
            >
              Sales
            </Link>
          </li>
          <li>
            <Link 
              to="/purchase" 
              className={location.pathname === '/purchase' ? 'active' : ''}
            >
              Purchase
            </Link>
          </li>
          <li>
            <Link 
              to="/reports" 
              className={location.pathname === '/reports' ? 'active' : ''}
            >
              Reports
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 