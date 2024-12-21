import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Bepaal welke navigatie te tonen op basis van login status
  const renderNavigation = () => {
    if (isLoggedIn) {
      return (
        <ul className="nav-links">
          <li><Link to="/investments" className={location.pathname === '/investments' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/budget" className={location.pathname === '/budget' ? 'active' : ''}>Budgetoverzicht</Link></li>
          <li><Link to="/fire" className={location.pathname === '/fire' ? 'active' : ''}>FIRE Doelen</Link></li>
          <li>
            <button className="profile-button" onClick={handleLogoutClick}>
              <FaUserCircle size={24} />
            </button>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="nav-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>Features</Link></li>
          {/* <li><Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Pricing</Link></li> */}
          <li>
            <button className="login-button" onClick={handleLoginClick}>
              Login
            </button>
          </li>
        </ul>
      );
    }
  };

  return (
    <header>
      <div className="logo">
        <Link to={isLoggedIn ? '/investments' : '/'}>FinancePro</Link>
      </div>
      <nav>
        {renderNavigation()}
      </nav>
    </header>
  );
};

export default Header;
