import type { Card, Deck } from "@src/decklist/parser";
import { type PDFPage, type PDFFont, PDFDocument, StandardFonts, rgb, drawText } from "pdf-lib";
import { useEffect, useRef } from "preact/hooks";

const pdfUrl = "/play-pokemon-deck-list-85x11-tef.pdf";

export interface Player {
  name: string;
  playerId: string;
  dob: Date;
}

export type CardType = "pokemon" | "trainer" | "energy";

export const PdfViewer = ({ deck, player }: { deck: Deck; player: Player }) => {
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

      page.drawText(player.name, {
        x: 95,
        y: 715,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(player.playerId, {
        x: 295,
        y: 715,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(formatMonth(player.dob.getMonth()), {
        x: 495,
        y: 715,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(player.dob.getDate().toString(), {
        x: 525,
        y: 715,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      page.drawText(player.dob.getFullYear().toString(), {
        x: 549,
        y: 715,
        size: 9,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

      const year = player.dob.getFullYear();
      let yDivision = 674;

      if (year <= 2011 && year >= 2008) {
        yDivision = 661;
      }

      if (year <= 2007) {
        yDivision = 647;
      }

      page.drawText("X", {
        x: 374,
        y: yDivision,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0),
      });

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

      iframe.src = dataUri;
    };

    renderPdf().catch((err) => console.error(err));
  }, [iframeRef, deck]);

  return <iframe ref={iframeRef} width="90%" height="100%"></iframe>;
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

const formatMonth = (month: number) => {
  let val = (month + 1).toString();

  if (val.length === 1) {
    val = "0" + val;
  }

  return val;
};
