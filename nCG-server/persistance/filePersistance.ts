import { Hash } from "crypto";
import { CustomSet, Set } from "../types/set.ts";
import type Persistance from "./persistance.ts";
import * as fs from 'fs';
import type { Card, CardIdentity } from "../types/card.ts";
import { Deck, type DeckZone } from "../types/deck.ts";

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
const decksFilePath = (deck:string) => decksPath + deck + decksSuffix;
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
        return(fs.existsSync(decksFilePath(deck)));
    }

    storeSet(code: string, set: Set): Set {
        set.id = code;
        const content:string = JSON.stringify(set, null, 4);
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
        const content:string = JSON.stringify(card, null, 4);
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
    listCardsInSet(set: string | Set, zone?:DeckZone): Card[] {
        var setCode:string;
        if (set instanceof Set) {
            setCode = set.code;
        } else {
            setCode = set;
        }
        const files:string[] = fs.readdirSync(cardsPath);
        const cards:Card[] = [];
        for (const cardFileName of files) {
            const cardFilePath:string = cardsFilePath + cardFileName;
            const content:string = fs.readFileSync(cardFilePath).toString();
            const cardObject:Card = JSON.parse(content);
            if (cardObject.set == setCode)
                cards.push(cardObject);
        }
        return cards;
    }
    addCardToSet(set: string | CustomSet, cardNumber: string, card: Card): Set {
        var setCode:string;
        if (set instanceof Set) {
            setCode = set.code;
        } else {
            setCode = set;
        }
        const newCard:Card = structuredClone(card);
        newCard.set = setCode;
        newCard.cardNumber = cardNumber;
        newCard.id = setCode + "/" + cardNumber;
        this.storeCard(setCode, cardNumber, newCard);
        return this.loadSet(setCode);
    }
    deleteSetCard(set: string | Set, card: Card): Set {
        throw new Error("Method not implemented.");
    }
    storeDeck(deck: Deck): Deck {
        deck.id = deck.name;
        const content:string = JSON.stringify(deck, null, 4);
        if (!fs.existsSync(decksPath)) {
            fs.mkdirSync(decksPath);
        }
        fs.writeFileSync(decksFilePath(deck.name), content);
        return deck;
    }
    loadDeck(id: string): Deck {
        const deckFilePath:string = decksFilePath(id);
        const content:string = fs.readFileSync(deckFilePath).toString();
        const deckObject:Deck = JSON.parse(content);
        return deckObject;
    }
    listDecks(): Deck[] {
        const files:string[] = fs.readdirSync(decksPath);
        const decks:Deck[] = [];
        for (const deckFileName of files) {
            const deckFilePath:string = decksPath + deckFileName;
            const content:string = fs.readFileSync(deckFilePath).toString();
            const deckObject:Deck = JSON.parse(content);
            decks.push(deckObject);
        }
        return decks;
    }
    listCardsInDeck(deck: string | Deck, zone?:DeckZone): Card[] {
        if (deck instanceof Deck) {
            deck = deck;
        } else {
            deck = this.loadDeck(deck);
        }
        const files:string[] = fs.readdirSync(decksPath);
        const cards:Card[] = [];
        var cardIdentities:CardIdentity[];
        if (zone) {
            switch (zone) {
                case ("cmdr"): {
                    cardIdentities = deck.commanders;
                    break;
                }
                case ("cmp"): {
                    cardIdentities = deck.companions;
                    break;
                }
                case ("main"): {
                    cardIdentities = deck.mainboard;
                    break;
                }
                case ("side"): {
                    cardIdentities = deck.sideboard;
                    break;
                }
            }
        } else {
            cardIdentities = new Array().concat(deck.commanders, deck.companions, deck.mainboard, deck.sideboard);
        }
        for (const cardIdentity of cardIdentities) {
            const card = this.loadCard(cardIdentity.set, cardIdentity.cardNumber);
            cards.push(card);
        }
        return cards;
    }
    addCardToDeck(deck: string | Deck, card: Card, zone:DeckZone): Deck {
        if (!(deck instanceof Deck))
            deck = this.loadDeck(deck);
        switch (zone) {
            case "cmdr": {
                deck.commanders.push(card);
                break;
            }
            case "cmp": {
                deck.companions.push(card);
                break;
            }
            case "main": {
                deck.mainboard.push(card);
                break;
            }
            case "side": {
                deck.sideboard.push(card);
            }
        }
        return this.storeDeck(deck);
    }
    deleteDeckCard(deck: string | Deck, card: Card, zone:DeckZone): Deck {
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
    storeUserDeck(deck: string | Deck, user: string | {}): { user: {}; deck: Deck; } {
        throw new Error("Method not implemented.");
    }
    listUserSets(user: string | {}): Set[] {
        throw new Error("Method not implemented.");
    }
    listUserDecks(user: string | User): Deck[] {
        throw new Error("Method not implemented.");
    }
    listCardsInUserSets(user: string | {}): Card[] {
        throw new Error("Method not implemented.");
    }
    deleteUserSet(user: string | {}, set: string | Set): {} {
        throw new Error("Method not implemented.");
    }
    deleteUserDeck(user: string | {}, deck: string | Deck): {} {
        throw new Error("Method not implemented.");
    }
    
}