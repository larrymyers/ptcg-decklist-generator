import { parseDecklist, type Deck } from "@src/decklist/parser";
import { PdfViewer } from "./PdfViewer";
import { useRef, useState } from "preact/hooks";
import { parse } from "date-fns/parse";
import type { Player } from "@src/decklist/pdf";

export const DecklistGenerator = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const playerIdRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [appState, setAppState] = useState<AppState>(defaultAppState());

  const preview = (evt: Event) => {
    evt.preventDefault();

    const nextAppState = { ...appState };

    if (nameRef.current) {
      nextAppState.player.name = nameRef.current.value;
    }

    if (playerIdRef.current) {
      nextAppState.player.playerId = playerIdRef.current.value;
    }

    if (dobRef.current) {
      nextAppState.player.dob = parse(dobRef.current.value, "yyyy-MM-dd", new Date());
    }

    if (textareaRef.current) {
      const content = textareaRef.current.value;
      const deck = parseDecklist(content);
      nextAppState.deck = deck;
    }

    setAppState(nextAppState);
  };

  const openNewWindow = (evt: Event) => {
    evt.preventDefault();

    const iframe = document.querySelector("iframe");

    if (iframe) {
      window.open(iframe.src, "_blank");
    }
  };

  return (
    <div class="flex flex-col md:flex-row mt-8">
      <div class="md:basis-1/4">
        <form onSubmit={preview}>
          <div class="flex flex-col space-y-4 md:flex-row md:space-x-3 md:space-y-0">
            <input
              class="px-4 py-2 rounded-sm border-slate-400 border-2"
              ref={nameRef}
              type="text"
              maxLength={32}
              placeholder="Full Name"
              autoFocus
            />
            <input
              class="px-4 py-2 rounded-sm border-slate-400 border-2 w-28"
              ref={playerIdRef}
              type="text"
              maxLength={7}
              placeholder="Player ID"
            />
            <input
              class="px-4 py-2 rounded-sm border-slate-400 border-2"
              ref={dobRef}
              type="date"
              placeholder="MM/DD/YYYY"
            />
          </div>
          <div class="mt-4">
            <textarea
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
          </div>
        </form>
      </div>
      <div class="mt-4 md:mt-0 md:basis-3/4 md:ml-4">
        <PdfViewer deck={appState.deck} player={appState.player} />
      </div>
    </div>
  );
};

interface AppState {
  player: Player;
  deck: Deck;
}

const defaultAppState = (): AppState => ({
  player: {
    name: "",
    playerId: "",
    dob: new Date(),
  },
  deck: { pokemon: [], trainers: [], energy: [] },
});
