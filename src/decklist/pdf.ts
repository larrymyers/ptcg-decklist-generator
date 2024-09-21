import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import type { Card, Deck } from "./parser";
import type { Player } from "@src/player";

const pdfUrl = "/play-pokemon-deck-list-85x11-scr.pdf";

export type CardType = "pokemon" | "trainer" | "energy";

export const generatePDF = async ({ deck, player }: { deck: Deck; player: Player }) => {
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

  if (player.dob) {
    page.drawText(formatMonth(player.dob.getMonth()), {
      x: 495,
      y: 715,
      size: 9,
      font: helvetica,
      color: rgb(0, 0, 0),
    });

    page.drawText(zeroPad(player.dob.getDate()), {
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
  }

  deck.pokemon.forEach((card, i) => {
    drawRow(page, helvetica, i, "pokemon", card);
  });

  deck.trainers.forEach((card, i) => {
    drawRow(page, helvetica, i, "trainer", card);
  });

  deck.energy.forEach((card, i) => {
    drawRow(page, helvetica, i, "energy", card);
  });

  return pdf;
};

export const toObjectURL = async (pdf: PDFDocument) => {
  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: "application/pdf" });

  return URL.createObjectURL(blob);
};

const drawRow = (page: PDFPage, font: PDFFont, rowNum: number, cardType: CardType, card: Card) => {
  let cardTypeOffset = 0;

  if (cardType == "trainer") {
    cardTypeOffset = 177;
  }

  if (cardType == "energy") {
    cardTypeOffset = 458;
  }

  const yOffset = 588 - rowNum * 13 - cardTypeOffset;
  const size = 8;

  page.drawText(card.quantity.toString(), {
    x: 272,
    y: yOffset,
    size,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(card.name, {
    x: 300,
    y: yOffset,
    size,
    font,
    color: rgb(0, 0, 0),
  });

  if (cardType == "pokemon") {
    page.drawText(card.set, {
      x: 475,
      y: yOffset,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(card.displayNumber, {
      x: 508,
      y: yOffset,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(card.regulationMark, {
      x: 555,
      y: yOffset,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }
};

const zeroPad = (n: number) => {
  let val = n.toString();

  if (val.length === 1) {
    val = "0" + val;
  }

  return val;
};

const formatMonth = (month: number) => zeroPad(month + 1);
