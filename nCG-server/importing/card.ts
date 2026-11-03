import { instance } from "../persistance/persistance.ts";
import { Card, cardExists, OfficialCard } from "../types/card.ts";
import { OfficialSet, type Set } from "../types/set.ts";
import { cardExistsOfficially, loadCardFromScryfall } from "../web/index.ts";
import { setFrom } from "./set.ts";


export async function cardFrom(set: string, cardNumber: string): Promise<Card> {
    if (cardExists(set, cardNumber)) { // Set found in list of existing sets; no web call needed
        return instance.loadCard(set, cardNumber);
    } else if (await cardExistsOfficially(set, cardNumber)) { // See if official/custom; if official load from scryfall
        return (await loadCardFromScryfall(set, cardNumber)).persist();
    } else { // Set not official and not in local list; create new custom set
        return (new Card(set, cardNumber)).persist();
    }
}

export async function importCardsForOfficialSet(set: string): Promise<OfficialCard[]> {
    const setObject:any = await setFrom(set);
    const cards:OfficialCard[] = [];
    for (let cardNumber = 1; cardNumber <= setObject.printSize; cardNumber++) {
        const card:any = await cardFrom(set, cardNumber.toString());
        cards.push(card);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return cards;
}

export async function importCardsForCustomSet(set: string, cardsXml:string): Promise<Card[]> {
    throw new Error("Not implemented yet");
}
