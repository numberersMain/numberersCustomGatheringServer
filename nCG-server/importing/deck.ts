import type express from "express";
import type { ParsedQs } from "qs";
import { instance } from "../persistance/persistance.ts";
import type { Card, CardIdentityWithAmount } from "../types/card.ts";
import { Deck } from "../types/deck.ts";
import { searchByCSVLine } from "./tappedOut.ts";


export async function importDeck(
  name: string,
  mainboard: CardIdentityWithAmount[],
  sideboard: CardIdentityWithAmount[],
  commanders: CardIdentityWithAmount[],
  companions: CardIdentityWithAmount[]
): Promise<Deck> {
  const deck = instance.storeDeck((instance.existsDeck(name)) ? instance.loadDeck(name) : new Deck(name));
  for (const cardWA of mainboard) {
    instance.addCardToDeck(deck, cardWA, "main");
  }
  for (const cardWA of sideboard) {
    instance.addCardToDeck(deck, cardWA, "side");
  }
  for (const cardWA of commanders) {
    instance.addCardToDeck(deck, cardWA, "cmdr");
  }
  for (const cardWA of companions) {
    instance.addCardToDeck(deck, cardWA, "cmp");
  }
  return deck;
}
export async function importDeckFromCSV(csv: string, name:string) {
  const mainboard: CardIdentityWithAmount[] = [];
  const sideboard: CardIdentityWithAmount[] = [];
  const commanders: CardIdentityWithAmount[] = [];
  const csvLines: string[] = csv.split("\n");
  for (var csvLine of csvLines) {
    if (csvLine.length != 0
      && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language,Commander\r"
      && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language\r") {
      const result = await searchByCSVLine(csvLine);
      switch (result.zone) {
        case "cmdr": {
          commanders.push(result.card);
          break;
        }
        case "main": {
          mainboard.push(result.card);
          break;
        }
        case "side": {
          sideboard.push(result.card);
          break;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  const deck = await importDeck(name, mainboard, sideboard, commanders, []);
  return deck;
}
