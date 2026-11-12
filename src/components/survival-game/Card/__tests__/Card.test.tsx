import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../index';
import type { Card as CardType } from '../../../../types';

const card: CardType = {
  id: 1,
  faction: 'megacorporationInfluence',
  text: 'An abandoned relay starts transmitting. What will you do?',
  leftChoice: { text: 'Investigate', effects: { resources: -2 } },
  rightChoice: { text: 'Ignore', effects: { survivorTrust: 3 } },
};

describe('Route 66 decision card', () => {
  it('maps the left and right arrow keys to the same game decisions as swipes', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const surface = screen.getByTestId('route66-decision-card');
    expect(surface).toHaveAttribute('tabindex', '0');
    expect(surface).toHaveStyle({ touchAction: 'pan-y' });
    expect(screen.getByText(/Swipe the card left or right/)).toBeInTheDocument();

    fireEvent.keyDown(surface, { key: 'ArrowLeft' });
    fireEvent.keyDown(surface, { key: 'ArrowRight' });
    expect(onSwipe).toHaveBeenNthCalledWith(1, 'left', card.leftChoice.effects);
    expect(onSwipe).toHaveBeenNthCalledWith(2, 'right', card.rightChoice.effects);
  });

  it('keeps accessible choice controls without visible action buttons', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const left = screen.getByRole('button', { name: /Choose left/ });
    const right = screen.getByRole('button', { name: /Choose right/ });
    expect(left.parentElement).toHaveClass('sr-only');
    fireEvent.click(left);
    fireEvent.click(right);
    expect(onSwipe).toHaveBeenNthCalledWith(1, 'left', card.leftChoice.effects);
    expect(onSwipe).toHaveBeenNthCalledWith(2, 'right', card.rightChoice.effects);
  });

  it('accepts a horizontal mouse drag toward the left choice', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const surface = screen.getByTestId('route66-decision-card');
    fireEvent.mouseDown(surface, { button: 0, clientX: 260, clientY: 150 });
    fireEvent.mouseMove(document, { button: 0, clientX: 135, clientY: 152 });
    fireEvent.mouseUp(document, { button: 0, clientX: 135, clientY: 152 });
    expect(onSwipe).toHaveBeenCalledWith('left', card.leftChoice.effects);
  });

  it('accepts a horizontal mouse drag toward the right choice', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const surface = screen.getByTestId('route66-decision-card');
    fireEvent.mouseDown(surface, { button: 0, clientX: 100, clientY: 150 });
    fireEvent.mouseMove(document, { button: 0, clientX: 225, clientY: 152 });
    fireEvent.mouseUp(document, { button: 0, clientX: 225, clientY: 152 });
    expect(onSwipe).toHaveBeenCalledWith('right', card.rightChoice.effects);
  });

  it('maps a touch swipe to the left decision', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const surface = screen.getByTestId('route66-decision-card');
    const start = { identifier: 0, clientX: 250, clientY: 110 };
    const finish = { identifier: 0, clientX: 120, clientY: 112 };
    fireEvent.touchStart(surface, { touches: [start], changedTouches: [start] });
    fireEvent.touchMove(surface, { touches: [finish], changedTouches: [finish] });
    fireEvent.touchEnd(surface, { touches: [], changedTouches: [finish] });
    expect(onSwipe).toHaveBeenCalledWith('left', card.leftChoice.effects);
  });

  it('ignores vertical movement as a choice', () => {
    const onSwipe = vi.fn();
    render(<Card card={card} onSwipe={onSwipe} />);
    const surface = screen.getByTestId('route66-decision-card');
    fireEvent.mouseDown(surface, { button: 0, clientX: 130, clientY: 40 });
    fireEvent.mouseMove(document, { button: 0, clientX: 133, clientY: 190 });
    fireEvent.mouseUp(document, { button: 0, clientX: 133, clientY: 190 });
    expect(onSwipe).not.toHaveBeenCalled();
  });
});
