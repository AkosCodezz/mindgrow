'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Crown,
  Flame,
  Lock,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type BadgeCategory = 'progress' | 'streak' | 'challenge' | 'community' | 'rank';

type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  category: BadgeCategory;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0..100
  requirement: string;
  xpReward?: number;
};

export default function BadgesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [rarity, setRarity] = useState<'all' | Rarity>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Badge | null>(null);

  const badges: Badge[] = useMemo(
    () => [
      {
        id: 1,
        name: 'First Steps',
        description: 'Completed your first challenge',
        icon: '🎯',
        rarity: 'common',
        category: 'challenge',
        unlocked: true,
        unlockedAt: '2024-01-15',
        progress: 100,
        requirement: 'Complete 1 challenge',
        xpReward: 50,
      },
      {
        id: 2,
        name: 'Code Warrior',
        description: 'Solved 25 challenges',
        icon: '⚔️',
        rarity: 'rare',
        category: 'challenge',
        unlocked: true,
        unlockedAt: '2024-02-10',
        progress: 100,
        requirement: 'Complete 25 challenges',
        xpReward: 250,
      },
      {
        id: 3,
        name: 'Speed Demon',
        description: 'Completed a challenge in under 5 minutes',
        icon: '⚡',
        rarity: 'epic',
        category: 'challenge',
        unlocked: true,
        unlockedAt: '2024-02-20',
        progress: 100,
        requirement: 'Finish any challenge under 5 minutes',
        xpReward: 200,
      },
      {
        id: 4,
        name: 'Week Warrior',
        description: 'Code for 7 days straight',
        icon: '🔥',
        rarity: 'rare',
        category: 'streak',
        unlocked: true,
        unlockedAt: '2024-03-01',
        progress: 100,
        requirement: 'Maintain a 7-day streak',
        xpReward: 150,
      },
      {
        id: 5,
        name: 'Perfect Month',
        description: 'Code every day for 30 days',
        icon: '📅',
        rarity: 'epic',
        category: 'streak',
        unlocked: false,
        progress: 70,
        requirement: 'Maintain a 30-day streak',
        xpReward: 500,
      },
      {
        id: 6,
        name: 'Master Coder',
        description: 'Reach level 20',
        icon: '👑',
        rarity: 'legendary',
        category: 'progress',
        unlocked: false,
        progress: 60,
        requirement: 'Reach Level 20',
        xpReward: 1000,
      },
      {
        id: 7,
        name: 'Team Player',
        description: 'Help 10 community members',
        icon: '🤝',
        rarity: 'rare',
        category: 'community',
        unlocked: false,
        progress: 30,
        requirement: 'Help 10 members (answers, reviews)',
        xpReward: 300,
      },
      {
        id: 8,
        name: 'Century Club',
        description: 'Solve 100 challenges',
        icon: '💯',
        rarity: 'legendary',
        category: 'challenge',
        unlocked: false,
        progress: 47,
        requirement: 'Complete 100 challenges',
        xpReward: 1200,
      },
      {
        id: 9,
        name: 'Rising Star',
        description: 'Earn 1,000 XP',
        icon: '⭐',
        rarity: 'common',
        category: 'progress',
        unlocked: true,
        unlockedAt: '2024-01-22',
        progress: 100,
        requirement: 'Earn 1,000 XP',
        xpReward: 100,
      },
      {
        id: 10,
        name: 'Diamond Mind',
        description: 'Reach Diamond rank',
        icon: '💎',
        rarity: 'epic',
        category: 'rank',
        unlocked: false,
        progress: 25,
        requirement: 'Reach Diamond rank in Ranked',
        xpReward: 800,
      },
      {
        id: 11,
        name: 'Hot Streak',
        description: 'Maintain a 14-day streak',
        icon: '🔥',
        rarity: 'epic',
        category: 'streak',
        unlocked: false,
        progress: 50,
        requirement: 'Maintain a 14-day streak',
        xpReward: 350,
      },
      {
        id: 12,
        name: 'Legend of the Rift',
        description: 'Reach level 50',
        icon: '🏆',
        rarity: 'legendary',
        category: 'progress',
        unlocked: false,
        progress: 15,
        requirement: 'Reach Level 50',
        xpReward: 3000,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return badges
      .filter((b) => {
        if (tab === 'unlocked') return b.unlocked;
        if (tab === 'locked') return !b.unlocked;
        return true;
      })
      .filter((b) => (rarity === 'all' ? true : b.rarity === rarity))
      .filter((b) => {
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.requirement.toLowerCase().includes(q)
        );
      });
  }, [badges, query, rarity, tab]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getRarityColor = (r: Rarity) => {
    switch (r) {
      case 'common':
        return 'from-slate-400 to-slate-600';
      case 'rare':
        return 'from-blue-400 to-cyan-600';
      case 'epic':
        return 'from-primary-400 to-accent-600';
      case 'legendary':
        return 'from-amber-400 to-orange-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const getRarityBadge = (r: Rarity) => {
    const colors = {
      common: 'bg-slate-500/20 text-slate-300 border-slate-400/40 shadow-slate-500/20',
      rare: 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-blue-500/30',
      epic: 'bg-primary-500/20 text-primary-200 border-primary-400/40 shadow-primary-500/30',
      legendary: 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-amber-500/40',
    };
    return colors[r] || colors.common;
  };

  const categoryMeta: Record<BadgeCategory, { label: string; icon: JSX.Element; tint: string }> = {
    progress: { label: 'Progress', icon: <Zap className="w-4 h-4" />, tint: 'from-yellow-500/20 to-orange-500/10' },
    streak: { label: 'Streak', icon: <Flame className="w-4 h-4" />, tint: 'from-orange-500/20 to-red-500/10' },
    challenge: { label: 'Challenges', icon: <Target className="w-4 h-4" />, tint: 'from-blue-500/20 to-cyan-500/10' },
    community: { label: 'Community', icon: <Star className="w-4 h-4" />, tint: 'from-primary-500/20 to-accent-500/10' },
    rank: { label: 'Ranked', icon: <Crown className="w-4 h-4" />, tint: 'from-amber-500/20 to-yellow-500/10' },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
      {/* Premium animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--cr-primary)/0.16),transparent_55%),radial-gradient(circle_at_80%_20%,rgb(var(--cr-secondary)/0.16),transparent_55%),radial-gradient(circle_at_20%_80%,rgb(var(--cr-accent)/0.14),transparent_55%)]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-primary-600/35 rounded-full blur-[180px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-600/30 rounded-full blur-[180px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_78%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-lg shadow-black/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent mb-1 flex items-center gap-3 drop-shadow-2xl">
                  Badges
                  <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                    <Sparkles className="w-7 h-7 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]" />
                  </motion.div>
                </h1>
                <p className="text-sm text-neutral-400 font-medium">
                  {unlockedCount} of {badges.length} unlocked — keep grinding.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search badges..."
                  className="bg-transparent outline-none text-sm text-white placeholder:text-neutral-500 w-64"
                />
              </div>
              <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Collection</div>
                    <div className="text-sm font-black text-white">
                      {Math.round((unlockedCount / badges.length) * 100)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 grid md:grid-cols-2 gap-3">
            <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'unlocked', label: 'Unlocked' },
                { id: 'locked', label: 'Locked' },
              ].map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTab(t.id as any)}
                  className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    tab === t.id ? 'text-white shadow-2xl' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  {tab === t.id && (
                    <>
                      <motion.div
                        layoutId="activeBadgesTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-xl opacity-50" />
                    </>
                  )}
                  <span className="relative">{t.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              {(['all', 'common', 'rare', 'epic', 'legendary'] as const).map((r) => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRarity(r)}
                  className={`relative flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    rarity === r ? 'text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                >
                  {rarity === r && (
                    <>
                      <motion.div
                        layoutId="activeRarity"
                        className="absolute inset-0 bg-white/10 rounded-xl border border-white/15"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                      <div className="absolute inset-0 rounded-xl blur-xl opacity-30 bg-white/10" />
                    </>
                  )}
                  <span className="relative">{r}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-3 md:hidden flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search badges..."
              className="bg-transparent outline-none text-sm text-white placeholder:text-neutral-500 w-full"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((b, index) => {
              const meta = categoryMeta[b.category];
              const progress = typeof b.progress === 'number' ? b.progress : b.unlocked ? 100 : 0;
              return (
                <motion.button
                  key={b.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -18 }}
                  transition={{ delay: index * 0.02, type: 'spring', stiffness: 300, damping: 26 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  onClick={() => setSelected(b)}
                  className="text-left relative group"
                >
                  <div
                    className={`absolute -inset-2 bg-gradient-to-br ${getRarityColor(b.rarity)} opacity-0 group-hover:opacity-45 rounded-3xl blur-2xl transition-all duration-500`}
                  />

                  <div className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 transition-all ${!b.unlocked ? 'opacity-75' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className="text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                          {b.icon}
                        </motion.div>
                        {b.unlocked ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-neutral-500" />
                          </div>
                        )}
                      </div>

                      <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-lg ${getRarityBadge(b.rarity)}`}>
                        {b.rarity}
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${meta.tint} border border-white/10 mb-4`}>
                      <span className="text-neutral-200">{meta.icon}</span>
                      <span className="text-xs font-bold text-neutral-200">{meta.label}</span>
                    </div>

                    <h3 className="text-lg font-black text-white mb-1 leading-tight">{b.name}</h3>
                    <p className="text-sm text-neutral-300 mb-4 leading-relaxed">{b.description}</p>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-neutral-500 font-semibold">{b.unlocked ? 'Unlocked' : 'Progress'}</span>
                        <span className="text-white font-black font-mono">{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getRarityColor(b.rarity)} rounded-full`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-neutral-500">{b.requirement}</span>
                        {b.xpReward ? (
                          <span className="text-amber-300 font-black font-mono flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />+{b.xpReward}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center text-neutral-400 py-20">
            <div className="text-5xl mb-4">🕵️</div>
            <div className="text-lg font-bold text-neutral-200 mb-1">No badges found</div>
            <div className="text-sm">Try a different search or filter.</div>
          </div>
        )}
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-neutral-900 to-black border border-white/20 rounded-3xl p-10 max-w-lg w-full shadow-2xl"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${getRarityColor(selected.rarity)} rounded-3xl blur-2xl opacity-20`} />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-7xl drop-shadow-2xl">
                      {selected.icon}
                    </motion.div>
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-lg mb-2 ${getRarityBadge(selected.rarity)}`}>
                        {selected.rarity}
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight">{selected.name}</h3>
                      <p className="text-neutral-400 mt-1">{selected.description}</p>
                    </div>
                  </div>

                  {selected.unlocked ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 shadow-lg shadow-green-500/20">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400">Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 opacity-70">
                      <Lock className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-300">Locked</span>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Requirement</div>
                    <div className="text-sm text-white font-semibold">{selected.requirement}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Reward</div>
                    <div className="text-sm text-white font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300" />
                      {selected.xpReward ? `+${selected.xpReward} XP` : '—'}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-neutral-500 font-semibold">{selected.unlocked ? 'Unlocked' : 'Progress'}</span>
                    <span className="text-white font-black font-mono">
                      {typeof selected.progress === 'number' ? selected.progress : selected.unlocked ? 100 : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getRarityColor(selected.rarity)} rounded-full`}
                      style={{
                        width: `${typeof selected.progress === 'number' ? selected.progress : selected.unlocked ? 100 : 0}%`,
                      }}
                    />
                  </div>
                  {selected.unlockedAt && (
                    <div className="mt-3 text-xs text-neutral-400">
                      Unlocked at <span className="text-neutral-200 font-semibold">{selected.unlockedAt}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white rounded-xl font-bold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    Go to Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

