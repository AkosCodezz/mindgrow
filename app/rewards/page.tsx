'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Sparkles, Crown, Zap, Star, Lock, CheckCircle2,
  Gift, Palette, Users, ArrowLeft, Flame, ShoppingCart,
  TrendingUp, Award, Package, Coins, ChevronRight
} from 'lucide-react';
import { useTheme, type ThemeId } from '@/components/ThemeProvider';

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'themes' | 'boosts' | 'avatars' | 'exclusive'>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const { themes, owned, coins, buyTheme, setTheme } = useTheme();

  const STORAGE_REWARDS_OWNED = 'cr_rewards_owned';
  const [ownedRewards, setOwnedRewards] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_REWARDS_OWNED);
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setOwnedRewards(Array.isArray(parsed) ? parsed : []);
    } catch {
      setOwnedRewards([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REWARDS_OWNED, JSON.stringify(ownedRewards));
    } catch {
      // ignore
    }
  }, [ownedRewards]);

  type RewardCategory = 'themes' | 'boosts' | 'avatars' | 'exclusive';
  type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';
  type Reward =
    | {
        kind: 'theme';
        themeId: ThemeId;
        id: string;
        name: string;
        description: string;
        icon: string;
        cost: number;
        category: 'themes';
        rarity: RewardRarity;
        preview?: string;
        features?: string[];
      }
    | {
        kind: 'item';
        id: number;
        name: string;
        description: string;
        icon: string;
        cost: number;
        category: RewardCategory;
        rarity: RewardRarity;
        preview?: string;
        duration?: string;
        features?: string[];
      };

  const themeMeta: Partial<Record<ThemeId, { icon: string; rarity: RewardRarity; preview: string; features: string[]; description: string }>> = {
    neon: {
      icon: '🌃',
      rarity: 'rare',
      preview: 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 60%, #F472B6 100%)',
      features: ['Neon borders', 'Glow accents', 'Dark mode optimized'],
      description: 'Electric cyberpunk theme with glowing neon accents',
    },
    ocean: {
      icon: '🌊',
      rarity: 'common',
      preview: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 60%, #34D399 100%)',
      features: ['Calming blues', 'Focus-friendly', 'Clean contrast'],
      description: 'Calm blue gradient perfect for focus',
    },
    sunset: {
      icon: '🌅',
      rarity: 'rare',
      preview: 'linear-gradient(135deg, #F97316 0%, #FB7185 55%, #FBBF24 100%)',
      features: ['Warm tones', 'Energetic vibe', 'Bold accents'],
      description: 'Warm orange and pink paradise theme',
    },
    matrix: {
      icon: '💚',
      rarity: 'epic',
      preview: 'linear-gradient(135deg, #22C55E 0%, #16A34A 55%, #A3E635 100%)',
      features: ['Terminal vibes', 'Green glow', 'Hacker aesthetic'],
      description: 'Classic green terminal hacker aesthetic',
    },
    dracula: {
      icon: '🧛',
      rarity: 'epic',
      preview: 'linear-gradient(135deg, #BD93F9 0%, #8BE9FD 55%, #FF79C6 100%)',
      features: ['Deep contrast', 'Purple/cyan pop', 'Night-friendly'],
      description: 'A legendary night palette with punchy accents',
    },
    nord: {
      icon: '❄️',
      rarity: 'rare',
      preview: 'linear-gradient(135deg, #88C0D0 0%, #81A1C1 55%, #A3BE8C 100%)',
      features: ['Cool neutrals', 'Soft contrast', 'Clean & calm'],
      description: 'Nord-inspired icy calm with frosty accents',
    },
    solarized: {
      icon: '🌗',
      rarity: 'rare',
      preview: 'linear-gradient(135deg, #268BD2 0%, #2AA198 55%, #CB4B16 100%)',
      features: ['Solarized vibes', 'Readable contrast', 'Warm highlight'],
      description: 'Classic Solarized-inspired dusk palette',
    },
    monokai: {
      icon: '🧪',
      rarity: 'epic',
      preview: 'linear-gradient(135deg, #A6E22E 0%, #66D9EF 55%, #F92672 100%)',
      features: ['Editor-core vibe', 'High energy', 'Bold contrast'],
      description: 'Monokai-inspired pro palette',
    },
    rosepine: {
      icon: '🌹',
      rarity: 'epic',
      preview: 'linear-gradient(135deg, #EBBCBA 0%, #9CCFD8 55%, #C4A7E7 100%)',
      features: ['Rosy warmth', 'Soft neon', 'Cozy dark'],
      description: 'Cozy Rosé Pine inspired colors',
    },
  };

  const themeRewards: Reward[] = useMemo(() => {
    return themes
      .filter((t) => t.id !== 'default')
      .map((t) => {
        const meta = themeMeta[t.id] ?? {
          icon: '🎨',
          rarity: 'rare' as const,
          preview: `linear-gradient(135deg, ${t.vars.primary} 0%, ${t.vars.secondary} 55%, ${t.vars.accent} 100%)`,
          features: ['Global theme', 'Instant apply', 'Cross-site colors'],
          description: 'A new color theme for your whole experience',
        };

        return {
          kind: 'theme' as const,
          themeId: t.id,
          id: `theme:${t.id}`,
          name: t.name,
          description: meta.description,
          icon: meta.icon,
          cost: t.price,
          category: 'themes' as const,
          rarity: meta.rarity,
          preview: meta.preview,
          features: meta.features,
        };
      });
  }, [themes]);

  const itemRewards: Reward[] = useMemo(
    () => [
      // Boosts
      { kind: 'item', id: 5, name: '2x XP Boost', description: 'Double all XP earned for 24 hours', icon: '⚡', cost: 800, category: 'boosts', rarity: 'epic', duration: '24h', features: ['2x XP multiplier', 'All activities', 'Stackable'] },
      { kind: 'item', id: 6, name: 'Streak Shield', description: 'Protect your streak for 3 days if you miss', icon: '🛡️', cost: 300, category: 'boosts', rarity: 'common', duration: '3 days', features: ['Auto-protection', 'Peace of mind', 'One-time use'] },
      { kind: 'item', id: 7, name: 'Challenge Skip', description: 'Skip any hard challenge without losing progress', icon: '⏭️', cost: 200, category: 'boosts', rarity: 'common', duration: 'One-time', features: ['Instant skip', 'No penalties', 'Smart choice'] },
      { kind: 'item', id: 8, name: 'Coin Magnet', description: 'Triple coin earnings for the entire weekend', icon: '💰', cost: 1000, category: 'boosts', rarity: 'legendary', duration: 'Weekend', features: ['3x coins', 'Friday-Sunday', 'Limited time'] },

      // Avatars
      { kind: 'item', id: 9, name: 'Cyber Samurai', description: 'Futuristic warrior with neon katana', icon: '🥷', cost: 700, category: 'avatars', rarity: 'epic', features: ['Animated', 'Unique design', 'Flex on friends'] },
      { kind: 'item', id: 10, name: 'Code Wizard', description: 'Master of algorithms and magic spells', icon: '🧙‍♂️', cost: 650, category: 'avatars', rarity: 'rare', features: ['Mystical aura', 'Rare drop', 'Collector item'] },
      { kind: 'item', id: 11, name: 'Space Dev', description: 'Coding among the stars', icon: '👨‍🚀', cost: 750, category: 'avatars', rarity: 'epic', features: ['Cosmic vibes', 'Animated', 'Out of this world'] },
      { kind: 'item', id: 12, name: 'Pixel Legend', description: 'Retro 8-bit nostalgia', icon: '👾', cost: 500, category: 'avatars', rarity: 'common', features: ['Retro style', 'Classic gaming', 'Timeless'] },

      // Exclusive
      { kind: 'item', id: 13, name: 'Golden Crown', description: 'Exclusive gold frame for your profile', icon: '👑', cost: 2000, category: 'exclusive', rarity: 'legendary', features: ['Ultra rare', 'Permanent', 'Show off'] },
      { kind: 'item', id: 14, name: 'RGB Username', description: 'Rainbow animated username color', icon: '🌈', cost: 1500, category: 'exclusive', rarity: 'epic', features: ['Custom colors', 'Animated', 'Stand out'] },
      { kind: 'item', id: 15, name: 'Profile Banner', description: 'Custom banner image on your profile', icon: '🖼️', cost: 1200, category: 'exclusive', rarity: 'rare', features: ['Upload image', 'Personalize', 'Premium feel'] },
      { kind: 'item', id: 16, name: 'VIP Club Access', description: 'Join the exclusive VIP developer lounge', icon: '💎', cost: 3000, category: 'exclusive', rarity: 'legendary', features: ['Private community', 'Priority support', 'Lifetime access'] },
    ],
    []
  );

  const rewards: Reward[] = useMemo(() => [...themeRewards, ...itemRewards], [themeRewards, itemRewards]);

  const rewardCategories = useMemo(() => {
    const countBy: Record<string, number> = {
      all: rewards.length,
      themes: rewards.filter((r) => r.category === 'themes').length,
      boosts: rewards.filter((r) => r.category === 'boosts').length,
      avatars: rewards.filter((r) => r.category === 'avatars').length,
      exclusive: rewards.filter((r) => r.category === 'exclusive').length,
    };
    return [
      { id: 'all', label: 'All', icon: <Gift className="w-4 h-4" />, count: countBy.all },
      { id: 'themes', label: 'Themes', icon: <Palette className="w-4 h-4" />, count: countBy.themes },
      { id: 'boosts', label: 'Boosts', icon: <Zap className="w-4 h-4" />, count: countBy.boosts },
      { id: 'avatars', label: 'Avatars', icon: <Users className="w-4 h-4" />, count: countBy.avatars },
      { id: 'exclusive', label: 'VIP', icon: <Crown className="w-4 h-4" />, count: countBy.exclusive },
    ] as const;
  }, [rewards]);

  const filteredRewards = activeTab === 'all' ? rewards : rewards.filter(r => r.category === activeTab);

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'from-slate-400 to-slate-600';
      case 'rare': return 'from-blue-400 to-cyan-600';
      case 'epic': return 'from-primary-400 to-accent-600';
      case 'legendary': return 'from-amber-400 to-orange-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-slate-500/20 text-slate-300 border-slate-400/40 shadow-slate-500/20',
      rare: 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-blue-500/30',
      epic: 'bg-primary-500/20 text-primary-200 border-primary-400/40 shadow-primary-500/30',
      legendary: 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-amber-500/40'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const isRewardOwned = (reward: Reward) => {
    if (reward.kind === 'theme') return owned.has(reward.themeId);
    return ownedRewards.includes(reward.id);
  };

  const canAffordReward = (reward: Reward) => coins >= reward.cost;

  const handlePurchaseClick = (reward: Reward) => {
    if (isRewardOwned(reward)) return;
    if (!canAffordReward(reward)) return;
    setSelectedReward(reward);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedReward) return;

    if (selectedReward.kind === 'theme') {
      const res = buyTheme(selectedReward.themeId);
      if (!res.ok) {
        setToast(res.reason);
        window.setTimeout(() => setToast(null), 1600);
        return;
      }
      setTheme(selectedReward.themeId);
      setToast('Theme purchased & applied');
    } else {
      setOwnedRewards((prev) => (prev.includes(selectedReward.id) ? prev : [...prev, selectedReward.id]));
      setToast('Purchased');
    }

    setShowPurchaseModal(false);
    setSelectedReward(null);
    window.setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
      {/* ULTRA Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--cr-primary)/0.16),transparent_55%),radial-gradient(circle_at_80%_20%,rgb(var(--cr-secondary)/0.16),transparent_55%),radial-gradient(circle_at_20%_80%,rgb(var(--cr-accent)/0.14),transparent_55%)]" />
        
        {/* Animated orbs with enhanced glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-primary-600/35 rounded-full blur-[180px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-600/30 rounded-full blur-[180px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-accent-600/30 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-cyan-600/40 rounded-full blur-[150px]" 
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
          <svg className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)"/>
          </svg>
        </div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Header with glass morphism */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-6">
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
                <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 bg-clip-text text-transparent mb-1 flex items-center gap-3 drop-shadow-2xl">
                  Rewards Shop 
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-7 h-7 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                  </motion.div>
                </h1>
                <p className="text-sm text-neutral-400 font-medium">Unlock exclusive items and boost your power</p>
              </div>
            </div>
            
            {/* ULTRA Coin Balance */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-600/20 border border-amber-500/30 rounded-2xl px-7 py-4 shadow-2xl shadow-amber-500/20 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10 animate-pulse" />
              <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-2xl blur-xl opacity-30" />
              <div className="relative flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                >
                  💰
                </motion.div>
                <div>
                  <div className="text-[11px] text-amber-400/80 font-bold uppercase tracking-widest mb-0.5">Your Balance</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent font-mono flex items-center gap-2 drop-shadow-lg">
                    {coins.toLocaleString()}
                    <Coins className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ULTRA Category Tabs */}
          <div className="relative flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/30">
            {rewardCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(cat.id as any)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === cat.id
                    ? 'text-white shadow-2xl'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                {activeTab === cat.id && (
                  <>
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 rounded-xl" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 rounded-xl blur-xl opacity-50" />
                  </>
                )}
                <span className="relative flex items-center gap-2 z-10">
                  {cat.icon}
                  {cat.label}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === cat.id ? 'bg-white/20' : 'bg-white/10'}`}>
                    {cat.count}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredRewards.map((reward, index) => {
              const isOwned = isRewardOwned(reward);
              const canAfford = canAffordReward(reward);

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ delay: Math.min(index * 0.01, 0.15), type: "spring", stiffness: 280, damping: 26 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="relative group"
                >
                  {/* ULTRA Rarity Glow */}
                  <div className={`pointer-events-none absolute -inset-2 bg-gradient-to-br ${getRarityColor(reward.rarity)} opacity-0 group-hover:opacity-50 rounded-3xl blur-2xl transition-all duration-500`} />
                  
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                          {reward.icon}
                        </motion.div>
                        {isOwned && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-lg ${getRarityBadge(reward.rarity)}`}>
                        {reward.rarity}
                      </div>
                    </div>

                    <h3 className="font-black text-xl text-white mb-2 leading-tight">
                      {reward.name}
                    </h3>

                    {/* Theme Preview with glow */}
                    {reward.category === 'themes' && reward.preview && (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative mb-5 h-28 rounded-xl overflow-hidden border border-white/20 shadow-2xl"
                      >
                        <div style={{ background: reward.preview }} className="w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </motion.div>
                    )}

                    <p className="text-sm text-neutral-300 mb-5 leading-relaxed flex-1">
                      {reward.description}
                    </p>

                    {/* Features with icons */}
                    {reward.features && (
                      <div className="space-y-2 mb-5">
                        {reward.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-400">
                            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Duration badge */}
                    {reward.duration && (
                      <div className="flex items-center gap-2.5 mb-5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-orange-300">
                          {reward.duration}
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span className="text-2xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">
                          {reward.cost}
                        </span>
                      </div>
                      
                      {isOwned ? (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 shadow-lg shadow-green-500/20">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-bold text-green-400">Owned</span>
                        </div>
                      ) : reward.kind === 'theme' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePurchaseClick(reward)}
                          disabled={!canAfford}
                          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white rounded-xl text-sm font-bold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {canAfford ? 'Buy Theme' : 'Locked'}
                        </motion.button>
                      ) : canAfford ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePurchaseClick(reward)}
                          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white rounded-xl text-sm font-bold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 opacity-40">
                          <Lock className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs font-bold text-neutral-500">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ULTRA Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-neutral-900 to-black border border-white/20 rounded-3xl p-10 max-w-md w-full shadow-2xl"
            >
              <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl blur-2xl opacity-20" />
              
              <div className="relative text-center mb-8">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-6 drop-shadow-2xl"
                >
                  {selectedReward.icon}
                </motion.div>
                <h3 className="text-3xl font-black text-white mb-3">{selectedReward.name}</h3>
                <p className="text-neutral-400">{selectedReward.description}</p>
              </div>

              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-400 font-medium">Cost:</span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-2xl font-black text-amber-400 font-mono">{selectedReward.cost}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-medium">Your balance:</span>
                  <span className="text-xl font-bold text-white font-mono">{coins.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white rounded-xl font-bold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 text-sm font-bold text-white shadow-2xl">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}