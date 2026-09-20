import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

const lessons = [
  // ==========================================
  // CATEGORY 1 — GETTING STARTED
  // ==========================================
  {
    slug: 'what-is-touch-typing',
    lessonNumber: 1,
    category: 'Getting Started',
    categoryId: 'getting-started',
    title: 'What is Touch Typing?',
    subtitle: 'The gold standard technique for fast, effortless typing.',
    description:
      'Understand how muscle memory enables typing at high speeds without looking at the keyboard.',
    difficulty: 'Beginner',
    duration: '4 min',
    highlightKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
    hasPostureGuide: false,
    hasFingerGuide: false,
    hasInteractiveKeyboard: false,
    sections: [
      {
        heading: 'The Core Philosophy of Touch Typing',
        content:
          'Touch typing is the method of typing based on muscle memory rather than sight. Instead of looking down at the keyboard to find each letter with two fingers (the "hunt-and-peck" method), touch typists rest eight fingers on the home row and reach for keys instinctively without glancing down.',
        callout: {
          type: 'tip',
          text: 'Touch typists regularly type between 60 to 120+ WPM because their eyes stay fixed on the screen, allowing their brain to focus on ideas rather than key locations.',
        },
      },
      {
        heading: 'Why Sight Typing Slows You Down',
        content:
          'When you look at the keyboard, your brain performs a 3-step loop for every single word:\n1. Look at screen to read or verify.\n2. Look down at keyboard to locate letters.\n3. Look back up to check for typos.\n\nThis constant visual context-switching creates cognitive fatigue, slows you to 25–40 WPM, and strains your neck. Touch typing removes steps 2 and 3 completely!',
        mistakes: [
          'Looking down at the keys every time you make a mistake.',
          'Using only index and middle fingers to reach distant keys.',
          'Rushing to type fast before building foundational finger habits.',
        ],
      },
    ],
    drillText:
      'aaa sss ddd fff jjj kkk lll ;;; asdf jkl; asdf jkl;',
    quiz: {
      question:
        'What is the primary advantage of touch typing over sight typing?',
      options: [
        'It lets you press keys harder',
        'It relies on muscle memory so your eyes stay focused on the screen',
        'It requires only two fingers',
        'It eliminates the need for a spacebar',
      ],
      correctIndex: 1,
      explanation:
        'Touch typing builds muscle memory in all 10 fingers, allowing you to keep your eyes on the screen and type with continuous rhythm.',
    },
    practicePreset: {
      mode: 'words',
      words: 25,
    },
  },

  {
    slug: 'why-learn-touch-typing',
    lessonNumber: 2,
    category: 'Getting Started',
    categoryId: 'getting-started',
    title: 'Why Learn Touch Typing?',
    subtitle:
      'The compounding benefits of speed, accuracy, and mental clarity.',
    description:
      'Discover how doubling your typing speed saves hundreds of hours every year.',
    difficulty: 'Beginner',
    duration: '5 min',
    highlightKeys: [],
    sections: [
      {
        heading: 'The Math of Typing Efficiency',
        content:
          'The average knowledge worker, student, or software developer types between 1,500 and 4,000 words daily.\n\n- At 35 WPM: Typing 2,000 words takes ~57 minutes.\n- At 80 WPM: Typing 2,000 words takes ~25 minutes.\n\nThat is a direct savings of 32 minutes per day, which equals 160+ hours per year — four full working weeks gained simply by mastering touch typing!',
        callout: {
          type: 'info',
          text: 'Beyond pure speed, touch typing frees your working memory so you can think deeper about prose, code logic, or emails without physical friction.',
        },
      },
      {
        heading: 'Flow State & Focus',
        content:
          'When your fingers automatically convert your thoughts into text on screen with 98%+ accuracy, typing becomes invisible. You enter a frictionless flow state where writing, coding, and chatting happen at the true speed of thought.',
      },
    ],
    drillText:
      'type faster think sharper achieve more with tara typing',
    quiz: {
      question:
        'How does touch typing improve cognitive focus while writing or coding?',
      options: [
        'It forces you to memorize dictionary definitions',
        'It removes physical friction and visual switching so your brain focuses entirely on content',
        'It automatically corrects spelling mistakes in your head',
        'It makes the computer processor run faster',
      ],
      correctIndex: 1,
      explanation:
        'When typing mechanics are automated by muscle memory, 100% of your cognitive bandwidth is dedicated to creative and analytical thinking.',
    },
    practicePreset: {
      mode: 'words',
      words: 30,
    },
  },

  {
    slug: 'correct-typing-posture',
    lessonNumber: 3,
    category: 'Getting Started',
    categoryId: 'getting-started',
    title: 'Correct Typing Posture',
    subtitle:
      'Ergonomics to prevent strain and maximize long-term stamina.',
    description:
      'Learn the ergonomic sitting posture and wrist alignment required for comfortable sessions.',
    difficulty: 'Beginner',
    duration: '4 min',
    hasPostureGuide: true,
    hasFingerGuide: false,
    hasInteractiveKeyboard: false,
    sections: [
      {
        heading: 'Ergonomic Body Alignment',
        content:
          'Great typing speed starts from the ground up. Poor posture causes neck tension, lower back stiffness, and carpal tunnel syndrome over time. Follow these five golden rules:\n\n1. Back & Spine: Sit upright with your lower back supported against the chair.\n2. Elbows: Keep elbows bent at a relaxed 90° to 100° angle, close to your sides.\n3. Wrists: Hover your wrists gently above the keyboard; never bend or rest them hard against the desk while typing.\n4. Feet: Keep feet flat on the floor with thighs parallel to the ground.\n5. Screen: Position the top of your monitor at eye level, roughly an arm’s length away.',
        callout: {
          type: 'warning',
          text: 'Avoid resting your wrists on hard desk edges while typing. "Floating" wrists reduce tendon friction and allow your fingers to glide freely across rows.',
        },
      },
    ],
    drillText:
      'sit upright keep wrists relaxed elbows at ninety degrees',
    quiz: {
      question: 'Where should your wrists be positioned while typing?',
      options: [
        'Resting heavily on the desk edge',
        'Bent upward at an extreme angle',
        'Hovering neutrally and relaxed above the keyboard',
        'Anchored firmly on the spacebar',
      ],
      correctIndex: 2,
      explanation:
        'Floating wrists in a neutral position prevents tendon compression in the carpal tunnel and allows effortless reaches.',
    },
    practicePreset: {
      mode: 'time',
      duration: 30,
    },
  },

  {
    slug: 'how-to-position-your-hands',
    lessonNumber: 4,
    category: 'Getting Started',
    categoryId: 'getting-started',
    title: 'How to Position Your Hands',
    subtitle:
      'Curving your fingers and establishing the resting anchor.',
    description:
      'Master the relaxed curved finger arch and light keystroke touch.',
    difficulty: 'Beginner',
    duration: '4 min',
    hasPostureGuide: false,
    hasFingerGuide: true,
    hasInteractiveKeyboard: false,
    highlightKeys: [
      'A',
      'S',
      'D',
      'F',
      'J',
      'K',
      'L',
      ';',
      ' ',
    ],
    sections: [
      {
        heading: 'The Natural Curved Arch',
        content:
          'Imagine you are holding a tennis ball or an apple in each hand. Your fingers should naturally curve downward with the tips (not the flat pads) resting gently on the home row keys.\n\n- Fingertips: Strike keys with the center of the fingertip.\n- Light Touch: Modern mechanical and laptop keyboards register keystrokes with minimal force. Do not hammer the keys.\n- Immediate Return: After reaching for a key on the top or bottom row, immediately bring your finger back to its home row key.',
      },
    ],
    drillText:
      'asdf jkl; fff jjj ddd kkk sss lll aaa ;;;',
    quiz: {
      question:
        'How should your fingers be shaped while resting on the home row?',
      options: [
        'Completely flat and stiff',
        'Gently curved as if holding a small ball, striking with fingertips',
        'Crossed over each other',
        'Only two fingers curved, the rest tucked away',
      ],
      correctIndex: 1,
      explanation:
        'A relaxed curve ensures optimal reach, agility, and minimal finger fatigue.',
    },
    practicePreset: {
      mode: 'words',
      words: 25,
    },
  },

  // ==========================================
  // CATEGORY 2 — FINGER PLACEMENT
  // ==========================================
  {
    slug: 'home-row-foundation',
    lessonNumber: 5,
    category: 'Finger Placement',
    categoryId: 'finger-placement',
    title: 'Home Row Foundation',
    subtitle:
      'The 8 base keys where every keystroke starts and returns.',
    description:
      'Learn the primary home row keys: A, S, D, F for left hand, J, K, L, ; for right hand.',
    difficulty: 'Beginner',
    duration: '5 min',
    hasPostureGuide: false,
    hasFingerGuide: true,
    hasInteractiveKeyboard: false,
    highlightKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
    sections: [
      {
        heading: 'The Universal Starting Position',
        content:
          'The Home Row is the central horizontal line of letters on your keyboard. Your fingers rest on these exact keys before, during, and after every sentence:\n\n- Left Hand:\n  - Pinky → A\n  - Ring → S\n  - Middle → D\n  - Index → F\n\n- Right Hand:\n  - Index → J\n  - Middle → K\n  - Ring → L\n  - Pinky → ; (Semicolon)\n\n- Thumbs: Hovering over the Spacebar.',
        callout: {
          type: 'tip',
          text: 'Every time you type a letter in the top or bottom row, your finger moves out, strikes the key, and snaps right back to its home row anchor.',
        },
      },
    ],
    drillText:
      'asdf jkl; a s d f j k l ; dad sad fad lad asks fall flask',
    quiz: {
      question:
        'Which key does the left index finger rest on in the home row?',
      options: ['A', 'S', 'D', 'F'],
      correctIndex: 3,
      explanation:
        'The left index finger rests on F, right next to the tactile guide bump.',
    },
    practicePreset: {
      mode: 'custom',
      customText:
        'asdf jkl; a s d f j k l ; dad sad fad lad asks fall flask',
    },
  },

  {
    slug: 'f-and-j-tactile-bumps',
    lessonNumber: 6,
    category: 'Finger Placement',
    categoryId: 'finger-placement',
    title: 'F and J Keys & Tactile Bumps',
    subtitle:
      'Find your home position blindly using keyboard ridges.',
    description:
      'Understand the raised physical ridges on F and J keys that anchor your hands.',
    difficulty: 'Beginner',
    duration: '4 min',
    hasPostureGuide: false,
    hasFingerGuide: false,
    hasInteractiveKeyboard: false,
    highlightKeys: ['F', 'J'],
    sections: [
      {
        heading: 'The Built-in Anchors',
        content:
          'Almost every physical keyboard manufactured in the world has small raised tactile bumps or ridges on the F and J keys.\n\nThese bumps serve one critical purpose: they allow you to place both hands in the exact home row position without looking down.\n\n1. Slide your index fingers across the keyboard until you feel the small horizontal bumps.\n2. Left index rests on F.\n3. Right index rests on J.\n4. The remaining fingers naturally fall onto A-S-D and K-L-; respectively.',
      },
    ],
    drillText:
      'ff jj ff jj f j f j fff jjj fj fj fjfj jfjf',
    quiz: {
      question:
        'Why do the F and J keys have raised bumps or ridges?',
      options: [
        'For decorative styling',
        'To allow touch typists to find the home row by feel without looking',
        'To indicate the loudest keys',
        'To show where to rest your palms',
      ],
      correctIndex: 1,
      explanation:
        'The ridges on F and J provide physical tactile feedback so you can instantly anchor both hands without taking your eyes off the screen.',
    },
    practicePreset: {
      mode: 'words',
      words: 25,
    },
  },

  {
    slug: 'finger-to-key-mapping',
    lessonNumber: 7,
    category: 'Finger Placement',
    categoryId: 'finger-placement',
    title: 'Finger-to-Key Mapping',
    subtitle:
      'Assigning dedicated columns to each of your 10 fingers.',
    description:
      'Learn which finger is responsible for reaching each key across the entire keyboard.',
    difficulty: 'Beginner',
    duration: '6 min',
    hasPostureGuide: false,
    hasFingerGuide: true,
    hasInteractiveKeyboard: false,
    highlightKeys: [
      'Q',
      'A',
      'Z',
      'W',
      'S',
      'X',
      'E',
      'D',
      'C',
      'R',
      'T',
      'F',
      'G',
      'V',
      'B',
      'Y',
      'U',
      'H',
      'J',
      'N',
      'M',
      'I',
      'K',
      'O',
      'L',
      'P',
    ],
    sections: [
      {
        heading: 'Dedicated Zones for Each Finger',
        content:
          'To type fast without collisions, each finger owns a specific vertical column:\n\n- Left Pinky: 1, Q, A, Z, Left Shift, Caps, Tab\n- Left Ring: 2, W, S, X\n- Left Middle: 3, E, D, C\n- Left Index: 4, 5, R, T, F, G, V, B (owns 2 columns!)\n- Right Index: 6, 7, Y, U, H, J, N, M (owns 2 columns!)\n- Right Middle: 8, I, K, ,\n- Right Ring: 9, O, L, .\n- Right Pinky: 0, -, =, P, [, ], ;, \', /, Right Shift, Enter\n- Thumbs: Spacebar',
        callout: {
          type: 'info',
          text: 'Notice that the index fingers are the most agile and cover 2 columns each (F & G for left, J & H for right).',
        },
      },
    ],
    drillText:
      'qaz wsx edc rfv tgb yhn ujm ik, ol. p;/',
    quiz: {
      question:
        'Which finger is responsible for pressing both the T and G keys?',
      options: [
        'Left middle finger',
        'Left index finger',
        'Right index finger',
        'Left pinky finger',
      ],
      correctIndex: 1,
      explanation:
        'The left index finger reaches from F up to R/T and down to V/B as well as adjacent key G.',
    },
    practicePreset: {
      mode: 'words',
      words: 30,
    },
  },

  // ==========================================
  // CATEGORY 3 — LEARN THE KEYBOARD
  // ==========================================
  {
    slug: 'home-row-keys',
    lessonNumber: 8,
    category: 'Learn the Keyboard',
    categoryId: 'keyboard-mastery',
    title: 'Mastering the Home Row Words',
    subtitle:
      'Building complete words using only A, S, D, F, G, H, J, K, L, ;',
    description:
      'Drill the central home row letters including the center reaches G and H.',
    difficulty: 'Beginner',
    duration: '5 min',
    highlightKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
    sections: [
      {
        heading: 'Expanding to G and H',
        content:
          'Once your fingers are confident on ASDF and JKL;, we introduce the central reaches:\n- Left Index slides right from F → G and returns to F.\n- Right Index slides left from J → H and returns to J.\n\nWith these 10 keys, you can already spell hundreds of real English words!',
      },
    ],
    drillText:
      'half glad flash dash salad flags falls glass shall had hall',
    quiz: {
      question:
        'Which finger presses the letter H on the keyboard?',
      options: [
        'Left index finger',
        'Right index finger',
        'Right middle finger',
        'Right ring finger',
      ],
      correctIndex: 1,
      explanation:
        'The right index finger reaches horizontally from J over to H.',
    },
    practicePreset: {
      mode: 'custom',
      customText:
        'half glad flash dash salad flags falls glass shall had hall',
    },
  },

  {
    slug: 'top-row-keys',
    lessonNumber: 9,
    category: 'Learn the Keyboard',
    categoryId: 'keyboard-mastery',
    title: 'Top Row Keys (Q W E R T Y U I O P)',
    subtitle:
      'Reaching upward with diagonal precision and swift returns.',
    description:
      'Learn the upward reaches for vowels and common letters like E, R, T, U, I, O.',
    difficulty: 'Intermediate',
    duration: '6 min',
    highlightKeys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    sections: [
      {
        heading: 'The Power of the Top Row',
        content:
          'The top row contains the most frequent vowels (E, I, O, U) and high-frequency consonants (R, T, Y, P, W).\n\n- E: Left middle finger reaches up from D.\n- R: Left index finger reaches up-left from F.\n- T: Left index finger reaches up-right from F.\n- Y: Right index finger reaches up-left from J.\n- U: Right index finger reaches up-right from J.\n- I: Right middle finger reaches up from K.\n- O: Right ring finger reaches up from L.\n- P: Right pinky reaches up from semicolon.',
      },
    ],
    drillText:
      'quite route write power report require provide output query update',
    quiz: {
      question:
        'Which finger presses the letter E (the most common letter in English)?',
      options: [
        'Left index finger',
        'Left middle finger',
        'Left ring finger',
        'Right index finger',
      ],
      correctIndex: 1,
      explanation:
        'The left middle finger reaches from its home key D upward to E.',
    },
    practicePreset: {
      mode: 'words',
      words: 35,
    },
  },

  {
    slug: 'bottom-row-keys',
    lessonNumber: 10,
    category: 'Learn the Keyboard',
    categoryId: 'keyboard-mastery',
    title: 'Bottom Row Keys (Z X C V B N M)',
    subtitle:
      'Mastering the downward reaches with curl control.',
    description:
      'Learn the downward finger tucks for Z, X, C, V, B, N, M, comma, and period.',
    difficulty: 'Intermediate',
    duration: '6 min',
    highlightKeys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
    sections: [
      {
        heading: 'The Downward Motion',
        content:
          'Reaching down requires a slight inward curl of the finger while keeping your palm floating:\n\n- Z: Left pinky curls down from A.\n- X: Left ring finger curls down from S.\n- C: Left middle finger curls down from D.\n- V & B: Left index reaches down to V and B.\n- N & M: Right index reaches down to N and M.\n- , (Comma): Right middle finger curls down from K.\n- . (Period): Right ring finger curls down from L.',
      },
    ],
    drillText:
      'box cave zebra civic volume matrix vibrant combat balance novel',
    quiz: {
      question:
        'Which finger strikes the letter C on the bottom row?',
      options: [
        'Left index finger',
        'Left middle finger',
        'Left ring finger',
        'Right index finger',
      ],
      correctIndex: 1,
      explanation:
        'The left middle finger moves downward from D to C.',
    },
    practicePreset: {
      mode: 'words',
      words: 35,
    },
  },

  {
    slug: 'capital-letters-and-shift',
    lessonNumber: 11,
    category: 'Learn the Keyboard',
    categoryId: 'keyboard-mastery',
    title: 'Capital Letters & Opposite Shift',
    subtitle:
      'The two-hand coordination rule for effortless capitalization.',
    description:
      'Master using the opposite hand Shift key to maintain speed during capitalization.',
    difficulty: 'Intermediate',
    duration: '5 min',
    highlightKeys: ['Shift'],
    sections: [
      {
        heading: 'The Golden Opposite Shift Rule',
        content:
          'Never use the same hand to press Shift and a letter key! Doing so twists your wrist and breaks rhythm.\n\n- Capital letters with Left Hand: Hold Right Shift with your Right Pinky, tap the letter with your Left Hand, then release Shift.\n\n- Capital letters with Right Hand: Hold Left Shift with your Left Pinky, tap the letter with your Right Hand, then release Shift.',
        callout: {
          type: 'tip',
          text: 'Using the opposite hand Shift key keeps your typing hand in perfect home row position and prevents wrist cramps.',
        },
      },
    ],
    drillText:
      'Tara Typing Learn Faster Think Sharper Practice Daily Excel Always',
    quiz: {
      question:
        'When capitalizing the letter "P" (a right-hand key), which Shift key should you press?',
      options: [
        'Right Shift with right thumb',
        'Left Shift with left pinky',
        'Caps Lock key',
        'Either Shift with right index',
      ],
      correctIndex: 1,
      explanation:
        'Always use the opposite hand Shift key (Left Shift with left pinky) when capitalizing right-hand letters like P.',
    },
    practicePreset: {
      mode: 'quote',
    },
  },

  {
    slug: 'numbers-and-symbols',
    lessonNumber: 12,
    category: 'Learn the Keyboard',
    categoryId: 'keyboard-mastery',
    title: 'Numbers & Common Symbols',
    subtitle:
      'Reaching the top numeral row with confidence.',
    description:
      'Learn the top number row (1-0) and punctuation symbols without looking down.',
    difficulty: 'Advanced',
    duration: '6 min',
    highlightKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    sections: [
      {
        heading: 'Navigating the Number Row',
        content:
          'The number row is the farthest reach on the keyboard. Maintain your home row anchor with your pinky or index finger while extending upward:\n\n- Left Pinky → 1\n- Left Ring → 2\n- Left Middle → 3\n- Left Index → 4 & 5\n- Right Index → 6 & 7\n- Right Middle → 8\n- Right Ring → 9\n- Right Pinky → 0, -, =',
      },
    ],
    drillText:
      'speed test in 2026 score was 100 wpm with 99% accuracy in 60s',
    quiz: {
      question:
        'Which finger reaches for the numbers 4 and 5?',
      options: [
        'Left middle finger',
        'Left index finger',
        'Right index finger',
        'Left ring finger',
      ],
      correctIndex: 1,
      explanation:
        'The left index finger reaches from F up past R/T to numbers 4 and 5.',
    },
    practicePreset: {
      mode: 'words',
      words: 30,
    },
  },

  // ==========================================
  // CATEGORY 4 — BUILD ACCURACY
  // ==========================================
  {
    slug: 'what-is-typing-accuracy',
    lessonNumber: 13,
    category: 'Build Accuracy',
    categoryId: 'build-accuracy',
    title: 'Understanding Typing Accuracy',
    subtitle:
      'Why accuracy is the true engine of sustainable speed.',
    description:
      'Discover why high accuracy prevents devastating backspace penalties.',
    difficulty: 'Beginner',
    duration: '5 min',
    sections: [
      {
        heading: 'The Backspace Penalty Formula',
        content:
          'When you make a single typo while typing at 90 WPM:\n1. You must realize the error (150ms).\n2. Stop forward typing momentum (100ms).\n3. Reach for Backspace and tap it (200ms).\n4. Re-type the correct character (150ms).\n5. Resume your rhythm (200ms).\n\nA single mistake costs nearly 0.8 seconds — in that time, an accurate typist typed 3 extra words!\n\nTyping with 99% accuracy at 75 WPM will consistently beat a 100 WPM typist who makes 88% accuracy with constant backspacing.',
      },
    ],
    drillText:
      'accuracy precedes speed slow is smooth smooth is fast precision',
    quiz: {
      question:
        'Why does 98% accuracy result in higher net productivity than 85% accuracy at high raw speed?',
      options: [
        'Because backspacing and correcting errors costs enormous time and destroys flow',
        'Because computers reject files with typos',
        'Because accuracy increases font size',
        'Because tests are graded only on vowels',
      ],
      correctIndex: 0,
      explanation:
        'Every error incurs a costly backspacing penalty that halves your effective typing throughput.',
    },
    practicePreset: {
      mode: 'words',
      words: 40,
    },
  },

  {
    slug: 'common-typing-mistakes',
    lessonNumber: 14,
    category: 'Build Accuracy',
    categoryId: 'build-accuracy',
    title: 'Top 5 Common Typing Mistakes & Fixes',
    subtitle:
      'Identify bad habits and replace them with pro techniques.',
    description:
      'Diagnose peeking, hand drifting, wrist resting, and bursting.',
    difficulty: 'Intermediate',
    duration: '5 min',
    sections: [
      {
        heading: 'The 5 Harmful Habits',
        content:
          '1. The Keyboard Glance: Looking down whenever a word feels unfamiliar.\n   - Fix: Force yourself to mis-type rather than look down. Your brain learns faster from corrected tactile mistakes.\n2. Wrist Anchoring: Resting wrists firmly on the desk, locking your fingers in place.\n   - Fix: Float wrists 1-2 cm above the desk.\n3. Speed Bursting: Typing easy words at 120 WPM and slamming into hard words at 40 WPM.\n   - Fix: Type at a metronome-like steady pace (e.g. constant 70 WPM).\n4. Single-Hand Shift: Pressing Shift with the same hand that types the letter.\n   - Fix: Always use the opposite hand Shift.\n5. Over-using the Backspace: Spamming backspace without looking at what went wrong.\n   - Fix: Slow down and type each character deliberately.',
      },
    ],
    drillText:
      'maintain a steady rhythm do not rush easy words stay smooth',
    quiz: {
      question:
        'What is the best way to break the habit of looking down at the keyboard?',
      options: [
        'Type only with your eyes closed',
        'Embrace typing errors and let muscle memory correct the reach without glancing down',
        'Remove keycaps with pliers',
        'Type with one hand only',
      ],
      correctIndex: 1,
      explanation:
        'Allowing your muscle memory to correct misses without visual confirmation builds true tactile mastery.',
    },
    practicePreset: {
      mode: 'time',
      duration: 60,
    },
  },

  // ==========================================
  // CATEGORY 5 — BUILD SPEED
  // ==========================================
  {
    slug: 'understanding-wpm-metrics',
    lessonNumber: 15,
    category: 'Build Speed',
    categoryId: 'build-speed',
    title: 'What is WPM? (Raw vs Net Speed)',
    subtitle:
      'The standard formulas that measure typing velocity.',
    description:
      'Learn how standard 5-character word units, Raw WPM, Net WPM, and accuracy are calculated.',
    difficulty: 'Beginner',
    duration: '5 min',
    sections: [
      {
        heading: 'How WPM is Standardized',
        content:
          'In professional typing standards, 1 Word = 5 Keystrokes (including spaces and punctuation).\n\n- Raw WPM: Total Keystrokes / 5 / Minutes Elapsed\n- Net (Real) WPM: Raw WPM - (Uncorrected Errors / Minutes)\n- Accuracy %: (Correct Keystrokes / Total Keystrokes) × 100\n\nIf you type 300 characters in 1 minute:\n- 300 / 5 = 60 Raw WPM.\n- With 2 uncorrected errors: 60 - 2 = 58 Net WPM.',
      },
    ],
    drillText:
      'words per minute measures your speed five keystrokes equal one word',
    quiz: {
      question:
        'In standard typing metrics, how many keystrokes are counted as one "word"?',
      options: [
        '3 characters',
        '5 characters (including spaces)',
        '7 characters',
        '10 characters',
      ],
      correctIndex: 1,
      explanation:
        'Standard typing tests define 1 word as exactly 5 keystrokes to normalize varying word lengths.',
    },
    practicePreset: {
      mode: 'time',
      duration: 30,
    },
  },

  {
    slug: 'how-to-increase-typing-speed',
    lessonNumber: 16,
    category: 'Build Speed',
    categoryId: 'build-speed',
    title: 'How to Increase Typing Speed (50 → 100+ WPM)',
    subtitle:
      'Proven progression strategies for breaking through speed plateaus.',
    description:
      'Learn chunking (word-level muscle memory), predictive reading, and daily practice routines.',
    difficulty: 'Advanced',
    duration: '6 min',
    sections: [
      {
        heading: 'The 3 Stages of Typing Evolution',
        content:
          '1. Letter-by-Letter Stage (20-45 WPM):\nYour brain processes every single character: t... h... e.\n2. N-Gram & Trigram Chunking (50-80 WPM):\nYour fingers group common letter clusters automatically: the, ing, tion, ment, ould.\n3. Word-Level Whole Muscle Memory (85-130+ WPM):\nYou read the entire word on screen and your hands fire off all keystrokes in a single fluid reflex motion without thinking of individual letters.',
        callout: {
          type: 'tip',
          text: 'Practice reading 1 to 2 words ahead of your current typing cursor to prepare finger sequences before your hands arrive.',
        },
      },
    ],
    drillText:
      'the international communication through modern technological society',
    quiz: {
      question:
        'What is "word chunking" in advanced touch typing?',
      options: [
        'Breaking words apart with extra spaces',
        'Treating frequent letter combinations and words as single muscle-memory reflex units',
        'Typing words backward',
        'Deleting entire paragraphs at once',
      ],
      correctIndex: 1,
      explanation:
        'Chunking turns common patterns (like "ing" or "the") into instant reflex bursts.',
    },
    practicePreset: {
      mode: 'words',
      words: 50,
    },
  },

  // ==========================================
  // CATEGORY 6 — ADVANCED TYPING
  // ==========================================
  {
    slug: 'touch-typing-blind',
    lessonNumber: 17,
    category: 'Advanced Typing',
    categoryId: 'advanced-typing',
    title: 'Blind Typing & Muscle Memory Mastery',
    subtitle:
      'Achieving 100% eyes-on-screen confidence.',
    description:
      'Eliminate the subtle subconscious glances and master spatial awareness.',
    difficulty: 'Advanced',
    duration: '5 min',
    hasPostureGuide: false,
    hasFingerGuide: false,
    hasInteractiveKeyboard: false,
    highlightKeys: [
      'Q',
      'W',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P',
      'A',
      'S',
      'D',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      ';',
      'Z',
      'X',
      'C',
      'V',
      'B',
      'N',
      'M',
    ],
    sections: [
      {
        heading: 'Conquering the Last 5% of Peeking',
        content:
          'Most intermediate typists type blind for 90% of words, but glance down when typing symbols (@, #, $, %, &), numbers (7, 8, 9), or capital Q/Z.\n\nTo achieve true mastery:\n- Place a light sheet of paper over your hands or dim room lights.\n- Practice typing while reciting the text aloud.\n- When you mis-strike a symbol, pause, feel the home row bump, and re-reach blindly until you hit it.',
      },
    ],
    drillText:
      'function calculateTotal(items, taxRate = 0.08) { return items.reduce(); }',
    quiz: {
      question:
        'How should you react when you miss a difficult key like a symbol or number while typing blind?',
      options: [
        'Immediately look down at the keyboard',
        'Reset your index fingers on F and J, and retry the spatial reach blindly',
        'Skip the symbol completely',
        'Switch to mouse',
      ],
      correctIndex: 1,
      explanation:
        'Re-anchoring on F/J and attempting the reach again cements the correct spatial neural pathway.',
    },
    practicePreset: {
      mode: 'custom',
      customText:
        'function calculateTotal(items, taxRate = 0.08) { return items.reduce(); }',
    },
  },

  {
    slug: 'advanced-typing-drills',
    lessonNumber: 18,
    category: 'Advanced Typing',
    categoryId: 'advanced-typing',
    title: 'Advanced Rhythm & Stamina Drills',
    subtitle:
      'Maintaining 100+ WPM over long tests without muscle fatigue.',
    description:
      'Learn breathing control, metronome pacing, and sprint-versus-marathon stamina.',
    difficulty: 'Advanced',
    duration: '6 min',
    sections: [
      {
        heading: 'Sustained Endurance & Flow',
        content:
          'Sprinting for 15 seconds is easy; typing 100+ WPM for 2 minutes with 99% accuracy requires stamina.\n\n- Micro-Breaks: Relax finger tension on spacebars.\n- Rhythmic Cadence: Maintain uniform audio clicks like a steady metronome.\n- Breathe: Never hold your breath during difficult words. Maintain deep, calm diaphragm breathing.',
      },
    ],
    drillText:
      'consistency creates confidence confidence creates competence competence creates champions',
    quiz: {
      question:
        'What is the primary factor that prevents finger cramping and fatigue during long typing sessions?',
      options: [
        'Striking keys as hard as possible',
        'Floating relaxed wrists, light keystrokes, and steady rhythmic breathing',
        'Typing without any breaks for 5 hours',
        'Using heavy weights on fingers',
      ],
      correctIndex: 1,
      explanation:
        'Floating wrists, gentle strikes, and steady rhythm eliminate physical tension and allow effortless stamina.',
    },
    practicePreset: {
      mode: 'time',
      duration: 120,
    },
  },
];

const seedLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    await Lesson.deleteMany({});

    const insertedLessons = await Lesson.insertMany(lessons);

    console.log(`Seeded ${insertedLessons.length} lessons successfully`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Lesson seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedLessons();