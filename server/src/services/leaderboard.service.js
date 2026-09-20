class LeaderboardService {
  constructor(TypingResult) {
    this.TypingResult = TypingResult;
  }

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

  getStartDate(period) {
    const now = new Date();

    const { year, month, day } =
      this.getIndiaDateParts(now);

    // Create a date representing midnight in India.
    // IST is UTC+05:30.
    const indiaMidnight = new Date(
      Date.UTC(year, month - 1, day, -5, -30, 0, 0)
    );

    if (period === 'today') {
      return indiaMidnight;
    }

    if (period === 'thisWeek') {
      const dayOfWeek = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
      }).format(now);

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

    if (period === 'thisMonth') {
      indiaMidnight.setUTCDate(1);

      return indiaMidnight;
    }

    return null;
  }


  normalizePeriod(period = 'allTime') {
  const normalizedPeriod =
    period === 'all-time' ? 'allTime' : period;

  if (
    ![
      'allTime',
      'today',
      'thisWeek',
      'thisMonth',
    ].includes(normalizedPeriod)
  ) {
    const error = new Error('Invalid leaderboard period');
    error.statusCode = 400;
    throw error;
  }

  return normalizedPeriod;
}

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

  if (![15, 30, 60, 120].includes(durationNumber)) {
    const error = new Error(
      'Duration must be one of: 15, 30, 60, 120, all'
    );

    error.statusCode = 400;
    throw error;
  }

  return durationNumber;
}

buildMatch(period = 'allTime', duration = 'all') {
  const normalizedPeriod = this.normalizePeriod(period);
  const normalizedDuration = this.normalizeDuration(duration);

  const match = {
    user: {
      $exists: true,
      $ne: null,
    },
  };

  if (normalizedDuration !== 'all') {
    match.duration = normalizedDuration;
  }

  const startDate = this.getStartDate(normalizedPeriod);

  if (startDate) {
    match.createdAt = {
      $gte: startDate,
    };
  }

  return match;
}

  async getLeaderboard(
    period = 'allTime',
    duration = 30
  ) {
    const match = {
       user: {
        $exists: true,
    $ne: null,
  },
    };

    // Duration filter
    if (duration && duration !== 'all') {
      const durationNumber = Number(duration);

      if (![15, 30, 60, 120].includes(durationNumber)) {
        const error = new Error(
          'Duration must be one of: 15, 30, 60, 120, all'
        );

        error.statusCode = 400;

        throw error;
      }

      match.duration = durationNumber;
    }

    // Period filter
    const normalizedPeriod =
      period === 'all-time'
        ? 'allTime'
        : period;

    if (
      ![
        'allTime',
        'today',
        'thisWeek',
        'thisMonth',
      ].includes(normalizedPeriod)
    ) {
      const error = new Error(
        'Invalid leaderboard period'
      );

      error.statusCode = 400;

      throw error;
    }

    const startDate =
      this.getStartDate(normalizedPeriod);

    if (startDate) {
      match.createdAt = {
        $gte: startDate,
      };
    }

    /*
     * Each user should appear only once.
     *
     * First sort all results by:
     * 1. WPM
     * 2. Accuracy
     * 3. Newer result
     *
     * Then group by user and keep their best result.
     */
    const results =
      await this.TypingResult.aggregate([
        {
          $match: match,
        },

        {
          $sort: {
            wpm: -1,
            accuracy: -1,
            createdAt: -1,
          },
        },

        {
          $group: {
            _id: '$user',
            bestResult: {
              $first: '$$ROOT',
            },
          },
        },

       {
  $replaceRoot: {
    newRoot: '$bestResult',
  },
},

// Check whether the referenced user actually exists
{
  $lookup: {
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'userData',
  },
},

// Remove orphaned results whose User no longer exists
{
  $unwind: '$userData',
},

{
  $sort: {
    wpm: -1,
    accuracy: -1,
    createdAt: -1,
  },
},

{
  $limit: 50,
},

{
  $project: {
    _id: 1,
    user: '$userData',
    wpm: 1,
    accuracy: 1,
    createdAt: 1,
  },
},

        {
          $sort: {
            wpm: -1,
            accuracy: -1,
            createdAt: -1,
          },
        },

        {
          $limit: 50,
        },
      ]);

    return this.TypingResult.populate(
      results,
      {
        path: 'user',
        select:
          'name username avatar testsCompleted',
      }
    );
  }

  async getUserRank(
  userId,
  period = 'allTime',
  duration = 'all'
) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  const match = this.buildMatch(period, duration);

  const bestResults =
    await this.TypingResult.aggregate([
      {
        $match: match,
      },

      {
        $sort: {
          wpm: -1,
          accuracy: -1,
          createdAt: -1,
        },
      },

      {
        $group: {
          _id: '$user',
          bestResult: {
            $first: '$$ROOT',
          },
        },
      },

      {
        $replaceRoot: {
          newRoot: '$bestResult',
        },
      },

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

      {
        $sort: {
          wpm: -1,
          accuracy: -1,
          createdAt: -1,
        },
      },
    ]);

  const userIndex = bestResults.findIndex(
    (result) =>
      result.user.toString() === userId.toString()
  );

  if (userIndex === -1) {
    return {
      rank: null,
      totalUsers: bestResults.length,
      wpm: 0,
      accuracy: 0,
      hasResult: false,
    };
  }

  const userResult = bestResults[userIndex];

  return {
    rank: userIndex + 1,
    totalUsers: bestResults.length,
    wpm: userResult.wpm,
    accuracy: userResult.accuracy,
    hasResult: true,
  };
}
}

export default LeaderboardService;