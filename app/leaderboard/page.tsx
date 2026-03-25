'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  Trophy, Zap, Target, Flame, LogOut, Code2, Crown, Star,
  ArrowRight, Calendar, Bell, Award, BookOpen, Briefcase,
  Settings, Users, MessageSquare, TrendingUp,
  Terminal, Brain, Moon, Sun, Gift, Medal, Swords, Map, Shield
} from 'lucide-react';

// ── Rank tier definitions ──────────────────────────────────────────────────────
const RANK_TIERS = [
  { name: 'Bronze',   min: 0,    max: 499,  gradient: 'from-orange-700 to-amber-700',  text: 'text-orange-500',  bg: 'bg-orange-500/10', border: 'border-orange-500/25', emoji: '🥉' },
  { name: 'Silver',   min: 500,  max: 999,  gradient: 'from-slate-400 to-gray-400',     text: 'text-slate-400',   bg: 'bg-slate-500/10',  border: 'border-slate-500/25',  emoji: '🥈' },
  { name: 'Gold',     min: 1000, max: 1999, gradient: 'from-amber-500 to-yellow-500',   text: 'text-amber-400',   bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  emoji: '🥇' },
  { name: 'Platinum', min: 2000, max: 3499, gradient: 'from-teal-500 to-emerald-500',   text: 'text-teal-400',    bg: 'bg-teal-500/10',   border: 'border-teal-500/25',   emoji: '💎' },
  { name: 'Diamond',  min: 3500, max: Infinity, gradient: 'from-cyan-400 to-blue-500',  text: 'text-cyan-400',    bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   emoji: '👑' },
] as const;

function getTierForPoints(points: number) {
  return RANK_TIERS.find(t => points >= t.min && points <= t.max) ?? RANK_TIERS[0];
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { name: 'Sarah Chen',    points: 8450, streak: 28, tasksCompleted: 145, avatar: 'SC', color: 'from-pink-500 to-rose-500' },
  { name: 'Alex Rivera',   points: 7200, streak: 21, tasksCompleted: 132, avatar: 'AR', color: 'from-indigo-500 to-purple-500' },
  { name: 'Emma Zhang',    points: 6800, streak: 19, tasksCompleted: 128, avatar: 'EZ', color: 'from-cyan-500 to-blue-500' },
  { name: 'David Kim',     points: 4200, streak: 14, tasksCompleted: 98,  avatar: 'DK', color: 'from-blue-500 to-cyan-500' },
  { name: 'Maria Garcia',  points: 3600, streak: 12, tasksCompleted: 87,  avatar: 'MG', color: 'from-purple-500 to-violet-500' },
  { name: 'James Wilson',  points: 2800, streak: 9,  tasksCompleted: 72,  avatar: 'JW', color: 'from-teal-500 to-emerald-500' },
  { name: 'Lisa Anderson', points: 1950, streak: 7,  tasksCompleted: 58,  avatar: 'LA', color: 'from-amber-500 to-orange-500' },
  { name: 'Tom Baker',     points: 1400, streak: 5,  tasksCompleted: 41,  avatar: 'TB', color: 'from-green-500 to-lime-500' },
  { name: 'Nina Patel',    points: 920,  streak: 4,  tasksCompleted: 33,  avatar: 'NP', color: 'from-rose-500 to-pink-500' },
  { name: 'Oscar Ruiz',    points: 610,  streak: 3,  tasksCompleted: 22,  avatar: 'OR', color: 'from-violet-500 to-fuchsia-500' },
  { name: 'Chloe Lee',     points: 380,  streak: 2,  tasksCompleted: 14,  avatar: 'CL', color: 'from-sky-500 to-blue-500' },
  { name: 'Ryan Scott',    points: 150,  streak: 1,  tasksCompleted: 6,   avatar: 'RS', color: 'from-emerald-500 to-green-500' },
];

