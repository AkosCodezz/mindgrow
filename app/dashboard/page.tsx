'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { statsApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Zap, Target, Flame, LogOut, Code2, Crown, Star, 
  ArrowRight, Calendar, Bell, Award, BookOpen, Briefcase,
  Settings, Users, MessageSquare, TrendingUp, CheckCircle2,
  Play, Rocket, Terminal, Sparkles, Brain, Moon, Sun, Gift,
  Medal, Swords, Map, Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeCard, setActiveCard] = useState<'project' | 'challenge' | 'path'>('project');
  const [isDark, setIsDark] = useState(true);
  const [stats, setStats] = useState({ coins: 0, xp: 0, level: 1, challengesSolved: 0, streak: 0, bestStreak: 0, rank: 'Bronze' });
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    checkUser();
    const handleMouse = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') checkUser(); };
    document.addEventListener('visibilitychange', h);
    return () => document.removeEventListener('visibilitychange', h);
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/'); return setLoading(false); }
    setUser(user);
    setLoading(false);
    // Fetch stats from backend
    try {
      const [s, lb] = await Promise.all([
        statsApi.get(),
        statsApi.getLeaderboard(8),
      ]);
      setStats(s);
      // Update streak on page load
      statsApi.updateStreak().then(updated => setStats(updated)).catch(() => {});
      // Map leaderboard
      const mapped = lb.map((u: any) => ({
        ...u,
        points: u.xp,
        tasksCompleted: u.challengesSolved,
        avatar: u.name?.[0] || '?',
        color: u.userId === user.id ? 'from-primary-500 to-secondary-500' : ['from-pink-500 to-rose-500','from-indigo-500 to-purple-500','from-cyan-500 to-blue-500','from-blue-500 to-cyan-500','from-purple-500 to-violet-500','from-teal-500 to-emerald-500','from-amber-500 to-orange-500'][u.rank % 7],
        isMe: u.userId === user.id,
      }));
      setLeaderboardData(mapped);
    } catch (e) { console.error('Stats fetch failed:', e); }
  };

  const avatarOptions = useMemo(() => {
    const mk = (seeds: string[], style: string, prefix: string) => seeds.map((s, i) => ({ id: `${prefix}-${i+1}`, url: `https://api.dicebear.com/7.x/${style}/svg?seed=${s}` }));
    return [
      ...mk(['John','Michael','David','James','Robert','William','Richard','Joseph','Thomas','Charles','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua','Kenneth'], 'avataaars', 'male'),
      ...mk(['Sarah','Jessica','Emily','Ashley','Michelle','Amanda','Melissa','Deborah','Stephanie','Rebecca','Laura','Sharon','Cynthia','Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela'], 'avataaars', 'female'),
      ...mk(['Felix','Aneka','Tigger','Buster','Midnight','Shadow','Nova','Spark','Bolt','Circuit','Pixel','Byte','Chip','Core','Data','Echo','Flux','Grid','Hex','Ion'], 'bottts', 'robot'),
      ...mk(['Neo','Trinity','Morpheus','Cipher','Tank','Dozer','Mouse','Apoc','Switch','Ghost','Niobe','Link','Zee','Seraph','Oracle','Keymaker','Architect','Merovingian','Persephone','Trainman'], 'pixel-art', 'hacker'),
      ...mk(['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi','Rho','Sigma','Tau','Omega'], 'identicon', 'geometric'),
    ];
  }, []);

  const userAvatar = user?.user_metadata?.avatar || 'male-1';
  const avatarUrl = avatarOptions.find(a => a.id === userAvatar)?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John';
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  // stats loaded from backend via useEffect
  // Build streak days based on actual data - show current week with real streak
  const getWeekDays = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
    const streak = stats.streak || 0;
    const status = days.map((_, i) => {
      if (i > dayOfWeek) return false; // Future days
      if (i === dayOfWeek) return streak >= 1; // Today
      // Past days: colored if within streak range
      const daysAgo = dayOfWeek - i;
      return daysAgo < streak;
    });
    return { days, status };
  };
  const { days: streakDays, status: streakStatus } = getWeekDays();
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const formatISODate = (d: Date) => { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; };
  const startOfWeek = (d: Date, ws: 0|1) => { const date=new Date(d), day=date.getDay(), diff=(day-ws+7)%7; date.setDate(date.getDate()-diff); date.setHours(0,0,0,0); return date; };
  const getMonthLabel = (d: Date) => d.toLocaleString(undefined, { month: 'short' });

  const generateContributionGrid = (days: number, ws: 0|1) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const start = new Date(today); start.setDate(start.getDate()-(days-1));
    const gridStart = startOfWeek(start, ws), gridEnd = new Date(today);
    const endOfThisWeek = startOfWeek(gridEnd, ws); endOfThisWeek.setDate(endOfThisWeek.getDate()+6);
    const all: { date:string; value:number; level:0|1|2|3|4; hours:number; projects:number; tasks:number }[] = [];
    for (let d=new Date(gridStart); d<=endOfThisWeek; d.setDate(d.getDate()+1)) {
      const date=new Date(d), iso=formatISODate(date);
      const seed=(date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate())%97;
      const base=(seed*37)%23, weekendBoost=date.getDay()===0||date.getDay()===6?1.1:1;
      const value=Math.floor(base*weekendBoost);
      const hours=parseFloat(clamp(value/6,0,6).toFixed(1));
      const projects=value>0?clamp(Math.floor(value/9),0,3):0;
      const tasks=value>0?clamp(Math.floor(value/2.5),0,10):0;
      all.push({ date:iso, value, hours, projects, tasks, level:0 });
    }
    const max=Math.max(...all.map(x=>x.value),0);
    const toLevel = (v:number): 0|1|2|3|4 => { if(v<=0||max<=0)return 0; const r=v/max; if(r<0.25)return 1; if(r<0.5)return 2; if(r<0.75)return 3; return 4; };
    const withLevels = all.map(x=>({...x, level:toLevel(x.value)}));
    const weeks: typeof withLevels[] = []; for(let i=0;i<withLevels.length;i+=7) weeks.push(withLevels.slice(i,i+7));
    const monthLabels = weeks.map(week => { const f=week.find(d=>d.date.endsWith('-01')); if(f){const[y,m]=f.date.split('-').map(Number); return getMonthLabel(new Date(y,(m||1)-1,1));} const first=week[0]; if(!first)return ''; const[y,m]=first.date.split('-').map(Number); const label=getMonthLabel(new Date(y,(m||1)-1,1)); return week.some(d=>d.date.slice(0,7)!==first.date.slice(0,7))?label:''; });
    const cutoff=formatISODate(start); const lastNDays=withLevels.filter(d=>d.date>=cutoff&&d.date<=formatISODate(today));
    return { weeks, monthLabels, lastNDays };
  };

  const contribution = useMemo(() => generateContributionGrid(98, 1), [isDark]);

  if (loading) return (
    <div className={`min-h-screen ${isDark?'bg-neutral-950':'bg-neutral-50'} flex items-center justify-center`}>
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className={`text-2xl font-bold ${isDark?'text-white':'text-neutral-900'}`}>Loading your dashboard...</motion.div>
    </div>
  );

  const currentProject = { title:'E-commerce Dashboard', tag:'CURRENT PROJECT', description:'Build a full-stack admin panel with React + Node.js', progress:68, tasks:[{id:1,text:'Setup authentication system',done:true,xp:100},{id:2,text:'Create product CRUD operations',done:true,xp:150},{id:3,text:'Build analytics charts',done:false,xp:200},{id:4,text:'Add payment integration',done:false,xp:250}] };
  const currentChallenge = { title:'Array Manipulation Master', tag:'DAILY CHALLENGE', description:'Solve 3 medium-level array problems in 30 minutes', progress:66, tasks:[{id:1,text:'Two Sum Problem',done:true,xp:50},{id:2,text:'Rotate Array',done:true,xp:75},{id:3,text:'Find Duplicates',done:false,xp:100}] };
  const learningPath = { title:'Full-Stack Web Developer', tag:'LEARNING PATH', description:'Master frontend, backend, and deployment skills', progress:45, tasks:[{id:1,text:'React Fundamentals',done:true,xp:300},{id:2,text:'Node.js & Express',done:true,xp:350},{id:3,text:'Database Design',done:false,xp:400},{id:4,text:'Cloud Deployment',done:false,xp:450}] };

  // leaderboardData loaded from backend via useEffect

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

  const activeContent = {project:currentProject,challenge:currentChallenge,path:learningPath}[activeCard];

  const getActivityColor = (level: number) => {
    if(level===0)return isDark?'bg-neutral-800/50':'bg-neutral-200';
    if(level===1)return isDark?'bg-primary-900/40':'bg-primary-200';
    if(level===2)return isDark?'bg-primary-700/60':'bg-primary-400';
    if(level===3)return isDark?'bg-primary-600/80':'bg-primary-600';
    return isDark?'bg-primary-500':'bg-primary-700';
  };

  const SidebarSection = ({title,items,showBadge=false}:{title:string;items:any[];showBadge?:boolean}) => (
    <>
      <div className={`text-[10px] font-bold ${isDark?'text-neutral-500':'text-neutral-400'} uppercase tracking-wider px-3 py-2 mt-4 first:mt-2`}>{title}</div>
      {items.map((item:any) => (
        <motion.div key={item.id} whileHover={{x:4}} onClick={()=>{setActiveNav(item.id);if(item.path)router.push(item.path);}}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 ${activeNav===item.id?`${isDark?'bg-primary-600/15 text-primary-400 border-primary-600/25':'bg-primary-100 text-primary-700 border-primary-200'} border font-semibold`:`${isDark?'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300':'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'} border border-transparent`}`}>
          {item.icon}<span className="text-sm flex-1">{item.label}</span>
          {showBadge&&item.badge&&<span className={`${isDark?'bg-primary-600':'bg-primary-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono`}>{item.badge}</span>}
        </motion.div>
      ))}
    </>
  );

  /* ── Standardized layout tokens ─────────────────────────────────────────── */
  const cardBase = `backdrop-blur-xl border rounded-2xl`;
  const cardPad = 'p-6';
  const cardDark = `${isDark?'bg-neutral-900/80 border-neutral-800':'bg-white/90 border-neutral-200'}`;
  const sectionGap = 'gap-6'; // 24px — used everywhere

  return (
    <div className={`min-h-screen ${isDark?'bg-neutral-950 text-white':'bg-neutral-50 text-neutral-900'} flex overflow-hidden relative transition-colors duration-300`}>
      <motion.div style={{x:smoothX,y:smoothY}} className={`fixed w-96 h-96 rounded-full ${isDark?'bg-primary-600/20':'bg-primary-400/30'} blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2`}/>
      <div className={`fixed top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br ${isDark?'from-primary-600/30':'from-primary-500/40'} to-transparent blur-[100px] pointer-events-none`}/>
      <div className={`fixed bottom-[5%] left-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-br ${isDark?'from-secondary-600/20':'from-secondary-500/30'} to-transparent blur-[80px] pointer-events-none`}/>

      {/* ── SIDEBAR ── */}
      <aside className={`w-64 min-h-screen ${isDark?'bg-neutral-900/95 border-neutral-800':'bg-white/95 border-neutral-200'} backdrop-blur-xl border-r flex flex-col flex-shrink-0 relative z-10 transition-colors duration-300`}>
        <div className={`p-5 pb-4 border-b ${isDark?'border-neutral-800/50':'border-neutral-200/50'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl"><Terminal className="w-6 h-6 text-white" strokeWidth={2.5}/></div>
            <h1 className="text-lg font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">CodeRift</h1>
          </div>
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className={`m-4 relative overflow-hidden rounded-2xl bg-gradient-to-br ${isDark?'from-amber-500/15 to-orange-500/5':'from-amber-400/25 to-orange-400/10'} border border-amber-500/30 p-4 text-center hover-card`}>
          <div className="absolute top-0 right-0 text-5xl opacity-20">🔥</div>
          <div className="relative">
            <div className={`text-4xl font-black ${isDark?'text-amber-500':'text-amber-600'} font-mono leading-none`}>{stats.streak}</div>
            <div className={`text-[10px] font-bold ${isDark?'text-amber-500/70':'text-amber-600/80'} uppercase tracking-widest mt-1`}>Day Streak 🔥</div>
            <div className="flex gap-1 justify-center mt-3">
              {streakDays.map((day,i)=>(
                <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all ${streakStatus[i]?'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/40':`${isDark?'bg-neutral-800 text-neutral-600':'bg-neutral-200 text-neutral-400'}`}`}>{day}</div>
              ))}
            </div>
          </div>
        </motion.div>
        <nav className="px-3 flex-1 overflow-y-auto">
          <SidebarSection title="Main" items={navItems}/>
          <SidebarSection title="Learning" items={learningItems} showBadge/>
          <SidebarSection title="Career" items={careerItems}/>
        </nav>
        <div className={`p-4 border-t ${isDark?'border-neutral-800/50':'border-neutral-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold ${isDark?'text-neutral-500':'text-neutral-400'} uppercase tracking-wide`}>XP Progress</span>
            <span className={`text-xs font-bold ${isDark?'text-primary-400':'text-primary-600'} font-mono`}>{stats.xp} / {stats.level * 500}</span>
          </div>
          <div className={`h-1.5 ${isDark?'bg-neutral-800':'bg-neutral-200'} rounded-full overflow-hidden`}>
            <motion.div initial={{width:0}} animate={{width:`${Math.min(100, (stats.xp % 500) / 5)}%`}} transition={{duration:1,delay:0.3}} className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg shadow-primary-500/50"/>
          </div>
          <div className={`text-[10px] ${isDark?'text-neutral-500':'text-neutral-400'} mt-1.5`}>{(stats.level * 500) - stats.xp} XP to Level {stats.level+1}</div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto relative z-5">
        {/* Top bar */}
        <div className={`sticky top-0 z-20 ${isDark?'bg-neutral-950/85 border-neutral-800/50':'bg-neutral-50/85 border-neutral-200/50'} backdrop-blur-xl border-b h-16 px-7 flex items-center justify-between transition-colors duration-300`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark?'text-white':'text-neutral-900'}`}>Welcome back, {user?.user_metadata?.name||'Coder'}! 👋</h2>
            <p className={`text-xs ${isDark?'text-neutral-400':'text-neutral-500'}`}>{stats.streak} day streak — keep it going!</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setIsDark(!isDark)} className={`hover-btn w-9 h-9 rounded-xl ${isDark?'bg-neutral-800 border-neutral-700':'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500`}>
              {isDark?<Sun className="w-4 h-4 text-amber-500"/>:<Moon className="w-4 h-4 text-primary-600"/>}
            </button>
            <button className={`hover-btn relative w-9 h-9 rounded-xl ${isDark?'bg-neutral-800 border-neutral-700':'bg-white border-neutral-300'} border flex items-center justify-center hover:border-primary-500`}>
              <Bell className={`w-4 h-4 ${isDark?'text-neutral-400':'text-neutral-600'}`}/>
              <div className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 ${isDark?'border-neutral-950':'border-neutral-50'}`}/>
            </button>
            <button onClick={handleLogout} className={`hover-btn flex items-center gap-2 px-4 py-2 text-sm ${isDark?'text-neutral-400 hover:text-white hover:bg-neutral-800':'text-neutral-600 hover:text-neutral-900 hover:bg-white'} rounded-xl border border-transparent`}>
              <LogOut className="w-4 h-4"/>Logout
            </button>
            <div onClick={()=>router.push('/profile')} className="hover-btn w-9 h-9 rounded-xl bg-neutral-800 overflow-hidden cursor-pointer border border-white/10">
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>

        {/* ── Dashboard grid — standardized 24px gaps throughout ── */}
        <div className={`p-6 flex flex-col ${sectionGap}`}>

          {/* ROW 1: Stat cards — 4-column, equal height */}
          <div className={`grid grid-cols-4 ${sectionGap}`}>
            {[
              {icon:<Trophy className="w-6 h-6"/>,label:'CodeRift Coins',value:stats.coins.toLocaleString(),color:'from-accent-500 to-accent-600',change:'+50 today',changeColor:'text-green-500'},
              {icon:<Zap className="w-6 h-6"/>,label:'Total XP',value:stats.xp.toLocaleString(),color:'from-primary-500 to-primary-600',change:'+120 this week',changeColor:'text-green-500'},
              {icon:<Target className="w-6 h-6"/>,label:'Challenges Solved',value:stats.challengesSolved,color:'from-secondary-500 to-secondary-600',change:'+3 today',changeColor:'text-green-500'},
              {icon:<Flame className="w-6 h-6"/>,label:'Day Streak',value:stats.streak,color:'from-orange-500 to-red-500',change:'7 days',changeColor:'text-orange-500'},
            ].map((stat,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} whileHover={{y:-4}} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} ${isDark?'opacity-10':'opacity-15'} rounded-2xl blur-xl group-hover:opacity-20 transition-all`}/>
                <div className={`relative hover-card ${cardDark} ${cardBase} ${cardPad}`}>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>{stat.icon}</div>
                  <p className={`text-[11px] ${isDark?'text-neutral-500':'text-neutral-400'} mb-1 font-semibold uppercase tracking-wide`}>{stat.label}</p>
                  <p className={`text-2xl font-black ${isDark?'text-white':'text-neutral-900'} font-mono leading-none`}>{stat.value}</p>
                  <p className={`text-xs mt-2 font-semibold ${stat.changeColor}`}>{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ROW 2: Two-column — Project card (5fr) + Activity Tracker (7fr) */}
          <div className={`grid grid-cols-[5fr_7fr] ${sectionGap} items-stretch`}>

            {/* Left: Project / Challenge / Path */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
              className={`hover-card ${cardBase} ${cardPad} flex flex-col ${isDark?'bg-neutral-900/80 border-primary-600/25':'bg-white/90 border-primary-200'} relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark?'from-primary-600/6':'from-primary-500/8'} to-transparent pointer-events-none`}/>
              <div className="relative flex flex-col flex-1">
                <div className={`flex gap-1 p-1 ${isDark?'bg-neutral-800/50':'bg-neutral-100'} rounded-xl mb-4`}>
                  {[{id:'project',label:'Project',icon:<Code2 className="w-3.5 h-3.5"/>},{id:'challenge',label:'Challenge',icon:<Target className="w-3.5 h-3.5"/>},{id:'path',label:'Path',icon:<Map className="w-3.5 h-3.5"/>}].map(tab=>(
                    <button key={tab.id} onClick={()=>setActiveCard(tab.id as any)} className={`hover-btn flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeCard===tab.id?`${isDark?'bg-primary-600 text-white':'bg-primary-500 text-white'} shadow-lg`:`${isDark?'text-neutral-400 hover:text-neutral-300':'text-neutral-600 hover:text-neutral-700'}`}`}>{tab.icon}{tab.label}</button>
                  ))}
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${isDark?'text-secondary-400':'text-secondary-600'} uppercase tracking-widest mb-2`}>
                      <div className={`w-3.5 h-0.5 ${isDark?'bg-secondary-400':'bg-secondary-600'} rounded`}/>{activeContent.tag}
                    </div>
                    <h3 className={`text-xl font-black ${isDark?'text-white':'text-neutral-900'} mb-1`}>{activeContent.title}</h3>
                    <p className={`text-sm ${isDark?'text-neutral-400':'text-neutral-500'} leading-relaxed`}>{activeContent.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/12 border border-green-500/25 rounded-full px-3 py-1.5 text-xs font-bold text-green-500 flex-shrink-0 ml-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Active
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${isDark?'text-neutral-400':'text-neutral-500'} font-semibold`}>Progress</span>
                    <span className={`text-sm font-black ${isDark?'text-primary-400':'text-primary-600'} font-mono`}>{activeContent.progress}%</span>
                  </div>
                  <div className={`h-2 ${isDark?'bg-neutral-800':'bg-neutral-200'} rounded-full overflow-hidden`}>
                    <motion.div key={activeCard} initial={{width:0}} animate={{width:`${activeContent.progress}%`}} transition={{duration:1}} className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg shadow-primary-500/50"/>
                  </div>
                </div>
                {/* Tasks fill remaining space */}
                <div className="space-y-2 flex-1">
                  {activeContent.tasks.map(task=>(
                    <div key={task.id} className={`hover-row flex items-center gap-3 p-3 ${isDark?'bg-neutral-800/50 border-neutral-700/50':'bg-neutral-50 border-neutral-200'} border rounded-xl cursor-pointer`}>
                      <div className={`w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center ${task.done?'bg-gradient-to-br from-green-500 to-emerald-500 text-white':`${isDark?'bg-neutral-700 border-neutral-600':'bg-white border-neutral-300'} border`}`}>
                        {task.done&&<CheckCircle2 className="w-3 h-3"/>}
                      </div>
                      <span className={`text-sm flex-1 ${task.done?`line-through ${isDark?'text-neutral-500':'text-neutral-400'}`:`${isDark?'text-neutral-300':'text-neutral-700'}`}`}>{task.text}</span>
                      <span className={`text-xs font-bold ${isDark?'text-primary-400':'text-primary-600'} font-mono`}>+{task.xp} XP</span>
                    </div>
                  ))}
                </div>
                {/* Buttons pinned to bottom */}
                <div className="flex gap-3 mt-4">
                  <button className="hover-btn flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-bold text-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    <span className="relative flex items-center justify-center gap-2"><Play className="w-4 h-4"/>Continue</span>
                  </button>
                  <button className={`hover-btn bg-transparent ${isDark?'border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:text-white':'border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'} border px-5 py-3 rounded-xl font-semibold text-sm`}>Details</button>
                </div>
              </div>
            </motion.div>

            {/* Right: Activity Tracker */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
              className={`hover-card ${cardDark} ${cardBase} ${cardPad} flex flex-col`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-base font-black ${isDark?'text-white':'text-neutral-900'} mb-1`}>Activity Tracker</h3>
                  <p className={`text-xs ${isDark?'text-neutral-500':'text-neutral-400'}`}>Last 14 weeks of coding activity</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`${isDark?'text-neutral-500':'text-neutral-400'} font-medium`}>Less</span>
                  {[0,1,2,3,4].map(l=><div key={l} className={`w-3 h-3 rounded-sm ${l===0?(isDark?'bg-neutral-800/50':'bg-neutral-200'):getActivityColor(l)}`}/>)}
                  <span className={`${isDark?'text-neutral-500':'text-neutral-400'} font-medium`}>More</span>
                </div>
              </div>

              {/* Heatmap + stats sidebar */}
              <div className="grid grid-cols-[1fr_auto] gap-5 flex-1">
                <div className="flex flex-col gap-4 min-w-0">
                  {/* Heatmap */}
                  <div className="overflow-x-auto overflow-y-visible py-1">
                    <div className="min-w-fit">
                      <div className="flex gap-[6px] mb-3 ml-12">
                        {contribution.monthLabels.map((label,i)=><div key={i} className={`text-[10px] font-bold ${isDark?'text-neutral-500':'text-neutral-400'} w-[28px] text-center`}>{label}</div>)}
                      </div>
                      <div className="flex gap-[6px]">
                        <div className="flex flex-col gap-[6px] text-[10px] font-semibold text-neutral-500 pr-1.5">
                          <div className="h-[28px]"/><div className="h-[28px] flex items-center">Mon</div><div className="h-[28px]"/><div className="h-[28px] flex items-center">Wed</div><div className="h-[28px]"/><div className="h-[28px] flex items-center">Fri</div><div className="h-[28px]"/>
                        </div>
                        <div className="flex gap-[6px]">
                          {contribution.weeks.map((week,wi)=>(
                            <div key={wi} className="flex flex-col gap-[6px]">
                              {week.map((day,di)=>{
                                const showBelow=di<3, showRight=wi<3;
                                return (
                                  <motion.div key={di} whileHover={{scale:1.15,zIndex:100}} className={`w-[28px] h-[28px] rounded-md ${getActivityColor(day.level)} cursor-pointer relative group transition-all shadow-sm hover:shadow-md hover:brightness-110`}>
                                    <div className={`absolute ${showBelow?'top-full mt-2':'bottom-full mb-2'} ${showRight?'left-full ml-2':'left-1/2 -translate-x-1/2'} px-3 py-2 ${isDark?'bg-neutral-800/95 border border-neutral-700/50':'bg-white border border-neutral-200'} ${isDark?'text-white':'text-neutral-900'} text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-[100] transition-all duration-150 shadow-xl backdrop-blur-sm`}>
                                      <div className={`font-bold text-sm mb-0.5 ${isDark?'text-white':'text-neutral-900'}`}>{day.date}</div>
                                      <div className={`${isDark?'text-neutral-300':'text-neutral-600'} text-xs`}>{day.tasks} tasks • {day.projects} projects</div>
                                      <div className={`${isDark?'text-neutral-400':'text-neutral-500'} text-xs`}>{day.hours}h focused</div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly bar chart */}
                  <div className={`${isDark?'bg-neutral-800/30':'bg-neutral-100'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-[10px] font-bold ${isDark?'text-neutral-400':'text-neutral-500'} uppercase tracking-wide`}>Last 7 Days</h4>
                      <div className={`text-[10px] ${isDark?'text-neutral-500':'text-neutral-400'} font-mono`}>27.0h total</div>
                    </div>
                    <div className="flex items-end gap-1.5" style={{height:'80px'}}>
                      {[{day:'M',h:'2.1h',height:34},{day:'T',h:'4.3h',height:55},{day:'W',h:'1.2h',height:16},{day:'T',h:'5.0h',height:66},{day:'F',h:'3.8h',height:48},{day:'S',h:'6.4h',height:80},{day:'S',h:'4.2h',height:54}].map(bar=>(
                        <div key={bar.day+bar.h} className="flex-1 flex flex-col items-center gap-1.5 group">
                          <div className="relative w-full">
                            <div className={`w-full rounded-t transition-all cursor-pointer hover:brightness-110 ${isDark?'bg-gradient-to-t from-primary-600 to-primary-400':'bg-gradient-to-t from-primary-500 to-primary-300'}`} style={{height:`${bar.height}px`}}/>
                            <div className={`absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 ${isDark?'bg-neutral-800/95 border border-neutral-700/50 text-white':'bg-white border border-neutral-200 text-neutral-900'} text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>{bar.h}</div>
                          </div>
                          <span className={`text-[9px] font-bold ${isDark?'text-neutral-500':'text-neutral-400'}`}>{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats sidebar */}
                <div className={`w-36 flex flex-col gap-3 ${isDark?'border-l border-neutral-800/50':'border-l border-neutral-300/50'} pl-5`}>
                  {[
                    {icon:<Flame className={`w-4 h-4 ${isDark?'text-orange-400':'text-orange-500'}`}/>,label:'Current Streak',value:stats.streak,color:isDark?'text-orange-400':'text-orange-500',sub:'days in a row',big:true},
                    {icon:<Crown className={`w-4 h-4 ${isDark?'text-amber-400':'text-amber-500'}`}/>,label:'Best Streak',value:stats.bestStreak||0,color:isDark?'text-amber-400':'text-amber-500',sub:'all-time record',big:false},
                    {icon:<Calendar className={`w-4 h-4 ${isDark?'text-primary-400':'text-primary-500'}`}/>,label:'Active Days',value:contribution.lastNDays.filter(d=>d.value>0).length,color:isDark?'text-primary-400':'text-primary-500',sub:`out of ${contribution.lastNDays.length}`,big:false},
                    {icon:<TrendingUp className={`w-4 h-4 ${isDark?'text-green-400':'text-green-500'}`}/>,label:'Completion',value:`${Math.round((contribution.lastNDays.filter(d=>d.value>0).length/contribution.lastNDays.length)*100)}%`,color:isDark?'text-green-400':'text-green-500',sub:'activity rate',big:false},
                  ].map((s,i)=>(
                    <div key={i} className={`${i>0?`pt-3 border-t ${isDark?'border-neutral-800/50':'border-neutral-300/50'}`:''}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">{s.icon}<span className={`text-[10px] font-semibold ${isDark?'text-neutral-400':'text-neutral-500'}`}>{s.label}</span></div>
                      <div className={`${s.big?'text-2xl':'text-xl'} font-black ${s.color} font-mono leading-tight`}>{s.value}</div>
                      <div className={`text-[10px] ${isDark?'text-neutral-500':'text-neutral-400'} mt-0.5`}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom summary — matches card padding */}
              <div className={`grid grid-cols-3 gap-3 mt-5 pt-4 border-t ${isDark?'border-neutral-800/50':'border-neutral-300/50'}`}>
                {[
                  {value:`${contribution.lastNDays.reduce((s,d)=>s+d.hours,0).toFixed(0)}h`,label:'Total Time',color:isDark?'text-primary-400':'text-primary-600'},
                  {value:contribution.lastNDays.reduce((s,d)=>s+d.projects,0),label:'Projects',color:isDark?'text-secondary-400':'text-secondary-600'},
                  {value:contribution.lastNDays.reduce((s,d)=>s+d.tasks,0),label:'Tasks Done',color:isDark?'text-accent-400':'text-accent-600'},
                ].map((m,i)=>(
                  <div key={i} className="text-center">
                    <div className={`text-base font-black ${m.color} mb-0.5 font-mono`}>{m.value}</div>
                    <div className={`text-[10px] ${isDark?'text-neutral-500':'text-neutral-400'} font-medium`}>{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ROW 3: Leaderboard — full width */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
            className={`hover-card ${cardDark} ${cardBase} ${cardPad}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-black ${isDark?'text-white':'text-neutral-900'} mb-1`}>Global Leaderboard</h3>
                <p className={`text-xs ${isDark?'text-neutral-500':'text-neutral-400'}`}>Top coders this month</p>
              </div>
              <button onClick={()=>router.push('/leaderboard')} className={`hover-btn flex items-center gap-2 ${isDark?'text-primary-400 hover:text-primary-300':'text-primary-600 hover:text-primary-700'} font-bold text-sm`}>
                View All <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
            <div className="space-y-2">
              {leaderboardData.slice(0,5).map(u=>(
                <motion.div key={u.rank} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:u.rank*0.05}} whileHover={{x:4}}
                  className={`hover-row flex items-center gap-3 p-3 rounded-xl border ${u.isMe?`${isDark?'bg-primary-600/10 border-primary-600/25':'bg-primary-100/50 border-primary-200'}`:`${isDark?'bg-neutral-800/50 border-neutral-700/50 hover:border-neutral-600':'bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}`}>
                  <div className={`w-8 text-center font-black font-mono text-lg flex-shrink-0 ${u.rank===1?'text-amber-500':u.rank===2?'text-slate-400':u.rank===3?'text-orange-600':`${isDark?'text-neutral-500':'text-neutral-400'}`}`}>{u.rank}</div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center font-bold text-sm flex-shrink-0 text-white shadow-lg`}>{u.avatar}</div>
                  <div className="flex-1"><div className={`font-bold text-sm ${isDark?'text-white':'text-neutral-900'}`}>{u.name}</div></div>
                  <div className={`text-base font-black ${isDark?'text-primary-400':'text-primary-600'} font-mono`}>{u.points.toLocaleString()}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
