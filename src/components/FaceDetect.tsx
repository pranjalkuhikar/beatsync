"use client";

import React, { useRef, useEffect, useState } from "react";

const FaceDetect = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [expression, setExpression] = useState<string>("");
  const [faceapi, setFaceapi] = useState<
    typeof import("@vladmandic/face-api") | null
  >(null);
  const [loadModels, setLoadModels] = useState<(() => Promise<void>) | null>(
    null
  );

  useEffect(() => {
    // Dynamically import face-api and loadModels only on client side
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
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleDetect = async () => {
    if (!videoRef.current || !faceapi) return;

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

      setExpression(
        `${topExpression[0]} (${(topExpression[1] * 100).toFixed(1)}%)`
      );
    } else {
      setExpression("No face detected");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        className="rounded border"
      />
      <button
        onClick={handleDetect}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 active:scale-95"
      >
        Detect Expression
      </button>
      {expression && (
        <p className="text-xl font-bold">Expression: {expression}</p>
      )}
    </div>
  );
};

export default FaceDetect;
