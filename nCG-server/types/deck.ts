import { instance } from "../persistance/persistance.ts";
import { type CardIdentity, type CardIdentityWithAmount } from "./card.ts";
import { Entity } from "./entity.ts";

export function deckExists(id:string):boolean {
    return instance.existsDeck(id);
}

export type DeckZone = "main" | "side" | "cmdr" | "cmp";

export class Deck extends Entity {

  name:string = "NOT FILLED YET";
  mainboard:CardIdentityWithAmount[] = [];
  sideboard:CardIdentityWithAmount[] = [];
  commanders:CardIdentityWithAmount[] = [];
  companions:CardIdentityWithAmount[] = [];

  constructor(name:string, id?:string) {
    super(id);
    this.name = name;
  }
}