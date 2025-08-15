import React from 'react';
import { useNavigate } from 'react-router-dom';

const WinScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/projects/route-66');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center'>
      <h1 className='text-4xl font-heading text-neon-blue mb-6'>You Escaped!</h1>
      <p className='text-lg mb-8'>
        Congratulations! You've gathered enough supplies to make your escape to the mountains, 
        away from the chaos of the wasteland.
      </p>
      <button 
        onClick={handleRestart}
        className='btn-outline px-8 py-3 text-lg hover:bg-neon-blue/20'
      >
        Play Again
      </button>
    </div>
  );
};

export default WinScreen;
