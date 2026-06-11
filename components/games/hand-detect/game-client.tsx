"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const WASM_PATH = "/vendor/mediapipe/tasks-vision/wasm";
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";
const WHEEL_CONFIDENCE_THRESHOLD = 0.75;
const WHEEL_SMOOTHING = 0.08;
const WHEEL_DEAD_ZONE = 0.025;
const WHEEL_HISTORY_SIZE = 4;
const WHEEL_HOLD_MS = 850;
const STEERING_ARROW_DEAD_ZONE = 0.09;
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

type SteeringWheelPose = {
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
};

type SteeringDirection = "left" | "right" | "straight";

type TruckState = {
  x: number;
  roadOffset: number;
};

function drawHand(
  context: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
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

function getHandCenter(landmarks: NormalizedLandmark[], width: number, height: number) {
  const palmPoints = [0, 5, 9, 13, 17]
    .map((index) => landmarks[index])
    .filter(Boolean);

  const center = palmPoints.reduce(
    (acc, landmark) => ({
      x: acc.x + (1 - landmark.x) * width,
      y: acc.y + landmark.y * height,
    }),
    { x: 0, y: 0 },
  );

  return {
    x: center.x / palmPoints.length,
    y: center.y / palmPoints.length,
  };
}

function getSteeringWheelPose(
  leftHand: NormalizedLandmark[],
  rightHand: NormalizedLandmark[],
  width: number,
  height: number,
): SteeringWheelPose {
  const a = getHandCenter(leftHand, width, height);
  const b = getHandCenter(rightHand, width, height);
  const centerX = (a.x + b.x) / 2;
  const centerY = (a.y + b.y) / 2;
  const handDistance = Math.hypot(a.x - b.x, a.y - b.y);
  const radius = Math.min(Math.max(handDistance * 0.42, 70), Math.min(width, height) * 0.28);
  const angle = Math.atan2(b.y - a.y, b.x - a.x);

  return { centerX, centerY, radius, angle };
}

function averageWheelPose(poses: SteeringWheelPose[]): SteeringWheelPose {
  const total = poses.reduce(
    (acc, pose) => ({
      centerX: acc.centerX + pose.centerX,
      centerY: acc.centerY + pose.centerY,
      radius: acc.radius + pose.radius,
      sin: acc.sin + Math.sin(pose.angle),
      cos: acc.cos + Math.cos(pose.angle),
    }),
    { centerX: 0, centerY: 0, radius: 0, sin: 0, cos: 0 },
  );

  return {
    centerX: total.centerX / poses.length,
    centerY: total.centerY / poses.length,
    radius: total.radius / poses.length,
    angle: Math.atan2(total.sin / poses.length, total.cos / poses.length),
  };
}

function smoothWheelPose(
  current: SteeringWheelPose | null,
  target: SteeringWheelPose,
  width: number,
): SteeringWheelPose {
  if (!current) return target;

  const deltaX = target.centerX - current.centerX;
  const deltaY = target.centerY - current.centerY;
  const deltaRadius = target.radius - current.radius;
  const deltaAngle = Math.atan2(Math.sin(target.angle - current.angle), Math.cos(target.angle - current.angle));
  const deadZonePixels = width * WHEEL_DEAD_ZONE;

  if (
    Math.hypot(deltaX, deltaY) < deadZonePixels &&
    Math.abs(deltaRadius) < deadZonePixels &&
    Math.abs(deltaAngle) < 0.015
  ) {
    return current;
  }

  return {
    centerX: current.centerX + deltaX * WHEEL_SMOOTHING,
    centerY: current.centerY + deltaY * WHEEL_SMOOTHING,
    radius: current.radius + deltaRadius * WHEEL_SMOOTHING,
    angle: current.angle + deltaAngle * WHEEL_SMOOTHING,
  };
}

function drawSteeringWheel(
  context: CanvasRenderingContext2D,
  pose: SteeringWheelPose,
) {
  const { centerX, centerY, radius, angle } = pose;
  context.save();
  context.translate(centerX, centerY);
  context.rotate(angle);

  context.lineCap = "round";

  const rimGradient = context.createRadialGradient(0, 0, radius * 0.45, 0, 0, radius * 1.05);
  rimGradient.addColorStop(0, "rgba(15, 23, 42, 0.1)");
  rimGradient.addColorStop(0.56, "rgba(15, 23, 42, 0.88)");
  rimGradient.addColorStop(1, "rgba(226, 232, 240, 0.96)");

  context.shadowColor = "rgba(34, 211, 238, 0.55)";
  context.shadowBlur = 24;

  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.lineWidth = Math.max(14, radius * 0.16);
  context.strokeStyle = rimGradient;
  context.stroke();

  context.shadowBlur = 0;
  context.beginPath();
  context.arc(0, 0, radius * 0.86, 0, Math.PI * 2);
  context.lineWidth = Math.max(3, radius * 0.035);
  context.strokeStyle = "rgba(34, 211, 238, 0.88)";
  context.stroke();

  context.beginPath();
  context.arc(0, 0, radius * 0.67, 0, Math.PI * 2);
  context.lineWidth = Math.max(2, radius * 0.025);
  context.strokeStyle = "rgba(148, 163, 184, 0.45)";
  context.stroke();

  for (const [start, end] of [
    [-0.95, -0.35],
    [Math.PI + 0.35, Math.PI + 0.95],
  ]) {
    context.beginPath();
    context.arc(0, 0, radius, start, end);
    context.lineWidth = Math.max(18, radius * 0.2);
    context.strokeStyle = "rgba(2, 6, 23, 0.88)";
    context.stroke();

    context.beginPath();
    context.arc(0, 0, radius, start + 0.08, end - 0.08);
    context.lineWidth = Math.max(4, radius * 0.045);
    context.strokeStyle = "rgba(34, 211, 238, 0.72)";
    context.stroke();
  }

  const spokeGradient = context.createLinearGradient(-radius * 0.7, 0, radius * 0.7, 0);
  spokeGradient.addColorStop(0, "rgba(15, 23, 42, 0.92)");
  spokeGradient.addColorStop(0.5, "rgba(226, 232, 240, 0.92)");
  spokeGradient.addColorStop(1, "rgba(15, 23, 42, 0.92)");

  context.lineWidth = Math.max(8, radius * 0.09);
  context.strokeStyle = spokeGradient;
  for (const angle of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) {
    context.beginPath();
    context.moveTo(Math.cos(angle) * radius * 0.24, Math.sin(angle) * radius * 0.24);
    context.lineTo(Math.cos(angle) * radius * 0.72, Math.sin(angle) * radius * 0.72);
    context.stroke();
  }

  const hubGradient = context.createRadialGradient(-radius * 0.08, -radius * 0.1, 0, 0, 0, radius * 0.33);
  hubGradient.addColorStop(0, "rgba(248, 250, 252, 0.98)");
  hubGradient.addColorStop(0.42, "rgba(30, 41, 59, 0.95)");
  hubGradient.addColorStop(1, "rgba(2, 6, 23, 0.96)");

  context.beginPath();
  context.arc(0, 0, radius * 0.31, 0, Math.PI * 2);
  context.fillStyle = hubGradient;
  context.fill();
  context.lineWidth = Math.max(3, radius * 0.04);
  context.strokeStyle = "rgba(34, 211, 238, 0.95)";
  context.stroke();

  context.beginPath();
  context.arc(0, 0, radius * 0.16, 0, Math.PI * 2);
  context.fillStyle = "rgba(34, 211, 238, 0.16)";
  context.fill();

  context.lineWidth = Math.max(2, radius * 0.02);
  context.strokeStyle = "rgba(226, 232, 240, 0.8)";
  for (const x of [-radius * 0.5, radius * 0.5]) {
    context.beginPath();
    context.roundRect(x - radius * 0.08, -radius * 0.08, radius * 0.16, radius * 0.16, radius * 0.04);
    context.stroke();
  }

  context.fillStyle = "rgba(224, 242, 254, 0.95)";
  context.font = `700 ${Math.max(11, radius * 0.11)}px Segoe UI, Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("AI", 0, -radius * 0.01);

  context.fillStyle = "rgba(34, 211, 238, 0.95)";
  for (const x of [-radius * 0.22, 0, radius * 0.22]) {
    context.beginPath();
    context.arc(x, radius * 0.43, Math.max(3, radius * 0.035), 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawSteeringArrow(
  context: CanvasRenderingContext2D,
  direction: SteeringDirection,
  width: number,
  height: number,
) {
  const centerX = width / 2;
  const centerY = Math.max(78, height * 0.18);
  const arrowLength = Math.min(width * 0.34, 220);
  const arrowWidth = Math.max(18, Math.min(width, height) * 0.045);
  const headSize = arrowWidth * 2.35;
  const color = direction === "straight" ? "#22d3ee" : "#facc15";

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = 18;
  context.fillStyle = "rgba(2, 6, 23, 0.62)";
  context.beginPath();
  context.roundRect(centerX - 148, centerY - 48, 296, 96, 28);
  context.fill();

  context.shadowColor = direction === "straight" ? "rgba(34, 211, 238, 0.75)" : "rgba(250, 204, 21, 0.75)";
  context.shadowBlur = 24;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = arrowWidth;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (direction === "straight") {
    const startY = centerY + arrowLength * 0.22;
    const endY = centerY - arrowLength * 0.22;

    context.beginPath();
    context.moveTo(centerX, startY);
    context.lineTo(centerX, endY);
    context.stroke();

    context.beginPath();
    context.moveTo(centerX, endY - headSize * 0.72);
    context.lineTo(centerX - headSize * 0.62, endY + headSize * 0.08);
    context.lineTo(centerX + headSize * 0.62, endY + headSize * 0.08);
    context.closePath();
    context.fill();
  } else {
    const sign = direction === "right" ? 1 : -1;
    const startX = centerX - sign * arrowLength * 0.34;
    const endX = centerX + sign * arrowLength * 0.34;

    context.beginPath();
    context.moveTo(startX, centerY);
    context.lineTo(endX, centerY);
    context.stroke();

    context.beginPath();
    context.moveTo(endX + sign * headSize * 0.72, centerY);
    context.lineTo(endX - sign * headSize * 0.08, centerY - headSize * 0.62);
    context.lineTo(endX - sign * headSize * 0.08, centerY + headSize * 0.62);
    context.closePath();
    context.fill();
  }

  context.restore();
}

function getSteeringDirection(angle: number): SteeringDirection {
  if (Math.abs(angle) < STEERING_ARROW_DEAD_ZONE) return "straight";
  return angle > 0 ? "right" : "left";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function drawTruckGame(
  context: CanvasRenderingContext2D,
  state: TruckState,
  steeringAngle: number,
  handsVisible: number,
  status: "idle" | "loading" | "playing" | "error",
) {
  const width = GAME_WIDTH;
  const height = GAME_HEIGHT;
  const horizonY = height * 0.36;
  const vanishingX = width * 0.5;
  const roadBottomHalf = width * 0.62;
  const roadHorizonHalf = width * 0.08;
  const truckWidth = 184;
  const truckHeight = 132;
  const truckY = height - 126;
  const direction = getSteeringDirection(steeringAngle);
  const steeringStrength = clamp(steeringAngle / 0.62, -1, 1);
  const truckLaneX = clamp(state.x, 138, width - 138);

  context.clearRect(0, 0, width, height);

  const sky = context.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, "#0f172a");
  sky.addColorStop(0.5, "#075985");
  sky.addColorStop(1, "#38bdf8");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, horizonY);

  context.fillStyle = "rgba(255, 255, 255, 0.72)";
  for (const cloud of [
    { x: 130, y: 78, s: 0.8 },
    { x: 560, y: 68, s: 0.62 },
    { x: 812, y: 112, s: 0.9 },
  ]) {
    context.beginPath();
    context.ellipse(cloud.x, cloud.y, 40 * cloud.s, 18 * cloud.s, 0, 0, Math.PI * 2);
    context.ellipse(cloud.x + 36 * cloud.s, cloud.y + 2, 34 * cloud.s, 16 * cloud.s, 0, 0, Math.PI * 2);
    context.ellipse(cloud.x - 34 * cloud.s, cloud.y + 5, 28 * cloud.s, 14 * cloud.s, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "#166534";
  context.fillRect(0, horizonY, width, height - horizonY);
  context.fillStyle = "#14532d";
  for (let x = -80; x < width + 120; x += 120) {
    context.beginPath();
    context.moveTo(x, horizonY);
    context.lineTo(x + 38, horizonY - 74);
    context.lineTo(x + 82, horizonY);
    context.closePath();
    context.fill();
  }

  const roadGradient = context.createLinearGradient(0, horizonY, 0, height);
  roadGradient.addColorStop(0, "#475569");
  roadGradient.addColorStop(0.38, "#334155");
  roadGradient.addColorStop(1, "#0f172a");
  context.fillStyle = roadGradient;
  context.beginPath();
  context.moveTo(vanishingX - roadHorizonHalf, horizonY);
  context.lineTo(vanishingX + roadHorizonHalf, horizonY);
  context.lineTo(vanishingX + roadBottomHalf, height);
  context.lineTo(vanishingX - roadBottomHalf, height);
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(226, 232, 240, 0.9)";
  context.lineWidth = 5;
  for (const side of [-1, 1]) {
    context.beginPath();
    context.moveTo(vanishingX + side * roadHorizonHalf, horizonY);
    context.lineTo(vanishingX + side * roadBottomHalf, height);
    context.stroke();
  }

  for (const lane of [-0.34, 0, 0.34]) {
    context.strokeStyle = lane === 0 ? "rgba(250, 204, 21, 0.85)" : "rgba(248, 250, 252, 0.72)";
    context.lineWidth = lane === 0 ? 6 : 4;
    for (let i = -1; i < 9; i += 1) {
      const progress = ((i * 90 + state.roadOffset * 1.9) % 720) / 720;
      const y1 = horizonY + Math.pow(progress, 1.75) * (height - horizonY);
      const y2 = horizonY + Math.pow(Math.min(progress + 0.08, 1), 1.75) * (height - horizonY);
      if (y2 <= horizonY + 3 || y1 >= height) continue;

      const p1 = (y1 - horizonY) / (height - horizonY);
      const p2 = (y2 - horizonY) / (height - horizonY);
      const half1 = roadHorizonHalf + (roadBottomHalf - roadHorizonHalf) * p1;
      const half2 = roadHorizonHalf + (roadBottomHalf - roadHorizonHalf) * p2;

      context.beginPath();
      context.moveTo(vanishingX + lane * half1, y1);
      context.lineTo(vanishingX + lane * half2, y2);
      context.stroke();
    }
  }

  context.fillStyle = "rgba(2, 6, 23, 0.28)";
  context.fillRect(0, height - 26, width, 26);

  context.save();
  context.translate(truckLaneX, truckY);
  context.rotate(steeringStrength * 0.045);

  context.shadowColor = "rgba(2, 6, 23, 0.5)";
  context.shadowBlur = 22;
  context.fillStyle = "rgba(2, 6, 23, 0.5)";
  context.beginPath();
  context.ellipse(0, truckHeight * 0.48, truckWidth * 0.62, 22, 0, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;

  const trailerGradient = context.createLinearGradient(0, -truckHeight * 0.74, 0, truckHeight * 0.18);
  trailerGradient.addColorStop(0, "#67e8f9");
  trailerGradient.addColorStop(0.55, "#0891b2");
  trailerGradient.addColorStop(1, "#0e7490");
  context.fillStyle = trailerGradient;
  context.beginPath();
  context.roundRect(-truckWidth * 0.42, -truckHeight * 0.72, truckWidth * 0.84, truckHeight * 0.76, 16);
  context.fill();

  context.strokeStyle = "rgba(224, 242, 254, 0.75)";
  context.lineWidth = 4;
  context.stroke();

  context.fillStyle = "#f97316";
  context.beginPath();
  context.roundRect(-truckWidth * 0.34, -truckHeight * 0.06, truckWidth * 0.68, truckHeight * 0.38, 14);
  context.fill();

  context.fillStyle = "#bae6fd";
  context.beginPath();
  context.roundRect(-truckWidth * 0.24, -truckHeight * 0.01, truckWidth * 0.48, truckHeight * 0.16, 8);
  context.fill();

  context.fillStyle = "#0f172a";
  context.beginPath();
  context.roundRect(-truckWidth * 0.54, truckHeight * 0.2, truckWidth * 1.08, truckHeight * 0.18, 10);
  context.fill();

  context.fillStyle = "#ef4444";
  context.fillRect(-truckWidth * 0.32, truckHeight * 0.24, 18, 12);
  context.fillRect(truckWidth * 0.22, truckHeight * 0.24, 18, 12);
  context.fillStyle = "#facc15";
  context.fillRect(-truckWidth * 0.08, truckHeight * 0.25, 16, 9);
  context.fillRect(truckWidth * 0.02, truckHeight * 0.25, 16, 9);

  for (const wheelX of [-truckWidth * 0.42, truckWidth * 0.42]) {
    context.fillStyle = "#020617";
    context.beginPath();
    context.arc(wheelX, truckHeight * 0.33, 25, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#94a3b8";
    context.beginPath();
    context.arc(wheelX, truckHeight * 0.33, 11, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();

  drawSteeringArrow(context, direction, width, height);

  context.fillStyle = "rgba(2, 6, 23, 0.7)";
  context.beginPath();
  context.roundRect(width - 274, height - 82, 250, 52, 16);
  context.fill();
  context.fillStyle = "#334155";
  context.fillRect(width - 244, height - 56, 190, 8);
  context.fillStyle = "#22d3ee";
  context.beginPath();
  context.arc(width - 149 + steeringStrength * 92, height - 52, 13, 0, Math.PI * 2);
  context.fill();

  if (status === "idle" || status === "error" || status === "loading") {
    context.fillStyle = "rgba(2, 6, 23, 0.62)";
    context.fillRect(0, 0, width, height);
  }
}

export function HandDetectGameClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastGameTimeRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const wheelPoseRef = useRef<SteeringWheelPose | null>(null);
  const wheelHistoryRef = useRef<SteeringWheelPose[]>([]);
  const lastValidWheelAtRef = useRef(0);
  const steeringAngleRef = useRef(0);
  const handsVisibleRef = useRef(0);
  const truckStateRef = useRef<TruckState>({
    x: GAME_WIDTH * 0.5,
    roadOffset: 0,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [message, setMessage] = useState("Camera and hand detection run only in your browser.");
  const [permissionState, setPermissionState] = useState("Checking...");
  const [cameraLive, setCameraLive] = useState(false);

  const statusRef = useRef(status);
  statusRef.current = status;

  function renderTruckGame(now: number) {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const context = canvas.getContext("2d");
    if (!context) return;

    const lastTime = lastGameTimeRef.current || now;
    const delta = Math.min((now - lastTime) / 16.67, 2);
    lastGameTimeRef.current = now;

    const truckState = truckStateRef.current;
    const gameActive = statusRef.current === "playing";
    const displaySteeringAngle = gameActive && handsVisibleRef.current >= 2 ? steeringAngleRef.current : 0;
    const steering = clamp(displaySteeringAngle / 0.62, -1, 1);

    if (gameActive) {
      truckState.roadOffset = (truckState.roadOffset + 7.5 * delta) % 96;
      truckState.x = clamp(truckState.x + steering * 7.2 * delta, 138, GAME_WIDTH - 138);
    }

    drawTruckGame(context, truckState, displaySteeringAngle, handsVisibleRef.current, statusRef.current);
  }

  useEffect(() => {
    renderTruckGame(performance.now());

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    async function checkPermission() {
      try {
        const result = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        setPermissionState(result.state.charAt(0).toUpperCase() + result.state.slice(1));

        result.addEventListener("change", () => {
          setPermissionState(result.state.charAt(0).toUpperCase() + result.state.slice(1));
        });
      } catch {
        setPermissionState("Unknown");
      }
    }

    checkPermission();
  }, []);

  useEffect(() => {
    renderTruckGame(performance.now());
  }, [status]);

  async function startCamera() {
    setStatus("loading");
    setMessage("Requesting camera permission...");
    handsVisibleRef.current = 0;
    steeringAngleRef.current = 0;
    wheelPoseRef.current = null;
    wheelHistoryRef.current = [];
    lastValidWheelAtRef.current = 0;
    truckStateRef.current = {
      x: GAME_WIDTH * 0.5,
      roadOffset: 0,
    };

    try {
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
        throw new Error("Camera not supported. Use Chrome, Firefox, Edge, or Safari on HTTPS.");
      }

      const stream = await getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setPermissionState("Granted");
      setCameraLive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setMessage("Camera is live. Loading hand detection model...");

      const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.75,
        minHandPresenceConfidence: 0.75,
        minTrackingConfidence: 0.75,
      });

      setStatus("playing");
      setMessage("Drive with both hands. Click anywhere to stop.");
      detectLoop();
    } catch (error) {
      setStatus("error");
      let errorMsg = "Could not start hand detection.";

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMsg = "Camera permission denied. Check browser settings to allow camera access.";
            setPermissionState("Denied");
            break;
          case "NotFoundError":
            errorMsg = "No camera detected on this device.";
            break;
          case "NotReadableError":
            errorMsg = "Camera is already in use by another application.";
            break;
          default:
            errorMsg = error.message;
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      setMessage(errorMsg);
      console.error("Camera error:", error);
    }
  }

  function detectLoop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker) {
      renderTruckGame(performance.now());
      frameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const width = video.videoWidth || 960;
    const height = video.videoHeight || 540;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      renderTruckGame(performance.now());
      frameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    context.clearRect(0, 0, width, height);
    const now = performance.now();
    renderTruckGame(now);

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const result = landmarker.detectForVideo(video, now);
      const detectedHands = result.landmarks ?? [];
      const trackedHands = detectedHands
        .map((landmarks, index) => ({
          landmarks,
          score: result.handedness?.[index]?.[0]?.score ?? 1,
          center: getHandCenter(landmarks, width, height),
        }))
        .filter((hand) => hand.score >= WHEEL_CONFIDENCE_THRESHOLD);

      handsVisibleRef.current = trackedHands.length;

      detectedHands.slice(0, 2).forEach((landmarks, index) => {
        drawHand(context, landmarks, width, height, index === 0 ? "#22d3ee" : "#a78bfa");
      });

      if (trackedHands.length >= 2) {
        const [leftHand, rightHand] = trackedHands
          .slice(0, 2)
          .sort((a, b) => a.center.x - b.center.x);
        const targetPose = getSteeringWheelPose(leftHand.landmarks, rightHand.landmarks, width, height);

        wheelHistoryRef.current.push(targetPose);
        if (wheelHistoryRef.current.length > WHEEL_HISTORY_SIZE) {
          wheelHistoryRef.current.shift();
        }

        const averagedPose = averageWheelPose(wheelHistoryRef.current);
        const smoothedPose = smoothWheelPose(wheelPoseRef.current, averagedPose, width);
        wheelPoseRef.current = smoothedPose;
        steeringAngleRef.current = averagedPose.angle;
        lastValidWheelAtRef.current = now;
        drawSteeringWheel(context, smoothedPose);
      } else if (wheelPoseRef.current && now - lastValidWheelAtRef.current < WHEEL_HOLD_MS) {
        steeringAngleRef.current = 0;
        drawSteeringWheel(context, wheelPoseRef.current);
      } else {
        steeringAngleRef.current = 0;
        wheelHistoryRef.current = [];
      }
    }

    frameRef.current = requestAnimationFrame(detectLoop);
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {
        console.log("Fullscreen request failed");
      });
    } else {
      document.exitFullscreen?.();
    }
  }

  function stopCamera() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus("idle");
    handsVisibleRef.current = 0;
    steeringAngleRef.current = 0;
    wheelPoseRef.current = null;
    wheelHistoryRef.current = [];
    lastValidWheelAtRef.current = 0;
    setCameraLive(false);
    setPermissionState("Stopped");
    setMessage("Camera stopped. Nothing was uploaded.");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-3 sm:p-5">
        <div ref={containerRef} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#050b14]">
          {status === "idle" || status === "error" ? (
            <button
              type="button"
              onClick={startCamera}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_60px_rgba(2,6,23,0.45)] transition hover:bg-cyan-200"
            >
              Start Game
            </button>
          ) : null}

          {status === "loading" ? (
            <button
              type="button"
              disabled
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/85 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_60px_rgba(2,6,23,0.45)]"
            >
              Loading
            </button>
          ) : null}

          {status !== "idle" && status !== "error" ? (
            <>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute right-3 top-3 rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(2,6,23,0.32)] transition hover:border-cyan-300/50 hover:bg-slate-900/90"
                title="Fullscreen mode (Press ESC to exit)"
              >
                ⛶
              </button>
              <p className="absolute right-3 bottom-3 text-xs text-slate-400 pointer-events-none">
                Press ESC to exit fullscreen
              </p>
            </>
          ) : null}

          <canvas
            ref={gameCanvasRef}
            className="aspect-video w-full bg-slate-950 object-cover cursor-pointer"
            aria-label="3D-style truck driving game"
            onClick={() => status === "playing" && stopCamera()}
          />

          <div className="absolute bottom-3 right-3 w-32 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-[0_18px_50px_rgba(2,6,23,0.42)] backdrop-blur-md sm:bottom-5 sm:right-5 sm:w-48 pointer-events-none">
            <div className="relative">
              <video
                ref={videoRef}
                className="aspect-video w-full scale-x-[-1] bg-slate-950 object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
