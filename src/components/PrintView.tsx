import { parseDecklist, type CardRegulationMarks, type Deck } from "@src/decklist/parser";
import { ageDivision, loadPlayer, type Player } from "@src/player";
import { useState, useEffect } from "preact/hooks";

interface AppState {
  player: Player;
  deck: Deck;
  regMarks: CardRegulationMarks;
}

const defaultAppState = (): AppState => {
  const player = loadPlayer();
  const appState: AppState = {
    player,
    deck: { pokemon: [], trainers: [], energy: [] },
    regMarks: {},
  };

  return appState;
};

export const PrintView = () => {
  const [appState, setAppState] = useState<AppState>(defaultAppState());

  useEffect(() => {
    async function loadCardDB() {
      const resp = await fetch("/cards.json");
      const regMarks: CardRegulationMarks = await resp.json();
      const deck = parseDecklist(appState.player.deck, regMarks);

      setAppState({ ...appState, deck, regMarks });
    }

    loadCardDB();
  }, []);

  return (
    <div>
      <div>
        <span class="pr-12">
          <span class="font-bold pr-1">Name</span> {appState.player.name}
        </span>
        <span class="pr-12">
          <span class="font-bold pr-1">Player ID</span> {appState.player.playerId}
        </span>
        <span class="pr-12">
          <span class="font-bold pr-1">Date of Birth</span>{" "}
          {appState.player.dob?.toLocaleDateString()}
        </span>
        <span class="pr-12">
          <span class="font-bold pr-1">Division</span> {ageDivision(appState.player)}
        </span>
      </div>
      <div className="flex flex-row mt-8">
        <div className="mr-12">
          <h2 class="text-lg font-bold">Pokémon</h2>
          <table>
            <thead class="border-b-2 border-black">
              <tr class="uppercase">
                <td class="pr-4 text-sm font-semibold">Qty</td>
                <td class="pr-4 text-sm font-semibold">Name</td>
                <td class="pr-4 text-sm font-semibold">Set</td>
                <td class="pr-4 text-sm font-semibold">Num</td>
                <td class="pr-4 text-sm font-semibold">Reg</td>
              </tr>
            </thead>
            <tbody>
              {appState.deck.pokemon.map((card) => (
                <tr class="even:bg-slate-100">
                  <td class="pr-4">{card.quantity}</td>
                  <td class="pr-4">{card.name}</td>
                  <td class="pr-4">{card.set}</td>
                  <td class="pr-4">{card.number}</td>
                  <td class="pr-4">{card.regulationMark}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 class="mt-8 text-lg font-bold">Energy</h2>
          <table>
            <thead class="border-b-2 border-black">
              <tr class="uppercase">
                <td class="pr-4 text-sm font-semibold">Qty</td>
                <td class="pr-4 text-sm font-semibold">Name</td>
              </tr>
            </thead>
            <tbody>
              {appState.deck.energy.map((card) => (
                <tr class="even:bg-slate-100">
                  <td class="pr-4">{card.quantity}</td>
                  <td class="pr-4">{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="">
          <h2 class="text-lg font-bold">Trainers</h2>
          <table>
            <thead class="border-b-2 border-black">
              <tr class="uppercase">
                <td class="pr-4 text-sm font-semibold">Qty</td>
                <td class="pr-4 text-sm font-semibold">Name</td>
              </tr>
            </thead>
            <tbody>
              {appState.deck.trainers.map((card) => (
                <tr class="even:bg-slate-100">
                  <td class="pr-4">{card.quantity}</td>
                  <td class="pr-4">{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
