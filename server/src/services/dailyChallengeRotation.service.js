import mongoose from 'mongoose';

class DailyChallengeRotationService {
  constructor(DailyChallenge) {
    this.DailyChallenge = DailyChallenge;
  }

  // Always calculate date according to India (IST)
  getIndiaDate(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  // Generate deterministic challenge content for a given date
  getChallengeContent(date) {
    const challenges = [
      {
        title: 'Daily Speed Sprint',
        description:
          'Push your typing speed while maintaining excellent accuracy.',
        text:
          'Touch typing becomes faster and easier when your fingers learn the keyboard through consistent practice. Focus on rhythm, accuracy, and keeping your eyes on the screen.',
        duration: 60,
      },
      {
        title: 'Accuracy Master',
        description:
          'Slow down slightly and aim for excellent typing accuracy.',
        text:
          'Accuracy is the foundation of sustainable typing speed. Keep your hands relaxed, follow proper finger placement, and avoid unnecessary backspace corrections.',
        duration: 60,
      },
      {
        title: 'Focus Challenge',
        description:
          'Keep your eyes on the screen and maintain a steady rhythm.',
        text:
          'Great typists do not need to look at their keyboards. Build muscle memory by trusting your fingers and maintaining a smooth, consistent typing rhythm.',
        duration: 60,
      },
      {
        title: 'Consistency Challenge',
        description:
          'Maintain your pace from the first character to the last.',
        text:
          'Consistency matters more than short bursts of speed. Find a comfortable rhythm and maintain it throughout the entire typing challenge.',
        duration: 60,
      },
      {
        title: 'Speed & Precision',
        description:
          'Balance fast typing with precise keystrokes.',
        text:
          'Fast typing is useful only when your accuracy remains high. Practice controlled movements, light keystrokes, and steady breathing to improve both speed and precision.',
        duration: 60,
      },
      {
        title: 'Touch Typing Challenge',
        description:
          'Test your touch typing fundamentals with a focused sprint.',
        text:
          'Keep your fingers close to the home row and return them after every reach. Let muscle memory guide your movements while your eyes remain focused on the text.',
        duration: 60,
      },
      {
        title: 'Weekly Speed Test',
        description:
          'Finish the challenge with your best controlled typing speed.',
        text:
          'Your typing speed improves through deliberate daily practice. Stay relaxed, read slightly ahead, and allow your fingers to follow the words naturally.',
        duration: 60,
      },
    ];

    // Convert YYYY-MM-DD into a deterministic number.
    // This guarantees the same challenge for everyone on the same date.
    const dateNumber = Number(date.replaceAll('-', ''));

    const index = dateNumber % challenges.length;

    return challenges[index];
  }

  // Find today's challenge or create it if it does not exist.
  async getOrCreateTodayChallenge() {
    const today = this.getIndiaDate();

    let challenge = await this.DailyChallenge.findOne({
      date: today,
    });

    if (challenge) {
      return {
        challenge,
        created: false,
      };
    }

    const content = this.getChallengeContent(today);

    try {
      challenge = await this.DailyChallenge.create({
        date: today,
        title: content.title,
        description: content.description,
        text: content.text,
        duration: content.duration,
        participantsCount: 0,
        topScores: [],
      });

      return {
        challenge,
        created: true,
      };
    } catch (error) {
      // Another request/server instance may have created
      // today's challenge at exactly the same time.
      if (
        error instanceof mongoose.Error &&
        error.code === 11000
      ) {
        challenge = await this.DailyChallenge.findOne({
          date: today,
        });

        if (challenge) {
          return {
            challenge,
            created: false,
          };
        }
      }

      // Also handle duplicate-key errors that may not
      // inherit from mongoose.Error in every environment.
      if (error?.code === 11000) {
        challenge = await this.DailyChallenge.findOne({
          date: today,
        });

        if (challenge) {
          return {
            challenge,
            created: false,
          };
        }
      }

      throw error;
    }
  }

  // Public method used by controllers/services.
  async ensureTodayChallenge() {
    const { challenge } = await this.getOrCreateTodayChallenge();

    return challenge;
  }
}

export default DailyChallengeRotationService;