import express from 'express';
import { getPublicStats } from '../controllers/publicStats.controller.js';

const router = express.Router();

router.get('/', getPublicStats);

export default router;