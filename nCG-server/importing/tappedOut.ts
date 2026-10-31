import { Card, cardExists } from "../types/card.ts";
import { searchBySetAndName, searchByName } from "../web/card.ts";
import type { DeckZone } from "../types/deck.ts";


export async function searchByTappedOutLine(toDeckListLine: string): Promise<Card> {
    const params: string[] | undefined = toDeckListLine.split("x ", 2)[1]?.split(" (");
    if (params != undefined) {
        const name: string | undefined = params[0];
        const set: string | undefined = params[1]?.split(")")[0];
        if (name != undefined && set != undefined) {
            return await searchBySetAndName(set, name);
        } else if (name != undefined) {
            return await searchByName(name);
        }
    }
    throw new Error("Invalid format!");
}export async function searchByCSVLine(csvDeckListLine: string): Promise<{ card: Card; zone: DeckZone; }> {
    const regex = /("[^"]+"|[^,]+)*,/g;
    const params: string[] | undefined = csvDeckListLine.split(regex);
    if (params != undefined) {
        const name: string | undefined = params[5];
        const set: string | undefined = params[7];
        const zoneString: string | undefined = params[1];
        const cmdrBool: boolean | undefined = params[18] != "\r" && Boolean(params[18]);
        const zone: DeckZone = cmdrBool ? "cmdr" : zoneString == "main" ? "main" : "side";
        try {
            if (name != undefined && set != undefined) {
                return { card: await searchBySetAndName(set, name), zone };
            } else if (name != undefined) {
                return { card: await searchByName(name), zone };
            }
        } catch (error) {
            console.log([name, set, zoneString, cmdrBool, zone].join())
        }
    }
    throw new Error("Invalid format!");
}

