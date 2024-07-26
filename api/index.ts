import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import createError from 'http-errors';
import * as DataAccess from '../data-access';
import { analyseReplies } from '../services/analysis';
import { generateContentFromMealGroups, getReplies } from '../services/message';
import { startAnalysisJob } from '../services/job';

dotenv.config();

const app: Express = express();
const hostname = process.env.HOST ?? 'localhost';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.get('/counting/post', async (req: Request, res: Response) => {
  if (req.query['key'] !== process.env.ACCESS_KEY) {
    res.sendStatus(401);
    return;
  }

  const replies = await getReplies();
  const groups = analyseReplies(replies);
  const content = generateContentFromMealGroups(groups);
  const channelId = process.env.COUNTER_CHANNEL_ID ?? '';
  const postResult = await DataAccess.Slack.Chat.postMessage(
    channelId,
    content,
  );

  res.sendStatus(postResult.ok ? 204 : 500);
});

app.post('/cron-job', (req: Request, res: Response) => {
  if (req.query['key'] !== process.env.ACCESS_KEY) {
    res.sendStatus(401);
    return;
  }

  startAnalysisJob();

  res.sendStatus(201);
});

app.get('/', (_req: Request, res: Response) => {
  res.send("Hi, I'm Teacher Tsai Counter.");
});

app.use((req: Request, res: Response, next) => {
  next(createError(404));
});

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
});
