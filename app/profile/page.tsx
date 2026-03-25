'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Edit3, Save, X, Trophy, Star, Flame, Crown, 
  Award, Target, Zap, Code2, GitBranch, Calendar, MapPin,
  Link as LinkIcon, Twitter, Github, Linkedin, Globe,
  TrendingUp, Users, Heart, Share2, Settings, Camera,
  CheckCircle2, Lock, Medal, Sparkles, Rocket, Brain,
  Coffee, Book, Terminal, Package
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');
  
  // User data
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    username: '@alexcodes',
    bio: 'Full-stack developer | Competitive coder | Coffee enthusiast ☕ | Building the future one line at a time 🚀',
    location: 'San Francisco, CA',
    website: 'alexchen.dev',
    twitter: 'alexcodes',
    github: 'alexchen',
    linkedin: 'alexchen',
    joinedDate: 'January 2024',
    rank: 'Diamond',
    level: 12,
    xp: 3840,
    coins: 1250,
    streak: 7
  });

  const [editedBio, setEditedBio] = useState(profile.bio);

  // Stats
  const stats = [
    { label: 'Total XP', value: '3,840', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
    { label: 'Challenges Solved', value: '47', icon: <Target className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Day Streak', value: '7', icon: <Flame className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
    { label: 'Rank', value: 'Diamond', icon: <Crown className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' }
  ];

  // Achievements/Badges
  const achievements = [
    { 
      id: 1, 
      name: 'First Steps', 
      description: 'Completed your first challenge',
      icon: '🎯', 
      unlocked: true, 
      unlockedAt: '2024-01-15',
      rarity: 'common',
      progress: 100
    },
    { 
      id: 2, 
      name: 'Code Warrior', 
      description: 'Solved 25 challenges',
      icon: '⚔️', 
      unlocked: true, 
      unlockedAt: '2024-02-10',
      rarity: 'rare',
      progress: 100
    },
    { 
      id: 3, 
      name: 'Speed Demon', 
      description: 'Completed a challenge in under 5 minutes',
      icon: '⚡', 
      unlocked: true, 
      unlockedAt: '2024-02-20',
      rarity: 'epic',
      progress: 100
    },
    { 
      id: 4, 
      name: 'Week Warrior', 
      description: 'Code for 7 days straight',
      icon: '🔥', 
      unlocked: true, 
      unlockedAt: '2024-03-01',
      rarity: 'rare',
      progress: 100
    },
    { 
      id: 5, 
      name: 'Perfect Month', 
      description: 'Code every day for 30 days',
      icon: '📅', 
      unlocked: false, 
      rarity: 'epic',
      progress: 70
    },
    { 
      id: 6, 
      name: 'Master Coder', 
      description: 'Reach level 20',
      icon: '👑', 
      unlocked: false, 
      rarity: 'legendary',
      progress: 60
    },
    { 
      id: 7, 
      name: 'Team Player', 
      description: 'Help 10 community members',
      icon: '🤝', 
      unlocked: false, 
      rarity: 'rare',
      progress: 30
    },
    { 
      id: 8, 
      name: 'Century Club', 
      description: 'Solve 100 challenges',
      icon: '💯', 
      unlocked: false, 
      rarity: 'legendary',
      progress: 47
    }
  ];

  // Recent Activity
  const recentActivity = [
    { id: 1, type: 'challenge', title: 'Completed "Binary Search Tree"', xp: 100, time: '2 hours ago', icon: '🎯' },
    { id: 2, type: 'badge', title: 'Earned "Speed Demon" badge', time: '5 hours ago', icon: '⚡' },
    { id: 3, type: 'level', title: 'Reached Level 12', xp: 500, time: 'Yesterday', icon: '⬆️' },
    { id: 4, type: 'challenge', title: 'Completed "Array Manipulation"', xp: 75, time: 'Yesterday', icon: '🎯' },
    { id: 5, type: 'streak', title: '7 day streak milestone!', time: '2 days ago', icon: '🔥' }
  ];

  // Skills
  const skills = [
    { name: 'JavaScript', level: 85, color: 'from-yellow-500 to-orange-500' },
    { name: 'Python', level: 70, color: 'from-blue-500 to-cyan-500' },
    { name: 'React', level: 90, color: 'from-cyan-500 to-blue-500' },
    { name: 'Node.js', level: 75, color: 'from-green-500 to-emerald-500' },
    { name: 'Algorithms', level: 65, color: 'from-purple-500 to-pink-500' }
  ];

  const handleSaveBio = () => {
    setProfile({ ...profile, bio: editedBio });
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'from-slate-400 to-slate-600';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-amber-400 to-orange-500';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-slate-500/20 text-slate-300 border-slate-400/40',
      rare: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      epic: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      legendary: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[180px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/40 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard')} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-black">Profile</h1>
                <p className="text-sm text-neutral-400">Manage your developer profile</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
              <Share2 className="w-4 h-4" />
              Share Profile
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center text-5xl font-black text-white">
                AC
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute bottom-2 right-2 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black mb-1">{profile.name}</h2>
                  <p className="text-neutral-400 text-lg mb-3">{profile.username}</p>
                  
                  {/* Rank Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-amber-400">{profile.rank} Rank</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-white">Level {profile.level}</span>
                  </div>
                </div>
                
                {!isEditing && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                )}
              </div>

              {/* Bio */}
              <div className="mb-6">
                {isEditing ? (
                  <div>
                    <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 resize-none" rows={3} placeholder="Write your bio..." />
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleSaveBio} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button onClick={() => { setIsEditing(false); setEditedBio(profile.bio); }} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-300 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {profile.joinedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${profile.website}`} className="hover:text-purple-400 transition-colors">{profile.website}</a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {profile.twitter && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://twitter.com/${profile.twitter}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 rounded-xl flex items-center justify-center transition-all">
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                )}
                {profile.github && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://github.com/${profile.github}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 rounded-xl flex items-center justify-center transition-all">
                    <Github className="w-4 h-4" />
                  </motion.a>
                )}
                {profile.linkedin && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-600/30 rounded-xl flex items-center justify-center transition-all">
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -4, scale: 1.02 }} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all`} />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-sm text-neutral-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
            { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
            { id: 'activity', label: 'Activity', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(tab.id as any)} className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'}`}>
              {activeTab === tab.id && (
                <>
                  <motion.div layoutId="activeProfileTab" className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-xl opacity-50" />
                </>
              )}
              <span className="relative flex items-center gap-2">{tab.icon}{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Skills */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  Skills & Expertise
                </h3>
                <div className="space-y-4">
                  {skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-sm text-neutral-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full bg-gradient-to-r ${skill.color} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Achievements Preview */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Recent Achievements
                  </h3>
                  <button onClick={() => setActiveTab('achievements')} className="text-sm text-purple-400 hover:text-purple-300 font-semibold">View All →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.filter(a => a.unlocked).slice(0, 4).map((badge) => (
                    <motion.div key={badge.id} whileHover={{ y: -4, scale: 1.05 }} className="relative group">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${getRarityColor(badge.rarity)} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all`} />
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-white/20 transition-all">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <p className="text-xs font-bold text-white">{badge.name}</p>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block border ${getRarityBadge(badge.rarity)}`}>
                          {badge.rarity}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-black mb-2">Achievements & Badges</h3>
                  <p className="text-neutral-400">
                    {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((badge) => (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: badge.id * 0.05 }} className="relative group">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${getRarityColor(badge.rarity)} rounded-2xl blur opacity-${badge.unlocked ? '30' : '0'} group-hover:opacity-50 transition-all`} />
                      <div className={`relative bg-black/60 backdrop-blur-xl border ${badge.unlocked ? 'border-white/20' : 'border-white/10'} rounded-2xl p-6 ${!badge.unlocked && 'opacity-60'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-5xl">{badge.icon}</div>
                            {badge.unlocked && (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getRarityBadge(badge.rarity)}`}>
                            {badge.rarity}
                          </div>
                        </div>
                        <h4 className="text-xl font-black mb-2">{badge.name}</h4>
                        <p className="text-sm text-neutral-400 mb-4">{badge.description}</p>
                        
                        {badge.unlocked ? (
                          <div className="flex items-center gap-2 text-xs text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Unlocked {badge.unlockedAt}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-neutral-400">Progress</span>
                              <span className="text-white font-bold">{badge.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${getRarityColor(badge.rarity)} rounded-full`} style={{ width: `${badge.progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-2xl font-black mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: activity.id * 0.05 }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all">
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{activity.title}</p>
                        <p className="text-sm text-neutral-400">{activity.time}</p>
                      </div>
                      {activity.xp && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-amber-400">+{activity.xp} XP</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}