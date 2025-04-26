import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card as CardType } from "../../../Types";
import './styles.css';

interface CardProps {
  card: CardType;
  onSwipe: (direction: string, effects: any) => void;
}

const Card: React.FC<CardProps> = ({ card, onSwipe }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe('left', card.leftChoice.effects),
    onSwipedRight: () => onSwipe('right', card.rightChoice.effects),
  });

  const backgroundImage = card.background || 'https://via.placeholder.com/800x600';

  return (
    <div
      {...handlers}
      className="card"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card-text">
        <h2>{card.text}</h2>
        <div>
          <button onClick={() => onSwipe('left', card.leftChoice.effects)}>
            {card.leftChoice.text}
          </button>
          <button onClick={() => onSwipe('right', card.rightChoice.effects)}>
            {card.rightChoice.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;