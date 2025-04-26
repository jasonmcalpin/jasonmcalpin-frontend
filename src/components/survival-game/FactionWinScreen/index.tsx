import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const FactionWinScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="screen">
      <h1>Faction Victory</h1>
      <p>A faction has taken control, reaching maximum power! You have lost the game as the balance has been tipped irreversibly.</p>
      <button onClick={handleRestart}>Try Again</button>
    </div>
  );
};

export default FactionWinScreen;