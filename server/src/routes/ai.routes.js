import express from 'express';
import {
  handleGenerateText,
  handleWeakKeyDrill,
  handleCodeSnippet,
  handleCoachFeedback,
  handleTypingChat,
} from '../controllers/ai.controller.js';

const router = express.Router();

// Public routes for AI features (allows both logged-in and guest users to experience AI)
router.post('/generate', handleGenerateText);
router.post('/weak-key-drill', handleWeakKeyDrill);
router.post('/code-snippet', handleCodeSnippet);
router.post('/coach-feedback', handleCoachFeedback);
router.post('/chat', handleTypingChat);

export default router;

