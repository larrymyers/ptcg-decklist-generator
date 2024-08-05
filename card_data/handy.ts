import { writeFileSync } from "fs";
import { join } from "path";

// release code -> expansion code (printed on card)
const STANDARD_SETS = [
  "SWSHBSP:PR-SW",
  "SWSH9:BRS",
  "SWSH10:ASR",
  "SWSH11:LOR",
  "SWSH12:SIT",
  "SWSH3-5:CPA",
  "SWSH4-5:SHF",
  "SWSH7-5:CEL",
  "SWSH10-5:PGO",
  "SWSH12-5:CRZ",
  "SVBSP:SVP",
  "SV1:SVI",
  "SV2:PAL",
  "SV3:OBF",
  "SV3-5:MEW",
  "SV4:PAR",
  "SV4-5:PAF",
  "SV5:TEF",
  "SV6:TWM",
  "SV6-5:SFA",
];

interface Set {
  id: string;
  name: string;
  expansion_code: string;
  release_code: string;
  card_code: string;
}

const getSets = async (expansionCodes: string[]) => {
  const resp = await fetch("https://api.handy.cards/items/tcg_sets?filter[language][_eq]=en-US");

  if (resp.status != 200) {
    console.error(await resp.text());
    return [];
  }

  const respBody: { data: Set[] } = await resp.json();
  const sets = respBody.data;
  const validSets: Set[] = [];

  STANDARD_SETS.forEach((code) => {
    const [release_code, card_code] = code.split(":");
    const set = sets.find((set: any) => set.release_code === release_code);

    if (set) {
      set.card_code = card_code;
      validSets.push(set);
    } else {
      console.error(`${code} NOT FOUND`);
    }
  });

  return validSets;
};

interface Card {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  card_number: string;
  regulation_mark: string;
}

const getCards = async (sets: Set[]) => {
  const cards: Record<string, string> = {};

  for (const set of sets) {
    console.log(`Set: ${set.name}`);

    const resp = await fetch(
      `https://api.handy.cards/items/tcg_cards?limit=-1&filter[language][_eq]=en-US&filter[set][_eq]=${set.id}`
    );

    if (resp.status != 200) {
      console.error(await resp.text());
      continue;
    }

    const respBody: { data: Card[] } = await resp.json();

    console.log(`Cards in Set: ${respBody.data.length}`);

    respBody.data.forEach((card) => {
      cards[`${set.card_code}:${card.card_number}`] = card.regulation_mark;
    });
  }

  return cards;
};

const sets = await getSets(STANDARD_SETS);
const cards = await getCards(sets);

writeFileSync(join(__dirname, "../public/cards.json"), JSON.stringify(cards, null, "  "), "utf-8");
