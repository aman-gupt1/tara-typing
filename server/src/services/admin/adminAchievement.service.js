import mongoose from 'mongoose';
import Achievement from '../../models/Achievement.js';
import User from '../../models/User.js';

export const DEFAULT_ACHIEVEMENTS = [
  {
    key: 'first-test',
    name: 'First Steps',
    title: 'First Steps',
    description: 'Complete your first typing test on Tara Typing.',
    requirement: '1 Test Completed',
    requirementConfig: {
      type: 'testsCompleted',
      value: 1,
    },
    category: 'Volume',
    tier: 'Common',
    icon: 'Target',
    color: 'blue',
    points: 10,
    status: 'Active',
  },
  {
    key: 'speed-30',
    name: 'Getting Started',
    title: 'Getting Started',
    description: 'Reach a benchmark speed of 30 WPM.',
    requirement: '30 WPM on any test',
    requirementConfig: {
      type: 'bestWpm',
      value: 30,
    },
    category: 'Speed',
    tier: 'Common',
    icon: 'Zap',
    color: 'purple',
    points: 20,
    status: 'Active',
  },
  {
    key: 'speed-50',
    name: 'Speed Typist',
    title: 'Speed Typist',
    description: 'Break into conversational typing speed at 50 WPM.',
    requirement: '50 WPM on any test',
    requirementConfig: {
      type: 'bestWpm',
      value: 50,
    },
    category: 'Speed',
    tier: 'Rare',
    icon: 'Zap',
    color: 'orange',
    points: 50,
    status: 'Active',
  },
  {
    key: 'speed-75',
    name: 'Fast Fingers',
    title: 'Fast Fingers',
    description: 'Reach professional typist speed of 75 WPM.',
    requirement: '75 WPM on any test',
    requirementConfig: {
      type: 'bestWpm',
      value: 75,
    },
    category: 'Speed',
    tier: 'Epic',
    icon: 'Flame',
    color: 'pink',
    points: 100,
    status: 'Active',
  },
  {
    key: 'speed-100',
    name: 'Century',
    title: 'Century',
    description: 'Ascend to elite velocity by crossing 100 WPM.',
    requirement: '100 WPM on any test',
    requirementConfig: {
      type: 'bestWpm',
      value: 100,
    },
    category: 'Speed',
    tier: 'Legendary',
    icon: 'Trophy',
    color: 'orange',
    points: 250,
    status: 'Active',
  },
  {
    key: 'accuracy-95',
    name: 'Precise',
    title: 'Precise',
    description: 'Maintain 95% accuracy over a 60-second test.',
    requirement: '95% Accuracy (min 60s)',
    requirementConfig: {
      type: 'accuracy',
      value: 95,
    },
    category: 'Accuracy',
    tier: 'Rare',
    icon: 'Target',
    color: 'green',
    points: 40,
    status: 'Active',
  },
  {
    key: 'accuracy-100',
    name: 'Perfect Accuracy',
    title: 'Perfect Accuracy',
    description: 'Flawless execution with 100% accuracy and zero uncorrected errors.',
    requirement: '100% Accuracy (min 60s)',
    requirementConfig: {
      type: 'accuracy',
      value: 100,
    },
    category: 'Accuracy',
    tier: 'Legendary',
    icon: 'Award',
    color: 'purple',
    points: 300,
    status: 'Active',
  },
  {
    key: 'tests-10',
    name: 'Regular Typist',
    title: 'Regular Typist',
    description: 'Complete 10 typing sessions across any mode.',
    requirement: '10 Tests Completed',
    requirementConfig: {
      type: 'testsCompleted',
      value: 10,
    },
    category: 'Volume',
    tier: 'Common',
    icon: 'Calendar',
    color: 'blue',
    points: 30,
    status: 'Active',
  },
  {
    key: 'tests-50',
    name: 'Dedicated Typist',
    title: 'Dedicated Typist',
    description: 'Complete 50 sessions and demonstrate true dedication.',
    requirement: '50 Tests Completed',
    requirementConfig: {
      type: 'testsCompleted',
      value: 50,
    },
    category: 'Volume',
    tier: 'Rare',
    icon: 'Star',
    color: 'orange',
    points: 80,
    status: 'Active',
  },
  {
    key: 'streak-7',
    name: 'Weekly Streak',
    title: 'Weekly Streak',
    description: 'Practice every single day for 7 consecutive days.',
    requirement: '7-Day Active Streak',
    requirementConfig: {
      type: 'currentStreak',
      value: 7,
    },
    category: 'Streak',
    tier: 'Epic',
    icon: 'Flame',
    color: 'pink',
    points: 150,
    status: 'Active',
  },
  {
    key: 'podium-finisher',
    name: 'Podium Finisher',
    title: 'Podium Finisher',
    description: 'Finish in the Top 3 on any official Daily Challenge contest.',
    requirement: 'Top 3 Daily Contest',
    requirementConfig: {
      type: 'custom',
      value: 1,
    },
    category: 'Competition',
    tier: 'Epic',
    icon: 'Trophy',
    color: 'orange',
    points: 200,
    status: 'Active',
  },
  {
    key: 'curriculum-graduate',
    name: 'Curriculum Graduate',
    title: 'Curriculum Graduate',
    description: 'Master all 18 interactive lessons in Tara Typing Touch Typing curriculum.',
    requirement: 'Complete 18 Lessons',
    requirementConfig: {
      type: 'custom',
      value: 18,
    },
    category: 'Learning',
    tier: 'Legendary',
    icon: 'Compass',
    color: 'purple',
    points: 500,
    status: 'Disabled',
  },
];

