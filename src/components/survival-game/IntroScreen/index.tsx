import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntroScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/projects/route-66/game');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto'>
      <h1 className='text-4xl font-heading text-neon-blue mb-6 text-center'>Welcome to Rustpunk Panic 66</h1>
      <p className='text-lg mb-8 text-center'>
        You are an ex-megacorp hacker trying to escape the wasteland.
        Collect 20 supplies to reach the mountains, but do not let your supplies
        run out. MegaCorp, Mecha, and the Scavs are all competing for control:
        if any faction reaches 20 influence before you escape, you lose.
        Every decision changes the balance of power.
      </p>
      <button 
        onClick={handleStartGame}
        className='btn-outline px-8 py-3 text-lg hover:bg-neon-blue/20'
      >
        Start Game
      </button>
    </div>
  );
};

export default IntroScreen;
