import { assert, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDecklist } from "./parser";

test("parseDecklist", () => {
  const input = readFileSync(join(__dirname, "..", "..", "testdata", "decklist.txt"), {
    encoding: "utf-8",
  });

  const deck = parseDecklist(input);

  assert.deepEqual(deck.pokemon[0], { quantity: 4, name: "Charmander", set: "OBF", number: "26" });
  assert.deepEqual(deck.trainers[3], {
    quantity: 1,
    name: "Professor Turo's Scenario",
    set: "PAR",
    number: "240",
  });
  assert.deepEqual(deck.energy[1], { quantity: 1, name: "Mist Energy", set: "TEF", number: "161" });
});
