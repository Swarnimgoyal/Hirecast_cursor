"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Users, Activity, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-black to-black py-24 px-6 text-center border border-white/5 mx-4 md:mx-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400 border border-purple-500/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live on Devnet
            </div>
            <p className="text-xs text-red-400 font-medium tracking-wide border border-red-500/20 bg-red-950/30 px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2">
              ⚠️ Warning: Please use Solana Devnet strictly for all transactions.
            </p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            NEXUS – The Prediction Game
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
            Predict outcomes, challenge the crowd, and earn rewards. <br className="hidden md:block"/>
            The gamified prediction market built for the future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/markets" 
              className="group flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
            >
              Start Trading
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/arena" 
              className="group flex items-center justify-center gap-2 bg-purple-900/30 text-white border border-purple-500/30 hover:bg-purple-900/50 font-bold py-4 px-8 rounded-full transition-all transform hover:-translate-y-1 backdrop-blur-sm"
            >
              Join Arena
              <Users className="w-5 h-5 text-purple-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8 text-blue-400" />}
            title="Dynamic Markets"
            description="Live Yes/No prediction markets on news, crypto, and culture."
            link="/markets"
            color="blue"
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-red-400" />}
            title="Arena Mode"
            description="Predict crowd sentiment vs reality. Battle for the top spot."
            link="/arena"
            color="red"
          />
          <FeatureCard 
            icon={<Trophy className="w-8 h-8 text-yellow-400" />}
            title="Quests & XP"
            description="Complete daily challenges, earn XP, and level up your profile."
            link="/quests"
            color="yellow"
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-green-400" />}
            title="Admin Panel"
            description="Live admin monitoring, simulations, and market management."
            link="/admin"
            color="green"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 md:px-0 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It <span className="text-purple-400">Works</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
          
          <StepCard 
            number="01"
            title="Choose a Market"
            description="Browse active markets and find a topic you know about."
          />
          <StepCard 
            number="02"
            title="Make a Prediction"
            description="Buy 'Yes' or 'No' shares based on your conviction."
          />
          <StepCard 
            number="03"
            title="Earn & Level Up"
            description="Win to earn rewards, build your Prediction DNA, and climb the leaderboard."
          />
        </div>
      </section>

      {/* Sponsors / Powered By */}
      <section className="text-center py-12 border-t border-white/5 mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
          Powered By
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-purple-500/30 transition-colors group">
            <span className="text-xl">🔌</span>
            <div className="text-left">
              <div className="font-bold text-gray-200 group-hover:text-purple-400 transition-colors">PNP Adapter</div>
              <div className="text-xs text-gray-500">Secure Transaction Verification</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-blue-500/30 transition-colors group">
            <span className="text-xl">⛓️</span>
            <div className="text-left">
              <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">Solana Devnet</div>
              <div className="text-xs text-gray-500">High-Speed Settlement</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, color }: { icon: any, title: string, description: string, link: string, color: string }) {
  const colorClasses = {
    blue: "group-hover:text-blue-400 border-blue-500/0 group-hover:border-blue-500/30",
    red: "group-hover:text-red-400 border-red-500/0 group-hover:border-red-500/30",
    yellow: "group-hover:text-yellow-400 border-yellow-500/0 group-hover:border-yellow-500/30",
    green: "group-hover:text-green-400 border-green-500/0 group-hover:border-green-500/30",
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:bg-gray-900/80 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${colorClasses[color as keyof typeof colorClasses].split(' ').pop()}`} />
      
      <div className="mb-4 p-3 bg-black/50 rounded-xl w-fit border border-white/5 shadow-inner">
        {icon}
      </div>
      
      <h3 className={`text-xl font-bold mb-2 transition-colors ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`}>
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 text-sm leading-relaxed h-10">
        {description}
      </p>
      
      <Link 
        href={link}
        className="inline-flex items-center text-sm font-bold text-white/70 group-hover:text-white transition-colors"
      >
        Explore
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center relative z-10">
      <div className="w-24 h-24 rounded-full bg-black border-4 border-gray-900 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        <span className="text-3xl font-black text-gray-800">{number}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 max-w-xs">{description}</p>
    </div>
  );
}
