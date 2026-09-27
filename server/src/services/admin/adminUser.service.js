import User from '../../models/User.js';
import UserLessonProgress from '../../models/UserLessonProgress.js';
import TypingResult from '../../models/TypingResult.js';
import Lesson from '../../models/Lesson.js';

class AdminUserService {
  constructor() {
    this.User = User;
    this.UserLessonProgress = UserLessonProgress;
    this.TypingResult = TypingResult;
    this.Lesson = Lesson;
  }

  /**
   * GET /api/admin/users
   * Retrieves paginated users directory with search, status, speedTier, sorting, and top KPI counts
   */
  async getUsers({
    search = '',
    status = 'All',
    speedTier = 'All',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  } = {}) {
    const filters = {};

    // 1. Text Search (name, username, email)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filters.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex },
      ];
    }

    // 2. Status Filter
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus !== 'all') {
      if (normalizedStatus === 'active') {
        // Treat missing status or null status as 'active' for backwards compatibility
        const activeCondition = [
          { status: 'active' },
          { status: { $exists: false } },
          { status: null },
        ];
        if (filters.$or) {
          filters.$and = [{ $or: filters.$or }, { $or: activeCondition }];
          delete filters.$or;
        } else {
          filters.$or = activeCondition;
        }
      } else {
        filters.status = normalizedStatus;
      }
    }

    // 3. Speed Tier Filter (Strictly aligned with Tara Typing thresholds)
    // Beginner: < 40 WPM, Intermediate: 40-79 WPM, Advanced: 80-109 WPM, Elite: >= 110 WPM
    const normalizedTier = speedTier.toLowerCase();
    if (normalizedTier !== 'all') {
      if (normalizedTier === 'beginner') {
        filters.bestWpm = { $lt: 40 };
      } else if (normalizedTier === 'intermediate') {
        filters.bestWpm = { $gte: 40, $lt: 80 };
      } else if (normalizedTier === 'advanced') {
        filters.bestWpm = { $gte: 80, $lt: 110 };
      } else if (normalizedTier === 'elite') {
        filters.bestWpm = { $gte: 110 };
      }
    }

    // 4. Sorting Construction (Whitelisted fields)
    const direction = sortOrder === 'asc' || sortOrder === '1' ? 1 : -1;
    let sortObj = { createdAt: -1 };

    switch (sortBy) {
      case 'newest':
      case 'createdAt':
        sortObj = { createdAt: direction };
        break;
      case 'speed':
      case 'bestWpm':
        sortObj = { bestWpm: direction, averageWpm: direction };
        break;
      case 'tests':
      case 'testsCompleted':
        sortObj = { testsCompleted: direction };
        break;
      case 'accuracy':
        sortObj = { accuracy: direction };
        break;
      case 'streak':
      case 'currentStreak':
        sortObj = { currentStreak: direction };
        break;
      case 'name':
        sortObj = { name: direction };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // 5. Pagination Calculation
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (currentPage - 1) * pageLimit;

    // 6. Execute Queries in Parallel
    const [matchingUsersCount, usersDocs, totalUsersCount, activeUsersCount, suspendedUsersCount, adminUsersCount] =
      await Promise.all([
        // Total count matching query filters
        this.User.countDocuments(filters),

        // Paginated users matching query filters
        this.User.find(filters)
          .select('-password')
          .sort(sortObj)
          .skip(skip)
          .limit(pageLimit)
          .lean(),

        // Overall platform KPIs (ignoring pagination filters)
        this.User.countDocuments({}),
        this.User.countDocuments({
          $or: [{ status: 'active' }, { status: { $exists: false } }, { status: null }],
        }),
        this.User.countDocuments({ status: 'suspended' }),
        this.User.countDocuments({ role: 'admin' }),
      ]);

    // 7. Attach Lesson Progress for each matching user
    const userIds = usersDocs.map((u) => u._id);
    const [lessonProgressDocs, totalActiveLessons] = await Promise.all([
      this.UserLessonProgress.find({
        user: { $in: userIds },
      })
        .select('user totalCompleted completedLessons')
        .lean(),
      this.Lesson.countDocuments({ isActive: true }),
    ]);

    const activeLessonsTotal = Math.max(1, totalActiveLessons);
    const lessonProgressMap = new Map();
    lessonProgressDocs.forEach((doc) => {
      lessonProgressMap.set(doc.user.toString(), doc.totalCompleted || doc.completedLessons?.length || 0);
    });

    // 8. Format Users for Frontend Consumption
    const formattedUsers = usersDocs.map((user) => {
      const completedLessonsCount = lessonProgressMap.get(user._id.toString()) || 0;
      const progressPercentage = Math.round((completedLessonsCount / activeLessonsTotal) * 100);

      return {
        _id: user._id,
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        location: user.location || '',
        avatar: user.avatar,
        bio: user.bio,
        role: user.role || 'user',
        status: user.status || (user.active === false ? 'suspended' : 'active'),
        active: user.active !== false,
        bestWpm: user.bestWpm || 0,
        averageWpm: user.averageWpm || 0,
        accuracy: user.accuracy || 0,
        testsCompleted: user.testsCompleted || 0,
        tests: user.testsCompleted || 0,
        totalTypingTime: user.totalTypingTime || 0,
        currentStreak: user.currentStreak || 1,
        streak: user.currentStreak || 1,
        lessonProgress: progressPercentage,
        completedLessonsCount,
        lastTypingDate: user.lastTypingDate || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    const totalPages = Math.ceil(matchingUsersCount / pageLimit) || 1;

    return {
      users: formattedUsers,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        totalUsers: matchingUsersCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      stats: {
        totalUsers: totalUsersCount,
        activeUsers: activeUsersCount,
        suspendedUsers: suspendedUsersCount,
        adminUsers: adminUsersCount,
      },
    };
  }

  /**
   * GET /api/admin/users/:id
   * Retrieves comprehensive user dossier, test history, curriculum breakdown, and diagnostics
   */
  async getUserById(id) {
    const user = await this.User.findById(id).select('-password').lean();
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // 1. Fetch recent typing results
    const recentTestsDocs = await this.TypingResult.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentTests = recentTestsDocs.map((test) => ({
      id: test._id.toString(),
      _id: test._id.toString(),
      mode: test.mode ? test.mode.charAt(0).toUpperCase() + test.mode.slice(1) : 'Words',
      wpm: test.wpm || 0,
      accuracy: Math.round(test.accuracy || 0),
      duration: test.duration || 60,
      mistakes: test.mistakes || 0,
      date: new Date(test.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: test.accuracy >= 90 && test.wpm >= 20 ? 'Passed' : 'Completed',
    }));

    // 2. Fetch lesson progress and total active lessons
    const [lessonProgressDoc, totalActiveLessons] = await Promise.all([
      this.UserLessonProgress.findOne({ user: id }).lean(),
      this.Lesson.countDocuments({ isActive: true }),
    ]);
    const completedLessonsCount =
      lessonProgressDoc?.totalCompleted || lessonProgressDoc?.completedLessons?.length || 0;
    const activeTotal = Math.max(1, totalActiveLessons);
    const progressPercentage = Math.round((completedLessonsCount / activeTotal) * 100);

    // 3. Bot Risk Score heuristic
    let riskScore = 2; // baseline legitimate
    if (user.bestWpm > 180) riskScore = 85;
    else if (user.bestWpm > 140) riskScore = 40;
    else if (user.bestWpm > 100) riskScore = 12;

    const joinedDateStr = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Recently';

    return {
      _id: user._id,
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      location: user.location || 'India',
      country: user.location || 'India',
      avatar: user.avatar,
      bio: user.bio,
      role: user.role || 'user',
      status: user.status || (user.active === false ? 'suspended' : 'active'),
      active: user.active !== false,
      bestWpm: user.bestWpm || 0,
      averageWpm: user.averageWpm || 0,
      avgWpm: user.averageWpm || 0,
      accuracy: user.accuracy || 0,
      testsCompleted: user.testsCompleted || 0,
      tests: user.testsCompleted || 0,
      totalTypingTime: user.totalTypingTime || 0,
      currentStreak: user.currentStreak || 1,
      streak: user.currentStreak || 1,
      lessonProgress: completedLessonsCount,
      completedLessonsCount,
      progressPercentage,
      joined: joinedDateStr,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastActive: user.lastTypingDate
        ? new Date(user.lastTypingDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : 'Active recently',
      recentTests,
      riskScore,
      ip: '127.0.0.1',
      browser: 'Chrome 128 / Windows',
      lessonDetails: {
        completedLessons: lessonProgressDoc?.completedLessons || [],
        bookmarkedLessons: lessonProgressDoc?.bookmarkedLessons || [],
        totalCompleted: completedLessonsCount,
        beginnerCompleted: Math.min(6, completedLessonsCount),
        intermediateCompleted: Math.max(0, Math.min(6, completedLessonsCount - 6)),
        advancedCompleted: Math.max(0, completedLessonsCount - 12),
      },
    };
  }

  /**
   * PATCH /api/admin/users/:id/role
   * Updates user role with self-demotion protection
   */
  async updateUserRole(id, role, currentAdminId) {
    if (id.toString() === currentAdminId?.toString() && role !== 'admin') {
      const error = new Error('Security restriction: You cannot demote your own administrator account');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * PATCH /api/admin/users/:id/status
   * Updates user status with self-suspension protection
   */
  async updateUserStatus(id, status, currentAdminId) {
    const normalizedStatus = status.toLowerCase();
    if (id.toString() === currentAdminId?.toString() && normalizedStatus !== 'active') {
      const error = new Error('Security restriction: You cannot suspend or deactivate your own administrator account');
      error.statusCode = 400;
      throw error;
    }

    const isActive = normalizedStatus === 'active';

    const user = await this.User.findByIdAndUpdate(
      id,
      { 
        status: normalizedStatus,
        active: isActive,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * DELETE /api/admin/users/:id
   * Cascade deletes a user and associated typing test & lesson progress records
   */
  async deleteUser(id, currentAdminId) {
    if (id.toString() === currentAdminId?.toString()) {
      const error = new Error('Security restriction: You cannot delete your own administrator account');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.User.findByIdAndDelete(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Cascade delete associated records
    await Promise.all([
      this.TypingResult.deleteMany({ user: id }),
      this.UserLessonProgress.deleteMany({ user: id }),
    ]);

    return {
      success: true,
      message: `User ${user.name} and all related records have been permanently deleted`,
      deletedUserId: id,
    };
  }

  /**
   * GET /api/admin/users/export
   * Exports entire user directory in CSV or JSON format
   */
  async exportUsers(format = 'csv') {
    const users = await this.User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((u) => u._id);
    const progressDocs = await this.UserLessonProgress.find({ user: { $in: userIds } })
      .select('user totalCompleted completedLessons')
      .lean();

    const progressMap = new Map();
    progressDocs.forEach((doc) => {
      progressMap.set(doc.user.toString(), doc.totalCompleted || doc.completedLessons?.length || 0);
    });

    const exportData = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      username: u.username,
      email: u.email,
      location: u.location || 'India',
      status: u.status || 'active',
      role: u.role || 'user',
      bestWpm: u.bestWpm || 0,
      averageWpm: u.averageWpm || 0,
      accuracy: u.accuracy || 0,
      testsCompleted: u.testsCompleted || 0,
      currentStreak: u.currentStreak || 1,
      lessonsCompleted: progressMap.get(u._id.toString()) || 0,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : '',
    }));

    if (format === 'json') {
      return {
        format: 'json',
        data: exportData,
      };
    }

    // CSV format
    const headers = [
      'ID',
      'Name',
      'Username',
      'Email',
      'Location',
      'Status',
      'Role',
      'Best WPM',
      'Avg WPM',
      'Accuracy',
      'Tests Completed',
      'Streak (Days)',
      'Lessons Completed',
      'Created At',
    ].join(',');

    const rows = exportData.map((u) =>
      [
        `"${u.id}"`,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.username || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.location || '').replace(/"/g, '""')}"`,
        `"${u.status}"`,
        `"${u.role}"`,
        u.bestWpm,
        u.averageWpm,
        u.accuracy,
        u.testsCompleted,
        u.currentStreak,
        u.lessonsCompleted,
        `"${u.createdAt}"`,
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    return {
      format: 'csv',
      data: csvContent,
      filename: `tara_typing_users_${new Date().toISOString().split('T')[0]}.csv`,
    };
  }
}

export const adminUserService = new AdminUserService();
export default adminUserService;
