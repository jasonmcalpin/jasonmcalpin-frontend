# Rustpunk Panic 66: faction motives and decision contract

## Player objective

The player is an independent scavenger trying to accumulate **20 Supplies** and escape the wasteland. Supplies at zero means starvation. If any faction reaches 20 influence first, that faction wins the wider conflict and the player is caught in the aftermath.

The four meters remain `megacorporationInfluence`, `rogueAIProgress`, `survivorTrust`, and `resources` in serialized JSON for compatibility. Their player-facing names are **MegaCorp**, **Mecha**, **Scavs**, and **Supplies**.

## Primary rivalries

These are reliable strategic tendencies rather than a claim that the factions never clash with anyone else.

- **MegaCorp → Mecha:** MegaCorp wants to capture Mecha's machines, command network, and factories. First it tries to seize components and control systems; at higher influence it prepares a total takeover.
- **Mecha → Scavs:** Scav salvage crews strip dormant robots and use the parts for other projects. Mecha considers this an existential threat and first tries to protect its machines, then mobilizes force to eliminate the dismantlers.
- **Scavs → MegaCorp:** The Scavs are turning salvaged machine parts into weapons to liberate their people and overthrow MegaCorp's control of the wasteland. They begin by hiding workshops and raiding supplies, then launch direct attacks.

This triangle creates predictable relationships without adding a separate alliance meter.

## Event and decision conventions

Every card is a request, dilemma, or event from its `faction`, with a **left refusal/alternative** and a **right cooperation** action. The story should explain what the requester wants, why it harms the primary rival, and why Supplies may be paid, confiscated, stolen, or consumed.

For the current authored 27-card deck:
- 3 ordinary cards per faction are always eligible; effects are at most 2 points in magnitude.
- 3 escalation cards per faction unlock at that faction's influence >=10.
- 3 crisis cards per faction unlock at that faction's influence >=15.
- Escalation and crisis cards may change faction meters by up to 3 points and Supplies by up to 2 points.
- Refusing a request harms the requesting faction and benefits its primary rival; cooperating benefits the requester and harms that rival. Supplies are contextual and can move either way.
- Eligible events are sampled uniformly; reaching 10 or 15 adds eligible cards without removing ordinary ones.
- Exactly one decision is applied per card, and terminal outcomes are checked before drawing another card.

A faction achieving 20 causes its distinct defeat ending. MegaCorp crushes Mecha and the Scavs; Mecha unleashes its army and crushes MegaCorp and the Scavs; the Scavs destroy Mecha's infrastructure and storm MegaCorp, catching the player in the fighting.

## Balance considerations

This contract intentionally makes the factions strategically legible. The current event probabilities and point magnitudes do **not** guarantee an easy or even fair game: any faction close to 20 can end the run through one major event. Balance should be measured through completed playthroughs before changing the score economy.
