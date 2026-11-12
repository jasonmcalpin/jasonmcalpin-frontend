import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { factionNames, type FactionKey } from '../GameScreen/rules';

const FactionWinScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const faction = (state as { faction?: FactionKey } | null)?.faction;
  const winner = faction && Object.hasOwn(factionNames, faction) ? factionNames[faction] : null;

  const handleRestart = () => {
    navigate('/projects/route-66');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center'>
      <h1 className='text-4xl font-heading text-neon-purple mb-6'>Faction Victory</h1>
      <p className='text-lg mb-8'>
        A faction has taken control, reaching maximum power! You have lost the game 
        as the balance has been tipped irreversibly.
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

export default FactionWinScreen;
