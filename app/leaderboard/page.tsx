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

// ── Rank tier definitions (9 tiers) ────────────────────────────────────────────
const RANK_TIERS = [
  { name: 'Bronze',      min: 0,    max: 499,      gradient: 'from-orange-700 to-amber-700',    text: 'text-orange-500',   bg: 'bg-orange-500/10',  border: 'border-orange-500/25',  emoji: '🥉', elite: false, glow: null },
  { name: 'Silver',      min: 500,  max: 999,      gradient: 'from-slate-400 to-gray-400',      text: 'text-slate-400',    bg: 'bg-slate-500/10',   border: 'border-slate-500/25',   emoji: '🥈', elite: false, glow: null },
  { name: 'Gold',        min: 1000, max: 1999,     gradient: 'from-amber-500 to-yellow-500',    text: 'text-amber-400',    bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   emoji: '🥇', elite: false, glow: null },
  { name: 'Platinum',    min: 2000, max: 2999,     gradient: 'from-teal-500 to-emerald-500',    text: 'text-teal-400',     bg: 'bg-teal-500/10',    border: 'border-teal-500/25',    emoji: '💠', elite: false, glow: null },
  { name: 'Emerald',     min: 3000, max: 3999,     gradient: 'from-emerald-500 to-green-400',   text: 'text-emerald-400',  bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', emoji: '🟢', elite: false, glow: null },
  { name: 'Diamond',     min: 4000, max: 5499,     gradient: 'from-cyan-400 to-blue-500',       text: 'text-cyan-400',     bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    emoji: '💎', elite: false, glow: null },
  {
    name: 'Master', min: 5500, max: 6999,
    gradient: 'from-violet-500 to-purple-600', text: 'text-violet-400',
    bg: 'bg-violet-500/10', border: 'border-violet-500/30', emoji: '⚔️', elite: true,
    glow: { rgb: '139,92,246', rowOpacity: '0.05', cardShadow: 'shadow-violet-500/15', badgeShadow: 'shadow-violet-500/25', orbOpacity: 'opacity-[0.12]', barGlow: '0 0 14px rgba(139,92,246,0.45)', cardBg: 'bg-violet-950/30', cardBgLight: 'bg-violet-50', borderWidth: 'border-2' },
  },
  {
    name: 'Grandmaster', min: 7000, max: 8999,
    gradient: 'from-fuchsia-500 to-pink-500', text: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', emoji: '🔮', elite: true,
    glow: { rgb: '217,70,239', rowOpacity: '0.07', cardShadow: 'shadow-fuchsia-500/20', badgeShadow: 'shadow-fuchsia-500/30', orbOpacity: 'opacity-[0.16]', barGlow: '0 0 18px rgba(217,70,239,0.5)', cardBg: 'bg-fuchsia-950/30', cardBgLight: 'bg-fuchsia-50', borderWidth: 'border-2' },
  },
  {
    name: 'Challenger', min: 9000, max: Infinity,
    gradient: 'from-red-500 to-orange-500', text: 'text-red-400',
    bg: 'bg-red-500/10', border: 'border-red-500/30', emoji: '👑', elite: true,
    glow: { rgb: '239,68,68', rowOpacity: '0.09', cardShadow: 'shadow-red-500/25', badgeShadow: 'shadow-red-500/40', orbOpacity: 'opacity-[0.22]', barGlow: '0 0 24px rgba(239,68,68,0.55)', cardBg: 'bg-red-950/30', cardBgLight: 'bg-red-50', borderWidth: 'border-[3px]' },
  },
] as const;

function getTierForPoints(points: number) {
  return RANK_TIERS.find(t => points >= t.min && points <= t.max) ?? RANK_TIERS[0];
}

function getProgression(points: number) {
  const tierIdx = RANK_TIERS.findIndex(t => points >= t.min && points <= t.max);
  const tier = RANK_TIERS[tierIdx] ?? RANK_TIERS[0];
  const nextTier = tierIdx < RANK_TIERS.length - 1 ? RANK_TIERS[tierIdx + 1] : null;
  if (!nextTier) return { percent: 100, nextName: null, nextEmoji: null, tier };
  const range = tier.max - tier.min + 1;
  const progress = points - tier.min;
  const percent = Math.min(100, Math.round((progress / range) * 100));
  return { percent, nextName: nextTier.name, nextEmoji: nextTier.emoji, tier };
}

const MOCK_USERS = [
  { name: 'Sarah Chen',      points: 9800,  streak: 42, tasksCompleted: 210, avatar: 'SC', color: 'from-pink-500 to-rose-500' },
  { name: 'Alex Rivera',     points: 8200,  streak: 35, tasksCompleted: 185, avatar: 'AR', color: 'from-indigo-500 to-purple-500' },
  { name: 'Emma Zhang',      points: 6800,  streak: 19, tasksCompleted: 128, avatar: 'EZ', color: 'from-cyan-500 to-blue-500' },
  { name: 'David Kim',       points: 5600,  streak: 16, tasksCompleted: 112, avatar: 'DK', color: 'from-blue-500 to-cyan-500' },
  { name: 'Maria Garcia',    points: 4800,  streak: 14, tasksCompleted: 98,  avatar: 'MG', color: 'from-purple-500 to-violet-500' },
  { name: 'James Wilson',    points: 3400,  streak: 11, tasksCompleted: 82,  avatar: 'JW', color: 'from-teal-500 to-emerald-500' },
  { name: 'Lisa Anderson',   points: 2600,  streak: 9,  tasksCompleted: 67,  avatar: 'LA', color: 'from-amber-500 to-orange-500' },
  { name: 'Tom Baker',       points: 1800,  streak: 7,  tasksCompleted: 51,  avatar: 'TB', color: 'from-green-500 to-lime-500' },
  { name: 'Nina Patel',      points: 1200,  streak: 5,  tasksCompleted: 38,  avatar: 'NP', color: 'from-rose-500 to-pink-500' },
  { name: 'Oscar Ruiz',      points: 750,   streak: 4,  tasksCompleted: 24,  avatar: 'OR', color: 'from-violet-500 to-fuchsia-500' },
  { name: 'Chloe Lee',       points: 380,   streak: 2,  tasksCompleted: 14,  avatar: 'CL', color: 'from-sky-500 to-blue-500' },
  { name: 'Ryan Scott',      points: 150,   streak: 1,  tasksCompleted: 6,   avatar: 'RS', color: 'from-emerald-500 to-green-500' },
];

const PODIUM_LAYOUT = {
  1: { avatarOuter:108,avatarInner:96,ringWidth:3,avatarText:'text-3xl',nameSize:'text-lg',pointsSize:'text-2xl',tierSize:'text-sm px-4 py-1.5',barHeight:'h-32',barGradient:'from-amber-500 to-yellow-400',barShadow:'shadow-amber-500/30',delay:0.2,order:'order-2',mt:'mt-0',medal:'👑',medalSize:'text-4xl' },
  2: { avatarOuter:84,avatarInner:72,ringWidth:2.5,avatarText:'text-2xl',nameSize:'text-base',pointsSize:'text-lg',tierSize:'text-xs px-3 py-1',barHeight:'h-24',barGradient:'from-slate-400 to-gray-300',barShadow:'shadow-slate-400/20',delay:0.35,order:'order-1',mt:'mt-10',medal:'🥈',medalSize:'text-3xl' },
  3: { avatarOuter:84,avatarInner:72,ringWidth:2.5,avatarText:'text-2xl',nameSize:'text-base',pointsSize:'text-lg',tierSize:'text-xs px-3 py-1',barHeight:'h-18',barGradient:'from-orange-600 to-amber-600',barShadow:'shadow-orange-500/20',delay:0.45,order:'order-3',mt:'mt-10',medal:'🥉',medalSize:'text-3xl' },
} as const;

function getTierEnergy(tierName: string) {
  switch (tierName) {
    case 'Challenger': return {
      ringGrad:'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #f97316, #ef4444)',
      shadow:'0 0 8px 2px rgba(239,68,68,0.45), 0 0 24px 4px rgba(249,115,22,0.2), 0 0 48px 8px rgba(239,68,68,0.1)',
      shadowHover:'0 0 12px 3px rgba(239,68,68,0.6), 0 0 32px 6px rgba(249,115,22,0.3), 0 0 56px 10px rgba(239,68,68,0.15)',
      spotGrad:'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(249,115,22,0.06) 50%, transparent 70%)', spotSize:140,
      pulseShadows:['0 0 8px 2px rgba(239,68,68,0.45), 0 0 24px 4px rgba(249,115,22,0.15), 0 0 48px 8px rgba(239,68,68,0.06)','0 0 8px 2px rgba(239,68,68,0.55), 0 0 24px 4px rgba(249,115,22,0.28), 0 0 48px 8px rgba(239,68,68,0.14)','0 0 8px 2px rgba(239,68,68,0.45), 0 0 24px 4px rgba(249,115,22,0.15), 0 0 48px 8px rgba(239,68,68,0.06)'],
      pulseDuration:3, badgeShadow:'0 0 10px rgba(239,68,68,0.35), 0 0 2px rgba(239,68,68,0.5)', liftShadow:'0 8px 24px -4px rgba(239,68,68,0.2)',
    };
    case 'Grandmaster': return {
      ringGrad:'conic-gradient(from 0deg, #d946ef, #ec4899, #a855f7, #ec4899, #d946ef)',
      shadow:'0 0 6px 2px rgba(217,70,239,0.35), 0 0 20px 4px rgba(236,72,153,0.15), 0 0 40px 6px rgba(217,70,239,0.06)',
      shadowHover:'0 0 10px 3px rgba(217,70,239,0.5), 0 0 28px 5px rgba(236,72,153,0.22), 0 0 48px 8px rgba(217,70,239,0.1)',
      spotGrad:'radial-gradient(circle, rgba(217,70,239,0.14) 0%, rgba(236,72,153,0.04) 50%, transparent 70%)', spotSize:120,
      pulseShadows:['0 0 6px 2px rgba(217,70,239,0.35), 0 0 20px 4px rgba(236,72,153,0.12), 0 0 40px 6px rgba(217,70,239,0.04)','0 0 6px 2px rgba(217,70,239,0.45), 0 0 20px 4px rgba(236,72,153,0.22), 0 0 40px 6px rgba(217,70,239,0.1)','0 0 6px 2px rgba(217,70,239,0.35), 0 0 20px 4px rgba(236,72,153,0.12), 0 0 40px 6px rgba(217,70,239,0.04)'],
      pulseDuration:3.5, badgeShadow:'0 0 8px rgba(217,70,239,0.3), 0 0 2px rgba(217,70,239,0.4)', liftShadow:'0 6px 20px -4px rgba(217,70,239,0.15)',
    };
    case 'Master': return {
      ringGrad:'conic-gradient(from 0deg, #8b5cf6, #7c3aed, #6d28d9, #7c3aed, #8b5cf6)',
      shadow:'0 0 5px 1px rgba(139,92,246,0.3), 0 0 16px 3px rgba(124,58,237,0.12), 0 0 32px 5px rgba(139,92,246,0.05)',
      shadowHover:'0 0 8px 2px rgba(139,92,246,0.45), 0 0 22px 4px rgba(124,58,237,0.18), 0 0 40px 6px rgba(139,92,246,0.08)',
      spotGrad:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(124,58,237,0.03) 50%, transparent 70%)', spotSize:110,
      pulseShadows:['0 0 5px 1px rgba(139,92,246,0.3), 0 0 16px 3px rgba(124,58,237,0.1), 0 0 32px 5px rgba(139,92,246,0.03)','0 0 5px 1px rgba(139,92,246,0.4), 0 0 16px 3px rgba(124,58,237,0.18), 0 0 32px 5px rgba(139,92,246,0.08)','0 0 5px 1px rgba(139,92,246,0.3), 0 0 16px 3px rgba(124,58,237,0.1), 0 0 32px 5px rgba(139,92,246,0.03)'],
      pulseDuration:4, badgeShadow:'0 0 6px rgba(139,92,246,0.25), 0 0 2px rgba(139,92,246,0.35)', liftShadow:'0 5px 16px -4px rgba(139,92,246,0.12)',
    };
    default: return {
      ringGrad:'conic-gradient(from 0deg, #6b7280, #9ca3af, #6b7280)',
      shadow:'0 0 4px 1px rgba(100,100,100,0.12)', shadowHover:'0 0 6px 2px rgba(100,100,100,0.18)',
      spotGrad:'none', spotSize:0,
      pulseShadows:['0 0 4px 1px rgba(100,100,100,0.12)','0 0 4px 1px rgba(100,100,100,0.16)','0 0 4px 1px rgba(100,100,100,0.12)'],
      pulseDuration:4, badgeShadow:'none', liftShadow:'0 4px 12px -4px rgba(0,0,0,0.15)',
    };
  }
}

