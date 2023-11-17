import express from 'express';
import healthCheckRouter from './health-check';

const router = express.Router();

router.use('/health-check', healthCheckRouter);

export default router;
