'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Zap, Target, Flame, LogOut, Code2, Crown, Star, 
  ArrowRight, Calendar, Bell, Award, BookOpen, Briefcase,
  Settings, Users, MessageSquare, TrendingUp, CheckCircle2,
  Play, Rocket, Terminal, Sparkles, Brain, Moon, Sun, Gift,
  Medal, Swords, Map
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeCard, setActiveCard] = useState<'project' | 'challenge' | 'path'>('project');
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Mouse follower effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    checkUser();
    
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
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
      <div className={`min-h-screen ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}
        >
          Loading your dashboard...
        </motion.div>
      </div>
    );
  }

  // Mock data
  const stats = {
    coins: 1250,
    xp: 3840,
    level: 12,
    challengesSolved: 47,
    streak: 7,
    rank: 'Gold'
  };

  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakStatus = [true, true, true, true, true, true, false];

  const currentProject = {
    title: 'E-commerce Dashboard',
    tag: 'CURRENT PROJECT',
    description: 'Build a full-stack admin panel with React + Node.js',
    progress: 68,
    tasks: [
      { id: 1, text: 'Setup authentication system', done: true, xp: 100 },
      { id: 2, text: 'Create product CRUD operations', done: true, xp: 150 },
      { id: 3, text: 'Build analytics charts', done: false, xp: 200 },
      { id: 4, text: 'Add payment integration', done: false, xp: 250 }
    ]
  };

  const currentChallenge = {
    title: 'Array Manipulation Master',
    tag: 'DAILY CHALLENGE',
    description: 'Solve 3 medium-level array problems in 30 minutes',
    progress: 66,
    tasks: [
      { id: 1, text: 'Two Sum Problem', done: true, xp: 50 },
      { id: 2, text: 'Rotate Array', done: true, xp: 75 },
      { id: 3, text: 'Find Duplicates', done: false, xp: 100 }
    ]
  };

  const learningPath = {
    title: 'Full-Stack Web Developer',
    tag: 'LEARNING PATH',
    description: 'Master frontend, backend, and deployment skills',
    progress: 45,
    tasks: [
      { id: 1, text: 'React Fundamentals', done: true, xp: 300 },
      { id: 2, text: 'Node.js & Express', done: true, xp: 350 },
      { id: 3, text: 'Database Design', done: false, xp: 400 },
      { id: 4, text: 'Cloud Deployment', done: false, xp: 450 }
    ]
  };

  const badges = [
    { id: 1, icon: '🎯', name: 'First Steps', earned: true },
    { id: 2, icon: '⚔️', name: 'Code Warrior', earned: true },
    { id: 3, icon: '⚡', name: 'Speed Demon', earned: true },
    { id: 4, icon: '📅', name: 'Perfect Week', earned: false },
    { id: 5, icon: '👑', name: 'Master', earned: false },
    { id: 6, icon: '🤝', name: 'Team Player', earned: false },
    { id: 7, icon: '🔥', name: 'On Fire', earned: true },
    { id: 8, icon: '🌟', name: 'Rising Star', earned: false }
  ];

  // GitHub-style heatmap data (last 12 weeks = 84 days)
  const generateHeatmapData = () => {
    const weeks = 12;
    const data = [];
    const today = new Date();
    
    for (let week = weeks - 1; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));
        
        // Mock activity data (0-4 levels)
        const level = Math.floor(Math.random() * 5);
        const hours = level * 1.5;
        const projects = level > 0 ? Math.floor(Math.random() * 3) : 0;
        const tasks = level > 0 ? Math.floor(Math.random() * 8) : 0;
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          level,
          hours: parseFloat(hours.toFixed(1)),
          projects,
          tasks
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', level: 'Lvl 15', xp: 4800, progress: 92, avatar: 'SC', color: 'from-pink-500 to-rose-500' },
    { rank: 2, name: 'David Kim', level: 'Lvl 14', xp: 4200, progress: 78, avatar: 'DK', color: 'from-blue-500 to-cyan-500' },
    { rank: 3, name: user?.user_metadata?.name || 'You', level: `Lvl ${stats.level}`, xp: stats.xp, progress: 68, avatar: user?.user_metadata?.name?.[0] || 'Y', color: 'from-primary-500 to-secondary-500', isMe: true },
    { rank: 4, name: 'Maria Garcia', level: 'Lvl 12', xp: 3600, progress: 55, avatar: 'MG', color: 'from-purple-500 to-violet-500' },
    { rank: 5, name: 'James Wilson', level: 'Lvl 11', xp: 3200, progress: 45, avatar: 'JW', color: 'from-orange-500 to-amber-500' }
  ];

  const navItems = [
    { id: 'dashboard', icon: <Terminal className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'ranked', icon: <Swords className="w-4 h-4" />, label: 'Ranked' },
    { id: 'rewards', icon: <Gift className="w-4 h-4" />, label: 'Rewards' },
    { id: 'ai-coach', icon: <Brain className="w-4 h-4" />, label: 'AI Coach' },
    { id: 'leaderboard', icon: <Trophy className="w-4 h-4" />, label: 'Leaderboard' }
  ];

  const learningItems = [
    { id: 'projects', icon: <Code2 className="w-4 h-4" />, label: 'Projects', badge: 3 },
    { id: 'courses', icon: <BookOpen className="w-4 h-4" />, label: 'Courses' },
    { id: 'challenges', icon: <Target className="w-4 h-4" />, label: 'Challenges', badge: 2 },
    { id: 'badges', icon: <Award className="w-4 h-4" />, label: 'Badges' }
  ];

  const careerItems = [
    { id: 'portfolio', icon: <Briefcase className="w-4 h-4" />, label: 'Portfolio' },
    { id: 'interview', icon: <MessageSquare className="w-4 h-4" />, label: 'Mock Interview' },
    { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' }
  ];

  const activeContent = {
    project: currentProject,
    challenge: currentChallenge,
    path: learningPath
  }[activeCard];

  const getHeatmapColor = (level: number) => {
    if (level === 0) return isDark ? 'bg-neutral-800' : 'bg-neutral-200';
    const colors = isDark
      ? ['bg-primary-900/40', 'bg-primary-700/60', 'bg-primary-600/80', 'bg-primary-500']
      : ['bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500'];
    return colors[level - 1];
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'} flex overflow-hidden relative transition-colors duration-300`}>
      {/* Background orbs */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className={`fixed w-96 h-96 rounded-full ${isDark ? 'bg-primary-600/20' : 'bg-primary-400/30'} blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2`}
      />
      <div className={`fixed top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br ${isDark ? 'from-primary-600/30' : 'from-primary-500/40'} to-transparent blur-[100px] pointer-events-none`} />
      <div className={`fixed bottom-[5%] left-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-br ${isDark ? 'from-secondary-600/20' : 'from-secondary-500/30'} to-transparent blur-[80px] pointer-events-none`} />

      {/* Sidebar */}
      <aside className={`w-64 min-h-screen ${isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-neutral-200'} backdrop-blur-xl border-r flex flex-col flex-shrink-0 relative z-10 transition-colors duration-300`}>
        {/* Logo */}
        <div className={`p-5 pb-4 border-b ${isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl">
              <Terminal className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              CodeRift
            </h1>
          </div>
        </div>

        {/* Streak Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`m-4 relative overflow-hidden rounded-2xl bg-gradient-to-br ${isDark ? 'from-amber-500/15 to-orange-500/5' : 'from-amber-400/25 to-orange-400/10'} border border-amber-500/30 p-4 text-center`}
        >
          <div className="absolute top-0 right-0 text-5xl opacity-20">🔥</div>
          <div className="relative">
            <div className={`text-4xl font-black ${isDark ? 'text-amber-500' : 'text-amber-600'} font-mono leading-none`}>{stats.streak}</div>
            <div className={`text-[10px] font-bold ${isDark ? 'text-amber-500/70' : 'text-amber-600/80'} uppercase tracking-widest mt-1`}>Day Streak 🔥</div>
            <div className="flex gap-1 justify-center mt-3">
              {streakDays.map((day, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all ${
                    streakStatus[i]
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40'
                      : i === stats.streak
                      ? `${isDark ? 'bg-amber-500/20' : 'bg-amber-400/30'} border border-amber-500 text-amber-500`
                      : `${isDark ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-200 text-neutral-400'}`
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="px-3 flex-1 overflow-y-auto">
          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-2`}>Main</div>
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${
                activeNav === item.id
                  ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold`
                  : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`
              }`}
            >
              {item.icon}
              <span className="text-sm flex-1">{item.label}</span>
            </motion.div>
          ))}

          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4`}>Learning</div>
          {learningItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${
                activeNav === item.id
                  ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold`
                  : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`
              }`}
            >
              {item.icon}
              <span className="text-sm flex-1">{item.label}</span>
              {item.badge && (
                <span className={`${isDark ? 'bg-primary-600' : 'bg-primary-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono`}>
                  {item.badge}
                </span>
              )}
            </motion.div>
          ))}

          <div className={`text-[10px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4`}>Career</div>
          {careerItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${
                activeNav === item.id
                  ? `${isDark ? 'bg-primary-600/15 text-primary-400 border-primary-600/25' : 'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold`
                  : `${isDark ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`
              }`}
            >
              {item.icon}
              <span className="text-sm flex-1">{item.label}</span>
            </motion.div>
          ))}
        </nav>

        {/* XP Progress */}
        <div className={`p-4 border-t ${isDark ? 'border-neutral-800/50' : 'border-neutral-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-wide`}>XP Progress</span>
            <span className={`text-xs font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'} font-mono`}>{stats.xp} / 4000</span>
          </div>
          <div className={`h-1.5 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '96%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg shadow-primary-500/50"
            />
          </div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} mt-1.5`}>160 XP to Level {stats.level + 1}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-5">
        {/* Topbar */}
        <div className={`sticky top-0 z-20 ${isDark ? 'bg-neutral-950/85 border-neutral-800/50' : 'bg-neutral-50/85 border-neutral-200/50'} backdrop-blur-xl border-b h-16 px-7 flex items-center justify-between transition-colors duration-300`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Welcome back, {user?.user_metadata?.name || 'Coder'}! 👋</h2>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{stats.streak} day streak — keep it going!</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className={`w-9 h-9 rounded-xl ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500 transition-all`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary-600" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-9 h-9 rounded-xl ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500 transition-all`}
            >
              <Bell className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
              <div className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 ${isDark ? 'border-neutral-950' : 'border-neutral-50'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700' : 'text-neutral-600 hover:text-neutral-900 hover:bg-white hover:border-neutral-300'} rounded-xl transition-all border border-transparent`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center font-bold text-sm cursor-pointer text-white">
              {user?.user_metadata?.name?.[0] || 'C'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: <Trophy className="w-7 h-7" />, label: 'CodeRift Coins', value: stats.coins.toLocaleString(), color: 'from-accent-500 to-accent-600', change: '+50 today', changeColor: 'text-green-500' },
              { icon: <Zap className="w-7 h-7" />, label: 'Total XP', value: stats.xp.toLocaleString(), color: 'from-primary-500 to-primary-600', change: '+120 this week', changeColor: 'text-green-500' },
              { icon: <Target className="w-7 h-7" />, label: 'Challenges Solved', value: stats.challengesSolved, color: 'from-secondary-500 to-secondary-600', change: '+3 today', changeColor: 'text-green-500' },
              { icon: <Flame className="w-7 h-7" />, label: 'Day Streak', value: stats.streak, color: 'from-orange-500 to-red-500', change: '7 days', changeColor: 'text-orange-500' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} ${isDark ? 'opacity-10' : 'opacity-15'} rounded-2xl blur-xl group-hover:opacity-20 transition-all`} />
                <div className={`relative ${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-5 group-hover:border-${isDark ? 'neutral-700' : 'neutral-300'} transition-all`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} mb-1 font-semibold uppercase tracking-wide`}>{stat.label}</p>
                  <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-neutral-900'} font-mono leading-none`}>{stat.value}</p>
                  <p className={`text-xs mt-2 font-semibold ${stat.changeColor}`}>{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Switchable Card - Current Project/Challenge/Path */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${isDark ? 'bg-neutral-900/80 border-primary-600/25' : 'bg-white/90 border-primary-200'} backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-primary-600/6' : 'from-primary-500/8'} to-transparent pointer-events-none`} />
              <div className="relative">
                {/* Tab Switcher */}
                <div className={`flex gap-1 p-1 ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-100'} rounded-xl mb-4`}>
                  {[
                    { id: 'project', label: 'Project', icon: <Code2 className="w-3.5 h-3.5" /> },
                    { id: 'challenge', label: 'Challenge', icon: <Target className="w-3.5 h-3.5" /> },
                    { id: 'path', label: 'Path', icon: <Map className="w-3.5 h-3.5" /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCard(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        activeCard === tab.id
                          ? `${isDark ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white'} shadow-lg`
                          : `${isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-700'}`
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${isDark ? 'text-secondary-400' : 'text-secondary-600'} uppercase tracking-widest mb-2`}>
                      <div className={`w-3.5 h-0.5 ${isDark ? 'bg-secondary-400' : 'bg-secondary-600'} rounded`} />
                      {activeContent.tag}
                    </div>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-neutral-900'} mb-1`}>{activeContent.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed`}>{activeContent.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/12 border border-green-500/25 rounded-full px-3 py-1.5 text-xs font-bold text-green-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-semibold`}>Progress</span>
                    <span className={`text-sm font-black ${isDark ? 'text-primary-400' : 'text-primary-600'} font-mono`}>{activeContent.progress}%</span>
                  </div>
                  <div className={`h-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
                    <motion.div
                      key={activeCard}
                      initial={{ width: 0 }}
                      animate={{ width: `${activeContent.progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg shadow-primary-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {activeContent.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-neutral-50 border-neutral-200'} border rounded-xl`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        task.done
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                          : `${isDark ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-neutral-300'} border`
                      }`}>
                        {task.done && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`text-sm flex-1 ${task.done ? `line-through ${isDark ? 'text-neutral-500' : 'text-neutral-400'}` : `${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}`}>
                        {task.text}
                      </span>
                      <span className={`text-xs font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'} font-mono`}>+{task.xp} XP</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-bold text-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Continue
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-transparent ${isDark ? 'border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:text-white' : 'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'} border px-5 py-3 rounded-xl font-semibold text-sm transition-all`}
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Badges & Activity Heatmap */}
            <div className="space-y-4">
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-5`}
              >
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-neutral-900'} mb-1`}>Badges</h3>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} mb-3`}>4/8 unlocked</p>
                <div className="grid grid-cols-4 gap-2">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: badge.earned ? 1.1 : 1 }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        badge.earned
                          ? `${isDark ? 'border-primary-400/30 bg-primary-600/8' : 'border-primary-300 bg-primary-100/50'} cursor-pointer`
                          : `${isDark ? 'border-neutral-800 bg-neutral-900/50 opacity-40' : 'border-neutral-200 bg-neutral-50 opacity-50'}`
                      }`}
                    >
                      <div className={`text-xl ${badge.earned ? 'drop-shadow-[0_0_3px_rgba(0,0,0,0.3)]' : ''}`}>
                        {badge.icon}
                      </div>
                      <span className={`text-[9px] font-bold text-center leading-tight ${
                        badge.earned ? `${isDark ? 'text-primary-400' : 'text-primary-600'}` : `${isDark ? 'text-neutral-600' : 'text-neutral-400'}`
                      }`}>
                        {badge.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* GitHub-Style Activity Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-neutral-900'} mb-0.5`}>Activity</h3>
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Last 12 weeks</p>
                  </div>
                </div>
                
                {/* Heatmap Grid */}
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={dayIndex}
                          whileHover={{ scale: 1.2 }}
                          className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.level)} cursor-pointer relative group`}
                          title={`${day.date}: ${day.hours}h, ${day.projects} projects, ${day.tasks} tasks`}
                        >
                          {/* Tooltip */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 ${isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-900 text-white'} text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg`}>
                            <div className="font-bold">{day.date}</div>
                            <div className={isDark ? 'text-neutral-400' : 'text-neutral-300'}>{day.hours}h • {day.projects} projects • {day.tasks} tasks</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div key={level} className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`} />
                    ))}
                  </div>
                  <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>More</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-neutral-900'} mb-1`}>Global Leaderboard</h3>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Top coders this week</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'} font-bold text-sm`}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-2">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    user.isMe
                      ? `${isDark ? 'bg-primary-600/10 border-primary-600/25' : 'bg-primary-100/50 border-primary-200'}`
                      : `${isDark ? 'bg-neutral-800/50 border-neutral-700/50 hover:border-neutral-600' : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`
                  }`}
                >
                  <div className={`w-7 text-center font-black font-mono flex-shrink-0 ${
                    user.rank === 1 ? 'text-amber-500' :
                    user.rank === 2 ? 'text-slate-400' :
                    user.rank === 3 ? 'text-amber-700' :
                    `${isDark ? 'text-neutral-500' : 'text-neutral-400'}`
                  }`}>
                    {user.rank}
                  </div>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center font-bold text-xs flex-shrink-0 text-white`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{user.name}</div>
                    <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{user.level}</div>
                  </div>
                  <div className={`text-sm font-black ${isDark ? 'text-primary-400' : 'text-primary-600'} font-mono`}>{user.xp.toLocaleString()} XP</div>
                  <div className="w-20 flex-shrink-0">
                    <div className={`h-1 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${user.progress}%` }}
                      />
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
