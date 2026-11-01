import { instance } from "../persistance/persistance.ts";
import { Entity } from "./entity.ts";

export function cardExists(set:string, cardNumber:string):boolean {
    return instance.existsCard(set, cardNumber);
}

export interface CardIdentity {
    set:string;
    cardNumber:string;
}

export interface CardIdentityWithAmount {
    card:CardIdentity;
    amount:number;
}

export class Card extends Entity implements CardIdentity {
    set:string;
    cardNumber:string; // collector number
    name:string = "NOT FILLED YET";
    flavorName?:string;
    typeLine:string = "NOT FILLED YET";
    manaValue:number = -1;
    manaCost:string = "NOT FILLED YET";
    colors:string = "NOT FILLED YET";
    colorIdentity:string = "NOT FILLED YET";
    oracleText?:string;
    power?:number;
    toughness?:number;
    startingLoyalty?:number;
    defense?:number;
    image?:string;
    artist?:string;
    borderColor:string = "NOT FILLED YET";
    flavorText?:string;

  constructor(set:string, cardNumber:string, id?:string) {
    super(id);
    this.set = set;
    this.cardNumber = cardNumber;
  }

  persist() {
    return instance.storeCard(this.set, this.cardNumber, this);
  }

  deepReducedCopyCard():CardIdentity {
    return {
        cardNumber: this.cardNumber,
        set: this.set
    }
  }
}

export class OfficialCard extends Card  {
  id:string = "NOT LOADED YET"; //scryfall id
  multiverseIds:string[] = ["NOT LOADED YET"];
  resourceId:string = "NOT LOADED YET";
  oracleId:string = "NOT LOADED YET";
  printsSearchURI:string = "NOT LOADED YET";
  rulingsURI:string = "NOT LOADED YET";
  scryfallURI:string = "NOT LOADED YET";
  uri:string = "NOT LOADED YET";
  artistIds:string[] = ["NOT LOADED YET"];

}