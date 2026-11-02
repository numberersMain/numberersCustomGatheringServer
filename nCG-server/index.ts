import express, { type Express, type Request, type Response } from 'express';
import { setFrom as setFrom } from "./importing/set.ts";
import { Card, type CardIdentity, type CardIdentityWithAmount } from './types/card.ts';
import { cardFrom } from "./importing/card.ts";
import { searchByCSVLine } from "./importing/tappedOut.ts";
import { searchByTappedOutLine } from "./importing/tappedOut.ts";
import type Persistance from './persistance/persistance.ts';
import FilePersistance from './persistance/filePersistance.ts';
import { instance } from './persistance/persistance.ts';
import { importDeck } from "./importing/deck.ts";
import { loadImage } from './web/index.ts';

const app: Express = express();

const persistance:Persistance = new FilePersistance();

app.use(express.text({type: "text/csv"}));
app.use(express.raw({type: "image/png", limit: "400kb"}));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/set/:code', async (req: Request<{code:string}>, res: Response) => {
    const code:string = req.params.code;
  res.json(await setFrom(code));
});
app.get('/set', async (req: Request, res: Response) => {
  res.json(instance.listSets());
});

app.get('/card/set/:set/:cardNumber', async (req: Request<{set:string, cardNumber:string}>, res: Response) => {
    const set:string = req.params.set;
    const cardNumber:string = req.params.cardNumber;
  res.json(await cardFrom(set, cardNumber));
});

app.get('/card/to/:tol', async (req: Request<{tol:string}>, res: Response) => {
    const tol:string = req.params.tol;
  res.json(await searchByTappedOutLine(tol));
});

app.get('/card/csv/:csv', async (req: Request<{csv:string}>, res: Response) => {
    const csv:string = req.params.csv;
  res.json(await searchByCSVLine(csv));
});

app.post('/cards/import/csv', async (req: Request, res: Response) => {
  const csv:string = req.body;
    const cards:CardIdentity[] = [];
    const csvLines:string[] = csv.split("\n");
    for (var csvLine of csvLines) {
      if (csvLine.length != 0 && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language,Commander") {
        cards.push((await searchByCSVLine(csvLine)).card.card);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  res.json(cards);
});

app.post('/deck/import/csv/:name', async (req: Request<{name:string}>, res: Response) => {
  const csv:string = req.body;
    const mainboard:CardIdentityWithAmount[] = [];
    const sideboard:CardIdentityWithAmount[] = [];
    const commanders:CardIdentityWithAmount[] = [];
    const csvLines:string[] = csv.split("\n");
    for (var csvLine of csvLines) {
      if (
        csvLine.length != 0
        && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language,Commander\r"
        && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language\r"
      ) {
        const result = await searchByCSVLine(csvLine);
        switch (result.zone) {
          case "cmdr": {
            commanders.push(result.card);
            break;
          }
          case "main": {
            mainboard.push(result.card);
            break;
          }
          case "side": {
            sideboard.push(result.card);
            break;
          }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  res.json(importDeck(req.params.name, mainboard, sideboard, commanders, []));
});

app.get('/deck/id/:id', async (req: Request<{id:string}>, res: Response) => {
    const id:string = req.params.id;
    if (instance.existsDeck(id))
      res.json(instance.loadDeck(id));
    else {
      res.status(404);
      res.send("Deck not found");
    }
});
app.get('/deck', async (req: Request, res: Response) => {
  res.json(instance.listDecks());
});

app.get('/card/set/:set/:cardNumber/image', async (req: Request<{set:string, cardNumber:string}>, res: Response) => {
  res.type("image/png");
  res.send((await instance.loadImage(req.params.set, req.params.cardNumber)));
});
app.post('/card/set/:set/:cardNumber/image', async (req: Request<{set:string, cardNumber:string}>, res: Response) => {
  res.type("image/png");
  res.send(instance.storeImage(req.params.set, req.params.cardNumber, req.body));
});



app.listen(3000);