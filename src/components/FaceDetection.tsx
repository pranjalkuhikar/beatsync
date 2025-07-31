"use client";

import React, { useRef, useEffect, useState } from "react";

interface FaceDetectionProps {
  onExpressionDetected: (expression: string, confidence: number) => void;
  isDetecting: boolean;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({
  onExpressionDetected,
  isDetecting,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [faceapi, setFaceapi] = useState<
    typeof import("@vladmandic/face-api") | null
  >(null);
  const [loadModels, setLoadModels] = useState<(() => Promise<void>) | null>(
    null
  );
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const faceapiModule = await import("@vladmandic/face-api");
      const loadModelsModule = await import("../lib/loadModels");
      setFaceapi(faceapiModule);
      setLoadModels(() => loadModelsModule.loadModels);
    };
    load();
  }, []);

  useEffect(() => {
    if (loadModels) {
      loadModels().then(startVideo);
    }
  }, [loadModels]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setIsVideoReady(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const detectExpression = async () => {
    if (!videoRef.current || !faceapi || !isVideoReady) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions as unknown as Record<
          string,
          number
        >;
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const topExpression = sorted[0] as [string, number];

        onExpressionDetected(topExpression[0], topExpression[1]);
      } else {
        onExpressionDetected("No face detected", 0);
      }
    } catch (error) {
      console.error("Detection error:", error);
      onExpressionDetected("Detection failed", 0);
    }
  };

  useEffect(() => {
    if (isDetecting && isVideoReady) {
      detectExpression();
    }
  }, [isDetecting, isVideoReady]);

  return (
    <div className="relative">
      {/* Camera Container */}
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-2xl">
        <div className="relative overflow-hidden rounded-xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="640"
            height="480"
            className="w-full h-auto rounded-xl"
          />

          {/* Detection Overlay */}
          {isDetecting && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-pulse">
                  <svg
                    className="w-20 h-20 mx-auto mb-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xl font-semibold text-shadow">
                    Detecting Expression...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Status */}
          <div className="absolute top-4 left-4">
            <div
              className={`flex items-center space-x-3 px-4 py-2 rounded-full text-sm font-semibold ${
                isVideoReady
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isVideoReady ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></div>
              <span>{isVideoReady ? "Camera Ready" : "Initializing..."}</span>
            </div>
          </div>

          {/* Face Detection Frame */}
          {isDetecting && (
            <div className="absolute inset-0 border-4 border-yellow-400 border-dashed rounded-xl animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Camera Controls */}
      <div className="mt-6 flex justify-center">
        <div className="card rounded-full p-4">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Recording
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2 font-medium">Ready</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDetection;
