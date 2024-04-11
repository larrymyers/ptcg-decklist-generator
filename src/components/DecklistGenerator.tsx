import { parseDecklist, type Deck } from "@src/decklist/parser";
import { PdfViewer, type Player } from "./PdfViewer";
import { useRef, useState } from "preact/hooks";
import { parse } from "date-fns/parse";

export const DecklistGenerator = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const playerIdRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<{ player: Player; deck: Deck }>({
    player: {
      name: "",
      playerId: "",
      dob: new Date(),
    },
    deck: { pokemon: [], trainers: [], energy: [] },
  });

  const onGenerate = (evt: Event) => {
    evt.preventDefault();

    const nextFormData = { ...formData };

    if (nameRef.current) {
      nextFormData.player.name = nameRef.current.value;
    }

    if (playerIdRef.current) {
      nextFormData.player.playerId = playerIdRef.current.value;
    }

    if (dobRef.current) {
      nextFormData.player.dob = parse(dobRef.current.value, "yyyy-MM-dd", new Date());
    }

    if (textareaRef.current) {
      const content = textareaRef.current.value;
      const deck = parseDecklist(content);
      nextFormData.deck = deck;
    }

    setFormData(nextFormData);
  };

  const printPDF = (evt: Event) => {
    evt.preventDefault();

    const iframe = document.querySelector("iframe");

    if (iframe) {
      iframe.contentWindow?.print();
    }
  };

  return (
    <form onSubmit={onGenerate}>
      <div class="flex flex-row space-x-3">
        <input ref={nameRef} type="text" placeholder="Full Name" autoFocus />
        <input ref={playerIdRef} type="text" placeholder="Player ID" />
        <input ref={dobRef} type="date" placeholder="MM/DD/YYYY" />
      </div>
      <div class="flex mt-4">
        <div class="basis-1/3">
          <textarea
            ref={textareaRef}
            rows={30}
            class="w-full h-full"
            placeholder="Deck list exported from Limitless or PTCGL"
          />
        </div>
        <div class="basis-2/3 ml-4">
          <PdfViewer deck={formData.deck} player={formData.player} />
        </div>
      </div>
      <div class="mt-4">
        <button
          type="submit"
          class="rounded border-blue-800 border-2 bg-blue-600 text-white font-bold py-2 px-4"
        >
          Generate
        </button>
        <button
          class="rounded border-green-800 border-2 bg-green-600 text-white font-bold py-2 px-4 ml-4"
          onClick={printPDF}
        >
          Print
        </button>
      </div>
    </form>
  );
};
