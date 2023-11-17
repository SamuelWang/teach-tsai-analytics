import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  const now = new Date();
  res.send(now.toLocaleString());
});

export default router;
