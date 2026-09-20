/**
 * Mock Typing Test Configuration and Presets
 */
export const MOCK_TEST_DURATIONS = [15, 30, 60, 120];

export const MOCK_TEST_MODES = [
  { id: "words", label: "Words", description: "Practice with standard high-frequency English vocabulary." },
  { id: "quote", label: "Quote", description: "Type inspiring literary and philosophical passages." },
  { id: "custom", label: "Custom", description: "Bring your own code, essays, or technical text." }
];

export const MOCK_WORD_COUNTS = {
  15: 50,
  30: 90,
  60: 160,
  120: 300
};

export const MOCK_DEFAULT_TEST_CONFIG = {
  duration: 30,
  mode: "words",
  wordCount: 90,
  customText: "",
  isDailyChallenge: false
};
