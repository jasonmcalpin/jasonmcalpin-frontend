import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const WinScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="screen">
      <h1>You Escaped!</h1>
      <p>Congratulations! You've gathered enough supplies to make your escape to the mountains, away from the chaos of the wasteland.</p>
      <button onClick={handleRestart}>Play Again</button>
    </div>
  );
};

export default WinScreen;