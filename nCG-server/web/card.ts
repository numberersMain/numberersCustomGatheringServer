import type { Card } from "../types/card.ts";
import { searchCardOnScryfall } from "./index.ts";


export async function searchBySetAndName(set: string, cardName: string): Promise<Card> {
    return (await searchCardOnScryfall(cardName, set)).persist();
}

export async function searchByName(cardName: string): Promise<Card> {
    return (await searchCardOnScryfall(cardName)).persist();
}
