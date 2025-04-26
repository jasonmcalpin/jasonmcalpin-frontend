import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="screen">
      <h1 className='game-title'>Welcome to Rustpunk Panic 66</h1>
      <p>
        You are an ex-megacorp hacker in a post-apocalyptic world. Your goal is
        to balance the power between factions while managing your supplies.
        Make decisions wisely, as they affect your survival and the world
        around you.
      </p>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default IntroScreen;