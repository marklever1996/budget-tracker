import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    login();
    navigate('/dashboard');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">FinancePro</Link>
      </div>
      <nav>
        {isLoggedIn ? (
          <ul className="nav-links">
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/fire-calculator">FIRE Calculator</Link></li>
            <li><Link to="/investments">Investeringstracker</Link></li>
            <li><Link to="/goals">Financiële doelen</Link></li>
            <li>
              <button className="profile-button" onClick={handleLogoutClick}>
                <FaUserCircle size={24} />
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li>
              <button className="login-button" onClick={handleLoginClick}>
                Login
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
