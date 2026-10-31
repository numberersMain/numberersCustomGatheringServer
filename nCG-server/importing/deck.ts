import { instance } from "../persistance/persistance.ts";
import type { Card } from "../types/card.ts";
import { Deck } from "../types/deck.ts";


export async function importDeck(name: string, mainboard: Card[], sideboard: Card[], commanders: Card[], companions: Card[]): Promise<Deck> {
  const deck = ((instance.existsDeck(name)) ? instance.loadDeck(name) : new Deck(name));
  for (const card of mainboard) {
    instance.addCardToDeck(deck, card, "main");
  }
  for (const card of sideboard) {
    instance.addCardToDeck(deck, card, "side");
  }
  for (const card of commanders) {
    instance.addCardToDeck(deck, card, "cmdr");
  }
  for (const card of companions) {
    instance.addCardToDeck(deck, card, "cmp");
  }
  return deck;
}
