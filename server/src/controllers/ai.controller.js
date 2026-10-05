import {
  generateTypingText,
  generateWeakKeyDrill,
  generateCodeSnippet,
  generateCoachFeedback,
  generateTypingChatResponse,
} from '../services/ai.service.js';

/**
 * @desc Generate AI typing passage
 * @route POST /api/ai/generate
 * @access Public / Private
 */
export const handleGenerateText = async (req, res, next) => {
  try {
    const { topic = 'Technology and Innovation', difficulty = 'medium', wordCount = 50 } = req.body;

    if (topic && typeof topic === 'string' && topic.length > 300) {
      return res.status(400).json({ success: false, message: 'Topic prompt must be under 300 characters.' });
    }

    const safeWordCount = Math.min(150, Math.max(15, Number(wordCount) || 50));
    const result = await generateTypingText({ topic, difficulty, wordCount: safeWordCount });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error - generateText]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI typing text. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc Generate AI drill for weak keys
 * @route POST /api/ai/weak-key-drill
 * @access Public / Private
 */
export const handleWeakKeyDrill = async (req, res, next) => {
  try {
    const { weakKeys = [], wordCount = 35 } = req.body;

    if (!Array.isArray(weakKeys) || weakKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one target weak key.',
      });
    }

    // Filter valid alphanumeric keys
    const sanitizedKeys = weakKeys
      .map((k) => String(k).trim())
      .filter((k) => k.length === 1 && /[a-zA-Z0-9;,.]/.test(k))
      .slice(0, 6);

    if (sanitizedKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid weak keys provided.',
      });
    }

    const result = await generateWeakKeyDrill({ weakKeys: sanitizedKeys, wordCount });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error - weakKeyDrill]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate weak key drill.',
      error: error.message,
    });
  }
};

/**
 * @desc Generate AI Code Snippet for developers
 * @route POST /api/ai/code-snippet
 * @access Public / Private
 */
export const handleCodeSnippet = async (req, res, next) => {
  try {
    const { language = 'javascript', topic = 'algorithms' } = req.body;

    const allowedLanguages = ['javascript', 'python', 'cpp', 'java', 'react', 'html', 'sql', 'typescript'];
    const safeLang = allowedLanguages.includes(language.toLowerCase()) ? language.toLowerCase() : 'javascript';

    const result = await generateCodeSnippet({ language: safeLang, topic });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error - codeSnippet]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate code snippet.',
      error: error.message,
    });
  }
};

/**
 * @desc Generate Post-Test AI Coach Feedback
 * @route POST /api/ai/coach-feedback
 * @access Public / Private
 */
export const handleCoachFeedback = async (req, res, next) => {
  try {
    const { wpm = 0, accuracy = 100, consistency = 80, duration = 30, mistakesCount = 0 } = req.body;

    const result = await generateCoachFeedback({
      wpm: Number(wpm),
      accuracy: Number(accuracy),
      consistency: Number(consistency),
      duration: Number(duration),
      mistakesCount: Number(mistakesCount),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error - coachFeedback]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate coach feedback.',
      error: error.message,
    });
  }
};

/**
 * @desc Interactive AI Typing Chatbot Coach
 * @route POST /api/ai/chat
 * @access Public / Private
 */
export const handleTypingChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    if (message.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long (maximum 10,000 characters).',
      });
    }

    const result = await generateTypingChatResponse({ message: message.trim(), history });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error - typingChat]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message.',
      error: error.message,
    });
  }
};

