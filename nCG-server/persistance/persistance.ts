import { Set } from "../types/set";

type Card = {}; // implement in types
type Deck = {}; // implement in types
type GameState = {}; // implement in types
type User = {}; // implement in types

export default interface Persistance {
    storeSet(code:string, set:Set):Set;
    loadSet(set:string):Set;
    listSets():Set[];

    storeCard(set:string|Set, cardNumber:string, card:Card):Card;
    loadCard(set:string|Set, cardNumber:string):Card;
    listCardsInSet(set:string|Set):Card[];
    addCardToSet(set:string|Set, card:string|Card):Set;
    deleteSetCard(set:string|Set, card:string|Card):Set;

    storeDeck(deck:Deck):Deck;
    loadDeck(id:string):Deck;
    listDecks():Deck[];
    listCardsInDeck(deck:string|Deck):Card[];
    addCardToDeck(deck:string|Deck, card:string|Card):Deck;
    deleteDeckCard(deck:string|Deck, card:string|Card):Deck;

    storeGameState(gameState:GameState):GameState;
    loadGameState(id:string):GameState;
    listRunningGameStates():GameState[];
    listRunningGameStatesPertainingToUser(user:string|User):GameState[];

    storeUser(username:string, user:User):User;
    loadUser(username:string):User;
    storeUserSet(set:string|Set, user:string|User):{user:User, set:Set};
    storeUserDeck(deck:string|Deck, user:string|User):{user:User, deck:Deck};
    listUserSets(user:string|User):Set[];
    listUserDecks(user:string|User):Deck[];
    listCardsInUserSets(user:string|User):Card[];
    deleteUserSet(user:string|User, set:string|Set):User;
    deleteUserDeck(user:string|User, deck:string|Deck):User;
}