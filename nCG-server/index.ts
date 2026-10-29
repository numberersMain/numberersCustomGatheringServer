import express, { type Express, type Request, type Response } from 'express';
import { from as setFrom } from './types/set.ts';
import type Persistance from './persistance/persistance.ts';
import FilePersistance from './persistance/filePersistance.ts';

const app: Express = express();

const persistance:Persistance = new FilePersistance();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/set/:code', async (req: Request<{code:string}>, res: Response) => {
    const code:string = req.params.code;
  res.json(await setFrom(code));
});

app.listen(3000);