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
    <div className="flex flex-col md:flex-row mt-8">
      <div className="basis-1/4">
        <div>Name</div>
        <div>{appState.player.name}</div>
        <div>Player ID</div>
        <div>{appState.player.playerId}</div>
        <div>Date of Birth</div>
        <div>{appState.player.dob?.toLocaleDateString()}</div>
        <div>Division</div>
        <div>{ageDivision(appState.player)}</div>
      </div>

      <div className="basis-3/4">
        <table>
          <tbody>
            <tr>
              <td colspan={3} className="font-bold pb-3">
                Pokémon
              </td>
            </tr>
            {appState.deck.pokemon.map((card) => (
              <tr>
                <td>{card.quantity}</td>
                <td>{card.name}</td>
                <td>{card.set}</td>
                <td>{card.regulationMark}</td>
              </tr>
            ))}
            <tr>
              <td colspan={3} className="font-bold pb-3 pt-3">
                Trainers
              </td>
            </tr>
            {appState.deck.trainers.map((card) => (
              <tr>
                <td>{card.quantity}</td>
                <td>{card.name}</td>
              </tr>
            ))}
            <tr>
              <td colspan={3} className="font-bold pb-3 pt-3">
                Energy
              </td>
            </tr>
            {appState.deck.energy.map((card) => (
              <tr>
                <td>{card.quantity}</td>
                <td>{card.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
