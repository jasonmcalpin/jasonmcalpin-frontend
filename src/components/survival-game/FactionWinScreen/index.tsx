import React from 'react';
import { useNavigate } from 'react-router-dom';

const FactionWinScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/projects/route-66');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-heading text-neon-purple mb-6">Faction Victory</h1>
      <p className="text-lg mb-8">
        A faction has taken control, reaching maximum power! You have lost the game 
        as the balance has been tipped irreversibly.
      </p>
      <button 
        onClick={handleRestart}
        className="btn-outline px-8 py-3 text-lg hover:bg-neon-blue/20"
      >
        Try Again
      </button>
    </div>
  );
};

export default FactionWinScreen;
