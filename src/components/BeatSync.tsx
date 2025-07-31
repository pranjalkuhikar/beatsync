"use client";

import React, { useState } from "react";
import FaceDetection from "./FaceDetection";
import MoodIndicator from "./MoodIndicator";
import SongCard from "./SongCard";
import { songService, Song } from "@/services/songService";

const BeatSync: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getMoodFromExpression = (expression: string): string => {
    const expressionLower = expression.toLowerCase();

    if (
      expressionLower.includes("happy") ||
      expressionLower.includes("surprised")
    ) {
      return "happy";
    } else if (
      expressionLower.includes("sad") ||
      expressionLower.includes("fearful")
    ) {
      return "sad";
    } else if (
      expressionLower.includes("angry") ||
      expressionLower.includes("disgusted")
    ) {
      return "angry";
    } else if (expressionLower.includes("neutral")) {
      return "neutral";
    } else {
      return "happy"; // default mood
    }
  };

  const handleExpressionDetected = async (
    detectedExpression: string,
    detectedConfidence: number
  ) => {
    setExpression(detectedExpression);
    setConfidence(detectedConfidence);

    if (
      detectedExpression &&
      detectedExpression !== "No face detected" &&
      detectedExpression !== "Detection failed"
    ) {
      setIsLoading(true);
      try {
        const mood = getMoodFromExpression(detectedExpression);
        const songs = await songService.getSongsByMood(mood);
        setSuggestedSongs(songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSuggestedSongs([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestedSongs([]);
    }
  };

  const handleDetectClick = () => {
    setIsDetecting(true);
    setExpression("");
    setConfidence(0);
    setSuggestedSongs([]);

    // Simulate detection time
    setTimeout(() => {
      setIsDetecting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-6 text-shadow-lg font-display animate-float">
            🎵 BeatSync 🎭
          </h1>
          <p className="text-2xl text-white text-shadow font-medium opacity-90">
            Your face, your mood, your perfect music
          </p>
          <div className="mt-4 w-24 h-1 bg-white mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Face Detection */}
          <div className="space-y-6">
            <div className="card p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center font-display">
                <span className="mr-4 text-4xl">📷</span>
                Face Detection
              </h2>
              <FaceDetection
                onExpressionDetected={handleExpressionDetected}
                isDetecting={isDetecting}
              />

              {/* Detection Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleDetectClick}
                  disabled={isDetecting}
                  className="btn-primary text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDetecting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Detecting...
                    </span>
                  ) : (
                    "Detect My Mood & Find Music"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Mood Indicator */}
          <div className="space-y-6">
            <div className="card p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center font-display">
                <span className="mr-4 text-4xl">🎭</span>
                Mood Analysis
              </h2>
              <MoodIndicator
                expression={expression}
                confidence={confidence}
                isDetecting={isDetecting}
              />
            </div>
          </div>
        </div>

        {/* Song Suggestions Section */}
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center font-display">
            <span className="mr-4 text-4xl">🎵</span>
            Suggested Songs
          </h2>

          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin w-16 h-16 mx-auto mb-6">
                <svg
                  className="w-full h-full text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-xl text-gray-700 font-medium">
                Finding perfect songs for your mood...
              </p>
            </div>
          )}

          {!isLoading && suggestedSongs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}

          {!isLoading &&
            suggestedSongs.length === 0 &&
            expression &&
            expression !== "No face detected" &&
            expression !== "Detection failed" && (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🎵</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4 font-display">
                  No songs found for this mood
                </h3>
                <p className="text-gray-600 text-lg">
                  Try adding some songs to your library first!
                </p>
              </div>
            )}

          {!expression && !isDetecting && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 animate-float">🎭</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 font-display">
                Ready to discover your mood music?
              </h3>
              <p className="text-gray-600 text-lg">
                Click the detect button to get started!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="glass-dark rounded-full px-8 py-4 inline-block">
            <p className="text-white font-medium text-shadow">
              Powered by AI Face Detection & Mood Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatSync;
