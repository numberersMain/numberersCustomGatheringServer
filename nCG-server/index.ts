import express, { type Express, type Request, type Response } from 'express';
import { from as setFrom } from './types/set.ts';
import { from as cardFrom, searchByCSVLine, searchByTappedOutLine } from './types/card.ts';
import type Persistance from './persistance/persistance.ts';
import FilePersistance from './persistance/filePersistance.ts';
import { instance } from './persistance/persistance.ts';

const app: Express = express();

const persistance:Persistance = new FilePersistance();

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

app.listen(3000);