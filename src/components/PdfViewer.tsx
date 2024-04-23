import type { Deck } from "@src/decklist/parser";
import { generatePDF, toObjectURL } from "@src/decklist/pdf";
import type { Player } from "@src/player";
import { useEffect, useRef } from "preact/hooks";

export const PdfViewer = ({ deck, player }: { deck: Deck; player: Player }) => {
  const embedRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const renderPdf = async () => {
      var embed = embedRef.current;

      if (!embed) {
        return;
      }

      const pdf = await generatePDF({ deck, player });

      embed.src = await toObjectURL(pdf);
    };

    renderPdf().catch((err) => console.error(err));
  }, [embedRef, deck, player]);

  return (
    <iframe ref={embedRef} class="w-11/12 h-full">
      Placeholder
    </iframe>
  );
};
