'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lock, Play, Zap, Trophy } from 'lucide-react';
import { getCourse } from '@/lib/courseData';
import { progressApi } from '@/lib/api';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const course = getCourse(courseId);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const progress = await progressApi.get(courseId);
        const completed = new Set<string>(
          progress.filter((p: any) => p.completed).map((p: any) => p.lesson_id)
        );
        setCompletedLessons(completed);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  const completedCount = completedLessons.size;
  const percent = Math.round((completedCount / course.lessons.length) * 100);

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = course.lessons[index - 1];
    return completedLessons.has(prevLesson.id);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push('/courses')} className="p-2 rounded-xl hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{course.title}</h1>
            <p className="text-xs text-neutral-400">{completedCount}/{course.lessons.length} completed</p>
          </div>
          <div className="text-right">
            <span className={`text-lg font-black ${percent === 100 ? 'text-green-400' : 'text-primary-400'}`}>{percent}%</span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-3">
          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-green-500' : `bg-gradient-to-r ${course.color}`}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      {/* Course banner */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${course.color} p-8 mb-8`}>
          <div className="absolute top-0 right-0 text-[120px] opacity-20 -mt-4 -mr-4">{course.icon}</div>
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">{course.difficulty}</span>
            <h2 className="text-3xl font-black mt-3 mb-2">{course.title}</h2>
            <p className="text-white/80 max-w-md">{course.description}</p>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm"><Zap className="w-4 h-4" /> {course.lessons.reduce((s, l) => s + l.xpReward, 0)} XP total</div>
              <div className="flex items-center gap-1.5 text-sm"><Trophy className="w-4 h-4" /> {course.lessons.length} lessons</div>
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div className="space-y-3">
          {course.lessons.map((lesson, i) => {
            const isCompleted = completedLessons.has(lesson.id);
            const unlocked = isLessonUnlocked(i);
            const isCurrent = unlocked && !isCompleted;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => unlocked && router.push(`/courses/${courseId}/${lesson.id}`)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-green-500/5 border-green-500/20 cursor-pointer hover:border-green-500/40'
                    : isCurrent
                    ? 'bg-primary-500/5 border-primary-500/25 cursor-pointer hover:border-primary-500/50 shadow-lg shadow-primary-500/5'
                    : unlocked
                    ? 'bg-neutral-900/50 border-neutral-800 cursor-pointer hover:border-neutral-700'
                    : 'bg-neutral-900/30 border-neutral-800/50 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Status icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? `bg-gradient-to-br ${course.color} text-white`
                    : 'bg-neutral-800 text-neutral-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : !unlocked ? <Lock className="w-4 h-4" /> : i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm ${isCompleted ? 'text-green-400' : isCurrent ? 'text-white' : 'text-neutral-400'}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{lesson.theory.slice(0, 80)}...</p>
                </div>

                {/* XP badge */}
                <div className={`flex items-center gap-1 text-xs font-bold ${isCompleted ? 'text-green-400' : 'text-neutral-500'}`}>
                  <Zap className="w-3.5 h-3.5" /> +{lesson.xpReward} XP
                </div>

                {/* Arrow */}
                {unlocked && (
                  <div className={`${isCurrent ? 'text-primary-400' : 'text-neutral-600'}`}>
                    {isCurrent ? <Play className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
