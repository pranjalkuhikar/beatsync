"use client";

import React, { useState, useEffect } from "react";
import { Song } from "@/services/songService";

interface SongCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
}

const getMoodEmoji = (mood: string): string => {
  const moodLower = mood.toLowerCase();
  switch (moodLower) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "angry":
      return "😠";
    case "neutral":
      return "😐";
    case "energetic":
      return "⚡";
    case "calm":
      return "😌";
    default:
      return "🎵";
  }
};

const getMoodGradient = (mood: string): string => {
  const moodLower = mood.toLowerCase();
  switch (moodLower) {
    case "happy":
      return "from-yellow-400 to-orange-400";
    case "sad":
      return "from-blue-400 to-indigo-400";
    case "angry":
      return "from-red-400 to-pink-400";
    case "neutral":
      return "from-gray-400 to-gray-300";
    case "energetic":
      return "from-orange-400 to-red-400";
    case "calm":
      return "from-green-400 to-teal-400";
    default:
      return "from-purple-400 to-pink-400";
  }
};

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef) {
      setCurrentTime(audioRef.currentTime);
      setProgress((audioRef.currentTime / audioRef.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef) {
      setDuration(audioRef.duration);
    }
  };

  const handleAudioRef = (ref: HTMLAudioElement | null) => {
    setAudioRef(ref);
    if (ref) {
      ref.addEventListener("ended", handleAudioEnded);
      ref.addEventListener("timeupdate", handleTimeUpdate);
      ref.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickPercent = clickX / width;
      const newTime = clickPercent * audioRef.duration;
      audioRef.currentTime = newTime;
    }
  };

  return (
    <div className="music-player-card p-6 animate-fade-in-up shadow-lg shadow-primary/20 border-t-2 border-primary-light/30">
      {/* CD-Style Album Cover Section */}
      <div className="relative mb-6">
        <div className="album-cover w-full h-64 flex items-center justify-center relative overflow-hidden neumorphic">
          {/* Background gradient based on mood */}
          <div
            className={`absolute inset-0 ${song.mood ? `mood-${song.mood}` : 'bg-gradient-to-br from-primary to-primary-dark'} opacity-30`}
          ></div>
          
          {/* CD-Style Album Art */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {/* Vinyl Record Disc */}
            <div className={`vinyl-disc relative w-56 h-56 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-xl flex items-center justify-center transition-all duration-500 ${isPlaying ? 'animate-spin-slow shadow-lg shadow-primary/30' : ''}`}>
              {/* Vinyl Grooves */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* Radial grooves */}
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute rounded-full border border-gray-700 opacity-30"
                    style={{
                      width: `${100 - i * 10}%`,
                      height: `${100 - i * 10}%`,
                      top: `${i * 5}%`,
                      left: `${i * 5}%`
                    }}
                  ></div>
                ))}
                
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 rounded-full opacity-10" 
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.5) 31%, transparent 32%, transparent 70%, rgba(0, 0, 0, 0.5) 71%, transparent 72%), radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.5) 31%, transparent 32%, transparent 70%, rgba(0, 0, 0, 0.5) 71%, transparent 72%)`,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px'
                  }}>
                </div>
              </div>
              
              {/* Center Hole */}
              <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-gray-600 flex items-center justify-center z-10">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              </div>
              
              {/* Vinyl Reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white to-transparent opacity-10 animate-rotate-3d"></div>
              
              {/* Record Label */}
              <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center z-10 border-2 border-gray-300 shadow-inner">
                {/* Song Title with Background */}
                <div className="relative w-[85%] py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-black text-xl font-bold text-center px-3 truncate max-w-full">
                    {song.title}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Light Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-5 animate-shimmer"></div>
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute top-4 right-4 w-16 h-16 bg-primary bg-opacity-95 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-primary/50 transform hover:scale-110 backdrop-blur-sm border border-primary-light/50"
        >
          {isPlaying ? (
            <svg
              className="w-8 h-8 text-light"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-light"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Mood Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-4 py-2 glass-dark text-light rounded-full text-sm font-semibold border border-primary-light border-opacity-50 backdrop-blur-sm shadow-lg hover:shadow-primary/30 transition-all duration-300">
            {getMoodEmoji(song.mood)} {song.mood.charAt(0).toUpperCase() + song.mood.slice(1)}
          </span>
        </div>
      </div>

      {/* Audio Player */}
      <div className="space-y-4">
        <audio
          ref={handleAudioRef}
          src={song.url}
          preload="metadata"
          className="hidden"
        />

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-light opacity-80">
            <span className="font-mono">{formatTime(currentTime)}</span>
            <span className="font-mono">{formatTime(duration)}</span>
          </div>

          <div
            className="progress-bar h-3 cursor-pointer bg-gray-700 rounded-full"
            onClick={handleProgressClick}
          >
            <div
              className="progress-fill h-full rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-handle w-4 h-4 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 border border-primary-light/50 shadow-primary/30 shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handlePlayPause}
            className="w-14 h-14 bg-gradient-to-r from-primary to-primary-dark text-light rounded-full flex items-center justify-center hover:from-primary-light hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/50 transform hover:scale-110 neumorphic-inset"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="glass inline-block px-4 py-1 rounded-full text-sm font-medium shadow-md border border-primary-light/30">
            {isPlaying ? "Now Playing" : "Click to play"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
