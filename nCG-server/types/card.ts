import { instance } from "../persistance/persistance.ts";
import { cardExistsOfficially, loadCardFromScryfall, searchCardOnScryfall } from "../web/index.ts";
import { Entity } from "./entity.ts";

export function cardExists(set:string, cardNumber:string):boolean {
    return instance.existsCard(set, cardNumber);
}

export class Card extends Entity {
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

export async function from(set:string, cardNumber:string):Promise<Card> {
    if (cardExists(set, cardNumber)) { // Set found in list of existing sets; no web call needed
        return instance.loadCard(set, cardNumber);
    } else if (await cardExistsOfficially(set, cardNumber)) { // See if official/custom; if official load from scryfall
        return (await loadCardFromScryfall(set, cardNumber)).persist();
    } else { // Set not official and not in local list; create new custom set
        return (new Card(set, cardNumber)).persist();
    }
}

export async function searchBySetAndName(set:string, cardName:string):Promise<Card> {
    return (await searchCardOnScryfall(cardName, set)).persist();
}

export async function searchByName(cardName:string):Promise<Card> {
    return (await searchCardOnScryfall(cardName)).persist();
}

export async function searchByTappedOutLine(toDeckListLine:string):Promise<Card> {
    const params:string[] | undefined = toDeckListLine.split("x ", 2)[1]?.split(" (");
    if (params != undefined) {
        const name:string | undefined = params[0];
        const set:string | undefined = params[1]?.split(")")[0];
        if (name != undefined && set != undefined) {
            return await searchBySetAndName(set, name);
        } else if (name != undefined) {
            return await searchByName(name);
        }
    }
    throw new Error("Invalid format!");
}

export async function searchByCSVLine(csvDeckListLine:string):Promise<Card> {
    console.log(csvDeckListLine);
    const regex = /("[^"]+"|[^,]+)*,/g;
    const params:string[] | undefined = csvDeckListLine.split(regex);
    console.log(params);
    if (params != undefined) {
        const name:string | undefined = params[5];
        const set:string | undefined = params[7];
        if (name != undefined && set != undefined) {
            return await searchBySetAndName(set, name);
        } else if (name != undefined) {
            return await searchByName(name);
        }
    }
    throw new Error("Invalid format!");
}