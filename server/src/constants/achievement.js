export const ACHIEVEMENTS = [
  {
    key: 'first-test',
    title: 'First Steps',
    description: 'Complete your first typing test',
    icon: '🎯',
    category: 'tests',
    requirement: {
      type: 'testsCompleted',
      value: 1,
    },
  },
  {
    key: 'speed-30',
    title: 'Getting Started',
    description: 'Reach 30 WPM',
    icon: '⚡',
    category: 'speed',
    requirement: {
      type: 'bestWpm',
      value: 30,
    },
  },
  {
    key: 'speed-50',
    title: 'Speed Typist',
    description: 'Reach 50 WPM',
    icon: '🚀',
    category: 'speed',
    requirement: {
      type: 'bestWpm',
      value: 50,
    },
  },
  {
    key: 'speed-75',
    title: 'Fast Fingers',
    description: 'Reach 75 WPM',
    icon: '🔥',
    category: 'speed',
    requirement: {
      type: 'bestWpm',
      value: 75,
    },
  },
  {
    key: 'speed-100',
    title: 'Century',
    description: 'Reach 100 WPM',
    icon: '💯',
    category: 'speed',
    requirement: {
      type: 'bestWpm',
      value: 100,
    },
  },
  {
    key: 'accuracy-95',
    title: 'Precise',
    description: 'Achieve 95% accuracy',
    icon: '🎯',
    category: 'accuracy',
    requirement: {
      type: 'accuracy',
      value: 95,
    },
  },
  {
    key: 'accuracy-100',
    title: 'Perfect Accuracy',
    description: 'Achieve 100% accuracy',
    icon: '🏆',
    category: 'accuracy',
    requirement: {
      type: 'accuracy',
      value: 100,
    },
  },
  {
    key: 'tests-10',
    title: 'Regular Typist',
    description: 'Complete 10 typing tests',
    icon: '📚',
    category: 'tests',
    requirement: {
      type: 'testsCompleted',
      value: 10,
    },
  },
  {
    key: 'tests-50',
    title: 'Dedicated Typist',
    description: 'Complete 50 typing tests',
    icon: '⭐',
    category: 'tests',
    requirement: {
      type: 'testsCompleted',
      value: 50,
    },
  },
  {
    key: 'streak-7',
    title: 'Weekly Streak',
    description: 'Maintain a 7-day typing streak',
    icon: '🔥',
    category: 'streak',
    requirement: {
      type: 'currentStreak',
      value: 7,
    },
  },
];