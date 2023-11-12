import dotenv from 'dotenv';
import express, { Express } from 'express';
import createError from 'http-errors';
import apiRouter from './routes/api';

dotenv.config();

const app: Express = express();
const hostname = process.env.HOST ?? 'localhost';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.use((req, res, next) => {
  next(createError(404));
});

app.use('/api', apiRouter);

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
