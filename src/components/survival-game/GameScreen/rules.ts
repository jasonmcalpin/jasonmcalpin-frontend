import type { Card, Pacts } from '../../../types';

export const TARGET = 20;

export const factionNames = {
  megacorporationInfluence: 'MegaCorp',
  rogueAIProgress: 'Mecha',
  survivorTrust: 'Scavs',
} as const;

export type FactionKey = keyof typeof factionNames;
export type Outcome =
  | { type: 'supplies-depleted' }
  | { type: 'faction-victory'; faction: FactionKey }
  | { type: 'escaped' };

/**
 * Requirements are inclusive minimum values (all constraints must be met).
 * Undefined requirements mean the event is always eligible.
 */
export function cardEligible(card: Card, pacts: Pacts): boolean {
  return Object.entries(card.requirements ?? {}).every(
    ([meter, minimum]) => minimum === undefined || (pacts[meter] ?? 0) >= minimum
  );
}

/**
 * Uniform choice from the eligible cards is equivalent to rolling across the
 * full deck and rejecting ineligible cards, without unbounded reroll loops.
 * Avoid repeating the preceding card when another eligible event exists.
 */
export function selectEvent(
  cards: Card[],
  pacts: Pacts,
  previousCardId: number | null = null,
  random: () => number = Math.random
): Card | null {
  const eligible = cards.filter(card => cardEligible(card, pacts));
  if (eligible.length === 0) return null;
  const alternatives = eligible.filter(card => card.id !== previousCardId);
  const pool = alternatives.length ? alternatives : eligible;
  const roll = random();
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(roll * pool.length)));
  return pool[index];
}

/** Terminal outcomes are resolved before dealing the next event. */
export function resolveOutcome(pacts: Pacts): Outcome | null {
  if (pacts.resources <= 0) return { type: 'supplies-depleted' };
  // A faction takeover wins ties against an escape on the same decision.
  const faction = (Object.keys(factionNames) as FactionKey[])
    .find(key => pacts[key] >= TARGET);
  if (faction) return { type: 'faction-victory', faction };
  if (pacts.resources >= TARGET) return { type: 'escaped' };
  return null;
}
