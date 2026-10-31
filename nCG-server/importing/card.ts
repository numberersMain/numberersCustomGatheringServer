import { instance } from "../persistance/persistance.ts";
import { Card, cardExists } from "../types/card.ts";
import { cardExistsOfficially, loadCardFromScryfall } from "../web/index.ts";


export async function cardFrom(set: string, cardNumber: string): Promise<Card> {
    if (cardExists(set, cardNumber)) { // Set found in list of existing sets; no web call needed
        return instance.loadCard(set, cardNumber);
    } else if (await cardExistsOfficially(set, cardNumber)) { // See if official/custom; if official load from scryfall
        return (await loadCardFromScryfall(set, cardNumber)).persist();
    } else { // Set not official and not in local list; create new custom set
        return (new Card(set, cardNumber)).persist();
    }
}
