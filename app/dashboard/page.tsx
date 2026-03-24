'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Zap, Target, TrendingUp, LogOut, User, Code2, 
  Award, Flame, Crown, Star, ArrowRight, Calendar
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-primary-50/30 flex items-center justify-center">
        <div className="text-2xl font-bold text-neutral-600">Loading...</div>
      </div>
    );
  }

  // Mock data - replace with real data from Supabase later
  const stats = {
    coins: 1250,
    xp: 3840,
    level: 12,
    challengesSolved: 47,
    streak: 7,
    rank: 'Gold'
  };

  const badges = [
    { id: 1, name: 'First Steps', icon: '🎯', unlocked: true, description: 'Complete your first challenge' },
    { id: 2, name: 'Code Warrior', icon: '⚔️', unlocked: true, description: 'Solve 25 challenges' },
    { id: 3, name: 'Speed Demon', icon: '⚡', unlocked: true, description: 'Solve a challenge in under 5 minutes' },
    { id: 4, name: 'Perfect Week', icon: '📅', unlocked: false, description: 'Code 7 days in a row' },
    { id: 5, name: 'Master Coder', icon: '👑', unlocked: false, description: 'Reach level 20' },
    { id: 6, name: 'Team Player', icon: '🤝', unlocked: false, description: 'Help 10 community members' }
  ];

  const recentChallenges = [
    { id: 1, title: 'Array Manipulation', difficulty: 'Easy', xp: 50, completed: true, date: '2 hours ago' },
    { id: 2, title: 'Binary Search Tree', difficulty: 'Medium', xp: 100, completed: true, date: 'Yesterday' },
    { id: 3, title: 'Dynamic Programming', difficulty: 'Hard', xp: 200, completed: false, date: '2 days ago' }
  ];

  const skills = [
    { name: 'JavaScript', level: 75 },
    { name: 'Python', level: 60 },
    { name: 'React', level: 80 },
    { name: 'Algorithms', level: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-neutral-50 to-primary-50/30">
      {/* Navbar */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl">
              <Code2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-display font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              CodeRift
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-5xl font-display font-black text-neutral-900 mb-2">
            Welcome back, {user?.user_metadata?.name || 'Coder'}! 👋
          </h2>
          <p className="text-xl text-neutral-600">Keep up the great work. You're on fire! 🔥</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              icon: <Trophy className="w-8 h-8" />, 
              label: 'CodeRift Coins', 
              value: stats.coins.toLocaleString(), 
              color: 'from-accent-500 to-accent-600',
              suffix: '💎'
            },
            { 
              icon: <Zap className="w-8 h-8" />, 
              label: 'Total XP', 
              value: stats.xp.toLocaleString(), 
              color: 'from-primary-500 to-primary-600',
              suffix: 'XP'
            },
            { 
              icon: <Target className="w-8 h-8" />, 
              label: 'Challenges Solved', 
              value: stats.challengesSolved, 
              color: 'from-secondary-500 to-secondary-600',
              suffix: ''
            },
            { 
              icon: <Flame className="w-8 h-8" />, 
              label: 'Day Streak', 
              value: stats.streak, 
              color: 'from-orange-500 to-red-500',
              suffix: '🔥'
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-all`} />
              <div className="relative bg-white rounded-3xl p-6 border border-neutral-200 shadow-lg group-hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-neutral-900">
                  {stat.value} <span className="text-xl">{stat.suffix}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-neutral-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-neutral-900">Level Progress</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-bold">
                <Crown className="w-5 h-5" />
                Level {stats.level}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-neutral-600">3,840 / 4,000 XP</span>
                <span className="text-sm font-semibold text-primary-600">96%</span>
              </div>
              <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '96%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2">160 XP until Level 13! 🎯</p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-lg font-black text-neutral-900 mb-4">Your Skills</h4>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-neutral-700">{skill.name}</span>
                      <span className="text-sm font-semibold text-neutral-600">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rank Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl p-8 text-white shadow-xl"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-6xl">
                🏆
              </div>
              <h3 className="text-3xl font-black mb-2">Gold Rank</h3>
              <p className="text-accent-100 mb-6">Top 15% of all coders</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <p className="text-sm text-accent-100 mb-1">Next Rank: Platinum</p>
                <p className="text-2xl font-black">350 XP to go!</p>
              </div>
              <button className="w-full py-3 bg-white text-accent-600 rounded-xl font-bold hover:bg-accent-50 transition-colors">
                View Leaderboard
              </button>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-black text-neutral-900 mb-6">Achievements & Badges</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  badge.unlocked
                    ? 'border-primary-400 bg-primary-50/50'
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-black text-neutral-900 mb-1">{badge.name}</h4>
                    <p className="text-sm text-neutral-600">{badge.description}</p>
                  </div>
                  {badge.unlocked && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-neutral-900">Recent Challenges</h3>
            <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 hover:border-primary-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    challenge.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {challenge.completed ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-900">{challenge.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-neutral-500">{challenge.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary-600">+{challenge.xp} XP</p>
                  {challenge.completed && (
                    <p className="text-xs text-green-600 font-semibold">Completed ✓</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}