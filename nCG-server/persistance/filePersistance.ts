import { Hash } from "crypto";
import { Set } from "../types/set.ts";
import type Persistance from "./persistance.ts";
import * as fs from 'fs';
import type { Card } from "../types/card.ts";

type Deck = {}; // implement in types
type GameState = {}; // implement in types
type User = {}; // implement in types

const path:string = "./content/";
const setsPath:string = path + "sets/";
const cardsPath:string = path + "cards/";
const decksPath:string = path + "decks/";
const gameStatesPath:string = path + "gs/";
const usersPath:string = path + "users/";
const setsSuffix:string = ".json";
const cardsSuffix:string = ".json";
const decksSuffix:string = ".json";
const gameStatesSuffix:string = ".json";
const usersSuffix:string = ".json";
const setsFilePath = (set:string) => setsPath + set + setsSuffix;
const cardsFilePath = (set:string, card:string) => cardsPath + set + ":" + card + cardsSuffix;
const decksFilePath = (deck:string) => decksPath + Date.now() + decksSuffix;
const gameStatesFilePath = (gs:string) => gameStatesPath + Date.now() + gameStatesSuffix;
const usersFilePath = (user:string) => usersPath + Date.now() + usersSuffix;

var loadedDir:boolean = false;
if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}
export default class FilePersistance implements Persistance {
    existsSet(code: string): boolean {
        return(fs.existsSync(setsFilePath(code)));
    }
    existsCard(set: string | Set, cardNumber: string): boolean {
        var setCode:string;
        if (set instanceof Set) {
            setCode = set.code;
        } else {
            setCode = set;
        }
        return(fs.existsSync(cardsFilePath(setCode, cardNumber)));
    }
    existsDeck(deck: string): boolean {
        throw new Error("Method not implemented.");
    }

    storeSet(code: string, set: Set): Set {
        set.id = code;
        const content:string = JSON.stringify(set);
        if (!fs.existsSync(setsPath)) {
            fs.mkdirSync(setsPath);
        }
        fs.writeFileSync(setsFilePath(code), content);
        return set;
    }
    loadSet(set: string): Set {
        const setFilePath:string = setsFilePath(set);
        const content:string = fs.readFileSync(setFilePath).toString();
        const setObject:Set = JSON.parse(content);
        return setObject;
    }
    listSets(): Set[] {
        const files:string[] = fs.readdirSync(setsPath);
        const sets:Set[] = [];
        for (const setFileName of files) {
            const setFilePath:string = setsPath + setFileName;
            const content:string = fs.readFileSync(setFilePath).toString();
            const setObject:Set = JSON.parse(content);
            sets.push(setObject);
        }
        return sets;
    }
    storeCard(set: string | Set, cardNumber: string, card: Card): Card {
        card.id = card.set + "/" + cardNumber;
        const content:string = JSON.stringify(card);
        if (!fs.existsSync(cardsPath)) {
            fs.mkdirSync(cardsPath);
        }
        fs.writeFileSync(cardsFilePath(card.set, cardNumber), content);
        return card;
    }
    loadCard(set: string | Set, cardNumber: string): Card {
        var setCode:string;
        if (set instanceof Set) {
            setCode = set.code;
        } else {
            setCode = set;
        }
        const cardFilePath:string = cardsFilePath(setCode, cardNumber);
        const content:string = fs.readFileSync(cardFilePath).toString();
        const cardObject:Card = JSON.parse(content);
        return cardObject;
    }
    listCardsInSet(set: string | Set): Card[] {
        throw new Error("Method not implemented.");
    }
    addCardToSet(set: string | Set, card: Card): Set {
        throw new Error("Method not implemented.");
    }
    deleteSetCard(set: string | Set, card: Card): Set {
        throw new Error("Method not implemented.");
    }
    storeDeck(deck: {}): {} {
        throw new Error("Method not implemented.");
    }
    loadDeck(id: string): {} {
        throw new Error("Method not implemented.");
    }
    listDecks(): {}[] {
        throw new Error("Method not implemented.");
    }
    listCardsInDeck(deck: string | {}): Card[] {
        throw new Error("Method not implemented.");
    }
    addCardToDeck(deck: string | {}, card: Card): {} {
        throw new Error("Method not implemented.");
    }
    deleteDeckCard(deck: string | {}, card: Card): {} {
        throw new Error("Method not implemented.");
    }
    storeGameState(gameState: {}): {} {
        throw new Error("Method not implemented.");
    }
    loadGameState(id: string): {} {
        throw new Error("Method not implemented.");
    }
    listRunningGameStates(): {}[] {
        throw new Error("Method not implemented.");
    }
    listRunningGameStatesPertainingToUser(user: string | {}): {}[] {
        throw new Error("Method not implemented.");
    }
    storeUser(username: string, user: {}): {} {
        throw new Error("Method not implemented.");
    }
    loadUser(username: string): {} {
        throw new Error("Method not implemented.");
    }
    storeUserSet(set: string | Set, user: string | {}): { user: {}; set: Set; } {
        throw new Error("Method not implemented.");
    }
    storeUserDeck(deck: string | {}, user: string | {}): { user: {}; deck: {}; } {
        throw new Error("Method not implemented.");
    }
    listUserSets(user: string | {}): Set[] {
        throw new Error("Method not implemented.");
    }
    listUserDecks(user: string | {}): {}[] {
        throw new Error("Method not implemented.");
    }
    listCardsInUserSets(user: string | {}): Card[] {
        throw new Error("Method not implemented.");
    }
    deleteUserSet(user: string | {}, set: string | Set): {} {
        throw new Error("Method not implemented.");
    }
    deleteUserDeck(user: string | {}, deck: string | {}): {} {
        throw new Error("Method not implemented.");
    }
    
}