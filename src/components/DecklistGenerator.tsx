import { parseDecklist, type CardRegulationMarks, type Deck } from "@src/decklist/parser";
import { generatePDF, toObjectURL } from "@src/decklist/pdf";
import { PdfViewer } from "./PdfViewer";
import { useEffect, useRef, useState } from "preact/hooks";
import type { FunctionComponent } from "preact";
import { parse } from "date-fns/parse";
import { format } from "date-fns/format";
import { loadPlayer, savePlayer, type Player } from "@src/player";

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

export const DecklistGenerator = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const playerIdRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [appState, setAppState] = useState<AppState>(defaultAppState());

  useEffect(() => {
    async function loadCardDB() {
      const resp = await fetch("/cards.json");
      const regMarks: CardRegulationMarks = await resp.json();

      setAppState({ ...appState, regMarks });
    }

    loadCardDB();
  }, []);

  // prefill inputs from localStorage
  useEffect(() => {
    if (nameRef.current && appState.player.name) {
      nameRef.current.value = appState.player.name;
    }

    if (playerIdRef.current && appState.player.playerId) {
      playerIdRef.current.value = appState.player.playerId;
    }

    if (dobRef.current && appState.player.dob) {
      dobRef.current.value = format(appState.player.dob, "yyyy-MM-dd");
    }

    if (textareaRef.current && appState.player.deck) {
      textareaRef.current.value = appState.player.deck;
    }
  }, []);

  const getNextAppState = () => {
    const nextAppState = { ...appState };

    if (nameRef.current) {
      nextAppState.player.name = nameRef.current.value;
    }

    if (playerIdRef.current) {
      nextAppState.player.playerId = playerIdRef.current.value;
    }

    if (dobRef.current && dobRef.current.value != "") {
      nextAppState.player.dob = parse(dobRef.current.value, "yyyy-MM-dd", new Date());
    }

    if (textareaRef.current) {
      const content = textareaRef.current.value;
      const deck = parseDecklist(content, nextAppState.regMarks);
      nextAppState.player.deck = content;
      nextAppState.deck = deck;
    }

    savePlayer(nextAppState.player);

    return nextAppState;
  };

  const preview = (evt: Event) => {
    evt.preventDefault();

    setAppState(getNextAppState());
  };

  const openNewWindow = (evt: Event) => {
    evt.preventDefault();

    const nextAppState = getNextAppState();

    generatePDF(nextAppState)
      .then(toObjectURL)
      .then((url: string) => window.open(url, "_blank"));
  };

  return (
    <div class="flex flex-col md:flex-row mt-8">
      <div class="md:basis-1/4">
        <form onSubmit={preview}>
          <div class="flex flex-col space-y-4 md:flex-row md:space-x-3 md:space-y-0">
            <div>
              <Label for="player-name">Name</Label>
              <input
                id="player-name"
                class="px-4 py-2 rounded-sm border-slate-400 border-2"
                ref={nameRef}
                type="text"
                maxLength={32}
                placeholder="Full Name"
                autoFocus
              />
            </div>

            <div>
              <Label for="player-id">Player ID</Label>
              <input
                id="player-id"
                class="px-4 py-2 rounded-sm border-slate-400 border-2 w-28"
                ref={playerIdRef}
                type="text"
                maxLength={7}
                placeholder="Player ID"
              />
            </div>

            <div>
              <Label for="player-dob">Date of Birth</Label>
              <input
                id="player-dob"
                class="px-4 py-2 rounded-sm border-slate-400 border-2"
                ref={dobRef}
                type="date"
              />
            </div>
          </div>
          <div class="mt-4">
            <Label for="deck-list">Deck List</Label>
            <textarea
              id="deck-list"
              ref={textareaRef}
              rows={30}
              class="w-full px-4 py-2 rounded-sm border-slate-400 border-2"
              placeholder="Deck list exported from Limitless or PTCGL"
            />
          </div>
          <div class="mt-4">
            <button
              class="rounded border-blue-800 bg-blue-600 hover:bg-blue-900 border-2 text-white font-bold py-2 px-4"
              onClick={openNewWindow}
            >
              Generate
            </button>
            <button
              type="submit"
              class="rounded border-blue-800 text-blue-800 hover:bg-blue-400 hover:text-white border-2 font-bold py-2 px-4 ml-4"
            >
              Preview
            </button>
            <a
              class="rounded border-blue-800 text-blue-800 hover:bg-blue-400 hover:text-white border-2 font-bold py-2 px-4 ml-4"
              href="/print"
            >
              Use Large Form
            </a>
          </div>
        </form>
      </div>
      <div class="mt-4 md:mt-0 md:basis-3/4 md:ml-4">
        <PdfViewer deck={appState.deck} player={appState.player} />
      </div>
    </div>
  );
};

const Label: FunctionComponent<{ for?: string }> = (props) => (
  <label class="block text-sm font-bold" for={props.for}>
    {props.children}
  </label>
);
