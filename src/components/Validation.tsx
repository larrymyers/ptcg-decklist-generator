import type { Deck, Card } from "@src/decklist/parser";

export const DeckValidation = ({ deck }: { deck: Deck }) => {
  const errors = validateDeck(deck);

  if (!errors.length) {
    return <></>;
  }

  return (
    <div class="p-4 bg-red-100 border border-red-800 rounded-sm">
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

  getInvalidCards(deck).forEach((c) => {
    if (c.regulationMark === "") {
      errors.push(
        `${c.name} ${c.set} ${c.number} is an unknown standard card. The name doesn't match the set and number.`,
      );
    } else {
      errors.push(`${c.name} has invalid regulation mark: ${c.regulationMark}`);
    }
  });

  return errors;
};

const getDeckCount = (deck: Deck) => {
  const pokemon = deck.pokemon.reduce((count, card) => count + card.quantity, 0);
  const trainers = deck.trainers.reduce((count, card) => count + card.quantity, 0);
  const energy = deck.energy.reduce((count, card) => count + card.quantity, 0);

  return pokemon + trainers + energy;
};

const standardRegMarks = ["G", "H", "I"];

const getInvalidCards = (deck: Deck) => {
  let invalidCards = deck.pokemon.reduce((cards, c) => {
    if (standardRegMarks.indexOf(c.regulationMark) < 0) {
      cards.push(c);
    }

    return cards;
  }, [] as Card[]);

  invalidCards = deck.trainers.reduce((cards, c) => {
    if (standardRegMarks.indexOf(c.regulationMark) < 0) {
      cards.push(c);
    }

    return cards;
  }, invalidCards);

  return invalidCards;
};
