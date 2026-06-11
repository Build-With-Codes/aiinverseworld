"use client";

import { useEffect, useRef, useState } from "react";

type HandLandmark = {
  x: number;
  y: number;
  z?: number;
};

type HandDetectionResult = {
  landmarks?: HandLandmark[][];
  handednesses?: Array<Array<{ categoryName?: string; score?: number }>>;
};

type HandLandmarkerInstance = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => HandDetectionResult;
  close?: () => void;
};

type FilesetResolverModule = {
  forVisionTasks: (path: string) => Promise<unknown>;
};

type HandLandmarkerModule = {
  createFromOptions: (
    vision: unknown,
    options: {
      baseOptions: {
        modelAssetPath: string;
        delegate: "GPU" | "CPU";
      };
      runningMode: "VIDEO";
      numHands: number;
      minHandDetectionConfidence: number;
      minHandPresenceConfidence: number;
      minTrackingConfidence: number;
    },
  ) => Promise<HandLandmarkerInstance>;
};

declare global {
  interface Window {
    FilesetResolver?: FilesetResolverModule;
    HandLandmarker?: HandLandmarkerModule;
  }
}

const SCRIPT_ID = "mediapipe-tasks-vision";
const SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/vision_bundle.js";
const WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";
const ROUND_SECONDS = 20;

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.HandLandmarker && window.FilesetResolver) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load hand detection script.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load hand detection script."));
    document.head.appendChild(script);
  });
}

function drawHand(
  context: CanvasRenderingContext2D,
  landmarks: HandLandmark[],
  width: number,
  height: number,
  color: string,
) {
  context.lineWidth = 4;
  context.strokeStyle = color;
  context.fillStyle = color;

  for (const [start, end] of HAND_CONNECTIONS) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!a || !b) continue;

    context.beginPath();
    context.moveTo((1 - a.x) * width, a.y * height);
    context.lineTo((1 - b.x) * width, b.y * height);
    context.stroke();
  }

  for (const landmark of landmarks) {
    context.beginPath();
    context.arc((1 - landmark.x) * width, landmark.y * height, 5, 0, Math.PI * 2);
    context.fill();
  }
}

export function HandDetectGameClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<HandLandmarkerInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "complete" | "error">("idle");
  const [message, setMessage] = useState("Camera and hand detection run only in your browser.");
  const [hands, setHands] = useState(0);
  const [roundTime, setRoundTime] = useState(ROUND_SECONDS);
  const [bothHandsSeconds, setBothHandsSeconds] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [permissionState, setPermissionState] = useState("Waiting");

  useEffect(() => {
    const stored = window.localStorage.getItem("hand-detect-best-score");
    if (stored) setBestScore(Number(stored));

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = window.setInterval(() => {
      setRoundTime((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("complete");
          setMessage("Round complete. Try again and keep both hands visible longer.");
          return 0;
        }

        return current - 1;
      });

      setBothHandsSeconds((current) => {
        if (hands < 2) return current;
        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hands, status]);

  useEffect(() => {
    if (status !== "complete") return;

    setBestScore((current) => {
      const next = Math.max(current, bothHandsSeconds);
      window.localStorage.setItem("hand-detect-best-score", String(next));
      return next;
    });
  }, [bothHandsSeconds, status]);

  async function startCamera() {
    setStatus("loading");
    setMessage("Loading hand model and requesting camera permission...");

    try {
      // Get getUserMedia with fallbacks
      let getUserMedia: any = null;

      if (navigator.mediaDevices?.getUserMedia) {
        getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      } else if ((navigator as any).getUserMedia) {
        getUserMedia = (navigator as any).getUserMedia.bind(navigator);
      } else if ((navigator as any).webkitGetUserMedia) {
        getUserMedia = (navigator as any).webkitGetUserMedia.bind(navigator);
      } else if ((navigator as any).mozGetUserMedia) {
        getUserMedia = (navigator as any).mozGetUserMedia.bind(navigator);
      }

      if (!getUserMedia) {
        // Check if localhost on HTTP
        if (window.location.hostname === "localhost" && window.location.protocol === "http:") {
          throw new Error("Camera works on localhost. Try accessing via http://localhost:3000 or use HTTPS.");
        }
        throw new Error("Camera not supported. Use Chrome, Firefox, Edge, or Safari on HTTPS.");
      }

      await loadScript();

      if (!window.FilesetResolver || !window.HandLandmarker) {
        throw new Error("Hand detection library did not initialize.");
      }

      const vision = await window.FilesetResolver.forVisionTasks(WASM_PATH);
      landmarkerRef.current = await window.HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55,
      });

      const stream = await getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setPermissionState("Allowed");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("ready");
      setMessage("Camera ready. Start the round and keep both hands inside the frame.");
      detectLoop();
    } catch (error) {
      setStatus("error");
      const errorMsg = error instanceof Error ? error.message : "Could not start hand detection.";
      setPermissionState("Blocked or unavailable");
      setMessage(errorMsg);
      console.error("Camera error:", error);
    }
  }

  function detectLoop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker) {
      frameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const width = video.videoWidth || 960;
    const height = video.videoHeight || 540;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      frameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    context.clearRect(0, 0, width, height);

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const result = landmarker.detectForVideo(video, performance.now());
      const detectedHands = result.landmarks ?? [];

      setHands(detectedHands.length);

      detectedHands.slice(0, 2).forEach((landmarks, index) => {
        drawHand(context, landmarks, width, height, index === 0 ? "#22d3ee" : "#a78bfa");
      });
    }

    frameRef.current = requestAnimationFrame(detectLoop);
  }

  function startRound() {
    setRoundTime(ROUND_SECONDS);
    setBothHandsSeconds(0);
    setStatus("playing");
    setMessage("Hold both hands up. Every second with two hands visible adds to your score.");
  }

  function stopCamera() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStatus("idle");
    setHands(0);
    setPermissionState("Stopped");
    setMessage("Camera stopped. Nothing was uploaded.");
  }

  const progress = Math.round((bothHandsSeconds / ROUND_SECONDS) * 100);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#050b14]">
          <video
            ref={videoRef}
            className="aspect-video w-full scale-x-[-1] bg-slate-950 object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          {status === "idle" || status === "loading" || status === "error" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/72 p-6 text-center backdrop-blur-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Browser-only hand tracking
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Detect both hands in real time
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  The model, webcam frames, and scoring all stay on this device.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Two-Hand Challenge
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Keep both hands visible
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#071120] p-4">
              <p className="text-xs text-slate-400">Hands detected</p>
              <p className="mt-2 text-3xl font-semibold text-white">{hands}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#071120] p-4">
              <p className="text-xs text-slate-400">Time left</p>
              <p className="mt-2 text-3xl font-semibold text-white">{roundTime}s</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#071120] p-4">
              <p className="text-xs text-slate-400">Score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{bothHandsSeconds}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#071120] p-4">
              <p className="text-xs text-slate-400">Best</p>
              <p className="mt-2 text-3xl font-semibold text-white">{bestScore}</p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {status === "idle" || status === "error" ? (
              <button
                type="button"
                onClick={startCamera}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Enable Camera
              </button>
            ) : null}
            {status === "ready" || status === "complete" ? (
              <button
                type="button"
                onClick={startRound}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Start Round
              </button>
            ) : null}
            {status !== "idle" ? (
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
              >
                Stop Camera
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
          <p className="text-sm font-semibold text-white">Browser status</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Camera permission</span>
              <span className="font-semibold text-cyan-200">{permissionState}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Server upload</span>
              <span className="font-semibold text-emerald-200">None</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Max hands</span>
              <span className="font-semibold text-violet-200">2</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
