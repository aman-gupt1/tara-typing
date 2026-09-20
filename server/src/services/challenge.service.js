// class DailyChallengeService {
//   constructor(DailyChallenge) {
//     this.DailyChallenge = DailyChallenge;
//   }

//   async getTodayChallenge() {
//     const today = new Date().toISOString().split('T')[0];

//     let challenge = await this.DailyChallenge.findOne({
//       date: today,
//     });

//     if (!challenge) {
//       challenge = await this.DailyChallenge.create({
//         date: today,
//         title: 'Velocity & Clarity',
//         description:
//           'Focus on fluid transitions and steady rhythm without hesitating on capital letters.',

//         text:
//           'The greatest glory in living lies not in never falling, but in rising every time we fall. The future belongs to those who believe in the beauty of their dreams and act upon them with unwavering determination.',

//         duration: 60,

//         participantsCount: 142,

//         topScores: [
//           {
//             rank: 1,
//             name: 'Alexander Wright',
//             username: 'alex_wpm',
//             avatar:
//               'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
//             wpm: 151,
//             accuracy: 99.2,
//           },
//           {
//             rank: 2,
//             name: 'Sophia Chen',
//             username: 'sophia_types',
//             avatar:
//               'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
//             wpm: 146,
//             accuracy: 98.8,
//           },
//           {
//             rank: 3,
//             name: 'Marcus Miller',
//             username: 'marcus_speed',
//             avatar:
//               'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
//             wpm: 139,
//             accuracy: 98.4,
//           },
//         ],
//       });
//     }

//     return challenge;
//   }

//   async submitChallengeScore(
//     challengeId,
//     wpm,
//     accuracy,
//     user
//   ) {
//     const challenge = await this.DailyChallenge.findById(
//       challengeId
//     );

//     if (!challenge) {
//       const error = new Error(
//         'Daily challenge not found'
//       );

//       error.statusCode = 404;
//       throw error;
//     }

//     challenge.participantsCount += 1;

//     const userEntry = {
//       rank: (challenge.topScores.length || 0) + 1,

//       user: user ? user._id : null,

//       name: user ? user.name : 'Guest Typist',

//       username: user ? user.username : 'guest',

//       avatar: user
//         ? user.avatar
//         : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',

//       wpm: Math.round(wpm),

//       accuracy: Math.round(accuracy * 10) / 10,
//     };

//     challenge.topScores.push(userEntry);

//     challenge.topScores.sort(
//       (a, b) =>
//         b.wpm - a.wpm ||
//         b.accuracy - a.accuracy
//     );

//     challenge.topScores.forEach((score, index) => {
//       score.rank = index + 1;
//     });

//     await challenge.save();

//     return challenge;
//   }
// }

// export default DailyChallengeService;


import DailyChallengeService from './dailyChallenge.service.js';
import DailyChallenge from '../models/DailyChallenge.js';
import DailyChallengeResult from '../models/DailyChallengesResult.js';
import User from '../models/User.js';

class ChallengeService {
  constructor() {
    this.dailyChallengeService =
      new DailyChallengeService(
        DailyChallenge,
        DailyChallengeResult,
        User
      );
  }

async getTodayChallenge() {
  return this.dailyChallengeService.getTodayChallenge();
}

  async submitChallengeScore(
    challengeId,
    wpm,
    accuracy,
    user
  ) {
    if (!user?._id) {
      const error = new Error(
        'User authentication required'
      );

      error.statusCode = 401;
      throw error;
    }

    const challenge =
      await DailyChallenge.findById(challengeId);

    if (!challenge) {
      const error = new Error(
        'Daily challenge not found'
      );

      error.statusCode = 404;
      throw error;
    }

    /*
     * Make sure the submitted challenge is today's
     * active challenge.
     */
    const today =
      this.dailyChallengeService.getIndiaDate();

    if (challenge.date !== today) {
      const error = new Error(
        'You can only submit today\'s challenge'
      );

      error.statusCode = 400;
      throw error;
    }

    const result =
      await this.dailyChallengeService.submitResult(
        user._id,
        {
          wpm,
          rawWpm: wpm,
          accuracy,
          mistakes: 0,
          correctCharacters: 0,
          totalCharacters: 0,
          consistency: 0,
        }
      );

    return result;
  }
}

export default ChallengeService;