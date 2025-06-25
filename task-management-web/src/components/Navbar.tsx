// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Task Manager
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/" className="navbar-link">
              My Tasks
            </Link>
            <Link to="/create-task" className="navbar-link">
              New Task
            </Link>
            <button onClick={onLogout} className="navbar-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="navbar-link">
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
