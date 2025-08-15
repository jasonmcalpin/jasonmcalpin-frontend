import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoseScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/projects/route-66');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center'>
      <h1 className='text-4xl font-heading text-red-500 mb-6'>Game Over</h1>
      <p className='text-lg mb-8'>
        Your supplies have run out, and you can no longer continue the journey. 
        The wasteland has claimed another victim.
      </p>
      <button 
        onClick={handleRestart}
        className='btn-outline px-8 py-3 text-lg hover:bg-neon-blue/20'
      >
        Try Again
      </button>
    </div>
  );
};

export default LoseScreen;
