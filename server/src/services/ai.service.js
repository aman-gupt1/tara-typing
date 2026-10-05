import Groq from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from environment variables.');
  }
  return new Groq({ apiKey });
};

const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

/**
 * Clean up text to be ready for typing test
 */
const cleanTypingText = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/```[a-zA-Z]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();
};

/**
 * Generate clean typing passage based on topic & difficulty
 */
export const generateTypingText = async ({ topic = 'Technology', difficulty = 'medium', wordCount = 50 }) => {
  const groq = getGroqClient();

  const difficultyPrompt = {
    easy: 'Use simple, common words and standard sentence structure.',
    medium: 'Use balanced vocabulary and natural punctuation (commas, periods).',
    hard: 'Use advanced vocabulary, varied punctuation, numbers, and hyphens.',
  }[difficulty.toLowerCase()] || 'Use balanced vocabulary and natural punctuation.';

  const systemMessage = 'You are a high-speed typing test text generator. You output ONLY the raw, pure paragraph text for the user to type. Never use markdown, never use quotes, and never include conversational filler like "Here is your text:".';
  const userMessage = `Topic: "${topic}".
Target length: around ${wordCount} words (between ${Math.max(20, wordCount - 10)} and ${wordCount + 15} words).
Difficulty: ${difficultyPrompt}
Generate a single cohesive paragraph.`;

  try {
    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = cleanTypingText(response.choices[0]?.message?.content);
    return { text, topic, wordCount: text.split(/\s+/).filter(Boolean).length, model: PRIMARY_MODEL };
  } catch (error) {
    console.warn(`[Groq Primary Error] Switching to ${FALLBACK_MODEL}:`, error.message);
    const fallbackResponse = await groq.chat.completions.create({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const text = cleanTypingText(fallbackResponse.choices[0]?.message?.content);
    return { text, topic, wordCount: text.split(/\s+/).filter(Boolean).length, model: FALLBACK_MODEL };
  }
};

/**
 * Generate targeted typing drill for user's weak keys
 */
export const generateWeakKeyDrill = async ({ weakKeys = [], wordCount = 35 }) => {
  const groq = getGroqClient();
  const keysList = weakKeys.map((k) => k.toUpperCase()).join(', ');

  const systemMessage = 'You are a touch-typing coach. Output ONLY raw typing practice paragraph text. No markdown, no quotes, no commentary.';
  const userMessage = `Generate a ${wordCount}-word natural English typing practice paragraph that heavily emphasizes words containing the target letters: [${keysList}]. Must be grammatically correct English sentences.`;

  try {
    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    const text = cleanTypingText(response.choices[0]?.message?.content);
    return { text, targetKeys: weakKeys, wordCount: text.split(/\s+/).filter(Boolean).length };
  } catch (error) {
    const fallbackResponse = await groq.chat.completions.create({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });
    const text = cleanTypingText(fallbackResponse.choices[0]?.message?.content);
    return { text, targetKeys: weakKeys, wordCount: text.split(/\s+/).filter(Boolean).length };
  }
};

/**
 * Generate clean code snippets for developer typing practice
 */
export const generateCodeSnippet = async ({ language = 'javascript', topic = 'algorithms' }) => {
  const groq = getGroqClient();

  const systemMessage = 'You are a code typing test generator. Output ONLY raw, runnable, clean code. Do NOT wrap in markdown code fence backticks like ```js. Return pure code text only.';
  const userMessage = `Language: ${language}.
Topic: ${topic}.
Generate 4 to 8 lines of clean, idiomatic ${language} code with realistic brackets, braces, and variables.`;

  try {
    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const code = cleanTypingText(response.choices[0]?.message?.content);
    return { code, language, topic };
  } catch (error) {
    const fallbackResponse = await groq.chat.completions.create({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });
    const code = cleanTypingText(fallbackResponse.choices[0]?.message?.content);
    return { code, language, topic };
  }
};

/**
 * Generate AI Coach Feedback after a typing test
 */
export const generateCoachFeedback = async ({ wpm, accuracy, consistency, duration, mistakesCount }) => {
  const groq = getGroqClient();

  const systemMessage = 'You are a concise, encouraging typing coach. Provide exactly 2 short sentences of actionable feedback (under 35 words total). Plain text only.';
  const userMessage = `Test Results: Speed: ${wpm} WPM, Accuracy: ${accuracy}%, Consistency: ${consistency}%, Duration: ${duration}s, Mistakes: ${mistakesCount}.`;

  try {
    const response = await groq.chat.completions.create({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const insight = cleanTypingText(response.choices[0]?.message?.content);
    return { insight };
  } catch (error) {
    return {
      insight: 'Great effort on this test! Maintaining a steady rhythm will help boost your speed and precision even further.',
    };
  }
};

/**
 * Generate conversational AI Typing Tutor & Coach response
 */
export const generateTypingChatResponse = async ({ message, history = [] }) => {
  const groq = getGroqClient();

  const systemMessage = `You are "Tara AI Typing Coach" — a friendly, smart touch-typing mentor on the Tara Typing platform.

CORE PRINCIPLE: ANSWER ACCORDING TO THE QUESTION (PROPORTIONALITY).
- NEVER give an unnecessary wall of text or giant lists when a short answer is appropriate!
- For greetings ("hello", "hi", "hey", "kaise ho", "namaste", "good morning"): Reply in ONLY 1 or 2 warm, friendly sentences (e.g. "Hey there! 👋 Ready for some typing practice today? What would you like to work on?"). NEVER output bullet points, menus, or long introductions for simple greetings!
- For simple or direct questions: Provide a concise, focused answer directly addressing the question in 2-4 sentences.
- For drill or practice requests: Provide the targeted drill cleanly with short guidance.
- For deep technical or speed plateau questions: Provide structured, well-organized points without filler.
- If the user writes in Hindi or Hinglish, reply in natural, friendly Hinglish/Hindi.
- Always sound like a supportive human coach, not a generic robot.`;

  // Sanitize and trim history to max 8 turns
  const formattedHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && item.content)
        .slice(-8)
        .map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: String(item.content).slice(0, 1000),
        }))
    : [];

  const messages = [
    { role: 'system', content: systemMessage },
    ...formattedHistory,
    { role: 'user', content: String(message).slice(0, 6000) },
  ];

  try {
    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    const reply = response.choices[0]?.message?.content?.trim() || 'I am ready to help you improve your typing! What specific technique or skill would you like to work on?';
    return { reply, model: PRIMARY_MODEL };
  } catch (error) {
    console.warn(`[Groq Chat Primary Error] Falling back to ${FALLBACK_MODEL}:`, error.message);
    try {
      const fallbackResponse = await groq.chat.completions.create({
        model: FALLBACK_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      });
      const reply = fallbackResponse.choices[0]?.message?.content?.trim() || 'Keep practicing regularly to build finger muscle memory!';
      return { reply, model: FALLBACK_MODEL };
    } catch (fallbackErr) {
      console.error('[Groq Chat Fallback Error]:', fallbackErr);
      return {
        reply: `**Coach Tip:** Touch typing mastery is all about muscle memory! Focus on maintaining 95%+ accuracy before trying to speed up. Keep your fingers anchored on the home row (\`ASDF\` - \`JKL;\`) and practice 15 minutes every day.`,
        model: 'offline_fallback',
      };
    }
  }
};

