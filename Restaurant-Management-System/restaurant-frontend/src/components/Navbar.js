// navbar //
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name?.split(' ')[0] || 'User';
  const userRole = user?.role || '';

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        🍽️ RMS
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/reserve">Reservations</Link></li> 
        <li><Link to="/payments">Payments</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>

      </ul>

      <div className="navbar-auth">
        {user ? (
          <>
            <span>Hi, {displayName} ({userRole})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



