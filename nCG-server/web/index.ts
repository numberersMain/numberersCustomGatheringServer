import axios from "axios"
import { OfficialSet } from "../types/set.ts";

const scryfallPath:string = "https://api.scryfall.com/sets/";

export async function setExistsOfficially(code:string):Promise<boolean> {
    var existsOfficially:boolean = false;
    try {
        const response = await axios.get(scryfallPath + encodeURI(code));
        existsOfficially = response.status == 200;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return existsOfficially;
}

export async function loadSetFromScryfall(code:string):Promise<OfficialSet> {
    const set:OfficialSet = new OfficialSet(code);
    try {
        const response = await axios.get(scryfallPath + encodeURI(code));
        set.code = response.data.code;
        set.cardCount = response.data.card_count;
        set.name = response.data.name;
        set.printSize = response.data.printed_size;
        set.scryfallUri = response.data.scryfall_uri;
        set.searchUri = response.data.search_uri;
        set.uri = response.data.uri;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return set;
}