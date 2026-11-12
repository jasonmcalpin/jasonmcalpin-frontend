import { describe, expect, it } from 'vitest';
import type { Card, Pacts } from '../../../types';
import catalog from '../../../../public/data/gameData.json';
import { cardEligible, factionEndings, resolveOutcome, selectEvent, TARGET } from './rules';

const scores: Pacts = {
  resources: 5,
  megacorporationInfluence: 5,
  rogueAIProgress: 5,
  survivorTrust: 5,
};
const card = (id: number, requirements?: Record<string, number>): Card => ({
  id, faction: 'megacorporationInfluence', text: `Event ${id}`,
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
    expect(cardEligible(events.find(event => event.id === 10)!, scores)).toBe(false);
  });
});

describe('Route 66 authored three-stage deck contract', () => {
  const events = catalog.cards as Card[];
  const factions = ['megacorporationInfluence', 'rogueAIProgress', 'survivorTrust'] as const;
  const meters = [...factions, 'resources'];

  it('contains exactly three cards per faction per tier, with no requirements below 10', () => {
    expect(events).toHaveLength(27);
    for (const faction of factions) {
      const factionEvents = events.filter(event => event.faction === faction);
      expect(factionEvents).toHaveLength(9);
      for (const tier of [0, 10, 15]) {
        const tierEvents = factionEvents.filter(event => {
          if (tier === 0) return event.requirements === undefined;
          return event.requirements?.[faction] === tier;
        });
        expect(tierEvents, `${faction} tier ${tier}`).toHaveLength(3);
        if (tier > 0) {
          expect(tierEvents.every(event => Object.keys(event.requirements ?? {}).length === 1)).toBe(true);
        }
      }
    }
  });

  it('unlocks exactly three extra events per faction at 10 and again at 15', () => {
    expect(events.filter(event => cardEligible(event, scores))).toHaveLength(9);
    for (const faction of factions) {
      expect(events.filter(event => cardEligible(event, { ...scores, [faction]: 9 }))).toHaveLength(9);
      expect(events.filter(event => cardEligible(event, { ...scores, [faction]: 10 }))).toHaveLength(12);
      expect(events.filter(event => cardEligible(event, { ...scores, [faction]: 14 }))).toHaveLength(12);
      expect(events.filter(event => cardEligible(event, { ...scores, [faction]: 15 }))).toHaveLength(15);
    }
    expect(events.filter(event => cardEligible(event, {
      ...scores,
      megacorporationInfluence: 15, rogueAIProgress: 15, survivorTrust: 15,
    }))).toHaveLength(27);
  });

  it('gives every event distinct, meaningful choices and bounded effects', () => {
    expect(new Set(events.map(event => event.id)).size).toBe(events.length);
    for (const event of events) {
      expect(event.text.trim().length, `card ${event.id} has no scenario`).toBeGreaterThan(40);
      expect([event.leftChoice.text.trim(), event.rightChoice.text.trim()].every(Boolean)).toBe(true);
      expect(event.leftChoice.text).not.toBe(event.rightChoice.text);
      expect(event.leftChoice.effects).not.toEqual(event.rightChoice.effects);
      const tier = event.requirements?.[event.faction] ?? 0;
      const maxChange = tier === 0 ? 2 : 3;
      for (const choice of [event.leftChoice, event.rightChoice]) {
        expect(Object.keys(choice.effects).length).toBeGreaterThanOrEqual(2);
        for (const [meter, amount] of Object.entries(choice.effects)) {
          expect(meters).toContain(meter);
          expect(Number.isInteger(amount)).toBe(true);
          expect(amount).not.toBe(0);
          expect(Math.abs(amount!)).toBeLessThanOrEqual(maxChange);
        }
        expect(Math.abs(choice.effects.resources ?? 0)).toBeLessThanOrEqual(2);
      }
      if (tier >= 10) {
        expect(event.leftChoice.effects.resources).toBeDefined();
        expect(event.rightChoice.effects.resources).toBeDefined();
        expect(
          [event.leftChoice, event.rightChoice].some(choice =>
            Object.values(choice.effects).some(value => Math.abs(value ?? 0) === 3))
        ).toBe(true);
      }
    }
  });

  it('uses consistent Mecha and Scavs names in player-facing authored events', () => {
    const text = events.map(event =>
      [event.text, event.leftChoice.text, event.rightChoice.text].join(' ')).join(' ');
    expect(text).not.toMatch(/rogue AI|survivor(s)?|wastelander(s)?/i);
    expect(text).toMatch(/Mecha/);
    expect(text).toMatch(/Scavs/);
    expect(text).toMatch(/MegaCorp/i);
  });

  it('enforces a primary rivalry cycle in each authored decision', () => {
    // Internal meter names are stable for compatibility; targets encode the
    // faction strategy, rather than presenting every opponent as interchangeable.
    const rivals = {
      megacorporationInfluence: 'rogueAIProgress',
      rogueAIProgress: 'survivorTrust',
      survivorTrust: 'megacorporationInfluence',
    } as const;
    for (const event of events) {
      const enemy = rivals[event.faction];
      const other = factions.find(faction => faction !== event.faction && faction !== enemy)!;
      expect(event.leftChoice.effects[event.faction], `card ${event.id} refusing employer`).toBeLessThan(0);
      expect(event.rightChoice.effects[event.faction], `card ${event.id} helping employer`).toBeGreaterThan(0);
      expect(event.leftChoice.effects[enemy], `card ${event.id} protecting rival`).toBeGreaterThan(0);
      expect(event.rightChoice.effects[enemy], `card ${event.id} attacking rival`).toBeLessThan(0);
      expect(event.leftChoice.effects[other], `card ${event.id} unrelated faction`).toBeUndefined();
      expect(event.rightChoice.effects[other], `card ${event.id} unrelated faction`).toBeUndefined();
    }
  });

  it('expresses faction motivations in the authored event situations', () => {
    const names = {
      megacorporationInfluence: 'Mecha',
      rogueAIProgress: 'Scav',
      survivorTrust: 'MegaCorp',
    } as const;
    for (const event of events) {
      expect(event.text, `card ${event.id} rival named in scenario`).toContain(names[event.faction]);
    }
    const allText = events.map(event => event.text + ' ' + event.leftChoice.text + ' ' + event.rightChoice.text).join(' ');
    expect(allText).not.toMatch(/\b(?:survivors?|rogue\s+ai|wastelanders?)\b/i);
  });

  it('provides a distinct, story-specific takeover for every faction', () => {
    expect(Object.keys(factionEndings)).toEqual([...factions]);
    expect(new Set(Object.values(factionEndings)).size).toBe(3);
    expect(factionEndings.megacorporationInfluence).toMatch(/crushes Mecha/);
    expect(factionEndings.rogueAIProgress).toMatch(/army of machines/);
    expect(factionEndings.survivorTrust).toMatch(/caught in the battle/);
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
