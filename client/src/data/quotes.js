// Curated inspiring and engaging quotes for typing practice
export const quotesList = [
  {
    id: 1,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    length: "short",
    category: "Inspirational"
  },
  {
    id: 2,
    text: "Simplicity is the soul of efficiency. The best way to predict your future is to create it.",
    author: "Austin Freeman",
    length: "short",
    category: "Wisdom"
  },
  {
    id: 3,
    text: "It does not matter how slowly you go as long as you do not stop. Success is the sum of small efforts repeated day in and day out.",
    author: "Confucius",
    length: "medium",
    category: "Perseverance"
  },
  {
    id: 4,
    text: "The only limit to our realization of tomorrow will be our doubts of today. Let us move forward with strong and active faith.",
    author: "Franklin D. Roosevelt",
    length: "medium",
    category: "Optimism"
  },
  {
    id: 5,
    text: "Your time is limited, so don't waste it living someone else's life. Have the courage to follow your heart and intuition.",
    author: "Steve Jobs",
    length: "medium",
    category: "Motivation"
  },
  {
    id: 6,
    text: "In the middle of difficulty lies opportunity. Keep your face always toward the sunshine, and shadows will fall behind you.",
    author: "Albert Einstein",
    length: "medium",
    category: "Perspective"
  },
  {
    id: 7,
    text: "Continuous learning is the minimum requirement for success in any field. The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    length: "medium",
    category: "Growth"
  },
  {
    id: 8,
    text: "Speed without accuracy is just a fast way to make mistakes. True mastery is the harmonious union of swiftness and precision.",
    author: "Tara Typing",
    length: "short",
    category: "Typing"
  },
  {
    id: 9,
    text: "Do what you can, with what you have, where you are. Every keystroke brings you one step closer to your greatest potential.",
    author: "Theodore Roosevelt",
    length: "medium",
    category: "Action"
  }
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotesList.length);
  return quotesList[index];
};
