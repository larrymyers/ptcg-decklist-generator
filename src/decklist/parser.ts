interface Card {
  quantity: number;
  name: string;
  set: string;
  number: string;
}

interface Deck {
  pokemon: Card[];
  trainers: Card[];
  energy: Card[];
  [index: string]: Card[];
}

export const parseDecklist = (decklist: string): Deck => {
  const lines = decklist.split("\n");

  let section = "";
  const deck: Deck = { pokemon: [], trainers: [], energy: [] };

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("Pokémon:")) {
      section = "pokemon";
      continue;
    }

    if (line.startsWith("Trainer:")) {
      section = "trainers";
      continue;
    }

    if (line.startsWith("Energy:")) {
      section = "energy";
      continue;
    }

    const parts = line.split(" ");
    const card: Card = { quantity: -1, name: "", set: "", number: "" };

    card.quantity = parseInt(parts[0], 10);
    card.number = parts.slice(-1).join("");
    card.set = parts.slice(-2, -1).join("");
    card.name = parts.slice(1, -2).join(" ");

    deck[section].push(card);
  }

  return deck;
};
