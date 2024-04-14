import { assert, describe, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDecklist } from "./parser";

describe("parseDecklist", () => {
  test("Limitless deck list", () => {
    const input = getTestdata("decklist.txt");

    const deck = parseDecklist(input);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 4,
      name: "Charmander",
      set: "OBF",
      number: "26",
    });
    assert.deepEqual(deck.trainers[3], {
      quantity: 1,
      name: "Professor Turo's Scenario",
      set: "PAR",
      number: "240",
    });
    assert.deepEqual(deck.energy[1], {
      quantity: 1,
      name: "Mist Energy",
      set: "TEF",
      number: "161",
    });
  });

  test("PTCGL deck list", () => {
    const input = getTestdata("ptcgl_decklist.txt");

    const deck = parseDecklist(input);

    assert.deepEqual(deck.pokemon[0], {
      quantity: 2,
      name: "Miraidon",
      set: "TEF",
      number: "121",
    });
    assert.deepEqual(deck.trainers[3], {
      quantity: 2,
      name: "Pokégear 3.0",
      set: "SVI",
      number: "186",
    });
    assert.equal(deck.energy.length, 2);
    assert.deepEqual(deck.energy[1], {
      quantity: 12,
      name: "Basic {L} Energy",
      set: "SVE",
      number: "4",
    });
  });
});

const getTestdata = (filename: string) =>
  readFileSync(join(__dirname, "..", "..", "testdata", filename), {
    encoding: "utf-8",
  });
