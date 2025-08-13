import React from 'react';
import { useNavigate } from 'react-router-dom';

const FactionLoseScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/projects/route-66');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center'>
      <h1 className='text-4xl font-heading text-red-500 mb-6'>Faction Defeat</h1>
      <p className='text-lg mb-8'>
        You've failed to maintain the balance between factions. The wasteland has fallen into chaos.
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

export default FactionLoseScreen;
