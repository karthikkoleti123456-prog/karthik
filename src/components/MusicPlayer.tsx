import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ListMusic } from 'lucide-react';
import { TR_ACKS } from '../data/musicTracks';
import { Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTrackList, setShowTrackList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TR_ACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(err => console.error("Playback error:", err));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TR_ACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TR_ACKS.length) % TR_ACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-[400px] bg-cyber-gray border-2 border-neon-pink rounded-xl p-6 neon-shadow-pink relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px]"
        style={{ backgroundColor: currentTrack.color, opacity: 0.15 }}
      />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex gap-4 items-center">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0"
          >
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex-1 overflow-hidden">
            <motion.h3 
              key={`${currentTrack.id}-title`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-display text-neon-pink neon-text-pink truncate"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p 
              key={`${currentTrack.id}-artist`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-mono text-white/60 tracking-wider truncate"
            >
              {currentTrack.artist}
            </motion.p>
          </div>
        </div>

        {/* Visualizer Mockup */}
        <div className="flex items-end justify-center gap-1 h-8 px-4">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full bg-neon-pink/40 rounded-t-sm"
              animate={{ 
                height: isPlaying ? [
                  Math.random() * 8 + 4,
                  Math.random() * 24 + 8,
                  Math.random() * 8 + 4
                ] : '4px' 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.4 + Math.random() * 0.4,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-pink neon-shadow-pink"
              style={{ width: `${progress}%` }}
              transition={{ type: 'tween', ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/40 tracking-wider">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60) || 0).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center px-4">
          <button 
            onClick={() => setShowTrackList(!showTrackList)}
            className="text-white/40 hover:text-neon-blue transition-colors"
          >
            <ListMusic size={20} />
          </button>

          <div className="flex items-center gap-6">
            <button 
              onClick={prevTrack}
              className="text-white/80 hover:text-neon-pink transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full border-2 border-neon-pink flex items-center justify-center text-neon-pink hover:bg-neon-pink hover:text-black transition-all neon-shadow-pink group"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={nextTrack}
              className="text-white/80 hover:text-neon-pink transition-colors"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <div className="text-white/40">
            <Volume2 size={20} />
          </div>
        </div>
      </div>

      {/* Track List Overlay */}
      <AnimatePresence>
        {showTrackList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-cyber-gray border-2 border-neon-pink rounded-xl p-4 neon-shadow-pink z-30"
          >
            <h4 className="font-display text-xs text-neon-pink mb-4 uppercase tracking-[0.2em]">Data Banks</h4>
            <div className="space-y-2">
              {TR_ACKS.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(i);
                    setIsPlaying(true);
                    setShowTrackList(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentTrackIndex === i ? 'bg-neon-pink/20 border border-neon-pink/40' : 'hover:bg-white/5'}`}
                >
                  <img src={track.cover} className="w-10 h-10 rounded object-cover" alt="" />
                  <div className="text-left overflow-hidden">
                    <p className={`text-sm tracking-tight truncate ${currentTrackIndex === i ? 'text-neon-pink' : 'text-white/80'}`}>{track.title}</p>
                    <p className="text-[10px] text-white/40 uppercase font-mono">{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
