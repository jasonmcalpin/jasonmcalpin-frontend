import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/projects/route-66/game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-heading text-neon-blue mb-6 text-center">Welcome to Rustpunk Panic 66</h1>
      <p className="text-lg mb-8 text-center">
        You are an ex-megacorp hacker in a post-apocalyptic world. Your goal is
        to balance the power between factions while managing your supplies.
        Make decisions wisely, as they affect your survival and the world
        around you.
      </p>
      <button 
        onClick={handleStartGame}
        className="btn-outline px-8 py-3 text-lg hover:bg-neon-blue/20"
      >
        Start Game
      </button>
    </div>
  );
};

export default IntroScreen;
