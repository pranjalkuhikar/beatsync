import * as faceapi from "@vladmandic/face-api";

export const loadModels = async () => {
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
};
