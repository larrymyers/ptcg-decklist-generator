export interface Card {
  quantity: number;
  name: string;
  set: string;
  number: string;
  displayNumber: string;
  regulationMark: string;
}

export interface Deck {
  pokemon: Card[];
  trainers: Card[];
  energy: Card[];
  [index: string]: Card[];
}

// Lookup table of SetCode:SetNumber -> Regulation Mark. Example: "OBF:26" -> "G"
export type CardRegulationMarks = Record<string, string>;

export const parseDecklist = (decklist: string, lookupRegMark: CardRegulationMarks): Deck => {
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
    let card: Card = {
      quantity: -1,
      name: "",
      set: "",
      number: "",
      displayNumber: "",
      regulationMark: "",
    };

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

    card = normalizeSetNumber(card);

    card.name = parts.slice(1, setStart).join(" ");
    card.regulationMark = lookupRegMark[`${card.set}:${card.number}`] || "";

    if (!deck[section]) {
      continue;
    }

    deck[section].push(card);
  }

  return deck;
};

const normalizeSetNumber = (card: Card): Card => {
  const normalized = { ...card };
  normalized.displayNumber = card.number;

  // left pad gallerian gallery numbers, normalize GG6 -> GG06
  if (card.set == "CRZ" && card.number.startsWith("GG")) {
    const n = parseInt(card.number.slice(2), 10);

    normalized.number = n < 10 ? "GG0" + n.toString() : "GG" + n.toString();
  }

  // prepend SHSW to the promo numbers for display so they match the physical card
  if (card.set == "PR-SW" && !card.number.startsWith("SHSW")) {
    normalized.displayNumber = "SWSH" + card.number;
  }

  return normalized;
};

const isSet = (set: string) => /\b(?:[A-Z]{3}|[A-Z]+(?:-[A-Z]+)*)\b/.test(set);
