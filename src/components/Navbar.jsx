import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styling/Navbar.css';

const Navbar = ({ isLoggedIn, handleLogout, username }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">
        Home
      </Link>

      {isLoggedIn ? (
        <div className="user-info">
          <span className="navbar-username">{username}</span>
          <button onClick={toggleDropdown} className="navbar-dropdown-button">
          </button>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
          <img src="/path-to-user-avatar.png" alt="User" className="user-avatar" />
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="navbar-link">Log In</Link>
          <Link to="/register" className="navbar-link">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  username: PropTypes.string
};

export default Navbar;
