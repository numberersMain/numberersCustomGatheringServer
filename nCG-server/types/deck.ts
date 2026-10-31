import { instance } from "../persistance/persistance.ts";
import { type CardIdentity } from "./card.ts";
import { Entity } from "./entity.ts";

export function deckExists(id:string):boolean {
    return instance.existsDeck(id);
}

export type DeckZone = "main" | "side" | "cmdr" | "cmp";

export class Deck extends Entity {

  name:string = "NOT FILLED YET";
  mainboard:CardIdentity[] = [];
  sideboard:CardIdentity[] = [];
  commanders:CardIdentity[] = [];
  companions:CardIdentity[] = [];

  constructor(name:string, id?:string) {
    super(id);
    this.name = name;
  }

  persist() {
    return instance.storeDeck(this);
  }
}