/*
  * Project: rustpunk-panic-66
  * File: Pacts.tsx
  * Author: Jason McAlpin
  * Description: This file defines the Pacts component, which displays the current values of the pacts in the game.
  * The pacts are displayed as a list of key-value pairs, with the key being the name of the pact and the value being the current value of the pact.
  * The component receives the pacts as a prop and maps over the pacts object to display each pact.
  * The display names of the pacts are defined in the pactDisplayNames object.
  * The component returns a div element with a list of pact elements, each containing the name and value of a pact.
  * The component is used in the App component to display the current values of the pacts in the game.
*/

import React from 'react';
import type { Pacts as PactsType } from '../../../types';
interface PactsProps {
  pacts: PactsType;
}

const pactDisplayNames: { [key: string]: string } = {
  megacorporationInfluence: "MegaCorp",
  rogueAIProgress: "Rogue AI",
  survivorTrust: "Wastelandlanders",
  resources: "Supplies"
};

const Pacts: React.FC<PactsProps> = ({ pacts }) => {
  return (
    <div className="grid grid-cols-4 gap-4 w-full mb-4">
      {Object.entries(pacts).map(([pact, value]) => (
        <div key={pact} className="bg-background-light rounded-lg p-3 text-center">
          <h3 className="text-sm font-heading text-neon-blue mb-1">{pactDisplayNames[pact]}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default Pacts;
