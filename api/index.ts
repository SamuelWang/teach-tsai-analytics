import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import createError from 'http-errors';

dotenv.config();

const app: Express = express();
const hostname = process.env.HOST ?? 'localhost';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.get('/', (_req: Request, res: Response) => {
  res.send("Hi, I'm Teacher Tsai Counter.");
});

app.use((req: Request, res: Response, next) => {
  next(createError(404));
});

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
