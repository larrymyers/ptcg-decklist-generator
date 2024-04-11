import type { Card, Deck } from "@src/decklist/parser";
import { type PDFPage, type PDFFont, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useEffect, useRef } from "preact/hooks";

const pdfUrl = "/play-pokemon-deck-list-85x11-tef.pdf";

type CardType = "pokemon" | "trainer" | "energy";

export const PdfViewer = ({ deck }: { deck: Deck }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const renderPdf = async () => {
      var iframe = iframeRef.current;

      if (!iframe) {
        return;
      }

      const pdfData = await fetch(pdfUrl).then((res) => res.arrayBuffer());

      const pdf = await PDFDocument.load(pdfData);
      const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
      const page = pdf.getPage(0);

      deck.pokemon.forEach((card, i) => {
        drawRow(page, helvetica, i, "pokemon", card);
      });

      deck.trainers.forEach((card, i) => {
        drawRow(page, helvetica, i, "trainer", card);
      });

      deck.energy.forEach((card, i) => {
        drawRow(page, helvetica, i, "energy", card);
      });

      const dataUri = await pdf.saveAsBase64({ dataUri: true });
      const viewport = page.getSize();
      const outputScale = window.devicePixelRatio || 1;

      iframe.width = Math.floor(viewport.width * outputScale).toString();
      iframe.height = Math.floor(viewport.height * outputScale).toString();
      iframe.style.width = Math.floor(viewport.width) + "px";
      iframe.style.height = Math.floor(viewport.height) + "px";

      iframe.src = dataUri;
    };

    renderPdf().catch((err) => console.error(err));
  }, [iframeRef]);

  return (
    <div>
      <iframe ref={iframeRef}></iframe>
    </div>
  );
};

const drawRow = (page: PDFPage, font: PDFFont, rowNum: number, cardType: CardType, card: Card) => {
  let cardTypeOffset = 0;

  if (cardType == "trainer") {
    cardTypeOffset = 177;
  }

  if (cardType == "energy") {
    cardTypeOffset = 458;
  }

  const yOffset = 587 - rowNum * 13 - cardTypeOffset;

  page.drawText(card.quantity.toString(), {
    x: 272,
    y: yOffset,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(card.name, {
    x: 300,
    y: yOffset,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(card.set, {
    x: 475,
    y: yOffset,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(card.number, {
    x: 515,
    y: yOffset,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });
};
