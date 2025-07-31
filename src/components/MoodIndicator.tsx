"use client";

import React from "react";

interface MoodIndicatorProps {
  expression: string;
  confidence: number;
  isDetecting: boolean;
}

const getMoodEmoji = (expression: string): string => {
  const expressionLower = expression.toLowerCase();
  switch (expressionLower) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "angry":
      return "😠";
    case "surprised":
      return "😲";
    case "fearful":
      return "😨";
    case "disgusted":
      return "🤢";
    case "neutral":
      return "😐";
    default:
      return "🎭";
  }
};

const getMoodColor = (expression: string): string => {
  const expressionLower = expression.toLowerCase();
  switch (expressionLower) {
    case "happy":
    case "surprised":
      return "from-yellow-400 to-orange-500";
    case "sad":
    case "fearful":
      return "from-blue-400 to-indigo-500";
    case "angry":
    case "disgusted":
      return "from-red-400 to-pink-500";
    case "neutral":
      return "from-gray-400 to-slate-500";
    default:
      return "from-purple-400 to-pink-500";
  }
};

const getMoodText = (expression: string): string => {
  const expressionLower = expression.toLowerCase();
  switch (expressionLower) {
    case "happy":
      return "Happy & Joyful";
    case "sad":
      return "Sad & Melancholic";
    case "angry":
      return "Angry & Intense";
    case "surprised":
      return "Surprised & Excited";
    case "fearful":
      return "Fearful & Anxious";
    case "disgusted":
      return "Disgusted & Repulsed";
    case "neutral":
      return "Neutral & Calm";
    default:
      return "Unknown Mood";
  }
};

const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  expression,
  confidence,
  isDetecting,
}) => {
  if (isDetecting) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-20 h-20 mx-auto mb-6">
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
        <h3 className="text-2xl font-bold text-gray-800 mb-3 font-display">
          Analyzing Your Mood...
        </h3>
        <p className="text-gray-600 text-lg">Please look at the camera</p>
      </div>
    );
  }

  if (
    !expression ||
    expression === "No face detected" ||
    expression === "Detection failed"
  ) {
    return (
      <div className="card p-8 text-center">
        <div className="text-8xl mb-6 animate-float">🎭</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3 font-display">
          No Expression Detected
        </h3>
        <p className="text-gray-600 text-lg">
          Please position your face in the camera
        </p>
      </div>
    );
  }

  const moodEmoji = getMoodEmoji(expression);
  const moodColor = getMoodColor(expression);
  const moodText = getMoodText(expression);
  const confidencePercentage = (confidence * 100).toFixed(1);

  return (
    <div className={`bg-gradient-to-r ${moodColor} rounded-2xl p-8 shadow-xl transform transition-all duration-500 hover:scale-105`}>
      <div className="text-center">
        {/* Mood Emoji */}
        <div className="text-9xl mb-6 animate-float">{moodEmoji}</div>

        {/* Mood Text */}
        <h3 className="text-3xl font-bold text-white mb-3 text-shadow font-display">{moodText}</h3>
        <p className="text-white opacity-90 mb-6 text-lg">Expression: {expression}</p>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-lg mb-3 font-semibold">
            <span>Confidence</span>
            <span>{confidencePercentage}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Mood Description */}
        <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-white text-base font-medium">
            {expression === "happy" &&
              "You're radiating positivity! Perfect for upbeat music."}
            {expression === "sad" &&
              "Feeling down? Let's find some comforting melodies."}
            {expression === "angry" &&
              "Channel that energy into powerful, intense tracks."}
            {expression === "surprised" &&
              "That excitement calls for energetic, dynamic music!"}
            {expression === "fearful" &&
              "Let's soothe those nerves with calming sounds."}
            {expression === "disgusted" &&
              "Time for some strong, assertive music to match."}
            {expression === "neutral" &&
              "A balanced mood deserves versatile, chill music."}
            {![
              "happy",
              "sad",
              "angry",
              "surprised",
              "fearful",
              "disgusted",
              "neutral",
            ].includes(expression) &&
              "Let's find the perfect music for your current state."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodIndicator;
