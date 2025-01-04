import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Layout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(false); // Désauthentifie l'utilisateur
    navigate('/'); // Redirige vers la page de login
  };

  return (
    <div>
      <nav>
        <Link to="/main">Main</Link> | 
        <Link to="/my-workouts">My Workouts</Link> | 
        <Link to="/start-workout">Start Workout</Link> | 
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <main>
        <Outlet /> {/* Contenu des routes enfants */}
      </main>
    </div>
  );
}

export default Layout;
