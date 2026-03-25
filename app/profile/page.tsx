'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/components/ThemeProvider';
import { 
  ArrowLeft, Edit3, Save, X, Trophy, Star, Flame, Crown, 
  Award, Target, Zap, Code2, GitBranch, Calendar, MapPin,
  Link as LinkIcon, Globe,
  TrendingUp, Users, Heart, Share2, Settings, Camera,
  CheckCircle2, Lock, Medal, Sparkles, Rocket, Brain,
  Coffee, Book, Terminal, Package
} from 'lucide-react';

type ProfileRow = {
  id: string;
  full_name: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { themeId } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');
  
  const [profileRow, setProfileRow] = useState<ProfileRow | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    joinedDate: '',
    rank: 'Diamond',
    level: 12,
    xp: 3840,
    coins: 1250,
    streak: 7
  });

  const [editedName, setEditedName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const avatarOptions = useMemo(() => {
    const maleSeeds = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth'];
    const male = maleSeeds.map((seed, i) => ({ 
      id: `male-${i + 1}`, 
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`, 
      category: 'male'
    }));
    
    const femaleSeeds = ['Sarah', 'Jessica', 'Emily', 'Ashley', 'Michelle', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela'];
    const female = femaleSeeds.map((seed, i) => ({ 
      id: `female-${i + 1}`, 
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`, 
      category: 'female'
    }));
    
    const robotSeeds = ['Felix', 'Aneka', 'Tigger', 'Buster', 'Midnight', 'Shadow', 'Nova', 'Spark', 'Bolt', 'Circuit', 'Pixel', 'Byte', 'Chip', 'Core', 'Data', 'Echo', 'Flux', 'Grid', 'Hex', 'Ion'];
    const robot = robotSeeds.map((seed, i) => ({ 
      id: `robot-${i + 1}`, 
      url: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`, 
      category: 'robot'
    }));
    
    const hackerSeeds = ['Neo', 'Trinity', 'Morpheus', 'Cipher', 'Tank', 'Dozer', 'Mouse', 'Apoc', 'Switch', 'Ghost', 'Niobe', 'Link', 'Zee', 'Seraph', 'Oracle', 'Keymaker', 'Architect', 'Merovingian', 'Persephone', 'Trainman'];
    const hacker = hackerSeeds.map((seed, i) => ({ 
      id: `hacker-${i + 1}`, 
      url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`, 
      category: 'hacker'
    }));
    
    const geometricSeeds = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Omega'];
    const geometric = geometricSeeds.map((seed, i) => ({ 
      id: `geometric-${i + 1}`, 
      url: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`, 
      category: 'geometric'
    }));
    
    return [...male, ...female, ...robot, ...hacker, ...geometric];
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }

      const user = userData.user;
      if (!user) {
        router.push('/');
        return;
      }

      const { data: row, error: rowError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (rowError) {
        setError(rowError.message);
        setLoading(false);
        return;
      }

      const resolvedUsername =
        (typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : null) ||
        (user.email ? user.email.split('@')[0] : 'user');

      const resolvedName =
        row?.full_name ||
        (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null) ||
        (typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null) ||
        resolvedUsername;

      const resolvedBio =
        (typeof user.user_metadata?.bio === 'string' ? user.user_metadata.bio : '') || '';

      const resolvedAvatar =
        (typeof user.user_metadata?.avatar === 'string' ? user.user_metadata.avatar : '') || 'male-1';

      const joinedDate = user.created_at
        ? new Date(user.created_at).toLocaleString(undefined, { month: 'long', year: 'numeric' })
        : '';

      setProfileRow(row ?? null);
      setSelectedAvatar(resolvedAvatar);
      setProfile((prev) => ({
        ...prev,
        name: resolvedName,
        username: `@${resolvedUsername}`,
        bio: resolvedBio,
        joinedDate
      }));

      setEditedName(resolvedName);
      setEditedUsername(resolvedUsername);
      setEditedBio(resolvedBio);
      setLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const stats = [
    { label: 'Total XP', value: '3,840', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
    { label: 'Challenges Solved', value: '47', icon: <Target className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Day Streak', value: '7', icon: <Flame className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
    { label: 'Rank', value: 'Diamond', icon: <Crown className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' }
  ];

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

  const recentActivity = [
    { id: 1, type: 'challenge', title: 'Completed "Binary Search Tree"', xp: 100, time: '2 hours ago', icon: '🎯' },
    { id: 2, type: 'badge', title: 'Earned "Speed Demon" badge', time: '5 hours ago', icon: '⚡' },
    { id: 3, type: 'level', title: 'Reached Level 12', xp: 500, time: 'Yesterday', icon: '⬆️' },
    { id: 4, type: 'challenge', title: 'Completed "Array Manipulation"', xp: 75, time: 'Yesterday', icon: '🎯' },
    { id: 5, type: 'streak', title: '7 day streak milestone!', time: '2 days ago', icon: '🔥' }
  ];

  const skills = [
    { name: 'JavaScript', level: 85, color: 'from-yellow-500 to-orange-500' },
    { name: 'Python', level: 70, color: 'from-blue-500 to-cyan-500' },
    { name: 'React', level: 90, color: 'from-cyan-500 to-blue-500' },
    { name: 'Node.js', level: 75, color: 'from-green-500 to-emerald-500' },
    { name: 'Algorithms', level: 65, color: 'from-purple-500 to-pink-500' }
  ];

  const handleSaveProfile = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    setError(null);

    const username = editedUsername.trim().replace(/^@+/, '');
    const full_name = editedName.trim();
    const bio = editedBio.trim();

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const user = userData.user;
      if (!user) {
        router.push('/');
        return;
      }

      if (profileRow?.id) {
        const { error: updateError, data: updated } = await supabase
          .from('profiles')
          .update({
            full_name: full_name || null,
          })
          .eq('id', user.id)
          .select('id, full_name')
          .maybeSingle();

        if (updateError) throw updateError;
        if (updated) setProfileRow(updated);
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: { bio, username, avatar: selectedAvatar },
      });
      if (metaError) throw metaError;

      const appliedUsername =
        username ||
        (editedUsername.trim().replace(/^@+/, '') ?? 'user');
      const appliedName = full_name || profileRow?.full_name || profile.name;

      setProfile((prev) => ({
        ...prev,
        name: appliedName,
        username: `@${appliedUsername}`,
        bio,
      }));
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save profile');
    } finally {
      setSaveLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-xl font-bold text-neutral-300">
          Loading profile...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--cr-primary)/0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgb(var(--cr-secondary)/0.15),transparent_50%)]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-[rgb(var(--cr-primary))]/40 rounded-full blur-[180px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[rgb(var(--cr-secondary))]/40 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

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
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-400/20 text-red-200 rounded-2xl px-5 py-4">
            <div className="font-bold mb-1">Profile error</div>
            <div className="text-sm text-red-200/90">{error}</div>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative w-32 h-32 rounded-2xl bg-neutral-800 border-2 border-white/10 overflow-hidden">
                <img 
                  src={avatarOptions.find(a => a.id === selectedAvatar)?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'} 
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAvatarPicker(true)} className="absolute bottom-2 right-2 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[rgb(var(--cr-primary))]/50"
                        placeholder="Full name"
                      />
                      <input
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[rgb(var(--cr-primary))]/50"
                        placeholder="Username"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black mb-1">{profile.name || 'Your Profile'}</h2>
                      <p className="text-neutral-400 text-lg mb-3">{profile.username || '@user'}</p>
                    </>
                  )}
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgb(var(--cr-primary))]/20 to-[rgb(var(--cr-accent))]/20 border border-[rgb(var(--cr-primary))]/30 rounded-xl">
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

              <div className="mb-6">
                {isEditing ? (
                  <div>
                    <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[rgb(var(--cr-primary))]/50 resize-none" rows={3} placeholder="Write your bio..." />
                    <div className="flex gap-2 mt-3">
                      <button disabled={saveLoading} onClick={handleSaveProfile} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgb(var(--cr-primary))] to-[rgb(var(--cr-secondary))] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        <Save className="w-4 h-4" />
                        {saveLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(profile.name);
                          setEditedUsername(profile.username.replace(/^@+/, ''));
                          setEditedBio(profile.bio);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-300 leading-relaxed">{profile.bio}</p>
                )}
              </div>

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
                  <a href={`https://${profile.website}`} className="hover:text-[rgb(var(--cr-primary))] transition-colors">{profile.website}</a>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {profile.twitter && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://twitter.com/${profile.twitter}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 rounded-xl flex items-center justify-center transition-all">
                    <LinkIcon className="w-4 h-4" />
                  </motion.a>
                )}
                {profile.github && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://github.com/${profile.github}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-[rgb(var(--cr-primary))]/20 border border-white/10 hover:border-[rgb(var(--cr-primary))]/30 rounded-xl flex items-center justify-center transition-all">
                    <LinkIcon className="w-4 h-4" />
                  </motion.a>
                )}
                {profile.linkedin && (
                  <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" className="w-10 h-10 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-600/30 rounded-xl flex items-center justify-center transition-all">
                    <LinkIcon className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

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

        <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
            { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
            { id: 'activity', label: 'Activity', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(tab.id as any)} className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'}`}>
              {activeTab === tab.id && (
                <>
                  <motion.div layoutId="activeProfileTab" className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--cr-primary))] to-[rgb(var(--cr-secondary))] rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--cr-primary))] to-[rgb(var(--cr-secondary))] rounded-xl blur-xl opacity-50" />
                </>
              )}
              <span className="relative flex items-center gap-2">{tab.icon}{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[rgb(var(--cr-primary))]" />
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

              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Recent Achievements
                  </h3>
                  <button onClick={() => setActiveTab('achievements')} className="text-sm text-[rgb(var(--cr-primary))] hover:text-[rgb(var(--cr-secondary))] font-semibold">View All →</button>
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
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[rgb(var(--cr-primary))]/20 to-[rgb(var(--cr-secondary))]/20 border border-[rgb(var(--cr-primary))]/30 rounded-lg">
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

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-neutral-900 to-black border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white mb-2">Choose Avatar</h3>
                <p className="text-neutral-400 text-sm">Select from {avatarOptions.length} available avatars</p>
              </div>

              <div className="max-h-[500px] overflow-y-auto mb-6 px-2">
                {[
                  { key: 'male', label: 'Male Avatars', icon: '👨' },
                  { key: 'female', label: 'Female Avatars', icon: '👩' },
                  { key: 'robot', label: 'Robot Avatars', icon: '🤖' },
                  { key: 'hacker', label: 'Hacker / Dev Avatars', icon: '💻' },
                  { key: 'geometric', label: 'Geometric Avatars', icon: '🔷' }
                ].map((section) => {
                  const categoryAvatars = avatarOptions.filter(a => a.category === section.key);
                  return (
                    <div key={section.key} className="mb-8 last:mb-0">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                        <span className="text-2xl">{section.icon}</span>
                        <h4 className="text-lg font-bold text-white">{section.label}</h4>
                        <span className="text-sm text-neutral-500 ml-auto">{categoryAvatars.length} options</span>
                      </div>
                      <div className="grid grid-cols-10 gap-2.5">
                        {categoryAvatars.map((avatar) => (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatar(avatar.id)}
                            className="relative group"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-40 transition-all" />
                            <div className={`relative w-full aspect-square rounded-lg bg-neutral-800 overflow-hidden border transition-all ${
                              selectedAvatar === avatar.id
                                ? 'border-2 border-white shadow-lg shadow-white/30 ring-2 ring-purple-500/50'
                                : 'border border-white/10 hover:border-white/30'
                            }`}>
                              <img 
                                src={avatar.url} 
                                alt={avatar.id}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {selectedAvatar === avatar.id && (
                              <motion.div
                                layoutId="selectedAvatarCheck"
                                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-lg"
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.updateUser({
                        data: { avatar: selectedAvatar },
                      });
                      if (error) throw error;
                      setShowAvatarPicker(false);
                    } catch (e: any) {
                      setError(e?.message ?? 'Failed to update avatar');
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[rgb(var(--cr-primary))] to-[rgb(var(--cr-secondary))] text-white rounded-xl font-bold shadow-2xl shadow-[rgb(var(--cr-primary))]/30 hover:shadow-[rgb(var(--cr-primary))]/50 hover:scale-105 transition-all"
                >
                  Save Avatar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}