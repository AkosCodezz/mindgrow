'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring as useSpringValue } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Code2, Brain, Zap, Target, Users, CheckCircle2, ArrowRight, Star, Play, Lightbulb, Rocket, Terminal
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 30 };
  const mouseXSpring = useSpringValue(mouseX, springConfig);
  const mouseYSpring = useSpringValue(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div ref={containerRef} className="relative bg-gradient-to-b from-neutral-50 via-neutral-50 to-primary-50/30 overflow-hidden">
      {/* Cursor follower */}
      <motion.div
        className="fixed w-6 h-6 border-2 border-primary-500/50 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ x: mouseXSpring, y: mouseYSpring, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Parallax background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/40 via-secondary-400/30 to-transparent rounded-full blur-3xl" />
        <motion.div style={{ y: y2 }} className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-accent-400/40 via-secondary-300/30 to-transparent rounded-full blur-3xl" />
        <motion.div style={{ y: y3 }} className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-primary-300/30 via-accent-300/30 to-transparent rounded-full blur-3xl" />
        <motion.div style={{ y: y4 }} className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl" />
        <motion.div style={{ y: y5, rotate: rotate1 }} className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-accent-400/25 to-secondary-400/25 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <motion.section style={{ opacity: opacity1, scale: scale1 }} className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-12 inline-block">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 animate-pulse" />
              <div className="relative flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 shadow-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur-md opacity-50" />
                  <div className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-3 rounded-xl">
                    <Terminal className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">CodeRift</h1>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-primary-200 shadow-lg mb-8">
              <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">AI-Powered Coding Companion</span>
            </div>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-7xl md:text-9xl font-display font-black mb-8 leading-[0.9]">
            <span className="inline-block bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">Master Code</span>
            <br />
            <span className="relative inline-block mt-4">
              <span className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 blur-3xl opacity-50 animate-pulse" />
              <span className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">Effortlessly</span>
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Your AI coding mentor adapts to your style, gives instant feedback, and turns complex concepts into interactive challenges you'll love.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              onClick={() => setShowAuth(true)}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="group relative px-10 py-5 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Rocket className="w-5 h-5" />Start Your Journey<ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-10 py-5 bg-white/80 backdrop-blur-md border-2 border-neutral-300 text-neutral-800 rounded-2xl font-bold text-lg shadow-lg">
              <Play className="w-5 h-5" />Watch Demo
            </motion.button>
          </motion.div>
        </div>

        <FloatingCodeSnippet delay={0} initialX={-200} initialY={100} />
        <FloatingCodeSnippet delay={2} initialX={200} initialY={-50} />
      </motion.section>

      {/* How It Works */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
              <span className="text-sm font-bold text-primary-700">HOW IT WORKS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Three Steps to Mastery</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="w-10 h-10" />, number: "01", title: "Set Your Goal", description: "Tell us what you want to build. Our AI creates a custom learning path just for you.", color: "from-primary-500 to-primary-600", bgColor: "bg-primary-50" },
              { icon: <Code2 className="w-10 h-10" />, number: "02", title: "Code & Learn", description: "Solve real challenges with live code execution. Get instant AI feedback as you type.", color: "from-secondary-500 to-secondary-600", bgColor: "bg-secondary-50" },
              { icon: <Rocket className="w-10 h-10" />, number: "03", title: "Build Projects", description: "Apply your skills to real projects. Ship code that matters and build your portfolio.", color: "from-accent-500 to-accent-600", bgColor: "bg-accent-50" }
            ].map((step, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} whileHover={{ y: -10 }} className="relative group">
                <div className={`absolute -inset-2 ${step.bgColor} rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500`} />
                <div className="relative bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl group-hover:shadow-2xl h-full">
                  <div className="text-7xl font-black text-neutral-100 mb-4">{step.number}</div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-4 font-display">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-primary-50/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-secondary-100 rounded-full mb-4">
              <span className="text-sm font-bold text-secondary-700">FEATURES</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Everything You Need</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain className="w-7 h-7" />, title: "AI Code Review", desc: "Get instant, context-aware feedback like having a senior dev mentor" },
              { icon: <Zap className="w-7 h-7" />, title: "Live Execution", desc: "Run code instantly. See results in real-time as you learn" },
              { icon: <Target className="w-7 h-7" />, title: "Adaptive Path", desc: "Challenges that evolve with you. Never too easy, never too hard" },
              { icon: <Users className="w-7 h-7" />, title: "Community", desc: "Join thousands of developers. Share solutions and learn together" },
              { icon: <Lightbulb className="w-7 h-7" />, title: "Smart Hints", desc: "AI-powered hints that guide without spoiling the solution" },
              { icon: <Sparkles className="w-7 h-7" />, title: "Gamified", desc: "Earn XP, unlock achievements, compete on leaderboards" }
            ].map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="group relative p-8 bg-white/70 backdrop-blur-lg rounded-3xl border border-neutral-200 hover:border-primary-300 transition-all shadow-lg hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards & Achievements - ÚJ SZEKCIÓ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-accent-100 rounded-full mb-4">
              <span className="text-sm font-bold text-accent-700">REWARDS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
              Code. Earn. Redeem.
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Every challenge you solve earns CodeRift Coins. Stack them up and redeem for real rewards.
            </p>
          </motion.div>

          {/* Coin System */}
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 via-primary-400/20 to-secondary-400/20 rounded-[3rem] blur-3xl" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[3rem] p-12 border-2 border-accent-200 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl">
                    💎
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">Earn Coins</h3>
                  <p className="text-neutral-600">Solve challenges, complete projects, help others. Every action earns you CodeRift Coins.</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl">
                    🏆
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">Unlock Badges</h3>
                  <p className="text-neutral-600">Hit milestones to unlock exclusive badges. Show off your coding journey on your profile.</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl">
                    🎁
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-2">Redeem Rewards</h3>
                  <p className="text-neutral-600">Trade coins for Pro membership, Amazon gift cards, exclusive swag, and more.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Redemption Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", coins: "500", reward: "1 Month Pro", color: "from-primary-500 to-primary-600" },
              { icon: "💳", coins: "1,000", reward: "$10 Gift Card", color: "from-secondary-500 to-secondary-600" },
              { icon: "👕", coins: "750", reward: "CodeRift Swag", color: "from-accent-500 to-accent-600" },
              { icon: "🎓", coins: "2,000", reward: "Certificate", color: "from-primary-600 to-secondary-600" }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-3xl blur-xl group-hover:opacity-20 transition-all`} />
                <div className="relative bg-white rounded-3xl p-6 border-2 border-neutral-200 hover:border-accent-300 transition-all shadow-lg hover:shadow-xl">
                  <div className="text-5xl mb-4 text-center">{item.icon}</div>
                  <div className="text-center mb-3">
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${item.color} rounded-full mb-2`}>
                      <span className="text-white font-black text-lg">{item.coins} 💎</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-neutral-900 text-center">{item.reward}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor */}
      <SyntaxHighlightedCodeEditor />

      {/* Pricing */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
              <span className="text-sm font-bold text-primary-700">PRICING</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Start Free, Scale Up</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "$0", period: "forever", features: ["100 challenges", "Basic AI hints", "Community access", "Progress tracking"], cta: "Start Free", highlighted: false },
              { name: "Pro", price: "$12", period: "per month", features: ["Unlimited challenges", "Advanced AI coach", "Code reviews", "1-on-1 mentoring", "Certificates"], cta: "Go Pro", highlighted: true },
              { name: "Team", price: "$99", period: "per month", features: ["Everything in Pro", "Team dashboard", "Custom content", "Admin controls", "Priority support"], cta: "Contact Sales", highlighted: false }
            ].map((plan, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} whileHover={{ y: -10 }} className={`relative group ${plan.highlighted ? 'md:scale-105' : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-black rounded-full shadow-xl z-10 animate-pulse">
                    MOST POPULAR
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.highlighted ? 'from-primary-400/30 to-secondary-400/30' : 'from-neutral-200/30 to-neutral-300/30'} rounded-3xl blur-2xl group-hover:blur-3xl transition-all`} />
                <div className={`relative bg-white rounded-3xl p-10 border-2 ${plan.highlighted ? 'border-primary-400 shadow-2xl' : 'border-neutral-200'} hover:border-primary-300 transition-all h-full flex flex-col`}>
                  <h3 className="text-3xl font-black text-neutral-900 mb-2">{plan.name}</h3>
                  <div className="mb-8">
                    <span className="text-6xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-neutral-500 ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-4 rounded-xl font-black text-lg transition-all ${plan.highlighted ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-xl hover:shadow-2xl' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent to-primary-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-accent-100 rounded-full mb-4">
              <span className="text-sm font-bold text-accent-700">TESTIMONIALS</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Loved by Developers</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Frontend Dev @ Stripe", content: "CodeRift's AI coach is insane. Like having a senior dev on call 24/7. Landed my dream job in 4 months.", rating: 5, avatar: "🧑‍💻" },
              { name: "Marcus Rodriguez", role: "Full-Stack Engineer", content: "Tried every platform. CodeRift's personalized learning path changed everything for me.", rating: 5, avatar: "👨‍💻" },
              { name: "Aisha Patel", role: "Engineer @ Google", content: "Complete beginner to production code in 6 months. The adaptive challenges kept me hooked.", rating: 5, avatar: "👩‍💻" }
            ].map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-300/20 to-primary-300/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200 hover:border-accent-300 transition-all shadow-lg">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 leading-relaxed text-lg font-medium">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-3xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-black text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-secondary-400/40 to-accent-400/40 rounded-[4rem] blur-3xl" />
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[4rem] p-16 border-2 border-primary-200 shadow-2xl">
              <div className="text-center">
                <h2 className="text-5xl md:text-6xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                  Start Coding Today
                </h2>
                <p className="text-xl text-neutral-600 mb-10">Join 50,000+ developers learning to code with AI</p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-6 py-4 rounded-2xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none text-lg bg-white/50 backdrop-blur-sm" />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-black text-lg shadow-xl">
                      Start Free
                    </motion.button>
                  </form>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-4xl mx-auto mb-4">✓</div>
                    <h3 className="text-3xl font-black text-neutral-900 mb-2">Welcome aboard! 🎉</h3>
                    <p className="text-neutral-600">Check your inbox for your magic link</p>
                  </motion.div>
                )}

                <p className="text-center text-sm text-neutral-500 mt-6">No spam ever. Start learning in 60 seconds.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-2 rounded-xl">
              <Terminal className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-display font-black text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CodeRift</h3>
          </div>
          <p className="text-center text-sm text-neutral-500">© 2024 CodeRift. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

