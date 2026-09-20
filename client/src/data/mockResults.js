/**
 * Mock Typing Test Results
 * Provides realistic history data for analytics, charts, and activity tables.
 */
export const INITIAL_MOCK_RESULTS = [
  {
    id: "res_001",
    mode: "words",
    duration: 30,
    wpm: 85,
    rawWpm: 89,
    accuracy: 97.4,
    errors: 2,
    consistency: 94,
    correctCharacters: 212,
    totalCharacters: 218,
    wpmHistory: [
      { second: 5, wpm: 68, rawWpm: 72 },
      { second: 10, wpm: 75, rawWpm: 78 },
      { second: 15, wpm: 82, rawWpm: 85 },
      { second: 20, wpm: 84, rawWpm: 88 },
      { second: 25, wpm: 86, rawWpm: 90 },
      { second: 30, wpm: 85, rawWpm: 89 },
    ],
    completedAt: "2026-09-07T14:30:00.000Z"
  },
  {
    id: "res_002",
    mode: "quote",
    duration: 60,
    wpm: 80,
    rawWpm: 84,
    accuracy: 96.8,
    errors: 3,
    consistency: 91,
    correctCharacters: 400,
    totalCharacters: 412,
    wpmHistory: [
      { second: 10, wpm: 72, rawWpm: 76 },
      { second: 20, wpm: 76, rawWpm: 80 },
      { second: 30, wpm: 79, rawWpm: 83 },
      { second: 40, wpm: 82, rawWpm: 86 },
      { second: 50, wpm: 81, rawWpm: 85 },
      { second: 60, wpm: 80, rawWpm: 84 },
    ],
    completedAt: "2026-09-06T18:15:00.000Z"
  },
  {
    id: "res_003",
    mode: "words",
    duration: 15,
    wpm: 88,
    rawWpm: 92,
    accuracy: 98.1,
    errors: 1,
    consistency: 96,
    correctCharacters: 110,
    totalCharacters: 112,
    wpmHistory: [
      { second: 5, wpm: 80, rawWpm: 82 },
      { second: 10, wpm: 86, rawWpm: 89 },
      { second: 15, wpm: 88, rawWpm: 92 },
    ],
    completedAt: "2026-09-05T20:45:00.000Z"
  },
  {
    id: "res_004",
    mode: "custom",
    duration: 60,
    wpm: 76,
    rawWpm: 81,
    accuracy: 95.5,
    errors: 5,
    consistency: 89,
    correctCharacters: 380,
    totalCharacters: 395,
    wpmHistory: [
      { second: 15, wpm: 70, rawWpm: 74 },
      { second: 30, wpm: 74, rawWpm: 78 },
      { second: 45, wpm: 78, rawWpm: 83 },
      { second: 60, wpm: 76, rawWpm: 81 },
    ],
    completedAt: "2026-09-04T12:00:00.000Z"
  },
  {
    id: "res_005",
    mode: "quote",
    duration: 30,
    wpm: 82,
    rawWpm: 85,
    accuracy: 97.0,
    errors: 2,
    consistency: 93,
    correctCharacters: 205,
    totalCharacters: 211,
    wpmHistory: [
      { second: 10, wpm: 75, rawWpm: 78 },
      { second: 20, wpm: 80, rawWpm: 83 },
      { second: 30, wpm: 82, rawWpm: 85 },
    ],
    completedAt: "2026-09-03T16:20:00.000Z"
  }
];
