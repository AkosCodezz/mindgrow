'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { courses } from '@/lib/courseData';
import { progressApi } from '@/lib/api';

export default function CoursesPage() {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<Record<string, { completed: number; total: number; percent: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const allProgress = await progressApi.get();
        const map: Record<string, { completed: number; total: number; percent: number }> = {};
        for (const c of courses) {
          const completedLessons = allProgress.filter((p: any) => p.course_id === c.id && p.completed);
          map[c.id] = {
            completed: completedLessons.length,
            total: c.lessons.length,
            percent: c.lessons.length > 0 ? Math.round((completedLessons.length / c.lessons.length) * 100) : 0,
          };
        }
        setProgressMap(map);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 rounded-xl hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black">Courses</h1>
            <p className="text-xs text-neutral-400">Learn to code step by step</p>
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => {
            const prog = progressMap[course.id] || { completed: 0, total: course.lessons.length, percent: 0 };
            const isComplete = prog.percent === 100;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/courses/${course.id}`)}
                className="group cursor-pointer relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-all`} />
                <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl`}>
                      {course.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      course.difficulty === 'Beginner' ? 'bg-green-500/15 text-green-400 border border-green-500/25' :
                      course.difficulty === 'Intermediate' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                      'bg-red-500/15 text-red-400 border border-red-500/25'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-neutral-400 mb-4 leading-relaxed">{course.description}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-neutral-500 font-medium">{prog.completed}/{prog.total} lessons</span>
                      <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-primary-400'}`}>
                        {isComplete ? '✓ Complete' : `${prog.percent}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prog.percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${isComplete ? 'bg-green-500' : `bg-gradient-to-r ${course.color}`}`}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-neutral-500">{course.lessons.length} lessons</span>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
                      {prog.percent > 0 ? 'Continue' : 'Start'} <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
