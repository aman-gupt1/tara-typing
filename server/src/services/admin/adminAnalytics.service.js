import mongoose from 'mongoose';
import User from '../../models/User.js';
import TypingResult from '../../models/TypingResult.js';
import Lesson from '../../models/Lesson.js';
import UserLessonProgress from '../../models/UserLessonProgress.js';
import Course from '../../models/Course.js';

class AdminAnalyticsService {
  /**
   * Helper to get IST start of today
   */
  getISTStartOfDay(daysAgo = 0) {
    const now = new Date();
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const utcOffset = date.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 3600000;
    const istTime = new Date(date.getTime() + utcOffset + istOffset);
    istTime.setHours(0, 0, 0, 0);
    return new Date(istTime.getTime() - istOffset - utcOffset);
  }

  /**
   * Helper to determine timeframe date boundary
   */
  getTimeframeDate(timeframe = '30d') {
    const now = new Date();
    switch (timeframe) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'all':
      default:
        return new Date(0);
    }
  }

  /**
   * GET /api/admin/analytics/overview
   * Computes complete live telemetry, engagement KPIs, charts, and curriculum funnel
   * 100% derived from live database records with zero synthetic dummy fallbacks.
   */
  async getAnalyticsOverview(timeframe = '30d') {
    const timeframeDate = this.getTimeframeDate(timeframe);
    const startOfToday = this.getISTStartOfDay(0);
    const startOfWeek = this.getISTStartOfDay(7);
    const startOfMonth = this.getISTStartOfDay(30);

    // 1. Parallel execution for high performance
    const [
      totalUsers,
      totalTestsAllTime,
      testsToday,
      activeTodayUsers,
      activeWeekUsers,
      activeMonthUsers,
      avgVelocityAgg,
      usersWithMultipleTests,
      lessonProgressAgg,
      totalLessonsCount,
    ] = await Promise.all([
      User.countDocuments(),
      TypingResult.countDocuments(),
      TypingResult.countDocuments({ createdAt: { $gte: startOfToday } }),
      TypingResult.distinct('user', { createdAt: { $gte: startOfToday } }),
      TypingResult.distinct('user', { createdAt: { $gte: startOfWeek } }),
      TypingResult.distinct('user', { createdAt: { $gte: startOfMonth } }),
      TypingResult.aggregate([
        { $match: { wpm: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
          },
        },
      ]),
      User.countDocuments({ testsCompleted: { $gt: 1 } }),
      UserLessonProgress.aggregate([
        {
          $group: {
            _id: null,
            totalCompletedLessons: { $sum: '$totalCompleted' },
            activeLearners: { $sum: 1 },
          },
        },
      ]),
      Lesson.countDocuments({ isActive: true }),
    ]);

    // Active users counts (real counts from DB)
    const dau = activeTodayUsers.length;
    const wau = activeWeekUsers.length;
    const mau = activeMonthUsers.length;

    // Platform averages (real data, 0 if no tests exist)
    const averageWpm = avgVelocityAgg[0]?.avgWpm
      ? Number(avgVelocityAgg[0].avgWpm.toFixed(1))
      : 0;
    const averageAccuracy = avgVelocityAgg[0]?.avgAccuracy
      ? Number(avgVelocityAgg[0].avgAccuracy.toFixed(1))
      : 0;

    // Derived retention and volume
    const testsPerUser = totalUsers > 0 ? Number((totalTestsAllTime / totalUsers).toFixed(1)) : 0;
    const retentionRate =
      totalUsers > 0 ? `${Number(((usersWithMultipleTests / totalUsers) * 100).toFixed(1))}%` : '0%';
    const bounceRate =
      totalUsers > 0 ? `${Math.max(0, (100 - parseFloat(retentionRate))).toFixed(1)}%` : '0%';

    // 2. Historical WPM Progression (Past 6 Months)
    const wpmProgression = await this.computeWpmProgression();

    // 3. Typing Mode Distribution
    const modeDistribution = await this.computeModeDistribution(timeframeDate);

    // 4. Keystroke Accuracy Distribution
    const accuracyDistribution = await this.computeAccuracyDistribution(timeframeDate);

    // 5. Hourly Activity in IST (24h concurrency)
    const hourlyActivity = await this.computeHourlyActivityIST();

    // 6. Client Platform / Browser Split
    const deviceBreakdown = await this.computeDeviceBreakdown(timeframeDate);

    // 7. 18-Lesson Curriculum Retention Funnel
    const lessonFunnel = await this.computeCurriculumFunnel(totalUsers);

    return {
      timeframe,
      dau,
      wau,
      mau,
      retentionRate,
      averageWpm,
      averageAccuracy,
      testsPerUser,
      bounceRate,
      totalTestsAllTime,
      testsToday,
      totalUsers,
      wpmProgression,
      modeDistribution,
      accuracyDistribution,
      hourlyActivity,
      deviceBreakdown,
      lessonFunnel,
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Compute 6-Month WPM Progression Curve (Avg WPM vs Top 1% Elite WPM)
   * 100% dynamic from DB. Returns 0 if no tests were performed in that calendar month.
   */
  async computeWpmProgression() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = monthNames[d.getMonth()];

      const [agg] = await TypingResult.aggregate([
        {
          $match: {
            createdAt: { $gte: d, $lt: nextMonth },
            wpm: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            maxWpm: { $max: '$wpm' },
          },
        },
      ]);

      const baseAvg = agg?.avgWpm ? Number(agg.avgWpm.toFixed(1)) : 0;
      const baseElite = agg?.maxWpm ? Number(agg.maxWpm.toFixed(1)) : 0;

      result.push({
        month: monthLabel,
        avgWpm: baseAvg,
        eliteWpm: baseElite,
      });
    }

    return result;
  }

  /**
   * Compute Typing Mode Distribution Breakdown
   * 100% dynamic from DB. Returns empty array if no test logs exist.
   */
  async computeModeDistribution(sinceDate) {
    const filter = sinceDate.getTime() > 0 ? { createdAt: { $gte: sinceDate } } : {};
    const modesAgg = await TypingResult.aggregate([
      { $match: filter },
      { $group: { _id: '$mode', count: { $sum: 1 } } },
    ]);

    const totalMatching = modesAgg.reduce((sum, m) => sum + m.count, 0);

    if (totalMatching === 0) {
      return [];
    }

    const modeConfig = {
      'timed-60': { label: 'Timed (60s)', color: '#8B5CF6' },
      'timed-30': { label: 'Timed (30s)', color: '#3B82F6' },
      'timed': { label: 'Timed (30s/60s)', color: '#8B5CF6' },
      'words': { label: 'Words (25/50)', color: '#3B82F6' },
      'daily': { label: 'Daily Challenge', color: '#10B981' },
      'practice': { label: 'Quote Drills', color: '#F59E0B' },
      'code': { label: 'Developer Code', color: '#EC4899' },
    };

    return modesAgg.map((m) => {
      const modeKey = (m._id || 'timed').toLowerCase();
      const cfg = modeConfig[modeKey] || {
        label: m._id ? `${m._id.charAt(0).toUpperCase() + m._id.slice(1)} Mode` : 'Timed Mode',
        color: '#8B5CF6',
      };
      const share = Number(((m.count / totalMatching) * 100).toFixed(1));
      return {
        mode: cfg.label,
        share,
        tests: m.count,
        color: cfg.color,
      };
    });
  }

  /**
   * Compute Keystroke Accuracy Precision Buckets
   * 100% dynamic from DB.
   */
  async computeAccuracyDistribution(sinceDate) {
    const filter = sinceDate.getTime() > 0 ? { createdAt: { $gte: sinceDate } } : {};
    const [accAgg] = await TypingResult.aggregate([
      { $match: filter },
      {
        $facet: {
          flawless: [{ $match: { accuracy: { $gte: 99 } } }, { $count: 'count' }],
          highPrecision: [
            { $match: { accuracy: { $gte: 95, $lt: 99 } } },
            { $count: 'count' },
          ],
          good: [{ $match: { accuracy: { $gte: 90, $lt: 95 } } }, { $count: 'count' }],
          needsWork: [{ $match: { accuracy: { $lt: 90 } } }, { $count: 'count' }],
        },
      },
    ]);

    const flawlessCount = accAgg?.flawless[0]?.count || 0;
    const highCount = accAgg?.highPrecision[0]?.count || 0;
    const goodCount = accAgg?.good[0]?.count || 0;
    const needsWorkCount = accAgg?.needsWork[0]?.count || 0;
    const total = flawlessCount + highCount + goodCount + needsWorkCount;

    return [
      {
        range: '99-100% (Flawless)',
        count: flawlessCount,
        percentage: total > 0 ? Number(((flawlessCount / total) * 100).toFixed(1)) : 0,
        fill: '#10B981',
      },
      {
        range: '95-98% (High Precision)',
        count: highCount,
        percentage: total > 0 ? Number(((highCount / total) * 100).toFixed(1)) : 0,
        fill: '#8B5CF6',
      },
      {
        range: '90-94% (Good)',
        count: goodCount,
        percentage: total > 0 ? Number(((goodCount / total) * 100).toFixed(1)) : 0,
        fill: '#F59E0B',
      },
      {
        range: '<90% (Needs Work)',
        count: needsWorkCount,
        percentage: total > 0 ? Number(((needsWorkCount / total) * 100).toFixed(1)) : 0,
        fill: '#EF4444',
      },
    ];
  }

  /**
   * Compute 24-Hour Concurrency & Activity in IST (UTC+5:30)
   * 100% dynamic from DB. Returns real count per 3-hour slot (0 if no activity).
   */
  async computeHourlyActivityIST() {
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const hourlyMap = {};
    hours.forEach((h) => {
      hourlyMap[h] = { users: 0, tests: 0 };
    });

    try {
      const startOfToday = this.getISTStartOfDay(1);
      const rawHourly = await TypingResult.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        {
          $project: {
            hourNumber: {
              $hour: {
                date: '$createdAt',
                timezone: '+05:30',
              },
            },
            user: '$user',
          },
        },
        {
          $group: {
            _id: '$hourNumber',
            tests: { $sum: 1 },
            users: { $addToSet: '$user' },
          },
        },
      ]);

      for (const row of rawHourly) {
        const hNum = row._id;
        let slot = '00:00';
        if (hNum >= 21) slot = '21:00';
        else if (hNum >= 18) slot = '18:00';
        else if (hNum >= 15) slot = '15:00';
        else if (hNum >= 12) slot = '12:00';
        else if (hNum >= 9) slot = '09:00';
        else if (hNum >= 6) slot = '06:00';
        else if (hNum >= 3) slot = '03:00';

        if (hourlyMap[slot]) {
          hourlyMap[slot].tests += row.tests;
          hourlyMap[slot].users += row.users.length;
        }
      }
    } catch (err) {
      console.warn('Hourly aggregation notice:', err.message);
    }

    return hours.map((hour) => ({
      hour,
      users: hourlyMap[hour]?.users || 0,
      tests: hourlyMap[hour]?.tests || 0,
    }));
  }

  /**
   * Compute Client Platform / Browser Split
   * 100% dynamic from DB. Returns 0% if no browser data is recorded.
   */
  async computeDeviceBreakdown(sinceDate) {
    const filter = sinceDate.getTime() > 0 ? { createdAt: { $gte: sinceDate } } : {};
    const browserAgg = await TypingResult.aggregate([
      { $match: filter },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
    ]);

    const total = browserAgg.reduce((sum, b) => sum + b.count, 0);

    if (total === 0) {
      return [
        { name: 'Desktop (Chrome)', value: 0, color: '#8B5CF6' },
        { name: 'Desktop (Firefox)', value: 0, color: '#3B82F6' },
        { name: 'Desktop (Edge/Safari)', value: 0, color: '#EC4899' },
        { name: 'Tablet / Other', value: 0, color: '#10B981' },
      ];
    }

    let chrome = 0;
    let firefox = 0;
    let edgeSafari = 0;
    let other = 0;

    browserAgg.forEach((b) => {
      const name = (b._id || '').toLowerCase();
      if (name.includes('chrome')) chrome += b.count;
      else if (name.includes('firefox')) firefox += b.count;
      else if (name.includes('edge') || name.includes('safari')) edgeSafari += b.count;
      else other += b.count;
    });

    return [
      { name: 'Desktop (Chrome)', value: Math.round((chrome / total) * 100), color: '#8B5CF6' },
      { name: 'Desktop (Firefox)', value: Math.round((firefox / total) * 100), color: '#3B82F6' },
      { name: 'Desktop (Edge/Safari)', value: Math.round((edgeSafari / total) * 100), color: '#EC4899' },
      { name: 'Tablet / Other', value: Math.round((other / total) * 100), color: '#10B981' },
    ];
  }

  /**
   * Compute 18-Lesson Curriculum Retention Funnel
   * 100% dynamic from UserLessonProgress collection.
   * Eliminates all hardcoded fallback student counts and completions.
   */
  async computeCurriculumFunnel(totalPlatformUsers) {
    const tiers = [
      { tier: 'Getting Started (L1–4)', minLessons: 1 },
      { tier: 'Finger Placement (L5–7)', minLessons: 5 },
      { tier: 'Full Keyboard (L8–12)', minLessons: 8 },
      { tier: 'Build Accuracy (L13–14)', minLessons: 13 },
      { tier: 'Build Speed (L15–16)', minLessons: 15 },
      { tier: 'Advanced Typing (L17+)', minLessons: 17 },
    ];

    try {
      const progressDocs = await UserLessonProgress.find().lean();
      const totalLearners = progressDocs ? progressDocs.length : 0;

      return tiers.map((t) => {
        // Count how many learners completed at least t.minLessons
        const reached = totalLearners > 0
          ? progressDocs.filter((p) => {
              const count = p.totalCompleted || (Array.isArray(p.completedLessons) ? p.completedLessons.length : 0);
              return count >= t.minLessons;
            }).length
          : 0;

        // Completion percentage among all learners enrolled in the curriculum
        const completion = totalLearners > 0
          ? Number(((reached / totalLearners) * 100).toFixed(1))
          : 0;

        return {
          tier: t.tier,
          enrolled: reached,
          completion,
        };
      });
    } catch (err) {
      console.warn('Curriculum funnel calculation notice:', err.message);
      return tiers.map((t) => ({
        tier: t.tier,
        enrolled: 0,
        completion: 0,
      }));
    }
  }

  /**
   * Export complete platform intelligence report as CSV
   */
  async exportAnalyticsCSV(timeframe = '30d') {
    const data = await this.getAnalyticsOverview(timeframe);

    const headers = ['Category', 'Metric', 'Value', 'Reference / Scope'];
    const rows = [
      ['Engagement', 'Daily Active Users (DAU)', data.dau, 'Today (IST)'],
      ['Engagement', 'Weekly Active Users (WAU)', data.wau, 'Rolling 7 Days'],
      ['Engagement', 'Monthly Active Users (MAU)', data.mau, 'Rolling 30 Days'],
      ['Engagement', '30-Day Retention Rate', data.retentionRate, 'Rolling 30 Days'],
      ['Engagement', 'Platform Bounce Rate', data.bounceRate, 'Platform Exit Rate'],
      ['Performance', 'Total Tests All Time', data.totalTestsAllTime, 'Across All Modes'],
      ['Performance', 'Tests Today', data.testsToday, "Today's Volume"],
      ['Performance', 'Platform Avg Speed', `${data.averageWpm} WPM`, 'Net Average Velocity'],
      ['Performance', 'Global Accuracy Benchmark', `${data.averageAccuracy}%`, 'Keystroke Precision'],
      ['Performance', 'Tests Per Typist', data.testsPerUser, 'Average Volume Per User'],
      ['Performance', 'Total Registered Typists', data.totalUsers, 'All-time Community'],
    ];

    // Append mode distribution
    data.modeDistribution.forEach((m) => {
      rows.push(['Mode Distribution', m.mode, `${m.tests.toLocaleString()} tests (${m.share}%)`, 'Test Execution Volume']);
    });

    // Append curriculum funnel
    data.lessonFunnel.forEach((f) => {
      rows.push(['Curriculum Funnel', f.tier, `${f.completion}% Completion`, `${f.enrolled.toLocaleString()} Students Enrolled`]);
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    return {
      filename: `tara_typing_analytics_report_${Date.now()}.csv`,
      data: csvContent,
    };
  }
}

export default new AdminAnalyticsService();
