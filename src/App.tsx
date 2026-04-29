import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music, Gamepad2, Zap, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-neon-blue selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-pink/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-neon-green/5 blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-blue neon-shadow-blue flex items-center justify-center">
              <Zap className="text-black" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-tighter text-white uppercase italic">
                Neon<span className="text-neon-blue">Snake</span>
              </h1>
              <p className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Sector-7 // Beats & Bits</p>
            </div>
          </div>

          <div className="hidden md:flex gap-8">
            <div className="flex items-center gap-2 text-xs font-mono text-white/60 tracking-wider">
              <Radio size={14} className="text-neon-pink animate-pulse" />
              <span>LIVE_STREAM</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60 tracking-wider">
              <Gamepad2 size={14} className="text-neon-blue" />
              <span>CONTROLS_OK</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Stats Section (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-8 sticky top-24">
          <div className="p-6 border border-white/10 rounded-xl bg-white/5 space-y-4">
            <h4 className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase underline underline-offset-4">Session Info</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">Current Multiplier</p>
                <p className="text-2xl font-display text-neon-green neon-text-green">x1.5</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">Neural Sync</p>
                <p className="text-2xl font-display text-neon-blue neon-text-blue">98%</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-white/10 rounded-xl bg-white/5">
             <div className="flex items-center gap-3 mb-6">
               <Music className="text-neon-pink" size={18} />
               <h4 className="font-display text-xs tracking-widest uppercase">System Log</h4>
             </div>
             <div className="space-y-3 font-mono text-[10px] text-white/40">
                <p><span className="text-neon-blue">05:01:05</span> {`>`} Initialize Core</p>
                <p><span className="text-neon-blue">05:01:06</span> {`>`} Audio Stream Ready</p>
                <p><span className="text-neon-blue">05:01:07</span> {`>`} Waiting for Input...</p>
                {currentScore > 0 && (
                  <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <span className="text-neon-blue">T+{(currentScore / 10).toFixed(0)}</span> {`>`} Entity Consumed
                  </motion.p>
                )}
             </div>
          </div>
        </div>

        {/* Center Game Section */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full flex justify-center"
          >
            <SnakeGame onScoreChange={setCurrentScore} />
          </motion.div>
        </div>

        {/* Right Music Player Section */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8 sticky top-24">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <MusicPlayer />
          </motion.div>

          {/* Social / Credits */}
          <div className="w-full p-6 border border-white/10 rounded-xl bg-white/5 font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase leading-loose">
            <p>Protocol: V.3.1.4</p>
            <p>Aesthetic: Neon-Cyber</p>
            <p>Audio Engine: SoundHelix</p>
            <p className="mt-4 border-t border-white/10 pt-4 text-center italic">Crafted in sector-7_ai_studio</p>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav (Mobile) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full z-50">
        <button className="text-neon-blue"><Gamepad2 size={24} /></button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <button className="text-neon-pink"><Music size={24} /></button>
      </div>
    </div>
  );
}

