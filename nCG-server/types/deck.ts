import { instance } from "../persistance/persistance.ts";
import { Entity } from "./entity.ts";

export function deckExists(id:string):boolean {
    return instance.existsDeck(id);
}

export class Deck extends Entity {

  name:string = "NOT FILLED YET";
  mainboard:{set:string, cardNumber:string}[] = [];
  sideboard:{set:string, cardNumber:string}[] = [];
  commanders:{set:string, cardNumber:string}[] = [];
  companions:{set:string, cardNumber:string}[] = [];

  constructor(name:string, id?:string) {
    super(id);
    this.name = name;
  }

  persist() {
    return instance.storeDeck(this);
  }
}