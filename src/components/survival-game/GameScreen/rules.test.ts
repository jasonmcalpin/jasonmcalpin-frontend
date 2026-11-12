import { describe, expect, it } from 'vitest';
import type { Card, Pacts } from '../../../types';
import catalog from '../../../../public/data/gameData.json';
import { cardEligible, resolveOutcome, selectEvent, TARGET } from './rules';

const scores: Pacts = {
  resources: 5,
  megacorporationInfluence: 5,
  rogueAIProgress: 5,
  survivorTrust: 5,
};
const card = (id: number, requirements?: Record<string, number>): Card => ({
  id, text: `Event ${id}`,
  leftChoice: { text: 'Left', effects: {} },
  rightChoice: { text: 'Right', effects: {} },
  requirements,
});

describe('Route 66 event eligibility', () => {
  it('treats requirements as inclusive minimums and combines every requirement with AND', () => {
    const event = card(1, { rogueAIProgress: 6, resources: 5 });
    expect(cardEligible(event, scores)).toBe(false);
    expect(cardEligible(event, { ...scores, rogueAIProgress: 6 })).toBe(true);
    expect(cardEligible(event, { ...scores, rogueAIProgress: 10 })).toBe(true);
    expect(cardEligible(card(2), scores)).toBe(true);
  });

  it('samples uniformly from eligible cards, rerolling ineligible cards by exclusion', () => {
    const deck = [card(1), card(2, { rogueAIProgress: 10 }), card(3)];
    expect(selectEvent(deck, scores, () => 0)?.id).toBe(1);
    expect(selectEvent(deck, scores, () => 0.99)?.id).toBe(3);
    expect(selectEvent([card(2, { rogueAIProgress: 10 })], scores)).toBeNull();
  });

  it('allows the same eligible event to appear twice in a row', () => {
    const event = card(1);
    expect(selectEvent([event], scores, () => 0)?.id).toBe(1);
    expect(selectEvent([event], scores, () => 0)?.id).toBe(1);
  });

  it('validates actual authored events and filters their minimum requirements', () => {
    const events = catalog.cards as Card[];
    expect(events.length).toBeGreaterThan(0);
    expect(new Set(events.map(event => event.id)).size).toBe(events.length);
    expect(events.every(event => event.text.trim() &&
      event.leftChoice.text.trim() && event.rightChoice.text.trim())).toBe(true);
    const eligible = events.filter(event => cardEligible(event, scores));
    expect(eligible.length).toBeGreaterThan(0);
    expect(eligible.length).toBeLessThan(events.length);
    expect(cardEligible(events.find(event => event.id === 2)!, scores)).toBe(false);
  });
});

describe('Route 66 win and loss conditions', () => {
  it('wins when supplies reach 20 and no faction has reached 20', () => {
    expect(TARGET).toBe(20);
    expect(resolveOutcome({ ...scores, resources: 19 })).toBeNull();
    expect(resolveOutcome({ ...scores, resources: 20 })).toEqual({ type: 'escaped' });
  });

  it('loses at zero supplies', () => {
    expect(resolveOutcome({ ...scores, resources: 0 })).toEqual({ type: 'supplies-depleted' });
  });

  it.each([
    ['megacorporationInfluence', 'MegaCorp'],
    ['rogueAIProgress', 'Mecha'],
    ['survivorTrust', 'Scavs'],
  ] as const)('ends game when %s reaches 20 (%s)', (key, _label) => {
    expect(resolveOutcome({ ...scores, [key]: 19 })).toBeNull();
    expect(resolveOutcome({ ...scores, [key]: 20 })).toEqual({
      type: 'faction-victory', faction: key,
    });
  });

  it('resolves simultaneous faction threshold and supplies victory as faction victory', () => {
    expect(resolveOutcome({ ...scores, resources: 20, survivorTrust: 20 })).toEqual({
      type: 'faction-victory', faction: 'survivorTrust',
    });
  });
});