export default function LeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [activeNav, setActiveNav] = useState('leaderboard');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialTab = searchParams.get('view') === 'ranked' ? 'ranked' : 'simple';
  const [activeTab, setActiveTab] = useState<'simple' | 'ranked'>(initialTab);

  useEffect(() => { (async () => { const{data:{user}}=await supabase.auth.getUser(); if(!user){router.push('/');return;} setUser(user); setLoading(false); })(); }, []);
  useEffect(() => { if(searchParams.get('view')==='ranked') setActiveTab('ranked'); }, [searchParams]);

  const currentUserEntry = { name:user?.user_metadata?.name||'You', points:3840, streak:7, tasksCompleted:47, avatar:user?.user_metadata?.name?.[0]||'Y', color:'from-primary-500 to-secondary-500', isMe:true };
  const sorted = [...MOCK_USERS.map(u=>({...u,isMe:false})), currentUserEntry].sort((a,b)=>b.points-a.points).map((u,i)=>({...u,rank:i+1}));
  const top3 = sorted.slice(0,3);
  const rest = activeTab==='ranked' ? sorted.slice(3) : sorted;
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const navItems = [
    {id:'dashboard',icon:<Terminal className="w-4 h-4"/>,label:'Dashboard',path:'/dashboard'},
    {id:'leaderboard',icon:<Trophy className="w-4 h-4"/>,label:'Leaderboard',path:'/leaderboard'},
    {id:'ranked',icon:<Swords className="w-4 h-4"/>,label:'Ranked',path:'/leaderboard?view=ranked'},
    {id:'rewards',icon:<Gift className="w-4 h-4"/>,label:'Rewards',path:'/rewards'},
    {id:'ai-coach',icon:<Brain className="w-4 h-4"/>,label:'AI Coach',path:'/ai-coach'},
  ];
  const learningItems = [
    {id:'projects',icon:<Code2 className="w-4 h-4"/>,label:'Projects',badge:3,path:'/projects'},
    {id:'courses',icon:<BookOpen className="w-4 h-4"/>,label:'Courses',path:'/courses'},
    {id:'challenges',icon:<Target className="w-4 h-4"/>,label:'Challenges',badge:2,path:'/challenges'},
    {id:'badges',icon:<Award className="w-4 h-4"/>,label:'Badges',path:'/badges'},
  ];
  const careerItems = [
    {id:'profile',icon:<Users className="w-4 h-4"/>,label:'Profile',path:'/profile'},
    {id:'portfolio',icon:<Briefcase className="w-4 h-4"/>,label:'Portfolio',path:'/portfolio'},
    {id:'interview',icon:<MessageSquare className="w-4 h-4"/>,label:'Mock Interview',path:'/interview'},
    {id:'settings',icon:<Settings className="w-4 h-4"/>,label:'Settings',path:'/settings'},
  ];

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="text-2xl font-bold text-white">Loading leaderboard...</motion.div>
    </div>
  );

  const rankBadge = (rank: number) => {
    if(rank===1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-sm shadow-lg shadow-amber-500/40">👑</div>;
    if(rank===2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center text-sm shadow-lg shadow-slate-400/30">🥈</div>;
    if(rank===3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">🥉</div>;
    return <div className={`w-8 text-center font-black font-mono text-lg ${isDark?'text-neutral-500':'text-neutral-400'}`}>{rank}</div>;
  };

  const PodiumCard = ({entry}:{entry:typeof sorted[number]}) => {
    const layout=PODIUM_LAYOUT[entry.rank as 1|2|3]; if(!layout) return null;
    const tier=getTierForPoints(entry.points), prog=getProgression(entry.points), energy=getTierEnergy(tier.name);
    return (
      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:layout.delay,duration:0.6,type:'spring',stiffness:110}} className={`flex flex-col items-center ${layout.order} ${layout.mt} flex-1 group`}>
        <div className="relative flex flex-col items-center">
          {energy.spotSize>0&&<div className="absolute pointer-events-none rounded-full" style={{width:energy.spotSize,height:energy.spotSize,top:'50%',left:'50%',transform:'translate(-50%,-55%)',background:energy.spotGrad}}/>}
          <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{delay:layout.delay+0.12,type:'spring',stiffness:200}} className={`${layout.medalSize} mb-1.5 relative z-20`}>{layout.medal}</motion.div>
          <motion.div animate={{boxShadow:energy.pulseShadows}} transition={{duration:energy.pulseDuration,repeat:Infinity,ease:'easeInOut'}} whileHover={{boxShadow:energy.shadowHover}} className="relative z-10 rounded-2xl cursor-pointer" style={{padding:layout.ringWidth,background:energy.ringGrad,boxShadow:energy.shadow}}>
            <div className={`bg-gradient-to-br ${entry.color} flex items-center justify-center font-bold ${layout.avatarText} text-white relative`} style={{width:layout.avatarInner,height:layout.avatarInner,borderRadius:14}}>
              {entry.avatar}
              {entry.isMe&&<div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/40 z-20"><Star className="w-3.5 h-3.5 text-white"/></div>}
            </div>
          </motion.div>
          <div className="absolute z-0 rounded-2xl" style={{width:layout.avatarOuter,height:layout.avatarOuter,top:`calc(${layout.medalSize==='text-4xl'?'2.75rem':'2.25rem'} + 6px)`,left:'50%',transform:'translateX(-50%)',boxShadow:energy.liftShadow}}/>
          <div className={`${layout.nameSize} font-bold ${isDark?'text-white':'text-neutral-900'} mt-3 text-center truncate max-w-[160px]`}>{entry.name}{entry.isMe&&<span className={`ml-1 text-xs ${isDark?'text-primary-400':'text-primary-600'}`}>(You)</span>}</div>
          <div className={`${layout.pointsSize} font-black font-mono ${isDark?'text-primary-400':'text-primary-600'} mt-1`}>{entry.points.toLocaleString()}</div>
          <span className={`inline-flex items-center gap-1.5 ${layout.tierSize} rounded-full font-black border mt-2.5 ${tier.bg} ${tier.border} ${tier.text} transition-shadow duration-300`} style={{boxShadow:energy.badgeShadow}}><span className="text-base">{tier.emoji}</span>{tier.name}</span>
          <div className="w-28 mt-2.5">
            <div className={`h-1 rounded-full overflow-hidden ${isDark?'bg-neutral-800':'bg-neutral-200'}`}><div className={`h-full rounded-full bg-gradient-to-r ${tier.gradient}`} style={{width:`${prog.percent}%`}}/></div>
            <div className={`text-[9px] font-mono mt-0.5 text-center ${isDark?'text-neutral-500':'text-neutral-400'}`}>{prog.nextName?`${prog.percent}% → ${prog.nextName}`:'Max Rank'}</div>
          </div>
        </div>
        <motion.div initial={{height:0}} animate={{height:'auto'}} transition={{delay:layout.delay+0.3,duration:0.5}} className={`w-full ${layout.barHeight} mt-4 rounded-t-2xl bg-gradient-to-t ${layout.barGradient} relative overflow-hidden shadow-lg ${layout.barShadow}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10 pointer-events-none"/><div className={`absolute inset-x-0 top-0 h-px ${isDark?'bg-white/20':'bg-white/40'}`}/>
          <div className="absolute inset-0 flex items-center justify-center"><span className={`text-5xl font-black ${isDark?'text-white/15':'text-white/25'} font-mono`}>{entry.rank}</span></div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark?'bg-neutral-950 text-white':'bg-neutral-50 text-neutral-900'} flex overflow-hidden relative transition-colors duration-300`}>
      <div className={`fixed top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br ${isDark?'from-primary-600/30':'from-primary-500/40'} to-transparent blur-[100px] pointer-events-none`}/>
      <div className={`fixed bottom-[5%] left-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-br ${isDark?'from-secondary-600/20':'from-secondary-500/30'} to-transparent blur-[80px] pointer-events-none`}/>

      {/* SIDEBAR */}
      <aside className={`w-64 min-h-screen ${isDark?'bg-neutral-900/95 border-neutral-800':'bg-white/95 border-neutral-200'} backdrop-blur-xl border-r flex flex-col flex-shrink-0 relative z-10 transition-colors duration-300`}>
        <div className={`p-5 pb-4 border-b ${isDark?'border-neutral-800/50':'border-neutral-200/50'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push('/dashboard')}>
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl"><Terminal className="w-6 h-6 text-white" strokeWidth={2.5}/></div>
            <h1 className="text-lg font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">CodeRift</h1>
          </div>
        </div>
        <nav className="px-3 flex-1 overflow-y-auto mt-4">
          {[{title:'Main',items:navItems,showBadge:false},{title:'Learning',items:learningItems,showBadge:true},{title:'Career',items:careerItems,showBadge:false}].map(section=>(
            <div key={section.title}>
              <div className={`text-[10px] font-bold ${isDark?'text-neutral-500':'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4 first:mt-0`}>{section.title}</div>
              {section.items.map((item:any)=>(
                <motion.div key={item.id} whileHover={{x:4}} onClick={()=>{setActiveNav(item.id);router.push(item.path);}}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${activeNav===item.id?`${isDark?'bg-primary-600/15 text-primary-400 border-primary-600/25':'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold`:`${isDark?'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300':'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`}`}>
                  {item.icon}<span className="text-sm flex-1">{item.label}</span>
                  {section.showBadge&&item.badge&&<span className={`${isDark?'bg-primary-600':'bg-primary-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono`}>{item.badge}</span>}
                </motion.div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto relative z-5">
        <div className={`sticky top-0 z-20 ${isDark?'bg-neutral-950/85 border-neutral-800/50':'bg-neutral-50/85 border-neutral-200/50'} backdrop-blur-xl border-b h-16 px-7 flex items-center justify-between transition-colors duration-300`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark?'text-white':'text-neutral-900'}`}>Leaderboard</h2>
            <p className={`text-xs ${isDark?'text-neutral-400':'text-neutral-500'}`}>See how you stack up against the community</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setIsDark(!isDark)} className={`hover-btn w-9 h-9 rounded-xl ${isDark?'bg-neutral-800 border-neutral-700':'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500`}>
              {isDark?<Sun className="w-4 h-4 text-amber-500"/>:<Moon className="w-4 h-4 text-primary-600"/>}
            </button>
            <button onClick={handleLogout} className={`hover-btn flex items-center gap-2 px-4 py-2 text-sm ${isDark?'text-neutral-400 hover:text-white hover:bg-neutral-800':'text-neutral-600 hover:text-neutral-900 hover:bg-white'} rounded-xl border border-transparent`}>
              <LogOut className="w-4 h-4"/>Logout
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className={`flex gap-1 p-1 ${isDark?'bg-neutral-800/50':'bg-neutral-200'} rounded-xl w-fit`}>
            {[{id:'simple' as const,label:'Simple Leaderboard',icon:<Trophy className="w-4 h-4"/>},{id:'ranked' as const,label:'Ranked Leaderboard',icon:<Swords className="w-4 h-4"/>}].map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                className={`hover-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${activeTab===tab.id?`${isDark?'bg-primary-600 text-white':'bg-primary-500 text-white'} shadow-lg`:`${isDark?'text-neutral-400 hover:text-neutral-300':'text-neutral-600 hover:text-neutral-700'}`}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* PODIUM */}
          {activeTab==='ranked'&&top3.length===3&&(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}
              className={`${isDark?'bg-neutral-900/80 border-neutral-800':'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-8 pb-0 overflow-hidden relative`}>
              <div className="relative flex items-end justify-center gap-6 px-4 pt-2">
                <PodiumCard entry={top3[1]}/><PodiumCard entry={top3[0]}/><PodiumCard entry={top3[2]}/>
              </div>
            </motion.div>
          )}

          {/* Leaderboard list */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className={`${isDark?'bg-neutral-900/80 border-neutral-800':'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${isDark?'border-neutral-800':'border-neutral-200'} flex items-center`}>
              <div className="w-12"/><div className="w-12"/>
              <div className={`flex-1 text-xs font-bold uppercase tracking-wider ${isDark?'text-neutral-500':'text-neutral-400'} ml-3`}>Player</div>
              <div className={`w-28 text-right text-xs font-bold uppercase tracking-wider ${isDark?'text-neutral-500':'text-neutral-400'}`}>Points</div>
              {activeTab==='ranked'&&<div className={`w-40 text-right text-xs font-bold uppercase tracking-wider ${isDark?'text-neutral-500':'text-neutral-400'}`}>Tier</div>}
            </div>
            <div className={`divide-y ${isDark?'divide-neutral-800/50':'divide-neutral-200/50'}`}>
              {rest.map((entry,i) => {
                const tier=getTierForPoints(entry.points), prog=getProgression(entry.points);
                return (
                  <motion.div key={entry.name} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}} whileHover={{x:4}}
                    className={`hover-row flex items-center px-6 py-4 relative ${entry.isMe?`${isDark?'bg-primary-600/[0.08] border-l-[3px] border-l-primary-500':'bg-primary-100/60 border-l-[3px] border-l-primary-500'}`:'border-l-[3px] border-l-transparent'} ${isDark?'hover:bg-neutral-800/40':'hover:bg-neutral-50'}`}>
                    {activeTab==='ranked'&&tier.elite&&tier.glow&&(
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} pointer-events-none`} style={{opacity:parseFloat(tier.glow.rowOpacity)}}/>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-16 rounded-full blur-2xl pointer-events-none" style={{background:`radial-gradient(circle, rgba(${tier.glow.rgb},0.12) 0%, transparent 70%)`}}/>
                      </>
                    )}
                    {entry.isMe&&<div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none" style={{background:'linear-gradient(90deg, rgba(var(--cr-primary),0.08), transparent)'}}/>}
                    <div className="w-12 flex-shrink-0 flex justify-center relative">{rankBadge(entry.rank)}</div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${entry.color} flex items-center justify-center font-bold text-sm text-white shadow-lg flex-shrink-0 ${entry.isMe?`ring-2 ring-primary-500 ring-offset-2 ${isDark?'ring-offset-neutral-950':'ring-offset-white'}`:''}`}>{entry.avatar}</div>
                    <div className="flex-1 ml-3 min-w-0 relative">
                      <div className={`font-bold text-sm truncate ${isDark?'text-white':'text-neutral-900'}`}>{entry.name}{entry.isMe&&<span className={`ml-2 text-xs ${isDark?'text-primary-400':'text-primary-600'}`}>(You)</span>}</div>
                      <div className={`text-xs ${isDark?'text-neutral-500':'text-neutral-400'} flex items-center gap-2`}><Flame className="w-3 h-3 text-orange-400"/>{entry.streak} day streak · {entry.tasksCompleted} tasks</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className={`flex-1 h-1 rounded-full overflow-hidden max-w-[120px] ${isDark?'bg-neutral-800':'bg-neutral-200'}`}>
                          <motion.div initial={{width:0}} animate={{width:`${prog.percent}%`}} transition={{duration:0.8,delay:i*0.03+0.2}} className={`h-full rounded-full bg-gradient-to-r ${tier.gradient}`}/>
                        </div>
                        <span className={`text-[9px] font-mono whitespace-nowrap ${isDark?'text-neutral-600':'text-neutral-400'}`}>{prog.nextName?`${prog.percent}% → ${prog.nextEmoji} ${prog.nextName}`:'✦ Max'}</span>
                      </div>
                    </div>
                    <div className={`w-28 text-right font-black font-mono text-base relative ${isDark?'text-primary-400':'text-primary-600'}`}>{entry.points.toLocaleString()}</div>
                    {activeTab==='ranked'&&(
                      <div className="w-40 flex justify-end relative">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tier.bg} ${tier.border} ${tier.text} ${tier.elite&&tier.glow?`shadow-lg ${tier.glow.badgeShadow}`:''}`}><span>{tier.emoji}</span>{tier.name}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Rank Tiers */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className={`${isDark?'bg-neutral-900/80 border-neutral-800':'bg-white/90 border-neutral-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-xl"><Shield className="w-5 h-5 text-white"/></div>
              <div>
                <h3 className={`text-base font-black ${isDark?'text-white':'text-neutral-900'}`}>Rank Tiers</h3>
                <p className={`text-xs ${isDark?'text-neutral-500':'text-neutral-400'}`}>Earn points to climb through the ranks — top tiers are for the elite</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {RANK_TIERS.filter(t=>!t.elite).map(tier=>(
                <div key={tier.name} className={`hover-card relative overflow-hidden rounded-2xl border ${tier.border} ${tier.bg} p-4 text-center`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5 pointer-events-none`}/>
                  <div className="relative">
                    <div className="text-3xl mb-2">{tier.emoji}</div>
                    <div className={`text-sm font-black ${tier.text} mb-1`}>{tier.name}</div>
                    <div className={`text-xs font-mono ${isDark?'text-neutral-400':'text-neutral-500'}`}>{tier.max===Infinity?`${tier.min.toLocaleString()}+`:`${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}`}</div>
                    <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${isDark?'bg-neutral-800':'bg-neutral-200'}`}><div className={`h-full rounded-full bg-gradient-to-r ${tier.gradient}`} style={{width:'100%'}}/></div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-2 pt-4 border-t ${isDark?'border-neutral-800/50':'border-neutral-200/50'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark?'text-neutral-500':'text-neutral-400'}`}><Star className="w-3 h-3"/>Elite Tiers<Star className="w-3 h-3"/></div>
              <div className="grid grid-cols-3 gap-3">
                {RANK_TIERS.filter(t=>t.elite&&t.glow).map(tier=>(
                  <div key={tier.name} className={`hover-card relative overflow-hidden rounded-2xl ${tier.glow!.borderWidth} ${tier.border} p-5 text-center ${isDark?tier.glow!.cardBg:tier.glow!.cardBgLight} ${tier.glow!.cardShadow}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-[0.08] pointer-events-none`}/>
                    <div className={`absolute -top-14 -right-14 w-36 h-36 rounded-full bg-gradient-to-br ${tier.gradient} ${tier.glow!.orbOpacity} blur-2xl pointer-events-none`}/>
                    <div className={`absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-br ${tier.gradient} ${tier.glow!.orbOpacity} blur-xl pointer-events-none`}/>
                    <div className="absolute inset-x-0 top-0 h-px pointer-events-none" style={{background:`linear-gradient(90deg, transparent, rgba(${tier.glow!.rgb},0.25), transparent)`}}/>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none blur-3xl" style={{background:`radial-gradient(circle, rgba(${tier.glow!.rgb},0.15) 0%, transparent 70%)`}}/>
                    <div className="relative">
                      <div className="text-4xl mb-2">{tier.emoji}</div>
                      <div className={`text-base font-black ${tier.text} mb-1`}>{tier.name}</div>
                      <div className={`text-xs font-mono ${isDark?'text-neutral-400':'text-neutral-500'}`}>{tier.max===Infinity?`${tier.min.toLocaleString()}+`:`${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}`}</div>
                      <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDark?'bg-neutral-800':'bg-neutral-200'}`}>
                        <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:1.2,delay:0.3}} className={`h-full rounded-full bg-gradient-to-r ${tier.gradient}`} style={{boxShadow:tier.glow!.barGlow}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
