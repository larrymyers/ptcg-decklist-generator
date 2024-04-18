export interface Card {
  quantity: number;
  name: string;
  set: string;
  number: string;
}

export interface Deck {
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

    if (line.length === 0) {
      continue;
    }

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

    const quantity = parseInt(parts[0], 10);

    // discard line (may be the "Total Cards:" line from PTCGL)
    if (isNaN(quantity)) {
      continue;
    }

    card.quantity = quantity;
    card.number = parts.slice(-1).join("");

    let setStart = -2;
    let set = parts.slice(setStart, -1).join("");

    // sometimes basic energy doesn't include a set
    if (!isSet(set)) {
      set = "";
      setStart = -1;
    }

    card.set = set;
    card.name = parts.slice(1, setStart).join(" ");

    if (!deck[section]) {
      continue;
    }

    deck[section].push(card);
  }

  return deck;
};

const isSet = (set: string) => /\b(?:[A-Z]{3}|[A-Z]+(?:-[A-Z]+)*)\b/.test(set);
