'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Crown, Lock, Palette, Sparkles, Trophy } from 'lucide-react';
import { useTheme, type ThemeId } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { themeId, themes, owned, coins, setTheme, buyTheme, addCoins } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'shop'>('appearance');
  const [toast, setToast] = useState<string | null>(null);

  const ownedList = useMemo(() => themes.filter((t) => owned.has(t.id)), [themes, owned]);
  const shopList = useMemo(() => themes.filter((t) => t.id !== 'default'), [themes]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const handleApply = (id: ThemeId) => {
    setTheme(id);
    showToast('Theme applied');
  };

  const handleBuy = (id: ThemeId) => {
    const res = buyTheme(id);
    if (!res.ok) {
      showToast(res.reason);
      return;
    }
    showToast('Purchased');
    setTheme(id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--cr-primary)/0.14),transparent_55%),radial-gradient(circle_at_80%_20%,rgb(var(--cr-secondary)/0.14),transparent_55%),radial-gradient(circle_at_20%_80%,rgb(var(--cr-accent)/0.12),transparent_55%)]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[180px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-600/25 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard')} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-lg shadow-black/20">
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent mb-1 flex items-center gap-3 drop-shadow-2xl">
                  Settings
                  <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                    <Sparkles className="w-7 h-7 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]" />
                  </motion.div>
                </h1>
                <p className="text-sm text-neutral-400 font-medium">Personalize your experience and unlock new color themes.</p>
              </div>
            </div>

            {/* Coins */}
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Coins</div>
                  <div className="text-sm font-black text-white font-mono">{coins.toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                addCoins(5000);
                showToast('+5,000 coins');
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-bold text-neutral-200 transition-all"
            >
              Add 5,000 coins (dev)
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            {[
              { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
              { id: 'shop', label: 'Theme Shop', icon: <Crown className="w-4 h-4" /> },
            ].map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(t.id as any)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  activeTab === t.id ? 'text-white shadow-2xl' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                {activeTab === t.id && (
                  <>
                    <motion.div layoutId="activeSettingsTab" className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-xl opacity-50" />
                  </>
                )}
                <span className="relative flex items-center gap-2">{t.icon}{t.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'appearance' ? (
            <motion.div key="appearance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black">Your Themes</h2>
                    <p className="text-sm text-neutral-400">Pick a theme you own. It updates the whole site instantly.</p>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    Active: <span className="text-white font-black">{themes.find((t) => t.id === themeId)?.name ?? themeId}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {ownedList.map((t) => (
                    <motion.div key={t.id} whileHover={{ y: -4, scale: 1.01 }} className="relative group">
                      <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all" style={{ background: `linear-gradient(90deg, ${t.vars.primary}, ${t.vars.secondary}, ${t.vars.accent})` }} />
                      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-lg font-black text-white">{t.name}</div>
                            <div className="text-xs text-neutral-400">Owned</div>
                          </div>
                          {themeId === t.id && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/30">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-xs font-bold text-green-400">Active</span>
                            </div>
                          )}
                        </div>
                        <div className="h-12 rounded-xl border border-white/10" style={{ background: `linear-gradient(90deg, ${t.vars.primary}, ${t.vars.secondary}, ${t.vars.accent})` }} />
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleApply(t.id)}
                            disabled={themeId === t.id}
                            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {themeId === t.id ? 'Applied' : 'Apply'}
                          </button>
                          <button
                            onClick={() => router.push('/rewards')}
                            className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                          >
                            Earn Coins
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7">
                <h3 className="text-xl font-black mb-3">What changes?</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  Themes update your global accent colors (gradients, scrollbar, selection, and other UI accents). When you switch, pages adapt instantly.
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Preview</div>
                    <div className="h-10 rounded-xl border border-white/10" style={{ background: `linear-gradient(90deg, var(--cr-primary), var(--cr-secondary), var(--cr-accent))` }} />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-2">Tip</div>
                    <div className="text-sm text-neutral-300">
                      Buy more themes in <span className="text-white font-bold">Theme Shop</span>.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="shop" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7">
                <div className="flex items-end justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black">Theme Shop</h2>
                    <p className="text-sm text-neutral-400">Purchase color packs and apply them instantly.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {shopList.map((t) => {
                    const isOwned = owned.has(t.id);
                    const canAfford = coins >= t.price;
                    return (
                      <motion.div key={t.id} whileHover={{ y: -6, scale: 1.01 }} className="relative group">
                        <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-45 transition-all" style={{ background: `linear-gradient(90deg, ${t.vars.primary}, ${t.vars.secondary}, ${t.vars.accent})` }} />
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="text-lg font-black text-white">{t.name}</div>
                              <div className="text-xs text-neutral-400">{t.price.toLocaleString()} coins</div>
                            </div>
                            {isOwned ? (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/30">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold text-green-400">Owned</span>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${canAfford ? 'bg-amber-500/10 border-amber-400/20' : 'bg-white/5 border-white/10'}`}>
                                {canAfford ? <Crown className="w-4 h-4 text-amber-300" /> : <Lock className="w-4 h-4 text-neutral-400" />}
                                <span className={`text-xs font-bold ${canAfford ? 'text-amber-200' : 'text-neutral-300'}`}>{canAfford ? 'Available' : 'Locked'}</span>
                              </div>
                            )}
                          </div>

                          <div className="h-14 rounded-2xl border border-white/10 mb-5" style={{ background: `linear-gradient(90deg, ${t.vars.primary}, ${t.vars.secondary}, ${t.vars.accent})` }} />

                          <div className="flex gap-2">
                            {isOwned ? (
                              <button
                                onClick={() => handleApply(t.id)}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                              >
                                Apply
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBuy(t.id)}
                                disabled={!canAfford}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Buy
                              </button>
                            )}
                            <button
                              onClick={() => router.push('/rewards')}
                              className="px-4 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all"
                            >
                              Get Coins
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 text-sm font-bold text-white shadow-2xl">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

