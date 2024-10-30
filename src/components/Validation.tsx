import type { Deck } from "@src/decklist/parser";

export const DeckValidation = ({ deck }: { deck: Deck }) => {
  const errors = validateDeck(deck);

  if (!errors.length) {
    return <></>;
  }

  return (
    <div class="p-2 bg-red-100 border border-red-800 rounded-sm">
      <h2 class="text-xl font-bold mb-4">Deck List Errors</h2>
      <ul class="list-disc list-inside">
        {errors.map((error) => (
          <li>{error}</li>
        ))}
      </ul>
    </div>
  );
};

const validateDeck = (deck: Deck) => {
  const errors: string[] = [];

  const cardCount = getDeckCount(deck);

  if (cardCount == 0) {
    return errors;
  }

  if (cardCount < 60) {
    errors.push(`Deck only has ${cardCount} cards.`);
  }

  return errors;
};

const getDeckCount = (deck: Deck) => {
  const pokemon = deck.pokemon.reduce((count, card) => count + card.quantity, 0);
  const trainers = deck.trainers.reduce((count, card) => count + card.quantity, 0);
  const energy = deck.energy.reduce((count, card) => count + card.quantity, 0);

  return pokemon + trainers + energy;
};
