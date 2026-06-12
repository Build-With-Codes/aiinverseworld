"use client";

type LegacyNavigator = Navigator & {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    success: (stream: MediaStream) => void,
    failure: (error: DOMException | Error) => void,
  ) => void;
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    success: (stream: MediaStream) => void,
    failure: (error: DOMException | Error) => void,
  ) => void;
  mozGetUserMedia?: (
    constraints: MediaStreamConstraints,
    success: (stream: MediaStream) => void,
    failure: (error: DOMException | Error) => void,
  ) => void;
};

function isLocalHost() {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function explainMissingMediaDevices(kind: "camera" | "microphone") {
  const deviceName = kind === "camera" ? "Camera" : "Microphone";

  if (typeof window !== "undefined" && !window.isSecureContext && !isLocalHost()) {
    return `${deviceName} access requires HTTPS or localhost. Open this app over HTTPS, localhost, or 127.0.0.1.`;
  }

  return `${deviceName} access is not supported in this browser or webview. Try Chrome, Edge, Firefox, or Safari.`;
}

export async function requestUserMedia(
  constraints: MediaStreamConstraints,
  kind: "camera" | "microphone",
) {
  if (typeof navigator === "undefined") {
    throw new Error(`${kind === "camera" ? "Camera" : "Microphone"} access is only available in a browser.`);
  }

  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  const legacyNavigator = navigator as LegacyNavigator;
  const legacyGetUserMedia =
    legacyNavigator.getUserMedia ??
    legacyNavigator.webkitGetUserMedia ??
    legacyNavigator.mozGetUserMedia;

  if (!legacyGetUserMedia) {
    throw new Error(explainMissingMediaDevices(kind));
  }

  return new Promise<MediaStream>((resolve, reject) => {
    legacyGetUserMedia.call(legacyNavigator, constraints, resolve, reject);
  });
}
