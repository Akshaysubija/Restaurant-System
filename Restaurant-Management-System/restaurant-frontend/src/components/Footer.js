// footer //
import React from 'react';
import { Link } from 'react-router-dom';  
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} 🍽️ Thalassery Nadan Restaurant, Near New Bustand, +91 8891221153
        </p>
        <div className="footer-links">
          <Link to="/menu">Menu</Link>
          <Link to="/reserve">Reservations</Link>
          <Link to="/">Home</Link>  
        </div>
      </div>
    </footer>
  );
};

export default Footer;
