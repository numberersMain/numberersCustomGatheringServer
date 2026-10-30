import axios from "axios"
import { OfficialSet } from "../types/set.ts";
import { Card, OfficialCard } from "../types/card.ts";

const scryfallPath:string = "https://api.scryfall.com/";
const setsSFPath:string = scryfallPath + "sets/";
const cardsSFPath:string = scryfallPath + "cards/";
const searchCardByNameAndSetSFPath:string = cardsSFPath + "named?exact=";
const searchSetSuffix:string = "&set=";

export async function setExistsOfficially(code:string):Promise<boolean> {
    var existsOfficially:boolean = false;
    try {
        const response = await axios.get(setsSFPath + encodeURI(code));
        existsOfficially = response.status == 200;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return existsOfficially;
}

export async function cardExistsOfficially(set:string, cardNumber:string):Promise<boolean> {
    var existsOfficially:boolean = false;
    try {
        const response = await axios.get(cardsSFPath + encodeURI(set) + "/" + encodeURI(cardNumber));
        existsOfficially = response.status == 200;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return existsOfficially;
}

export async function loadSetFromScryfall(code:string):Promise<OfficialSet> {
    const set:OfficialSet = new OfficialSet(code);
    try {
        const response = await axios.get(setsSFPath + encodeURI(code));
        set.code = response.data.code;
        set.cardCount = response.data.card_count;
        set.name = response.data.name;
        set.printSize = response.data.printed_size;
        set.scryfallUri = response.data.scryfall_uri;
        set.searchUri = response.data.search_uri;
        set.uri = response.data.uri;
        set.icon = {
            data: (await axios.get(response.data.icon_svg_uri)).data,
            type: "svg"
        }
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return set;
}

export async function searchCardOnScryfall(cardName:string, set?:string):Promise<OfficialCard> {
    const searchPath:string = searchCardByNameAndSetSFPath + cardName + ((set != undefined) ? searchSetSuffix + set : "");
    try {
        const response = await axios.get(searchPath);
        const card:OfficialCard = new OfficialCard("temp", response.data.collector_number);
        card.artist = response.data.artist;
        card.artistIds = response.data.artist_ids;
        card.borderColor = response.data.border_color;
        card.cardNumber = response.data.collector_number;
        card.colorIdentity = response.data.color_identity.join();
        card.colors = response.data.colors.join();
        card.defense = response.data.defense;
        card.flavorName = response.data.flavor_name;
        card.flavorText = response.data.flavor_text;
        card.image = (await axios.get(response.data.image_uris.large)).data;
        card.manaCost = response.data.mana_cost;
        card.manaValue = response.data.cmc;
        card.multiverseIds = response.data.multiverse_ids;
        card.name = response.data.name;
        card.oracleId = response.data.oracle_id;
        card.oracleText = response.data.oracle_text;
        card.power = response.data.power;
        card.printsSearchURI = response.data.prints_search_uri;
        card.resourceId = response.data.resource_id;
        card.rulingsURI = response.data.rulings_uri;
        card.scryfallURI = response.data.scryfall_uri;
        card.set = response.data.set;
        card.startingLoyalty = response.data.loyalty;
        card.toughness = response.data.toughness;
        card.typeLine = response.data.type_line;
        card.uri = response.data.uri;
        return card;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
        return new OfficialCard("XXX", "XXX");
    }
}

export async function loadCardFromScryfall(set:string, cardNumber:string):Promise<OfficialCard> {
    const card:OfficialCard = new OfficialCard(set, cardNumber);
    try {
        const response = await axios.get(cardsSFPath + encodeURI(set) + "/" + encodeURI(cardNumber));
        card.artist = response.data.artist;
        card.artistIds = response.data.artist_ids;
        card.borderColor = response.data.border_color;
        card.cardNumber = response.data.collector_number;
        card.colorIdentity = response.data.color_identity.join();
        card.colors = response.data.colors.join();
        card.defense = response.data.defense;
        card.flavorName = response.data.flavor_name;
        card.flavorText = response.data.flavor_text;
        card.image = (await axios.get(response.data.image_uris.large)).data;
        card.manaCost = response.data.mana_cost;
        card.manaValue = response.data.cmc;
        card.multiverseIds = response.data.multiverse_ids;
        card.name = response.data.name;
        card.oracleId = response.data.oracle_id;
        card.oracleText = response.data.oracle_text;
        card.power = response.data.power;
        card.printsSearchURI = response.data.prints_search_uri;
        card.resourceId = response.data.resource_id;
        card.rulingsURI = response.data.rulings_uri;
        card.scryfallURI = response.data.scryfall_uri;
        card.set = response.data.set;
        card.startingLoyalty = response.data.loyalty;
        card.toughness = response.data.toughness;
        card.typeLine = response.data.type_line;
        card.uri = response.data.uri;
    } catch (error) {
        console.log('Unexpected error ', error); // even a 404 will land here
    }
    return card;
}