/**
 * Mock Daily Challenges Data
 * Provides challenge details, texts, countdown duration, and leaderboard.
 */
export const DEFAULT_DAILY_CHALLENGE = {
  id: "dc_today",
  title: "Speed & Flow",
  description: "Focus on keeping a steady typing cadence across punctuation and uppercase shifts.",
  text: "The greatest discovery of all time is that a person can transform their future by merely altering their attitude and dedication. Each key you strike with intention and focus forges neural pathways of mastery.",
  duration: 60,
  participantsCount: 384,
  endsInSeconds: 43200,
  topScores: [
    { rank: 1, name: "Alexander Wright", username: "alex_wpm", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", wpm: 151, accuracy: 99.2 },
    { rank: 2, name: "Sophia Chen", username: "sophia_types", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", wpm: 146, accuracy: 98.8 },
    { rank: 3, name: "Marcus Miller", username: "marcus_speed", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", wpm: 139, accuracy: 98.4 },
    { rank: 4, name: "Elena Rostova", username: "elena_keys", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", wpm: 132, accuracy: 97.9 },
    { rank: 5, name: "Aman Gupta", username: "amangupta", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", wpm: 88, accuracy: 97.5, isCurrentUser: true }
  ],
  previousResult: {
    date: "Yesterday",
    wpm: 84,
    accuracy: 97.5,
    rank: 12,
  }
};
