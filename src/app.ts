import dotenv from 'dotenv';
import express, { Express } from 'express';
import createError from 'http-errors';
import apiRouter from './routes/api';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  next(createError(404));
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
