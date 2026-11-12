import type { Card, Pacts } from '../../../types';

export const TARGET = 20;

export const factionNames = {
  megacorporationInfluence: 'MegaCorp',
  rogueAIProgress: 'Mecha',
  survivorTrust: 'Scavs',
} as const;

export const factionEndings = {
  megacorporationInfluence: 'MegaCorp overruns the Scav settlements and crushes Mecha\'s factories. Its soldiers seize the wasteland, closing the roads before you can escape.',
  rogueAIProgress: 'Mecha unleashes an army of machines, smashing MegaCorp\'s defenses and Scav strongholds alike. The wasteland falls to its autonomous forces, and your route out is lost.',
  survivorTrust: 'The Scavs rise up, smash Mecha\'s command stations, and break into MegaCorp\'s fortified city. The fighting engulfs your escape route, and you are caught in the battle.',
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
 * Every eligible event remains equally likely, including the previous event.
 */
export function selectEvent(
  cards: Card[],
  pacts: Pacts,
  random: () => number = Math.random
): Card | null {
  const eligible = cards.filter(card => cardEligible(card, pacts));
  if (eligible.length === 0) return null;
  const roll = random();
  const index = Math.min(eligible.length - 1, Math.max(0, Math.floor(roll * eligible.length)));
  return eligible[index];
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