export default function LeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [activeNav, setActiveNav] = useState('leaderboard');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Tab state — initialise from ?view=ranked
  const initialTab = searchParams.get('view') === 'ranked' ? 'ranked' : 'simple';
  const [activeTab, setActiveTab] = useState<'simple' | 'ranked'>(initialTab);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/'); return; }
      setUser(user);
      setLoading(false);
    })();
  }, []);

  // When query param changes externally, sync
  useEffect(() => {
    if (searchParams.get('view') === 'ranked') setActiveTab('ranked');
  }, [searchParams]);

  // Build sorted leaderboard with the current user injected
  const currentUserEntry = {
    name: user?.user_metadata?.name || 'You',
    points: 3840,
    streak: 7,
    tasksCompleted: 47,
    avatar: user?.user_metadata?.name?.[0] || 'Y',
    color: 'from-primary-500 to-secondary-500',
    isMe: true,
  };

  const sorted = [...MOCK_USERS.map(u => ({ ...u, isMe: false })), currentUserEntry]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  // ── Sidebar nav arrays (same as dashboard) ──────────────────────────────────
  const navItems = [
    { id: 'dashboard', icon: <Terminal className="w-4 h-4" />, label: 'Dashboard', path: '/dashboard' },
    { id: 'leaderboard', icon: <Trophy className="w-4 h-4" />, label: 'Leaderboard', path: '/leaderboard' },
    { id: 'ranked', icon: <Swords className="w-4 h-4" />, label: 'Ranked', path: '/leaderboard?view=ranked' },
    { id: 'rewards', icon: <Gift className="w-4 h-4" />, label: 'Rewards', path: '/rewards' },
    { id: 'ai-coach', icon: <Brain className="w-4 h-4" />, label: 'AI Coach', path: '/ai-coach' },
  ];
  const learningItems = [
    { id: 'projects', icon: <Code2 className="w-4 h-4" />, label: 'Projects', badge: 3, path: '/projects' },
    { id: 'courses', icon: <BookOpen className="w-4 h-4" />, label: 'Courses', path: '/courses' },
    { id: 'challenges', icon: <Target className="w-4 h-4" />, label: 'Challenges', badge: 2, path: '/challenges' },
    { id: 'badges', icon: <Award className="w-4 h-4" />, label: 'Badges', path: '/badges' },
  ];
  const careerItems = [
    { id: 'profile', icon: <Users className="w-4 h-4" />, label: 'Profile', path: '/profile' },
    { id: 'portfolio', icon: <Briefcase className="w-4 h-4" />, label: 'Portfolio', path: '/portfolio' },
    { id: 'interview', icon: <MessageSquare className="w-4 h-4" />, label: 'Mock Interview', path: '/interview' },
    { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Settings', path: '/settings' },
  ];

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl font-bold text-white">
          Loading leaderboard...
        </motion.div>
      </div>
    );
  }

  // ── Render helpers ───────────────────────────────────────────────────────────
  const rankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-sm shadow-lg shadow-amber-500/40">👑</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center text-sm shadow-lg shadow-slate-400/30">🥈</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">🥉</div>;
    return <div className={`w-8 text-center font-black font-mono text-lg ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{rank}</div>;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'} flex overflow-hidden relative transition-colors duration-300`}>
      {/* BG blurs */}
      <div className={`fixed top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br ${isDark ? 'from-primary-600/30' : 'from-primary-500/40'} to-transparent blur-[100px] pointer-events-none`} />
      <div className={`fixed bottom-[5%] left-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-br ${isDark ? 'from-secondary-600/20' : 'from-secondary-500/30'} to-transparent blur-[80px] pointer-events-none`} />

      {/* ── SIDEBAR ── */}
      <aside className={`w-64 min-h-screen ${isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-200'} backdrop-blur-xl border-r flex flex-col flex-shrink-0 relative z-10 transition-colors duration-300`}>
        <div className={`p-5 pb-4 border-b ${isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl">
              <Terminal className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">CodeRift</h1>
          </div>
        </div>

        <nav className="px-3 flex-1 overflow-y-auto mt-4">
          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2`}>Main</div>
          {navItems.map((item) => (
            <motion.div key={item.id} whileHover={{ x: 4 }} onClick={() => { setActiveNav(item.id); router.push(item.path); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${activeNav === item.id ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold` : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`}`}>
              {item.icon}<span className="text-sm flex-1">{item.label}</span>
            </motion.div>
          ))}
          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4`}>Learning</div>
          {learningItems.map((item) => (
            <motion.div key={item.id} whileHover={{ x: 4 }} onClick={() => { setActiveNav(item.id); router.push(item.path); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${activeNav === item.id ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold` : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`}`}>
              {item.icon}<span className="text-sm flex-1">{item.label}</span>
              {item.badge && <span className={`${isDark ? 'bg-primary-600' : 'bg-primary-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono`}>{item.badge}</span>}
            </motion.div>
          ))}
          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4`}>Career</div>
          {careerItems.map((item) => (
            <motion.div key={item.id} whileHover={{ x: 4 }} onClick={() => { setActiveNav(item.id); router.push(item.path); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${activeNav === item.id ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold` : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`}`}>
              {item.icon}<span className="text-sm flex-1">{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto relative z-5">
        {/* Top bar */}
        <div className={`sticky top-0 z-20 ${isDark ? 'bg-neutral-950/85 border-neutral-800/50' : 'bg-neutral-50/85 border-neutral-200/50'} backdrop-blur-xl border-b h-16 px-7 flex items-center justify-between transition-colors duration-300`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Leaderboard</h2>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>See how you stack up against the community</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsDark(!isDark)} className={`w-9 h-9 rounded-xl ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500 transition-all`}>
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary-600" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className={`flex items-center gap-2 px-4 py-2 text-sm ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700' : 'text-neutral-600 hover:text-neutral-900 hover:bg-white hover:border-neutral-300'} rounded-xl transition-all border border-transparent`}>
              <LogOut className="w-4 h-4" />Logout
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* ── Tab toggle ── */}
          <div className={`flex gap-1 p-1 ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-200'} rounded-xl w-fit`}>
            {[
              { id: 'simple' as const, label: 'Simple Leaderboard', icon: <Trophy className="w-4 h-4" /> },
              { id: 'ranked' as const, label: 'Ranked Leaderboard', icon: <Swords className="w-4 h-4" /> },
            ].map((tab) => (
              <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? `${isDark ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white'} shadow-lg` : `${isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-700'}`}`}>
                {tab.icon}{tab.label}
              </motion.button>
            ))}
          </div>

          {/* ── Leaderboard list ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'} flex items-center`}>
              <div className="w-12" />
              <div className="w-12" />
              <div className={`flex-1 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'} ml-3`}>Player</div>
              <div className={`w-28 text-right text-xs font-bold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Points</div>
              {activeTab === 'ranked' && (
                <div className={`w-32 text-right text-xs font-bold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Tier</div>
              )}
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-800/50">
              {sorted.map((entry, i) => {
                const tier = getTierForPoints(entry.points);
                const isTop3 = entry.rank <= 3;
                return (
                  <motion.div
                    key={entry.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center px-6 py-4 transition-all ${
                      entry.isMe
                        ? `${isDark ? 'bg-primary-600/10' : 'bg-primary-100/50'}`
                        : isTop3 && activeTab === 'ranked'
                          ? `${isDark ? 'bg-amber-500/5' : 'bg-amber-50'}`
                          : ''
                    } ${isDark ? 'hover:bg-neutral-800/40' : 'hover:bg-neutral-50'}`}
                  >
                    {/* Rank */}
                    <div className="w-12 flex-shrink-0 flex justify-center">
                      {rankBadge(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${entry.color} flex items-center justify-center font-bold text-sm text-white shadow-lg flex-shrink-0 ${entry.isMe ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-neutral-950' : ''}`}>
                      {entry.avatar}
                    </div>

                    {/* Name + streak */}
                    <div className="flex-1 ml-3 min-w-0">
                      <div className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {entry.name}
                        {entry.isMe && <span className={`ml-2 text-xs ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>(You)</span>}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} flex items-center gap-2`}>
                        <Flame className="w-3 h-3 text-orange-400" />{entry.streak} day streak · {entry.tasksCompleted} tasks
                      </div>
                    </div>

                    {/* Points */}
                    <div className={`w-28 text-right font-black font-mono text-base ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                      {entry.points.toLocaleString()}
                    </div>

                    {/* Tier badge (ranked only) */}
                    {activeTab === 'ranked' && (
                      <div className="w-32 flex justify-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${tier.bg} ${tier.border} border ${tier.text}`}>
                          <span>{tier.emoji}</span>{tier.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Rank Tiers explanation (always visible) ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-neutral-900'}`}>Rank Tiers</h3>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Earn points to climb through the ranks</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {RANK_TIERS.map((tier) => (
                <motion.div key={tier.name} whileHover={{ y: -4, scale: 1.03 }} className={`relative overflow-hidden rounded-2xl border ${tier.border} ${tier.bg} p-4 text-center transition-all`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5 pointer-events-none`} />
                  <div className="relative">
                    <div className="text-3xl mb-2">{tier.emoji}</div>
                    <div className={`text-sm font-black ${tier.text} mb-1`}>{tier.name}</div>
                    <div className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {tier.max === Infinity ? `${tier.min.toLocaleString()}+` : `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}`}
                    </div>
                    {/* Progress bar visual */}
                    <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${tier.gradient}`} style={{ width: '100%' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