class AdminAchievementService {
  /**
   * Helper to ensure the default achievements are present in DB
   */
  async ensureDefaultAchievementsSeeded() {
    try {
      const count = await Achievement.countDocuments();
      if (count === 0) {
        console.log('AdminAchievementService - Seeding default achievements...');
        await Achievement.insertMany(DEFAULT_ACHIEVEMENTS);
        console.log('AdminAchievementService - Successfully seeded default achievements.');
      }
    } catch (error) {
      console.error('AdminAchievementService - Seed check error:', error.message);
    }
  }

  /**
   * Helper to get total typists and unlock counts map by key
   */
  async getUnlockCountsMap() {
    const totalUsers = await User.countDocuments();

    // Aggregate unlocks count grouped by key
    const unlockCounts = await User.aggregate([
      { $unwind: '$achievements' },
      { $group: { _id: '$achievements.key', count: { $sum: 1 } } },
    ]);

    const map = {};
    for (const item of unlockCounts) {
      if (item._id) {
        map[item._id] = item.count;
      }
    }

    return { totalUsers, map };
  }

  /**
   * GET /api/admin/achievements/stats
   * Real KPIs, unlock conversion rates, and tier breakdown
   */
  async getAchievementStats() {
    await this.ensureDefaultAchievementsSeeded();

    const [totalBadges, activeBadges, disabledBadges, { totalUsers, map }] = await Promise.all([
      Achievement.countDocuments(),
      Achievement.countDocuments({ status: 'Active' }),
      Achievement.countDocuments({ status: 'Disabled' }),
      this.getUnlockCountsMap(),
    ]);

    // Sum of all unlocks awarded
    let totalUnlocks = 0;
    for (const key in map) {
      totalUnlocks += map[key];
    }

    // First steps rate
    const firstStepsCount = map['first-test'] || 0;
    const firstStepsRate = totalUsers > 0 ? Number(((firstStepsCount / totalUsers) * 100).toFixed(1)) : 0;

    // Century typists count (100 WPM)
    const centuryCount = map['speed-100'] || 0;

    // Category breakdown
    const categoryStats = await Achievement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Tier breakdown
    const tierStats = await Achievement.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } },
    ]);

    return {
      kpis: {
        totalBadges: `${totalBadges} Badges`,
        totalBadgesRaw: totalBadges,
        activeBadges,
        disabledBadges,
        totalUnlocks: totalUnlocks.toLocaleString(),
        totalUnlocksRaw: totalUnlocks,
        firstStepsRate: `${firstStepsRate}%`,
        firstStepsCount,
        centuryCount: `${centuryCount.toLocaleString()} Typists`,
        centuryCountRaw: centuryCount,
        totalUsers,
      },
      categories: categoryStats.map((c) => ({ category: c._id, count: c.count })),
      tiers: tierStats.map((t) => ({ tier: t._id, count: t.count })),
    };
  }

  /**
   * GET /api/admin/achievements
   * List achievements with search, filters, sorting, real unlockedBy & unlockRate
   */
  async getAchievements(query = {}) {
    await this.ensureDefaultAchievementsSeeded();

    const {
      category,
      tier,
      status,
      search,
      sortBy = 'unlocked_desc',
      page = 1,
      limit = 100,
    } = query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (tier && tier !== 'All') {
      filter.tier = new RegExp(`^${tier}$`, 'i');
    }

    if (status && status !== 'All') {
      filter.status = new RegExp(`^${status}$`, 'i');
    }

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { title: regex },
        { key: regex },
        { description: regex },
        { requirement: regex },
        { category: regex },
      ];
    }

    // Fetch achievements matching query
    const achievementsDocs = await Achievement.find(filter).lean();
    const { totalUsers, map } = await this.getUnlockCountsMap();

    // Map each achievement to include live unlockedBy and unlockRate
    const achievements = achievementsDocs.map((doc) => {
      const id = doc._id.toString();
      const unlockedBy = map[doc.key] || 0;
      const unlockRate =
        totalUsers > 0 ? Number(((unlockedBy / totalUsers) * 100).toFixed(1)) : 0;

      return {
        ...doc,
        id,
        _id: id,
        unlockedBy,
        unlockRate,
      };
    });

    // In-memory sorting based on derived metrics or fields
    achievements.sort((a, b) => {
      if (sortBy === 'unlocked_desc') return b.unlockedBy - a.unlockedBy;
      if (sortBy === 'rate_desc') return b.unlockRate - a.unlockRate;
      if (sortBy === 'points_desc') return b.points - a.points;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    // Pagination
    const total = achievements.length;
    const startIndex = (page - 1) * limit;
    const paginated = achievements.slice(startIndex, startIndex + limit);

    return {
      achievements: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      totalUsers,
    };
  }

  /**
   * Helper to find achievement by ObjectId or key
   */
  async findAchievementByIdOrKey(idOrKey) {
    if (mongoose.Types.ObjectId.isValid(idOrKey)) {
      const ach = await Achievement.findById(idOrKey);
      if (ach) return ach;
    }
    return await Achievement.findOne({ key: idOrKey.toLowerCase().trim() });
  }

  /**
   * GET /api/admin/achievements/:id
   * Get single achievement dossier with live telemetry and recent unlocking typists
   */
  async getAchievementById(idOrKey) {
    await this.ensureDefaultAchievementsSeeded();

    const ach = await this.findAchievementByIdOrKey(idOrKey);
    if (!ach) {
      const error = new Error(`Achievement not found with id or key: ${idOrKey}`);
      error.statusCode = 404;
      throw error;
    }

    const { totalUsers, map } = await this.getUnlockCountsMap();
    const unlockedBy = map[ach.key] || 0;
    const unlockRate = totalUsers > 0 ? Number(((unlockedBy / totalUsers) * 100).toFixed(1)) : 0;

    // Fetch recent users who unlocked this achievement
    const recentTypists = await User.find({ 'achievements.key': ach.key })
      .select('name username avatar bestWpm accuracy currentStreak achievements')
      .limit(10)
      .lean();

    const unlockingUsers = recentTypists.map((u) => {
      const achItem = u.achievements?.find((a) => a.key === ach.key);
      return {
        id: u._id.toString(),
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        bestWpm: u.bestWpm || 0,
        accuracy: u.accuracy || 0,
        currentStreak: u.currentStreak || 0,
        unlockedAt: achItem?.unlockedAt || null,
      };
    });

    // Sort recent typists by unlock date descending
    unlockingUsers.sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0));

    const obj = ach.toJSON();
    return {
      ...obj,
      unlockedBy,
      unlockRate,
      recentUnlocks: unlockingUsers,
      totalPlatformUsers: totalUsers,
    };
  }

  /**
   * POST /api/admin/achievements
   * Create a new achievement badge
   */
  async createAchievement(data) {
    // Generate key if not supplied
    let key = data.key?.trim().toLowerCase();
    if (!key && data.name) {
      key = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Check key uniqueness
    const existing = await Achievement.findOne({ key });
    if (existing) {
      const error = new Error(`Achievement with key "${key}" already exists`);
      error.statusCode = 409;
      throw error;
    }

    // Infer requirementConfig if not provided
    let requirementConfig = data.requirementConfig;
    if (!requirementConfig || !requirementConfig.type || requirementConfig.type === 'custom') {
      const reqText = (data.requirement || '').toLowerCase();
      const numMatch = reqText.match(/\d+/);
      const parsedNum = numMatch ? parseInt(numMatch[0], 10) : 0;

      if (reqText.includes('wpm') || data.category === 'Speed') {
        requirementConfig = { type: 'bestWpm', value: parsedNum || 50 };
      } else if (reqText.includes('accuracy') || reqText.includes('%') || data.category === 'Accuracy') {
        requirementConfig = { type: 'accuracy', value: parsedNum || 95 };
      } else if (reqText.includes('test') || data.category === 'Volume') {
        requirementConfig = { type: 'testsCompleted', value: parsedNum || 10 };
      } else if (reqText.includes('streak') || data.category === 'Streak') {
        requirementConfig = { type: 'currentStreak', value: parsedNum || 7 };
      } else {
        requirementConfig = { type: 'custom', value: parsedNum || 1 };
      }
    }

    const newAch = new Achievement({
      ...data,
      key,
      title: data.name,
      requirementConfig,
      points: Number(data.points) || 50,
      status: data.status || 'Active',
    });

    const saved = await newAch.save();
    const result = saved.toJSON();
    result.unlockedBy = 0;
    result.unlockRate = 0;
    return result;
  }

  /**
   * PUT /api/admin/achievements/:id
   * Update an existing achievement badge
   */
  async updateAchievement(idOrKey, data) {
    const ach = await this.findAchievementByIdOrKey(idOrKey);
    if (!ach) {
      const error = new Error(`Achievement not found with id or key: ${idOrKey}`);
      error.statusCode = 404;
      throw error;
    }

    // If key changed, check uniqueness
    if (data.key && data.key.toLowerCase().trim() !== ach.key) {
      const nextKey = data.key.toLowerCase().trim();
      const conflict = await Achievement.findOne({ key: nextKey });
      if (conflict) {
        const error = new Error(`Achievement with key "${nextKey}" already exists`);
        error.statusCode = 409;
        throw error;
      }
      ach.key = nextKey;
    }

    if (data.name !== undefined) {
      ach.name = data.name;
      ach.title = data.name;
    }
    if (data.description !== undefined) ach.description = data.description;
    if (data.requirement !== undefined) ach.requirement = data.requirement;
    if (data.category !== undefined) ach.category = data.category;
    if (data.tier !== undefined) ach.tier = data.tier;
    if (data.icon !== undefined) ach.icon = data.icon;
    if (data.color !== undefined) ach.color = data.color;
    if (data.points !== undefined) ach.points = Number(data.points);
    if (data.status !== undefined) ach.status = data.status;
    if (data.requirementConfig !== undefined) ach.requirementConfig = data.requirementConfig;

    const saved = await ach.save();
    const { totalUsers, map } = await this.getUnlockCountsMap();
    const unlockedBy = map[saved.key] || 0;
    const unlockRate = totalUsers > 0 ? Number(((unlockedBy / totalUsers) * 100).toFixed(1)) : 0;

    const result = saved.toJSON();
    result.unlockedBy = unlockedBy;
    result.unlockRate = unlockRate;
    return result;
  }

  /**
   * PATCH /api/admin/achievements/:id/status
   * Toggle or set status of an achievement badge ('Active' | 'Disabled')
   */
  async updateAchievementStatus(idOrKey, status) {
    const ach = await this.findAchievementByIdOrKey(idOrKey);
    if (!ach) {
      const error = new Error(`Achievement not found with id or key: ${idOrKey}`);
      error.statusCode = 404;
      throw error;
    }

    if (status) {
      ach.status = status;
    } else {
      ach.status = ach.status === 'Active' ? 'Disabled' : 'Active';
    }

    const saved = await ach.save();
    const { totalUsers, map } = await this.getUnlockCountsMap();
    const unlockedBy = map[saved.key] || 0;
    const unlockRate = totalUsers > 0 ? Number(((unlockedBy / totalUsers) * 100).toFixed(1)) : 0;

    const result = saved.toJSON();
    result.unlockedBy = unlockedBy;
    result.unlockRate = unlockRate;
    return result;
  }

  /**
   * DELETE /api/admin/achievements/:id
   * Remove an achievement badge
   */
  async deleteAchievement(idOrKey) {
    const ach = await this.findAchievementByIdOrKey(idOrKey);
    if (!ach) {
      const error = new Error(`Achievement not found with id or key: ${idOrKey}`);
      error.statusCode = 404;
      throw error;
    }

    const deletedKey = ach.key;
    const deletedName = ach.name;
    await Achievement.findByIdAndDelete(ach._id);

    return {
      id: ach._id.toString(),
      key: deletedKey,
      name: deletedName,
      message: `Achievement "${deletedName}" successfully removed.`,
    };
  }

  /**
   * GET /api/admin/achievements/export
   * Export achievements dataset as CSV or JSON
   */
  async exportAchievements(query = {}) {
    const { achievements, totalUsers } = await this.getAchievements({
      ...query,
      page: 1,
      limit: 1000,
    });

    const format = query.format || 'csv';

    if (format === 'json') {
      return {
        format: 'json',
        data: achievements,
        total: achievements.length,
        exportedAt: new Date().toISOString(),
      };
    }

    // CSV format
    const headers = [
      'Badge ID',
      'Key',
      'Name',
      'Category',
      'Tier',
      'Requirement',
      'Points (XP)',
      'Total Typists Unlocked',
      'Unlock Rate (%)',
      'Status',
    ];

    const rows = achievements.map((a) => [
      a.id,
      a.key,
      `"${(a.name || '').replace(/"/g, '""')}"`,
      a.category,
      a.tier,
      `"${(a.requirement || '').replace(/"/g, '""')}"`,
      a.points,
      a.unlockedBy,
      `${a.unlockRate}%`,
      a.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return {
      format: 'csv',
      data: csvContent,
      filename: `tara_typing_achievements_${Date.now()}.csv`,
      total: achievements.length,
    };
  }
}

export default new AdminAchievementService();
