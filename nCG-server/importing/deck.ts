import { instance } from "../persistance/persistance.ts";
import type { Card, CardIdentityWithAmount } from "../types/card.ts";
import { Deck } from "../types/deck.ts";


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
