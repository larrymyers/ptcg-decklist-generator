import { normalizeName } from "../src/decklist/parser";
import { writeFileSync } from "fs";
import { join } from "path";

const STANDARD_SETS = [
  "SVP",
  "TEF",
  "TWM",
  "SFA",
  "SCR",
  "SSP",
  "PRE",
  "JTG",
  "DRI",
  "BLK",
  "WHT",
  "MEP",
  "MEG",
  "PFL",
  "ASC",
  "POR",
  "CRI",
  "PBL",
];

const parseCardsFromHtml = (html: string, setCode: string): Record<string, string> => {
  const cards: Record<string, string> = {};

  // Split by card blocks - each card is in a "card-page-main" div
  const blocks = html.split("card-page-main");

  for (const block of blocks) {
    const nameMatch = block.match(
      /<span class="card-text-name"><a href="\/cards\/[^/]+\/([^"]+)">([^<]+)<\/a><\/span>/,
    );
    if (!nameMatch) continue;

    const cardNumber = nameMatch[1];
    const cardName = normalizeName(nameMatch[2]);

    const regMatch = block.match(/(\w) Regulation Mark/);
    const regMark = regMatch ? regMatch[1] : "";

    cards[`${cardName}:${setCode}:${cardNumber}`] = regMark;
  }

  return cards;
};

const getCards = async (sets: string[]): Promise<Record<string, string>> => {
  const allCards: Record<string, string> = {};

  for (const setCode of sets) {
    console.log(`Fetching set: ${setCode}`);

    const resp = await fetch(`https://limitlesstcg.com/cards/${setCode}?display=full&show=all`);

    if (resp.status !== 200) {
      console.error(`Failed to fetch ${setCode}: ${resp.status}`);
      continue;
    }

    const html = await resp.text();
    const cards = parseCardsFromHtml(html, setCode);

    console.log(`  Cards found: ${Object.keys(cards).length}`);

    Object.assign(allCards, cards);
  }

  return allCards;
};

const cards = await getCards(STANDARD_SETS);
console.log(`\nTotal cards: ${Object.keys(cards).length}`);

writeFileSync(
  join(import.meta.dirname!, "../public/cards.json"),
  JSON.stringify(cards, null, "  "),
  "utf-8",
);

console.log("Written to public/cards.json");
