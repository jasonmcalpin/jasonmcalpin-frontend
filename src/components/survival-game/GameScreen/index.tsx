import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Pacts from '../Pacts';
import type { Card as CardType, Pacts as PactsType, Effects, GameData } from '../../../types';
import { resolveOutcome, selectEvent } from './rules';

const GameScreen: React.FC = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [pacts, setPacts] = useState<PactsType | null>(null);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [turn, setTurn] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<'left' | 'right' | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const navigate = useNavigate();
  const choiceLocked = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadGame() {
      try {
        const response = await fetch('/data/gameData.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch game data');
        const data: GameData = await response.json();
        if (!data.cards?.length || !data.pacts) throw new Error('Game data is incomplete');
        const firstCard = selectEvent(data.cards, data.pacts);
        if (!firstCard) throw new Error('No events are available at the starting scores');
        if (controller.signal.aborted) return;
        setGameData(data);
        setPacts(data.pacts);
        setCurrentCard(firstCard);
      } catch (error) {
        if (!controller.signal.aborted)
          setLoadError(error instanceof Error ? error.message : String(error));
      }
    }
    void loadGame();
    return () => {
      controller.abort();
      if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
    };
  }, []);

  // Reset only when a new turn renders. The same event may be dealt again
  // when it is the sole eligible event, so the event ID is not a turn identity.
  useEffect(() => {
    choiceLocked.current = false;
  }, [turn]);

  useEffect(() => {
    if (!pacts) return;
    const outcome = resolveOutcome(pacts);
    if (outcome?.type === 'supplies-depleted') {
      navigate('/projects/route-66/lose', { replace: true });
    } else if (outcome?.type === 'escaped') {
      navigate('/projects/route-66/win', { replace: true });
    } else if (outcome?.type === 'faction-victory') {
      navigate('/projects/route-66/faction-win', {
        replace: true,
        state: { faction: outcome.faction },
      });
    }
  }, [pacts, navigate]);

  useEffect(() => {
    if (!lastSwipe) return;
    const timer = setTimeout(() => setLastSwipe(null), 500);
    return () => clearTimeout(timer);
  }, [lastSwipe, turn]);

  const handleSwipe = (direction: 'left' | 'right', effects: Effects) => {
    if (!gameData || !pacts || !currentCard || choiceLocked.current) return;
    choiceLocked.current = true;
    setLastSwipe(direction);

    const nextPacts = { ...pacts };
    for (const [meter, effect] of Object.entries(effects)) {
      nextPacts[meter] = Math.max(0, (nextPacts[meter] ?? 0) + (effect ?? 0));
    }
    setPacts(nextPacts);

    // Never deal a new event after a terminal decision.
    if (resolveOutcome(nextPacts)) return;
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      const next = selectEvent(gameData.cards, nextPacts, currentCard.id);
      if (!next) {
        setEventError('No events match the current scores. The game cannot continue.');
        return;
      }
      setCurrentCard(next);
      setTurn(previous => previous + 1);
    }, 300);
  };

  if (loadError) {
    return <div className='min-h-[80vh] p-6 text-center' role='alert'>
      <h1 className='text-2xl mb-4'>Unable to load game</h1>
      <p>{loadError}</p>
      <button className='btn btn-primary mt-4' onClick={() => navigate('/projects/route-66')}>Back</button>
    </div>;
  }

  if (!gameData || !pacts || !currentCard) {
    return <div className='flex items-center justify-center min-h-[80vh]' role='status'>
      <p className='text-xl'>Loading game...</p>
    </div>;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] p-4 max-w-4xl mx-auto'>
      <div className='w-full max-w-md'>
        <Pacts pacts={pacts} />
        {lastSwipe && (
          <div className='fixed inset-0 z-10 flex items-center justify-center pointer-events-none' aria-hidden='true'>
            <div className={`text-6xl font-bold ${lastSwipe === 'left' ? 'text-red-500 -translate-x-16' : 'text-green-500 translate-x-16'} transition-transform duration-300`}>
              {lastSwipe === 'left' ? '←' : '→'}
            </div>
          </div>
        )}
        {eventError ? (
          <div role='alert' className='bg-background-light rounded-lg p-6 text-center'>
            <p>{eventError}</p>
            <button className='btn btn-primary mt-4' onClick={() => navigate('/projects/route-66')}>Restart</button>
          </div>
        ) : (
          <Card key={turn} card={currentCard} onSwipe={handleSwipe} />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
