class LeaderboardService {
  constructor(TypingResult) {
    this.TypingResult = TypingResult;
  }

  // --------------------------------------------------
  // Get current date parts according to India timezone
  // --------------------------------------------------
  getIndiaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const values = {};

    for (const part of parts) {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    }

    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day),
    };
  }

  // --------------------------------------------------
  // Get start date according to selected period
  // --------------------------------------------------
  getStartDate(period) {
    const now = new Date();

    const { year, month, day } =
      this.getIndiaDateParts(now);

    // Midnight in India (IST = UTC +05:30)
    const indiaMidnight = new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        -5,
        -30,
        0,
        0
      )
    );

    // Today
    if (period === 'today') {
      return indiaMidnight;
    }

    // Current week - starts Sunday
    if (period === 'thisWeek') {
      const dayOfWeek = new Intl.DateTimeFormat(
        'en-US',
        {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
        }
      ).format(now);

      const weekDays = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };

      const currentDay = weekDays[dayOfWeek];

      indiaMidnight.setUTCDate(
        indiaMidnight.getUTCDate() - currentDay
      );

      return indiaMidnight;
    }

    // Current month
    if (period === 'thisMonth') {
      indiaMidnight.setUTCDate(1);

      return indiaMidnight;
    }

    // All time
    return null;
  }

  // --------------------------------------------------
  // Normalize leaderboard period
  // --------------------------------------------------
  normalizePeriod(period = 'allTime') {
    const normalizedPeriod =
      period === 'all-time'
        ? 'allTime'
        : period;

    const validPeriods = [
      'allTime',
      'today',
      'thisWeek',
      'thisMonth',
    ];

    if (!validPeriods.includes(normalizedPeriod)) {
      const error = new Error(
        'Invalid leaderboard period'
      );

      error.statusCode = 400;

      throw error;
    }

    return normalizedPeriod;
  }

  // --------------------------------------------------
  // Normalize duration
  // --------------------------------------------------
  normalizeDuration(duration = 'all') {
    if (
      duration === undefined ||
      duration === null ||
      duration === '' ||
      duration === 'all'
    ) {
      return 'all';
    }

    const durationNumber = Number(duration);

    const validDurations = [
      15,
      30,
      60,
      120,
    ];

    if (!validDurations.includes(durationNumber)) {
      const error = new Error(
        'Duration must be one of: 15, 30, 60, 120, all'
      );

      error.statusCode = 400;

      throw error;
    }

    return durationNumber;
  }

  // --------------------------------------------------
  // Build MongoDB match conditions
  // --------------------------------------------------
  buildMatch(
    period = 'allTime',
    duration = 'all'
  ) {
    const normalizedPeriod =
      this.normalizePeriod(period);

    const normalizedDuration =
      this.normalizeDuration(duration);

    const match = {
      user: {
        $exists: true,
        $ne: null,
      },
    };

    // Duration filter
    if (normalizedDuration !== 'all') {
      match.duration = normalizedDuration;
    }

    // Period filter
    const startDate =
      this.getStartDate(normalizedPeriod);

    if (startDate) {
      match.createdAt = {
        $gte: startDate,
      };
    }

    return match;
  }

  // --------------------------------------------------
  // Get leaderboard
  //
  // IMPORTANT:
  // Each user appears only once.
  // We take the user's LATEST qualifying result.
  //
  // After selecting latest result for every user,
  // we rank those latest results by:
  //
  // 1. WPM DESC
  // 2. Accuracy DESC
  // 3. CreatedAt DESC
  // --------------------------------------------------
  async getLeaderboard(
    period = 'allTime',
    duration = 'all'
  ) {
    const match = this.buildMatch(
      period,
      duration
    );

    const results =
      await this.TypingResult.aggregate([
        // --------------------------------------------
        // 1. Apply period + duration filters
        // --------------------------------------------
        {
          $match: match,
        },

        // --------------------------------------------
        // 2. Sort newest result first
        // --------------------------------------------
        {
          $sort: {
            createdAt: -1,
          },
        },

        // --------------------------------------------
        // 3. Keep only the latest result per user
        // --------------------------------------------
        {
          $group: {
            _id: '$user',
            latestResult: {
              $first: '$$ROOT',
            },
          },
        },

        // --------------------------------------------
        // 4. Convert latestResult back to root
        // --------------------------------------------
        {
          $replaceRoot: {
            newRoot: '$latestResult',
          },
        },

        // --------------------------------------------
        // 5. Get user information
        // --------------------------------------------
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userData',
          },
        },

        // --------------------------------------------
        // 6. Remove results whose user no longer exists
        // --------------------------------------------
        {
          $unwind: '$userData',
        },

        // --------------------------------------------
        // 7. Rank latest results
        // --------------------------------------------
        {
          $sort: {
            wpm: -1,
            accuracy: -1,
            createdAt: -1,
          },
        },

        // --------------------------------------------
        // 8. Return top 50
        // --------------------------------------------
        {
          $limit: 50,
        },

        // --------------------------------------------
        // 9. Return only required fields
        // --------------------------------------------
        {
          $project: {
            _id: 1,

            user: {
              _id: '$userData._id',
              name: '$userData.name',
              username: '$userData.username',
              avatar: '$userData.avatar',
              location: '$userData.location',
              testsCompleted:
                '$userData.testsCompleted',
            },

            wpm: 1,
            accuracy: 1,
            createdAt: 1,
            duration: 1,
            mode: 1,
          },
        },
      ]);

    return results;
  }

  // --------------------------------------------------
  // Get current user's rank
  //
  // Uses exactly the same "latest result per user"
  // logic as getLeaderboard().
  // --------------------------------------------------
  async getUserRank(
    userId,
    period = 'allTime',
    duration = 'all'
  ) {
    if (!userId) {
      const error = new Error(
        'User ID is required'
      );

      error.statusCode = 400;

      throw error;
    }

    const match = this.buildMatch(
      period,
      duration
    );

    const results =
      await this.TypingResult.aggregate([
        // --------------------------------------------
        // 1. Apply period + duration filters
        // --------------------------------------------
        {
          $match: match,
        },

        // --------------------------------------------
        // 2. Latest result first
        // --------------------------------------------
        {
          $sort: {
            createdAt: -1,
          },
        },

        // --------------------------------------------
        // 3. Latest result for each user
        // --------------------------------------------
        {
          $group: {
            _id: '$user',
            latestResult: {
              $first: '$$ROOT',
            },
          },
        },

        // --------------------------------------------
        // 4. Restore latest result as root
        // --------------------------------------------
        {
          $replaceRoot: {
            newRoot: '$latestResult',
          },
        },

        // --------------------------------------------
        // 5. Make sure user still exists
        // --------------------------------------------
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userData',
          },
        },

        {
          $unwind: '$userData',
        },

        // --------------------------------------------
        // 6. Rank latest results
        // --------------------------------------------
        {
          $sort: {
            wpm: -1,
            accuracy: -1,
            createdAt: -1,
          },
        },
      ]);

    // ----------------------------------------------
    // Find current user's position
    // ----------------------------------------------
    const userIndex = results.findIndex(
      (result) =>
        result.user.toString() ===
        userId.toString()
    );

    // User has no qualifying result
    if (userIndex === -1) {
      return {
        rank: null,
        totalUsers: results.length,
        wpm: 0,
        accuracy: 0,
        hasResult: false,
      };
    }

    const userResult =
      results[userIndex];

    return {
      rank: userIndex + 1,
      totalUsers: results.length,
      wpm: userResult.wpm,
      accuracy: userResult.accuracy,
      hasResult: true,
    };
  }
}

export default LeaderboardService;