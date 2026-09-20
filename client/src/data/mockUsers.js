/**
 * Mock User Data for Tara Typing Frontend
 * Represents the default demo user and initial state.
 */
export const DEFAULT_MOCK_USER = {
  id: "user_001",
  name: "Aman Gupta",
  username: "amangupta",
  email: "aman@example.com",
  avatar: "",
  bio: "Typing enthusiast who loves improving speed and accuracy.",
  bestWpm: 85,
  averageWpm: 72,
  accuracy: 96,
  testsCompleted: 42,
  totalTypingTime: 2520, // seconds (~42 minutes)
  currentStreak: 7,
  createdAt: "2026-06-01T00:00:00.000Z"
};

export const MOCK_USERS_LIST = [
  DEFAULT_MOCK_USER,
  {
    id: "user_002",
    name: "Alexander Wright",
    username: "alex_wpm",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Mechanical keyboard builder and speedrunner.",
    bestWpm: 154,
    averageWpm: 138,
    accuracy: 99.2,
    testsCompleted: 420,
    totalTypingTime: 12600,
    currentStreak: 24,
    createdAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "user_003",
    name: "Sophia Chen",
    username: "sophia_types",
    email: "sophia@example.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Focusing on 100% accuracy and zero finger strain.",
    bestWpm: 148,
    averageWpm: 129,
    accuracy: 98.9,
    testsCompleted: 385,
    totalTypingTime: 11550,
    currentStreak: 19,
    createdAt: "2026-02-14T00:00:00.000Z"
  }
];
