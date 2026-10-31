import express, { type Express, type Request, type Response } from 'express';
import { setFrom as setFrom } from "./importing/set.ts";
import { Card } from './types/card.ts';
import { cardFrom } from "./importing/card.ts";
import { searchByCSVLine } from "./importing/tappedOut.ts";
import { searchByTappedOutLine } from "./importing/tappedOut.ts";
import type Persistance from './persistance/persistance.ts';
import FilePersistance from './persistance/filePersistance.ts';
import { instance } from './persistance/persistance.ts';
import { importDeck } from "./importing/deck.ts";

const app: Express = express();

const persistance:Persistance = new FilePersistance();

app.use(express.text({type: "text/csv"}));

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
    const cards:Card[] = [];
    const csvLines:string[] = csv.split("\n");
    for (var csvLine of csvLines) {
      if (csvLine.length != 0 && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language,Commander") {
        cards.push((await searchByCSVLine(csvLine)).card);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  res.json(cards);
});

app.post('/deck/import/csv/:name', async (req: Request<{name:string}>, res: Response) => {
  const csv:string = req.body;
  console.log(csv);
  console.log(req);
    const mainboard:Card[] = [];
    const sideboard:Card[] = [];
    const commanders:Card[] = [];
    const csvLines:string[] = csv.split("\n");
    for (var csvLine of csvLines) {
      if (csvLine.length != 0 && csvLine != "Board,Qty,Name,Printing,Foil,Alter,Signed,Condition,Language,Commander\r") {
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



app.listen(3000);