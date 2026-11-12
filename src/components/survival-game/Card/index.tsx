import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { Card as CardType, Effects } from '../../../types';

type Direction = 'left' | 'right';

interface CardProps {
  card: CardType;
  onSwipe: (direction: Direction, effects: Effects) => void;
}

const SWIPE_THRESHOLD = 55;
const MAX_DRAG = 160;

const Card: React.FC<CardProps> = ({ card, onSwipe }) => {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const choose = (direction: Direction) => {
    setDragging(false);
    setDragX(0);
    onSwipe(direction, direction === 'left' ? card.leftChoice.effects : card.rightChoice.effects);
  };

  const handlers = useSwipeable({
    onSwiping: ({ deltaX, absX, absY }) => {
      if (absX <= absY) return;
      setDragging(true);
      setDragX(Math.max(-MAX_DRAG, Math.min(MAX_DRAG, deltaX)));
    },
    onSwipedLeft: () => choose('left'),
    onSwipedRight: () => choose('right'),
    onSwiped: () => {
      setDragging(false);
      setDragX(0);
    },
    delta: SWIPE_THRESHOLD,
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const backgroundImage = card.background
    ? `/assets/games/images${card.background}`
    : '/assets/images/code-bg.jpg';
  const dragProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      choose(event.key === 'ArrowLeft' ? 'left' : 'right');
    }
  };

  return (
    <div className='mt-6'>
      <p id='route66-swipe-instructions' className='text-center text-sm text-gray-300 mb-3'>
        Swipe the card left or right. You can also use the left and right arrow keys.
      </p>
      <div
        {...handlers}
        onKeyDown={onKeyDown}
        role='group'
        aria-label='Decision card'
        aria-describedby='route66-swipe-instructions'
        tabIndex={0}
        data-testid='route66-decision-card'
        className='relative w-full h-96 rounded-xl overflow-hidden shadow-lg select-none cursor-grab active:cursor-grabbing outline-offset-4 focus-visible:outline-2 focus-visible:outline-neon-blue'
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          touchAction: 'pan-y',
          transform: `translateX(${dragX}px) rotate(${dragX / 22}deg)`,
          transition: dragging ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end pointer-events-none'>
          <h2 className='text-xl font-heading text-white mb-6'>{card.text}</h2>
          <div className='flex justify-between gap-4'>
            <div className='flex-1 text-left rounded-md border border-white/30 bg-black/50 p-3'
              style={{ opacity: dragX > 0 ? 0.65 : 0.65 + 0.35 * dragProgress }}>
              <span aria-hidden='true'>← </span>{card.leftChoice.text}
            </div>
            <div className='flex-1 text-right rounded-md border border-white/30 bg-black/50 p-3'
              style={{ opacity: dragX < 0 ? 0.65 : 0.65 + 0.35 * dragProgress }}>
              {card.rightChoice.text}<span aria-hidden='true'> →</span>
            </div>
          </div>
        </div>
      </div>
      <div className='sr-only focus-within:not-sr-only focus-within:mt-3 focus-within:flex focus-within:gap-3'>
        <button type='button' onClick={() => choose('left')}
          className='btn btn-primary flex-1'>
          Choose left: {card.leftChoice.text}
        </button>
        <button type='button' onClick={() => choose('right')}
          className='btn btn-secondary flex-1'>
          Choose right: {card.rightChoice.text}
        </button>
      </div>
    </div>
  );
};

export default Card;
