import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Pacts from '../Pacts';
import type { Card as CardType, Pacts as PactsType, Effects, GameData } from '../../../types';

const GameScreen: React.FC = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [pacts, setPacts] = useState<PactsType | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<string | null>(null);
  const [swipeAnimation, setSwipeAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch('/data/gameData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();
        setGameData(data);
        setPacts(data.pacts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };
    
    fetchGameData();
  }, []);

  // Check win/lose conditions
  useEffect(() => {
    if (!pacts) return;
    
    /*
    * Check for win/lose conditions and navigate to the appropriate screen if they are met.
    */
    if (pacts.resources <= 0) {
      navigate('/projects/route-66/lose');
    } else if (pacts.resources >= 20) {
      navigate('/projects/route-66/win');
    } else if (
      pacts.megacorporationInfluence >= 66 ||
      pacts.rogueAIProgress >= 66 ||
      pacts.survivorTrust >= 66
    ) {
      navigate('/projects/route-66/faction-win');
    }
  }, [pacts, navigate]);

  // Reset animation after it completes
  useEffect(() => {
    if (swipeAnimation) {
      const timer = setTimeout(() => {
        setSwipeAnimation(false);
        setLastSwipe(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [swipeAnimation]);

  const handleSwipe = (direction: string, effects: Effects) => {
    if (!gameData || !pacts) return;
    
    // Set the last swipe direction for visual feedback
    setLastSwipe(direction);
    setSwipeAnimation(true);
    
    // Update pacts based on effects
    const updatedPacts = { ...pacts };

    for (const [pact, effect] of Object.entries(effects)) {
      updatedPacts[pact as keyof PactsType] = Math.max(
        0,
        (updatedPacts[pact as keyof PactsType] || 0) + (effect || 0)
      );
    }

    setPacts(updatedPacts);
    
    // Move to next card after a short delay to allow animation to play
    setTimeout(() => {
      setCardIndex((prevIndex) => (prevIndex + 1) % gameData.cards.length);
    }, 300);
  };

  if (loading || !gameData || !pacts) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[80vh]'>
        <p className='text-xl'>Loading game...</p>
      </div>
    );
  }

  const currentCard: CardType = gameData.cards[cardIndex];

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-4 max-w-4xl mx-auto'>
      <div className='w-full max-w-md'>
        <Pacts pacts={pacts} />
        
        {/* Swipe direction indicator */}
        {lastSwipe && swipeAnimation && (
          <div className={`fixed inset-0 z-10 flex items-center justify-center pointer-events-none`}>
            <div className={`text-6xl font-bold ${lastSwipe === 'left' ? 'text-red-500 -translate-x-16' : 'text-green-500 translate-x-16'} transition-transform duration-300`}>
              {lastSwipe === 'left' ? '←' : '→'}
            </div>
          </div>
        )}
        
        <Card card={currentCard} onSwipe={handleSwipe} />
      </div>
    </div>
  );
};

export default GameScreen;
