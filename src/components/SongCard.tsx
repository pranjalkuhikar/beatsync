"use client";

import React, { useState } from "react";
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

const getMoodColor = (mood: string): string => {
  const moodLower = mood.toLowerCase();
  switch (moodLower) {
    case "happy":
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    case "sad":
      return "bg-blue-100 border-blue-300 text-blue-800";
    case "angry":
      return "bg-red-100 border-red-300 text-red-800";
    case "neutral":
      return "bg-gray-100 border-gray-300 text-gray-800";
    case "energetic":
      return "bg-orange-100 border-orange-300 text-orange-800";
    case "calm":
      return "bg-green-100 border-green-300 text-green-800";
    default:
      return "bg-purple-100 border-purple-300 text-purple-800";
  }
};

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

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
  };

  const handleAudioRef = (ref: HTMLAudioElement | null) => {
    setAudioRef(ref);
    if (ref) {
      ref.addEventListener("ended", handleAudioEnded);
    }
  };

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Thumbnail Section */}
      <div className="relative h-56 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-7xl mb-3 animate-float">
              {getMoodEmoji(song.mood)}
            </div>
            <div className="text-lg font-semibold opacity-90 text-shadow">
              Mood Music
            </div>
          </div>
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute top-4 right-4 w-14 h-14 bg-white bg-opacity-95 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          {isPlaying ? (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700 ml-1"
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

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 truncate flex-1 mr-3 font-display">
            {song.title}
          </h3>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getMoodColor(
              song.mood
            )}`}
          >
            {getMoodEmoji(song.mood)} {song.mood}
          </span>
        </div>

        {/* Audio Player */}
        <div className="space-y-4">
          <audio
            ref={handleAudioRef}
            src={song.url}
            preload="metadata"
            className="w-full"
          />

          {/* Custom Audio Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 ml-0.5"
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

            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                {isPlaying ? "Now Playing" : "Click to play"}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: isPlaying ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
