import { useRef } from 'react';
import SEO from '../components/common/SEO';
import LearnHero from '../components/learn/LearnHero';
import LearningProgress from '../components/learn/LearningProgress';
import LessonGrid from '../components/learn/LessonGrid';

export const Learn = () => {
  const lessonsSectionRef = useRef(null);

  const scrollToLessons = () => {
    const el = document.getElementById('all-lessons-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex-1 bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Learn Touch Typing — Study Course & Guide | Tara Typing"
        description="Master touch typing step by step. Interactive lessons, posture guides, finger mapping, accuracy drills and speed benchmarks on Tara Typing."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Learn Hero Banner */}
        <LearnHero onScrollToLessons={scrollToLessons} />

        {/* Global Progress Bar Overview */}
        <LearningProgress />

        {/* Structured Course Curriculum & Filters */}
        <LessonGrid />
      </main>
    </div>
  );
};

export default Learn;
