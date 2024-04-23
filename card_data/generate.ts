import { readFileSync, writeFileSync } from "fs";
import { parse } from "date-fns/parse";
import type { CardRegulationMarks } from "@src/decklist/parser";

const sets: any[] = JSON.parse(readFileSync("pokemon-tcg-data/sets/en.json", "utf-8"));

// lookup of Set Code -> Set IDs
const legalSets = sets.reduce((legal: Record<string, string[]>, s: any) => {
  const releaseDate = parse(s.releaseDate, "yyyy/MM/dd", new Date());

  if (releaseDate.getFullYear() < 2022 || !s.ptcgoCode) {
    return legal;
  }

  if (legal[s.ptcgoCode]) {
    legal[s.ptcgoCode].push(s.id);
  } else {
    legal[s.ptcgoCode] = [s.id];
  }

  return legal;
}, {});

// Sword & Shield Black Star Promos came out in 2020, but have F mark cards.
legalSets["PR-SW"] = ["swshp"];

const lookup: CardRegulationMarks = {};

for (const [code, ids] of Object.entries(legalSets)) {
  ids.forEach((id) => {
    const setCards: any[] = JSON.parse(
      readFileSync(`pokemon-tcg-data/cards/en/${id}.json`, "utf-8")
    );

    setCards.forEach((card) => {
      const { number, regulationMark } = card;

      lookup[`${code}:${number}`] = regulationMark;
    });
  });
}

writeFileSync("../public/cards.json", JSON.stringify(lookup, null, "  "), "utf-8");
