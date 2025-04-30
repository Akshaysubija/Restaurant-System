// home page //
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>🍴 Thalassery Nadan Restaurant <hr>
      </hr>
        തലശ്ശേരി നാടൻ റെസ്റ്റോറന്റ്
      </h1>

      {user ? (
        <div className="user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>Please log in to see your information.</p>
      )}

      <div className="nav-buttons">
        <button onClick={() => navigate('/menu')}>🍲 Menu</button>
        <button onClick={() => navigate('/orders')}>🛒 Orders</button>
        <button onClick={() => navigate('/reservations')}>📅 Reservations</button>
      </div>
    </div>
  );
};

export default Home;








