import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Pacts from '../Pacts';
import gameData from '../../../data/gameData.json';
import { Card as CardType, Pacts as PactsType, Effects } from '../../../Types';
import './styles.css';

const GameScreen: React.FC = () => {
  const initialPacts: PactsType = gameData.pacts;
  const [pacts, setPacts] = useState<PactsType>(initialPacts);
  const [cardIndex, setCardIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    /*
    * Check for win/lose conditions and navigate to the appropriate screen if they are met.
    */
    if (pacts.resources <= 0) {
      navigate('/lose');
    } else if (pacts.resources >= 20) {
      navigate('/win');
    } else if (
      pacts.megacorporationInfluence >= 66 ||
      pacts.rogueAIProgress >= 66 ||
      pacts.survivorTrust >= 66
    ) {
      navigate('/faction-win');
    }
  }, [pacts, navigate]);

  const handleSwipe = (direction: string, effects: Effects) => {
    const updatedPacts = { ...pacts };

    for (const [pact, effect] of Object.entries(effects)) {
      updatedPacts[pact as keyof PactsType] = Math.max(
        0,
        (updatedPacts[pact as keyof PactsType] || 0) + (effect || 0)
      );
    }

    setPacts(updatedPacts);
    setCardIndex((prevIndex) => (prevIndex + 1) % gameData.cards.length);
  };

  const currentCard: CardType = gameData.cards[cardIndex];

  return (
    <div className="game-screen">
      <Pacts pacts={pacts} />
      <Card card={currentCard} onSwipe={handleSwipe} />
    </div>
  );
};

export default GameScreen;