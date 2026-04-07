'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle2, XCircle, Zap, Trophy, ArrowRight, RotateCcw, BookOpen, Code2, Eye, PanelRight } from 'lucide-react';
import { getCourse, getLesson } from '@/lib/courseData';
import { progressApi, statsApi } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Monaco
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

function TargetIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (lesson) {
      setCode(lesson.starterCode);
      progressApi.get(courseId).then((progress: any[]) => {
        const done = progress.find((p: any) => p.lesson_id === lessonId && p.completed);
        if (done) setIsCompleted(true);
      }).catch(() => {});
    }
  }, [lesson, courseId, lessonId]);

  const handleReset = () => {
    if (lesson) {
      setCode(lesson.starterCode);
      setResult(null);
    }
  };

  const handleCheck = useCallback(async () => {
    if (!lesson || checking) return;
    setChecking(true);
    setResult(null);

    const normalizedCode = code.replace(/\s+/g, ' ').trim();
    const normalizedExpected = lesson.expectedOutput.replace(/\s+/g, ' ').trim();
    const passed = normalizedCode.includes(normalizedExpected);

    if (passed) {
      setResult({ success: true, message: 'Correct! Great job!' });
      if (!isCompleted) {
        try {
          await progressApi.complete(courseId, lessonId, 100);
          await statsApi.addXp(lesson.xpReward, 'lesson', `Completed: ${lesson.title}`);
          setIsCompleted(true);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 3000);
        } catch (e) { console.error(e); }
      }
    } else {
      setResult({ success: false, message: 'Not quite right. Check the instructions and try again.' });
    }
    setChecking(false);
  }, [code, lesson, courseId, lessonId, isCompleted, checking]);

  const currentIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const nextLesson = course?.lessons[currentIndex + 1];

  // Build preview HTML
  const getPreviewHtml = () => {
    if (courseId === 'css') {
      return `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>Heading 1</h1><h2>Heading 2</h2><p>A paragraph with <strong>bold</strong> and <em>italic</em> text.</p><div class="card"><p>Card content</p></div><nav class="nav"><a href="#">Link 1</a><a href="#">Link 2</a><a href="#">Link 3</a></nav><div class="gallery"><div style="background:#333;height:80px;border-radius:8px"></div><div style="background:#555;height:80px;border-radius:8px"></div><div style="background:#777;height:80px;border-radius:8px"></div><div style="background:#999;height:80px;border-radius:8px"></div></div><aside class="sidebar"><p>Sidebar</p></aside><div class="banner"><p>Banner section</p></div></body></html>`;
    }
    if (courseId === 'javascript') {
      return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:20px;background:#1a1a2e;color:#e0e0e0}#output{background:#0f0f23;padding:16px;border-radius:8px;margin-top:12px;font-family:monospace;white-space:pre-wrap;min-height:60px;border:1px solid #333}</style></head><body><h3>Console Output</h3><div id="output"></div><script>const _log=[];const origLog=console.log;console.log=(...a)=>{_log.push(a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' '));document.getElementById('output').textContent=_log.join('\\n')};try{${code}}catch(e){document.getElementById('output').textContent='Error: '+e.message}</script></body></html>`;
    }
    // HTML — wrap in full doc if needed
    if (code.includes('<!DOCTYPE') || code.includes('<html')) {
      return code;
    }
    return `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:16px;background:#fff;color:#222}</style></head><body>${code}</body></html>`;
  };

  if (!course || !lesson) {
    return <div className="h-screen bg-neutral-950 text-white flex items-center justify-center">Lesson not found</div>;
  }

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex items-center gap-3 z-10">
        <button onClick={() => router.push(`/courses/${courseId}`)} className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-neutral-500 font-medium">{course.title}</span>
          <span className="text-neutral-700">/</span>
          <span className="text-sm font-semibold truncate">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${showPreview ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <span className="text-xs text-neutral-500">{currentIndex + 1}/{course.lessons.length}</span>
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Instructions */}
        <div className="w-[320px] flex-shrink-0 border-r border-neutral-800 overflow-y-auto bg-neutral-950">
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Lesson {currentIndex + 1}
            </div>
            <h2 className="text-xl font-black mb-4">{lesson.title}</h2>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 mb-5">
              <p className="text-[13px] text-neutral-300 leading-relaxed">{lesson.theory}</p>
            </div>

            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-2">Example</h3>
            <pre className="bg-[#1e1e2e] border border-neutral-800 rounded-xl p-3.5 text-[12px] font-mono text-green-400 overflow-x-auto leading-relaxed mb-5 whitespace-pre-wrap">
              {lesson.example}
            </pre>

            <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-3.5">
              <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <TargetIcon className="w-3.5 h-3.5" /> Your Task
              </h3>
              <p className="text-[13px] text-neutral-200 leading-relaxed">{lesson.taskInstruction}</p>
              <div className="flex items-center gap-3 mt-2.5 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> +{lesson.xpReward} XP</span>
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> +{lesson.coinReward} coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-neutral-800 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Code2 className="w-3.5 h-3.5" />
              <span className="font-mono">{courseId === 'html' ? 'index.html' : courseId === 'css' ? 'style.css' : 'script.js'}</span>
            </div>
            <button onClick={handleReset} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} language={courseId === 'html' ? 'html' : courseId === 'css' ? 'css' : 'javascript'} />
          </div>

          {/* Result bar */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className={`px-4 py-3 border-t flex-shrink-0 ${result.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className={`text-sm font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>{result.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-t border-neutral-800 flex-shrink-0">
            <div className="text-xs text-neutral-500 font-mono">{code.split('\n').length} lines</div>
            <div className="flex items-center gap-2">
              {isCompleted && nextLesson && (
                <button onClick={() => router.push(`/courses/${courseId}/${nextLesson.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={handleCheck} disabled={checking}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  checking ? 'bg-neutral-700 text-neutral-400' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25'
                }`}>
                <Play className="w-3.5 h-3.5" /> {checking ? 'Checking...' : 'Run & Check'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        {showPreview && (
          <div className="w-[380px] flex-shrink-0 border-l border-neutral-800 flex flex-col bg-neutral-900">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-neutral-800 flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs text-neutral-400 font-medium">Live Preview</span>
              <div className="flex-1" />
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="flex-1 bg-white rounded-b-none overflow-hidden">
              <iframe
                srcDoc={getPreviewHtml()}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>

      {/* XP Reward popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 right-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/40 z-50"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-black text-lg">Lesson Complete!</div>
                <div className="text-sm opacity-90">+{lesson.xpReward} XP • +{lesson.coinReward} coins</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
