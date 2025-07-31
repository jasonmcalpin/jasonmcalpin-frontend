import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card as CardType, Effects } from "../../../types";

interface CardProps {
  card: CardType;
  onSwipe: (direction: string, effects: Effects) => void;
}

const Card: React.FC<CardProps> = ({ card, onSwipe }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe('left', card.leftChoice.effects),
    onSwipedRight: () => onSwipe('right', card.rightChoice.effects),
  });

  const backgroundImage = card.background ? `/assets/games/images${card.background}` : 'https://via.placeholder.com/800x600';

  return (
    <div
      {...handlers}
      className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg mt-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
        <h2 className="text-xl font-heading text-white mb-6">{card.text}</h2>
        <div className="flex justify-between gap-4">
          <button 
            onClick={() => onSwipe('left', card.leftChoice.effects)}
            className="flex-1 bg-primary hover:bg-primary-light text-white py-3 px-4 rounded-md transition-colors"
          >
            {card.leftChoice.text}
          </button>
          <button 
            onClick={() => onSwipe('right', card.rightChoice.effects)}
            className="flex-1 bg-secondary hover:bg-secondary-light text-white py-3 px-4 rounded-md transition-colors"
          >
            {card.rightChoice.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
