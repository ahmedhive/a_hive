import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  HAND_MODEL_URL,
  HAND_RANGE_MAX,
  HAND_RANGE_MIN,
  HAND_SMOOTHING,
  LM_INDEX_TIP,
  LM_MIDDLE_MCP,
  LM_THUMB_TIP,
  LM_WRIST,
  MEDIAPIPE_WASM_URL,
  PINCH_OFF_RATIO,
  PINCH_ON_RATIO,
} from "../../hive.data";
import { IHiveInput, THandStatus } from "../../hive.interface";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number) =>
  clamp01((v - HAND_RANGE_MIN) / (HAND_RANGE_MAX - HAND_RANGE_MIN));

export default function useHandTracking(inputRef: RefObject<IHiveInput>) {
  const [status, setStatus] = useState<THandStatus>("idle");
  const stopRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => stopRef.current?.(), []);

  const start = useCallback(async () => {
    if (stopRef.current) return;
    const input = inputRef.current;
    setStatus("loading");

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | undefined;
    let landmarker: { close: () => void } | undefined;
    let onVisibility: (() => void) | undefined;

    stopRef.current = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (onVisibility) {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      input.visible = true;
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      input.handActive = false;
      input.pinching = false;
      stopRef.current = null;
      setStatus("idle");
    };

    try {
      // Camera first, so a refusal fails fast, before any model download.
      const granted = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      // Closed during the prompt: stop() had no stream to release yet.
      if (cancelled) {
        granted.getTracks().forEach((track) => track.stop());
        return;
      }
      stream = granted;

      const { FilesetResolver, HandLandmarker } =
        await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      const created = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: HAND_MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
      });
      if (cancelled) {
        created.close();
        return;
      }
      landmarker = created;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      if (cancelled) return;

      setStatus("active");

      let lastTime = -1;
      let pinching = false;
      // A hidden tab pauses the loop below, which would otherwise leave a held
      // pinch on and the heartbeat playing in the background.
      onVisibility = () => {
        input.visible = !document.hidden;
        if (!document.hidden) return;
        input.handActive = false;
        input.pinching = false;
        pinching = false;
      };
      document.addEventListener("visibilitychange", onVisibility);
      onVisibility();

      const loop = () => {
        raf = requestAnimationFrame(loop);
        // Skips detection while the section is off screen.
        if (!input.visible || video.currentTime === lastTime) return;
        lastTime = video.currentTime;

        const hand = created.detectForVideo(video, performance.now())
          .landmarks[0];
        if (!hand) {
          input.handActive = false;
          input.pinching = false;
          pinching = false;
          return;
        }

        const thumb = hand[LM_THUMB_TIP];
        const index = hand[LM_INDEX_TIP];
        const palm = Math.hypot(
          hand[LM_WRIST].x - hand[LM_MIDDLE_MCP].x,
          hand[LM_WRIST].y - hand[LM_MIDDLE_MCP].y,
        );
        const gap = Math.hypot(thumb.x - index.x, thumb.y - index.y) / palm;
        pinching = pinching ? gap < PINCH_OFF_RATIO : gap < PINCH_ON_RATIO;

        // Mirrored, so moving right moves right on screen.
        const targetX = remap(1 - (thumb.x + index.x) / 2);
        const targetY = remap((thumb.y + index.y) / 2);
        if (!input.handActive) {
          input.handX = targetX;
          input.handY = targetY;
        } else {
          input.handX += (targetX - input.handX) * HAND_SMOOTHING;
          input.handY += (targetY - input.handY) * HAND_SMOOTHING;
        }
        input.handActive = true;
        input.pinching = pinching;
      };
      raf = requestAnimationFrame(loop);
    } catch (error) {
      const denied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError");
      stopRef.current?.();
      setStatus(denied ? "denied" : "error");
    }
  }, [inputRef]);

  const toggle = useCallback(() => {
    if (stopRef.current) stop();
    else void start();
  }, [start, stop]);

  // Camera off when the section unmounts.
  useEffect(() => () => stopRef.current?.(), []);

  return { status, toggle };
}
