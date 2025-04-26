import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LoseScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="screen">
      <h1>Game Over</h1>
      <p>Your supplies have run out, and you can no longer continue the journey. The wasteland has claimed another victim.</p>
      <button onClick={handleRestart}>Try Again</button>
    </div>
  );
};

export default LoseScreen;