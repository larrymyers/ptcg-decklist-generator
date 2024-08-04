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
        <span class="pr-6">
          <span class="font-bold pr-1">Name</span> {appState.player.name}
        </span>
        <span class="pr-6">
          <span class="font-bold pr-1">Player ID</span> {appState.player.playerId}
        </span>
        <span class="pr-6">
          <span class="font-bold pr-1">Date of Birth</span>{" "}
          {appState.player.dob?.toLocaleDateString()}
        </span>
        <span class="pr-6">
          <span class="font-bold pr-1">Division</span> {ageDivision(appState.player)}
        </span>
      </div>
      <div className="flex flex-row mt-8">
        <div className="basis-2/3">
          <h2 class="text-lg font-bold">Pokémon</h2>
          <table>
            <thead>
              <tr>
                <td class="pr-4 font-semibold">Quantity</td>
                <td class="pr-4 font-semibold">Card</td>
                <td class="pr-4 font-semibold">Set</td>
                <td class="pr-4 font-semibold">Reg. Mark</td>
              </tr>
            </thead>
            <tbody>
              {appState.deck.pokemon.map((card) => (
                <tr>
                  <td class="pr-4">{card.quantity}</td>
                  <td class="pr-4">{card.name}</td>
                  <td class="pr-4">{card.set}</td>
                  <td>{card.regulationMark}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 class="mt-4 font-bold">Energy</h2>
          <table>
            <tbody>
              {appState.deck.energy.map((card) => (
                <tr>
                  <td>{card.quantity}</td>
                  <td>{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="basis-1/3">
          <h2 class="font-bold">Trainers</h2>
          <table>
            <tbody>
              {appState.deck.trainers.map((card) => (
                <tr>
                  <td>{card.quantity}</td>
                  <td>{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
