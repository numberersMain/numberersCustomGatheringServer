import express, { type Express, type Request, type Response } from 'express';
import { importSetFromMSE, setFrom as setFrom } from "./importing/set.ts";
import { Card, type CardIdentity } from './types/card.ts';
import { cardFrom, importCardsForCustomSet, importCardsForOfficialSet } from "./importing/card.ts";
import { searchByCSVLine } from "./importing/tappedOut.ts";
import { searchByTappedOutLine } from "./importing/tappedOut.ts";
import type Persistance from './persistance/persistance.ts';
import FilePersistance from './persistance/filePersistance.ts';
import { instance } from './persistance/persistance.ts';
import { importDeckFromCSV } from "./importing/deck.ts";
import { loadImage } from './web/index.ts';
import { MIMEType } from 'node:util';
import { Gzip } from 'node:zlib';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Express = express();

const persistance:Persistance = new FilePersistance();

app.use(express.text({type: "text/csv"}));
app.use(express.raw({type: "image/png", limit: "400kb"}));
app.use(express.raw({type: "application/zip", limit: "100mb"}));
app.use(express.text({type: "text/xml", limit: "100mb"}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc({
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'nCGServer Swagger UI',
      version: '1.0.0',
    },
  },
  apis: ['./index.ts', './nCG-server/index.ts']
})));

/**
 * @openapi
 * /:
 *   get:
 *     description: Hello World
 *     summary: Hello World
 *     responses:
 *       200:
 *         description: Returns hello world.
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

/**
 * @openapi
 * /set/{code}:
 *   get:
 *     description: Set
 *     summary: Set
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Set code.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns set metadata
 */
app.get('/set/:code', async (req: Request<{code:string}>, res: Response) => {
    const code:string = req.params.code;
  res.json(await setFrom(code));
});
/**
 * @openapi
 * /set:
 *   get:
 *     description: List of Sets
 *     summary: List of Sets
 *     responses:
 *       200:
 *         description: Returns set metadata
 */
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
app.get('/card/set/:set', async (req: Request<{set:string}>, res: Response) => {
  res.json(instance.listCardsInSet(req.params.set));
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
    const deck = await importDeckFromCSV(csv, req.params.name);
  res.json(deck);
});

app.post('/set/mse', async (req: Request, res: Response) => {
  const set = await importSetFromMSE(req.body);
  res.json(set);
});
app.post('/set/mse/cards/:code', async (req: Request<{code:string}>, res: Response) => {
  const cards = await importCardsForCustomSet(req.params.code, req.body);
  res.json(cards);
});
app.post('/set/to/:code/cards', async (req: Request<{code:string}>, res: Response) => {
  const cards = await importCardsForOfficialSet(req.params.code);
  res.json(cards);
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


