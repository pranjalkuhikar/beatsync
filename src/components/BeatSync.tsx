"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';

const FaceDetection = dynamic(() => import('./FaceDetection'), { ssr: false });
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
    <div className="min-h-screen bg-gradient-to-br from-dark via-primary-dark to-primary p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-7xl font-bold text-light mb-8 text-shadow-lg font-display animate-float">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">🎵 BeatSync 🎭</span>
          </h1>
          <p className="text-3xl text-light text-shadow font-medium opacity-90 mb-6">
            Your face, your mood, your perfect music
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-light to-secondary-light mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Face Detection */}
          <div className="space-y-8 animate-slide-in">
            <div className="card-dark p-8 border-l-4 border-primary">
              <h2 className="text-4xl font-bold text-light mb-8 flex items-center font-display">
                <span className="mr-6 text-5xl animate-float">📷</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-light">Face Detection</span>
              </h2>
              <FaceDetection
                onExpressionDetected={handleExpressionDetected}
                isDetecting={isDetecting}
              />

              {/* Detection Button */}
              <div className="mt-10 text-center">
                <button
                  onClick={handleDetectClick}
                  disabled={isDetecting}
                  className="btn-primary text-xl px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/50 transition-all duration-300"
                >
                  {isDetecting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-800"
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
          <div
            className="space-y-8 animate-slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="card-dark p-8 border-l-4 border-secondary">
              <h2 className="text-4xl font-bold text-light mb-8 flex items-center font-display">
                <span className="mr-6 text-5xl animate-float">🎭</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-light">Mood Analysis</span>
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
        <div
          className="card-dark p-8 animate-fade-in-up border-t-4 border-primary-light rounded-b-3xl"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-4xl font-bold text-light mb-10 flex items-center font-display">
            <span className="mr-6 text-5xl animate-float">🎵</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-secondary-light to-light">Suggested Songs</span>
          </h2>

          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin w-20 h-20 mx-auto mb-8">
                <svg
                  className="w-full h-full text-primary-light"
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
              <p className="text-2xl text-light font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light inline-block">
                Finding perfect songs for your mood...
              </p>
            </div>
          )}

          {!isLoading && suggestedSongs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SongCard song={song} />
                </div>
              ))}
            </div>
          )}

          {!isLoading &&
            suggestedSongs.length === 0 &&
            expression &&
            expression !== "No face detected" &&
            expression !== "Detection failed" && (
              <div className="text-center py-20">
                <div className="text-9xl mb-8 animate-float">🎧</div>
                <h3 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light inline-block mb-6 font-display">
                  No songs found for this mood
                </h3>
                <p className="text-xl text-gray-400 mt-4 glass p-4 inline-block rounded-xl">
                  Try adding some songs to your library first!
                </p>
              </div>
            )}

          {!expression && !isDetecting && (
            <div className="text-center py-20">
              <div className="text-9xl mb-8 animate-float">🎭</div>
              <h3 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light inline-block mb-6 font-display">
                Ready to discover your mood music?
              </h3>
              <p className="text-xl glass p-4 inline-block rounded-xl">
                Click the detect button to get started!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="glass-dark rounded-full px-10 py-6 inline-block border border-primary-light shadow-lg shadow-primary/20">
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light font-semibold text-lg">
              Powered by AI Face Detection & Mood Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatSync;
