// High-frequency, clean, engaging words for typing practice
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "speed", "focus", "typing", "quick", "finger", "keyboard", "screen", "practice", "accuracy", "challenge",
  "system", "program", "code", "light", "energy", "mind", "power", "motion", "create", "future",
  "bright", "sound", "dream", "rhythm", "steady", "rapid", "smooth", "master", "action", "result",
  "global", "level", "great", "leader", "victory", "simple", "clarity", "design", "impact", "progress",
  "modern", "clean", "swift", "effort", "skill", "tempo", "boost", "smart", "active", "online",
  "nature", "water", "world", "space", "planet", "galaxy", "journey", "path", "horizon", "vision",
  "logic", "reason", "memory", "spark", "stride", "stream", "digital", "engine", "growth", "wonder",
  "pulse", "stride", "thrive", "shine", "sparkle", "venture", "navigate", "explore", "discover", "elevate",
  "brave", "calm", "noble", "eager", "sharp", "crisp", "lucid", "zenith", "apex", "pinnacle",
  "vibrant", "dynamic", "fluent", "nimble", "agile", "stellar", "matrix", "beacon", "odyssey", "summit"
];

export const getRandomWords = (count = 50) => {
  const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
  let result = [];
  while (result.length < count) {
    result = result.concat(shuffled);
  }
  return result.slice(0, count).join(" ");
};
