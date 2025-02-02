import { assert, describe, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDecklist, type CardRegulationMarks } from "./parser";
import { da } from "date-fns/locale";

describe("parseDecklist", () => {
  const regMarks = getCardRegMarks();

  test("Limitless deck builder list", () => {
    const input = getTestdata("limitless_builder_decklist.txt");

    const deck = parseDecklist(input, regMarks);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 4,
      name: "Charmander",
      set: "OBF",
      number: "26",
      displayNumber: "26",
      regulationMark: "G",
    });
    assert.deepEqual(deck.pokemon[deck.pokemon.length - 1], {
      quantity: 1,
      name: "Lumineon V",
      set: "PR-SW",
      number: "250",
      displayNumber: "SWSH250",
      regulationMark: "F",
    });
    assert.deepEqual(deck.trainers[3], {
      quantity: 1,
      name: "Professor Turo's Scenario",
      set: "PAR",
      number: "240",
      displayNumber: "240",
      regulationMark: "G",
    });
    assert.deepEqual(deck.energy[1], {
      quantity: 1,
      name: "Mist Energy",
      set: "TEF",
      number: "161",
      displayNumber: "161",
      regulationMark: "H",
    });
  });

  test("Limitless tournament Deck List", () => {
    const input = getTestdata("limitless_tournament_decklist.txt");

    const deck = parseDecklist(input, regMarks);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 4,
      name: "Roaring Moon",
      set: "TEF",
      number: "109",
      displayNumber: "109",
      regulationMark: "H",
    });
    assert.deepEqual(deck.trainers[0], {
      quantity: 4,
      name: "Professor Sada's Vitality",
      set: "PAR",
      number: "170",
      displayNumber: "170",
      regulationMark: "G",
    });
    assert.deepEqual(deck.energy[0], {
      quantity: 9,
      name: "Darkness Energy",
      set: "",
      number: "7",
      displayNumber: "7",
      regulationMark: "",
    });
  });

  test("PTCGL deck list", () => {
    const input = getTestdata("ptcgl_decklist.txt");

    const deck = parseDecklist(input, regMarks);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 2,
      name: "Miraidon",
      set: "TEF",
      number: "121",
      displayNumber: "121",
      regulationMark: "H",
    });
    assert.deepEqual(deck.trainers[3], {
      quantity: 2,
      name: "Pokégear 3.0",
      set: "SVI",
      number: "186",
      displayNumber: "186",
      regulationMark: "G",
    });
    assert.equal(deck.energy.length, 2);
    assert.deepEqual(deck.energy[1], {
      quantity: 12,
      name: "Basic {L} Energy",
      set: "SVE",
      number: "4",
      displayNumber: "4",
      regulationMark: "",
    });
  });

  test("PTCGL deck list with pokeball holo card", () => {
    const input = getTestdata("ptcgl_pokeball_decklist.txt");

    const deck = parseDecklist(input, regMarks);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 2,
      name: "Budew",
      set: "PRE",
      number: "4",
      displayNumber: "4",
      regulationMark: "H",
    });
  });
});

const getTestdata = (filename: string) =>
  readFileSync(join(__dirname, "..", "..", "testdata", filename), {
    encoding: "utf-8",
  });

const getCardRegMarks = (): CardRegulationMarks => {
  const data = readFileSync(join(__dirname, "..", "..", "public", "cards.json"), "utf8");

  return JSON.parse(data);
};
