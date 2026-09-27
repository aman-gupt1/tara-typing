import TypingResult from '../../models/TypingResult.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

class AdminLeaderboardService {
  constructor() {
    this.TypingResult = TypingResult;
    this.User = User;
  }

  /**
   * Get start date according to Indian Standard Time (IST)
   */
  getStartDate(timeframe) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const values = {};
    for (const p of parts) if (p.type !== 'literal') values[p.type] = p.value;
    const year = Number(values.year);
    const month = Number(values.month);
    const day = Number(values.day);

    const indiaMidnight = new Date(Date.UTC(year, month - 1, day, -5, -30, 0, 0));

    if (timeframe === 'daily') return indiaMidnight;
    if (timeframe === 'weekly') {
      const dayOfWeek = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
      }).format(now);
      const weekDays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      indiaMidnight.setUTCDate(indiaMidnight.getUTCDate() - weekDays[dayOfWeek]);
      return indiaMidnight;
    }
    if (timeframe === 'monthly') {
      indiaMidnight.setUTCDate(1);
      return indiaMidnight;
    }
    return null; // 'global' / all-time
  }

  /**
   * Normalize timeframe keyword
   */
  normalizeTimeframe(tf = 'global') {
    const t = tf.toLowerCase();
    if (t === 'daily' || t === 'today') return 'daily';
    if (t === 'weekly' || t === 'thisweek') return 'weekly';
    if (t === 'monthly' || t === 'thismonth') return 'monthly';
    return 'global';
  }

  /**
   * Calculate bot risk heuristic
   */
  calculateBotRisk(item) {
    if (item.isFlagged || item.isSuspicious) return 95;
    const wpm = item.wpm || 0;
    if (wpm >= 180) return 92;
    if (wpm >= 150) return 65;
    if (wpm >= 120) return 25;
    return 2;
  }

  /**
   * GET /api/admin/leaderboard
   * High-performance aggregation pipeline with deduplication and index utilization
   */
  async getLeaderboard({
    timeframe = 'global',
    mode = 'All',
    status = 'All',
    sortBy = 'rank',
    search = '',
    page = 1,
    limit = 20,
  } = {}) {
    const normTf = this.normalizeTimeframe(timeframe);
    const startDate = this.getStartDate(normTf);

    // 1. Initial Match Stage (Runs against indexed fields)
    const matchStage = {};
    if (startDate) {
      matchStage.createdAt = { $gte: startDate };
    }

    if (mode && mode.toLowerCase() !== 'all') {
      const m = mode.toLowerCase();
      if (m === 'timed') {
        matchStage.$or = [{ mode: /time/i }, { mode: 'custom' }, { duration: { $in: [15, 30, 60, 120] } }];
      } else if (m === 'words') {
        matchStage.$or = [{ mode: /word/i }, { mode: 'words' }];
      } else if (m === 'quote') {
        matchStage.mode = /quote/i;
      } else if (m === 'code') {
        matchStage.mode = /code/i;
      } else if (m.includes('challenge')) {
        matchStage.mode = /challenge/i;
      } else {
        matchStage.mode = new RegExp(m, 'i');
      }
    }

    // 2. High Performance Aggregation Pipeline
    const pipeline = [
      { $match: matchStage },
      // Sort first to pick the highest score per user in $group
      { $sort: { wpm: -1, accuracy: -1, createdAt: -1 } },
      {
        $group: {
          _id: '$user',
          testId: { $first: '$_id' },
          wpm: { $first: '$wpm' },
          rawWpm: { $first: '$rawWpm' },
          accuracy: { $first: '$accuracy' },
          mode: { $first: '$mode' },
          duration: { $first: '$duration' },
          consistency: { $first: '$consistency' },
          isSuspicious: { $first: '$isSuspicious' },
          status: { $first: '$status' },
          wpmHistory: { $first: '$wpmHistory' },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDoc',
        },
      },
      { $unwind: '$userDoc' },
    ];

    // Filter by text search if provided
    if (search && search.trim()) {
      const q = search.trim();
      const sRegex = new RegExp(q, 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'userDoc.name': sRegex },
            { 'userDoc.username': sRegex },
            { 'userDoc.email': sRegex },
            { mode: sRegex },
          ],
        },
      });
    }

    // Filter by audit status (Verified vs Flagged)
    if (status && status.toLowerCase() !== 'all') {
      const s = status.toLowerCase();
      if (s === 'flagged') {
        pipeline.push({
          $match: {
            $or: [{ isSuspicious: true }, { status: 'suspicious' }],
          },
        });
      } else {
        pipeline.push({
          $match: {
            $and: [
              { isSuspicious: { $ne: true } },
              { status: { $ne: 'suspicious' } },
            ],
          },
        });
      }
    }

    // Official Sorting
    let sortObj = { wpm: -1, accuracy: -1 };
    switch (sortBy) {
      case 'speed_desc':
        sortObj = { wpm: -1, accuracy: -1 };
        break;
      case 'accuracy_desc':
        sortObj = { accuracy: -1, wpm: -1 };
        break;
      case 'tests_desc':
        sortObj = { 'userDoc.testsCompleted': -1, wpm: -1 };
        break;
      case 'risk_desc':
        sortObj = { isSuspicious: -1, wpm: -1 };
        break;
      case 'rank':
      default:
        sortObj = { wpm: -1, accuracy: -1 };
    }
    pipeline.push({ $sort: sortObj });

    // Execute Leaderboard Query & Tab Counts in Parallel
    const [allRankedDocs, globalCount, dailyCount, weeklyCount, monthlyCount] =
      await Promise.all([
        this.TypingResult.aggregate(pipeline).allowDiskUse(true),
        // Fast distinct user counts per timeframe tab
        this.TypingResult.distinct('user', {}),
        this.TypingResult.distinct('user', { createdAt: { $gte: this.getStartDate('daily') } }),
        this.TypingResult.distinct('user', { createdAt: { $gte: this.getStartDate('weekly') } }),
        this.TypingResult.distinct('user', { createdAt: { $gte: this.getStartDate('monthly') } }),
      ]);

    // Compute Top 4 Platform KPIs
    const validCompetitors = allRankedDocs.filter(
      (doc) => !doc.isSuspicious && doc.status !== 'suspicious'
    );
    const flaggedCompetitors = allRankedDocs.filter(
      (doc) => doc.isSuspicious || doc.status === 'suspicious'
    );

    const peakWpm = validCompetitors.length > 0 ? validCompetitors[0].wpm : 0;
    const peakHolderName =
      validCompetitors.length > 0
        ? `@${validCompetitors[0].userDoc.username}`
        : 'None';

    const top3 = validCompetitors.slice(0, 3);
    const podiumAccuracy =
      top3.length > 0
        ? (top3.reduce((sum, item) => sum + item.accuracy, 0) / top3.length).toFixed(1)
        : '0.0';

    // Format Entries with Official Ranks
    const formattedLeaderboard = allRankedDocs.map((doc, idx) => {
      const isFlagged = Boolean(doc.isSuspicious || doc.status === 'suspicious');
      const botRisk = this.calculateBotRisk({ ...doc, isFlagged });

      const dateStr = doc.createdAt
        ? new Date(doc.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently';

      return {
        rank: idx + 1,
        id: doc.testId ? doc.testId.toString() : doc._id.toString(),
        testId: doc.testId ? doc.testId.toString() : doc._id.toString(),
        userId: doc.userDoc._id.toString(),
        name: doc.userDoc.name || 'Anonymous Typist',
        username: doc.userDoc.username || 'user',
        email: doc.userDoc.email || '',
        avatar:
          doc.userDoc.avatar ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${doc.userDoc.username || 'user'}`,
        location: doc.userDoc.location || 'India',
        streak: doc.userDoc.currentStreak || 1,
        tests: doc.userDoc.testsCompleted || 1,
        wpm: doc.wpm || 0,
        rawWpm: doc.rawWpm || doc.wpm || 0,
        accuracy: Math.round(doc.accuracy || 0),
        duration: doc.duration || 60,
        mode: (() => {
          const m = (doc.mode || '').toLowerCase();
          if (m === 'custom' || m.includes('time')) return doc.duration ? `Timed ${doc.duration}s` : 'Timed';
          if (m.includes('word')) return doc.duration ? `Words ${doc.duration}` : 'Words';
          if (m.includes('quote')) return 'Quote';
          if (m.includes('code')) return 'Code';
          if (m.includes('challenge')) return 'Daily Challenge';
          return doc.mode ? doc.mode.charAt(0).toUpperCase() + doc.mode.slice(1) : 'Timed';
        })(),
        modeDetail: `${doc.duration || 60}s Test`,
        date: dateStr,
        isFlagged,
        botRisk,
        status: isFlagged ? 'Flagged Anomalous' : 'Verified Clean',
        ip: '127.0.0.1',
        consistency: doc.consistency || 85,
        wpmHistory: doc.wpmHistory || [],
        createdAt: doc.createdAt,
      };
    });

    // Pagination slice
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const totalItems = formattedLeaderboard.length;
    const totalPages = Math.ceil(totalItems / pageLimit) || 1;
    const paginatedLeaderboard = formattedLeaderboard.slice(
      (currentPage - 1) * pageLimit,
      currentPage * pageLimit
    );

    return {
      timeframe: normTf,
      leaderboard: paginatedLeaderboard,
      allLeaderboard: formattedLeaderboard,
      tabsCount: {
        global: globalCount.length,
        daily: dailyCount.length,
        weekly: weeklyCount.length,
        monthly: monthlyCount.length,
      },
      stats: {
        peakSpeed: `${peakWpm} WPM`,
        peakHolder: peakHolderName,
        rankedTypists: totalItems,
        flaggedCount: flaggedCompetitors.length,
        podiumAccuracy: `${podiumAccuracy}%`,
      },
      pagination: {
        page: currentPage,
        limit: pageLimit,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  /**
   * PATCH /api/admin/leaderboard/entry/:testId/flag
   * Toggle anomalous / flagged state of an entry
   */
  async toggleFlag(testId, { isFlagged, status } = {}) {
    const test = await this.TypingResult.findById(testId);
    if (!test) {
      const error = new Error('Leaderboard test entry not found');
      error.statusCode = 404;
      throw error;
    }

    let nextFlagged = false;
    if (isFlagged !== undefined) {
      nextFlagged = Boolean(isFlagged);
    } else if (status !== undefined) {
      nextFlagged = status.toLowerCase() === 'flagged';
    } else {
      nextFlagged = !(test.isSuspicious || test.status === 'suspicious');
    }

    test.isSuspicious = nextFlagged;
    test.status = nextFlagged ? 'suspicious' : 'valid';
    await test.save();

    return {
      testId: test._id.toString(),
      isFlagged: nextFlagged,
      status: nextFlagged ? 'Flagged Anomalous' : 'Verified Clean',
      botRisk: nextFlagged ? 95 : 2,
    };
  }

  /**
   * DELETE /api/admin/leaderboard/entry/:testId
   * Disqualify anomalous record by removing the fraudulent test run
   */
  async disqualifyEntry(testId) {
    const test = await this.TypingResult.findByIdAndDelete(testId);
    if (!test) {
      const error = new Error('Leaderboard test entry not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      message: `Score entry ${testId} disqualified and removed permanently`,
      deletedTestId: testId,
    };
  }

  /**
   * GET /api/admin/leaderboard/export
   * Export leaderboard standings as CSV or JSON
   */
  async exportLeaderboard({ timeframe = 'global', format = 'csv' } = {}) {
    const result = await this.getLeaderboard({
      timeframe,
      limit: 1000,
    });

    const entries = result.allLeaderboard || result.leaderboard;

    if (format === 'json') {
      return {
        format: 'json',
        data: entries,
      };
    }

    // CSV format
    const headers = [
      'Rank',
      'Typist Name',
      'Username',
      'Speed (WPM)',
      'Raw WPM',
      'Accuracy (%)',
      'Total Tests',
      'Mode',
      'Date',
      'Status',
      'Bot Risk (%)',
      'IP Address',
    ].join(',');

    const rows = entries.map((item) =>
      [
        item.rank,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.username || '').replace(/"/g, '""')}"`,
        item.wpm,
        item.rawWpm || item.wpm,
        `"${item.accuracy}%"`,
        item.tests || 0,
        `"${item.mode || 'Timed'}"`,
        `"${item.date || ''}"`,
        `"${item.status}"`,
        `"${item.botRisk || 0}%"`,
        `"${item.ip || '127.0.0.1'}"`,
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    return {
      format: 'csv',
      data: csvContent,
      filename: `tara_typing_${timeframe}_leaderboard_${new Date().toISOString().split('T')[0]}.csv`,
    };
  }
}

export const adminLeaderboardService = new AdminLeaderboardService();
export default adminLeaderboardService;