function SyntaxHighlightedCodeEditor() {
  const [code, setCode] = useState(`function greet(name) {\n  return "Hello, " + name;\n}`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running...');
    setTimeout(() => {
      const hasReturn = code.includes('return');
      const hasPlus = code.includes('+') || code.includes('`');
      const hasParam = code.includes('name');
      
      if (!hasReturn) {
        setOutput('❌ Missing return statement!');
      } else if (hasReturn && hasPlus && hasParam) {
        setOutput('✅ Perfect! Your function works!\n\nTest:\ngreet("World") → "Hello, World" ✓\ngreet("CodeRift") → "Hello, CodeRift" ✓\n\n🎉 Challenge complete!');
      } else if (hasReturn) {
        setOutput('⚠️ Almost! Make sure to use the name parameter');
      } else {
        setOutput('💡 Try concatenating strings with +');
      }
      setIsRunning(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-accent-100 rounded-full mb-4">
            <span className="text-sm font-bold text-accent-700">TRY IT LIVE</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-display font-black mb-6 bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Code Right Now</h2>
          <p className="text-xl text-neutral-600">Solve a real challenge. Get instant feedback.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-all" />
          <div className="relative bg-neutral-900 rounded-[3rem] overflow-hidden border border-neutral-700/50 shadow-2xl">
            <div className="bg-neutral-800/90 px-6 py-4 flex items-center justify-between border-b border-neutral-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors" />
              </div>
              <span className="text-neutral-400 text-sm font-mono">challenge.js</span>
              <div className="w-16" />
            </div>

            <div className="px-8 py-6 bg-neutral-800/50 border-b border-neutral-700/30">
              <div className="flex gap-3 mb-4">
                <div className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">BEGINNER</div>
                <div className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-bold rounded-full border border-primary-500/30">CHALLENGE</div>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Greeting Function</h3>
              <p className="text-neutral-400 text-sm font-mono">
                Create a function that takes a name and returns a greeting.<br />
                Example: greet("Alice") {'->'} "Hello, Alice"
              </p>
            </div>

            {/* Code editor */}
            <div className="relative p-8 bg-neutral-900">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
              
              <div className="flex gap-4">
                {/* Line numbers */}
                <div className="flex flex-col font-mono text-base leading-relaxed text-neutral-600 select-none pt-0.5">
                  {code.split('\n').map((_, i) => (
                    <div key={i} className="text-right w-8">{i + 1}</div>
                  ))}
                </div>
                
                {/* Code textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-neutral-300 outline-none resize-none font-mono text-base leading-relaxed caret-white selection:bg-blue-500/40"
                  style={{ minHeight: '180px' }}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Output */}
            {output && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-8 py-6 bg-neutral-950 border-t border-neutral-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-bold text-neutral-500 tracking-wider">OUTPUT</span>
                </div>
                <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
              </motion.div>
            )}

            {/* Hint */}
            {showHint && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-8 py-6 bg-primary-900/10 border-t border-primary-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary-400" />
                  <span className="text-xs font-bold text-primary-400 tracking-wider">HINT</span>
                </div>
                <pre className="text-sm text-primary-200/90 font-mono leading-relaxed">{'Try: return "Hello, " + name;'}</pre>
              </motion.div>
            )}

            {/* Actions */}
            <div className="bg-neutral-800/90 px-8 py-5 border-t border-neutral-700/50 flex gap-3 items-center">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={runCode} disabled={isRunning} className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowHint(!showHint)} className="px-6 py-3 bg-neutral-700 text-neutral-200 rounded-xl font-bold hover:bg-neutral-600 transition-colors flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide' : 'Hint'}
              </motion.button>
              <div className="flex-1" />
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                <kbd className="px-2 py-1 bg-neutral-700 rounded text-neutral-400">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-neutral-700 rounded text-neutral-400">Enter</kbd>
                <span className="ml-1">to run</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCodeSnippet({ delay, initialX, initialY }: { delay: number; initialX: number; initialY: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: initialX, y: initialY }} animate={{ opacity: [0, 0.7, 0], x: [initialX, initialX + 100, initialX - 50], y: [initialY, initialY - 300, initialY - 500], rotate: [0, 10, -10] }} transition={{ duration: 12, delay, repeat: Infinity, ease: "easeInOut" }} className="absolute pointer-events-none hidden md:block">
      <div className="bg-neutral-900/90 backdrop-blur-md rounded-xl p-4 border border-neutral-700/50 shadow-2xl">
        <div className="flex gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <pre className="text-xs font-mono">
          <code className="text-purple-400">const</code> <code className="text-blue-300">magic</code> <code className="text-neutral-300">= () =&gt; &#123;</code>{'\n  '}<code className="text-purple-400">return</code> <code className="text-yellow-300">"✨"</code>{'\n'}<code className="text-neutral-300">&#125;</code>
        </pre>
      </div>
    </motion.div>
  );
}
