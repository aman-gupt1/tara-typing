class LessonService {
  constructor(Lesson, UserLessonProgress) {
    this.Lesson = Lesson;
    this.UserLessonProgress = UserLessonProgress;
  }

  // ----------------------------------------------------
  // Get all active lessons with user's progress
  // ----------------------------------------------------
  async getLessons(userId) {
    const lessons = await this.Lesson.find({
      isActive: true,
    })
      .sort({ lessonNumber: 1 })
      .lean();

    let progress = null;

    if (userId) {
      progress = await this.UserLessonProgress.findOne({
        user: userId,
      }).lean();
    }

    const completedLessons = progress?.completedLessons || [];
    const bookmarkedLessons = progress?.bookmarkedLessons || [];
    const quizScores = progress?.quizScores || {};
    const lastVisitedLesson = progress?.lastVisitedLesson || '';

    return lessons.map((lesson) => {
      const lessonId = lesson.slug;

      let quizScore = null;

      if (quizScores instanceof Map) {
        quizScore = quizScores.get(lessonId) ?? null;
      } else {
        quizScore = quizScores[lessonId] ?? null;
      }

      return {
        ...lesson,

        completed: completedLessons.includes(lessonId),

        bookmarked: bookmarkedLessons.includes(lessonId),

        quizScore,

        lastVisited: lastVisitedLesson === lessonId,
      };
    });
  }

  // ----------------------------------------------------
  // Get single lesson by slug
  // ----------------------------------------------------
  async getLessonBySlug(slug, userId) {
    const lesson = await this.Lesson.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }

    let progress = null;

    if (userId) {
      progress = await this.UserLessonProgress.findOne({
        user: userId,
      }).lean();
    }

    const completedLessons = progress?.completedLessons || [];
    const bookmarkedLessons = progress?.bookmarkedLessons || [];
    const quizScores = progress?.quizScores || {};
    const lastVisitedLesson = progress?.lastVisitedLesson || '';

    let quizScore = null;

    if (quizScores instanceof Map) {
      quizScore = quizScores.get(slug) ?? null;
    } else {
      quizScore = quizScores[slug] ?? null;
    }

    return {
      ...lesson,

      completed: completedLessons.includes(slug),

      bookmarked: bookmarkedLessons.includes(slug),

      quizScore,

      lastVisited: lastVisitedLesson === slug,
    };
  }

  // ----------------------------------------------------
  // Get or create user's lesson progress
  // ----------------------------------------------------
  async getOrCreateProgress(userId) {
    if (!userId) {
      const error = new Error('User authentication required');
      error.statusCode = 401;
      throw error;
    }

    let progress = await this.UserLessonProgress.findOne({
      user: userId,
    });

    if (!progress) {
      progress = await this.UserLessonProgress.create({
        user: userId,
        completedLessons: [],
        bookmarkedLessons: [],
        quizScores: {},
        lastVisitedLesson: '',
        totalCompleted: 0,
      });
    }

    return progress;
  }

  // ----------------------------------------------------
  // Mark lesson as visited
  // ----------------------------------------------------
  async updateLastVisited(userId, slug) {
    const lesson = await this.Lesson.findOne({
      slug,
      isActive: true,
    });

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }

    const progress = await this.getOrCreateProgress(userId);

    progress.lastVisitedLesson = slug;

    await progress.save();

    return progress;
  }

  // ----------------------------------------------------
  // Toggle bookmark
  // ----------------------------------------------------
  async toggleBookmark(userId, slug) {
    const lesson = await this.Lesson.findOne({
      slug,
      isActive: true,
    });

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }

    const progress = await this.getOrCreateProgress(userId);

    const alreadyBookmarked =
      progress.bookmarkedLessons.includes(slug);

    if (alreadyBookmarked) {
      progress.bookmarkedLessons =
        progress.bookmarkedLessons.filter(
          (lessonSlug) => lessonSlug !== slug
        );
    } else {
      progress.bookmarkedLessons.push(slug);
    }

    progress.lastVisitedLesson = slug;

    await progress.save();

    return {
      bookmarked: !alreadyBookmarked,
      bookmarkedLessons: progress.bookmarkedLessons,
    };
  }

  // ----------------------------------------------------
  // Complete lesson + save quiz score
  // ----------------------------------------------------
  async completeLesson(userId, slug, data = {}) {
    const lesson = await this.Lesson.findOne({
      slug,
      isActive: true,
    });

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }

    const progress = await this.getOrCreateProgress(userId);

    const score =
      data.score !== undefined
        ? Number(data.score)
        : null;

    // Validate quiz score
    if (
      score !== null &&
      (!Number.isFinite(score) ||
        score < 0 ||
        score > 100)
    ) {
      const error = new Error(
        'Quiz score must be between 0 and 100'
      );

      error.statusCode = 400;

      throw error;
    }

    const alreadyCompleted =
      progress.completedLessons.includes(slug);

    // Mark completed
    if (!alreadyCompleted) {
      progress.completedLessons.push(slug);
    }

    // Save quiz score
    if (score !== null) {
      const previousScore = progress.quizScores.get(slug);

      // Keep the best score
      if (
        previousScore === undefined ||
        score > previousScore
      ) {
        progress.quizScores.set(slug, score);
      }
    }

    // Update total completed
    progress.totalCompleted =
      progress.completedLessons.length;

    // Update last visited
    progress.lastVisitedLesson = slug;

    await progress.save();

    const savedQuizScore =
      progress.quizScores.get(slug) ?? null;

    return {
      lesson: {
        slug: lesson.slug,
        title: lesson.title,
        lessonNumber: lesson.lessonNumber,
      },

      completed: true,

      bookmarked:
        progress.bookmarkedLessons.includes(slug),

      quizScore: savedQuizScore,

      totalCompleted: progress.totalCompleted,

      lastVisitedLesson:
        progress.lastVisitedLesson,
    };
  }

  // ----------------------------------------------------
  // Get user's complete progress
  // ----------------------------------------------------
  async getProgress(userId) {
    const progress = await this.getOrCreateProgress(userId);

    return {
      user: progress.user,

      completedLessons:
        progress.completedLessons,

      bookmarkedLessons:
        progress.bookmarkedLessons,

      quizScores:
        Object.fromEntries(
          progress.quizScores
        ),

      lastVisitedLesson:
        progress.lastVisitedLesson,

      totalCompleted:
        progress.totalCompleted,

      updatedAt:
        progress.updatedAt,
    };
  }

  // ----------------------------------------------------
  // Reset user's learning progress
  // ----------------------------------------------------
  async resetProgress(userId) {
    const progress = await this.getOrCreateProgress(userId);

    progress.completedLessons = [];
    progress.bookmarkedLessons = [];
    progress.quizScores.clear();
    progress.lastVisitedLesson = '';
    progress.totalCompleted = 0;

    await progress.save();

    return {
      completedLessons: [],
      bookmarkedLessons: [],
      quizScores: {},
      lastVisitedLesson: '',
      totalCompleted: 0,
    };
  }
}

export default LessonService;