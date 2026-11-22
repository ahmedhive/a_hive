import { RefObject, useRef, useState } from "react";
import * as THREE from "three";
import { useIsomorphicLayoutEffect } from "@/lib";
import {
  ASSEMBLY_S,
  ART_FACE,
  ART_HEAD,
  ART_HEAD_WIDTH,
  ART_SOURCE,
  BLOOM_S,
  BREATH_AMOUNT,
  BREATH_S,
  HEAD_MAX_PITCH,
  HEAD_MAX_YAW,
  HIVE_ART,
  MAX_PIXEL_RATIO,
  MOBILE_MAX_WIDTH,
  TILE_CELL_DESKTOP,
  TILE_CELL_MOBILE,
  TILE_MIN_LEVEL,
  WAVE_S,
  WORLD_CELL_DESKTOP,
  WORLD_CELL_MOBILE,
  WORLD_MIN_LEVEL,
} from "../../hive.data";
import { IHiveInput, IHiveStats, THiveState } from "../../hive.interface";
import {
  ATMOSPHERE_FRAGMENT,
  ATMOSPHERE_VERTEX,
  TILE_FRAGMENT,
  TILE_VERTEX,
  WORLD_TILE_FRAGMENT,
  WORLD_TILE_VERTEX,
} from "./hive-modal.shaders";

const BLOOM_REACH = 1;
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

async function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

function toTexture(img: HTMLImageElement) {
  const texture = new THREE.Texture(img);
  // No decode here and no encode in the shaders: exact artwork colours.
  texture.colorSpace = THREE.NoColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// One tile per grid cell wherever any image has something to show, read once
// at load. Empty black cells get no particle.
function sampleTiles(
  images: HTMLImageElement[],
  cell: number,
  minLevel: number,
) {
  const columns = Math.floor(images[0].naturalWidth / cell);
  const rows = Math.floor(images[0].naturalHeight / cell);
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no 2d context");
  const keep = new Uint8Array(columns * rows);
  for (const img of images) {
    ctx.drawImage(img, 0, 0, columns, rows);
    const { data } = ctx.getImageData(0, 0, columns, rows);
    for (let i = 0; i < keep.length; i++) {
      const p = i * 4;
      if (Math.max(data[p], data[p + 1], data[p + 2]) > minLevel) keep[i] = 1;
    }
  }
  let count = 0;
  for (let i = 0; i < keep.length; i++) count += keep[i];
  const positions = new Float32Array(count * 3);
  let n = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (!keep[y * columns + x]) continue;
      positions[n++] = (x + 0.5) / columns;
      positions[n++] = 1 - (y + 0.5) / rows;
      positions[n++] = Math.random();
    }
  }
  return { positions, count, size: columns, rows };
}

export default function useHiveScene(inputRef: RefObject<IHiveInput>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handRingRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [stats, setStats] = useState<IHiveStats | null>(null);

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const input = inputRef.current;

    let cancelled = false;
    let raf = 0;
    let teardown: (() => void) | undefined;

    const begin = async () => {
      const [idle, listening, thinking, speaking, early, late, backdrop, mask] =
        await Promise.all(
          [
            HIVE_ART.idle,
            HIVE_ART.listening,
            HIVE_ART.thinking,
            HIVE_ART.speaking,
            HIVE_ART.early,
            HIVE_ART.late,
            HIVE_ART.backdrop,
            HIVE_ART.mask,
          ].map(loadImage),
        );
      if (cancelled) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0x000000, 1);

      const mobile = host.clientWidth < MOBILE_MAX_WIDTH;
      const tiles = sampleTiles(
        [idle, listening, thinking, speaking],
        mobile ? TILE_CELL_MOBILE : TILE_CELL_DESKTOP,
        TILE_MIN_LEVEL,
      );
      const worldTiles = sampleTiles(
        [backdrop],
        mobile ? WORLD_CELL_MOBILE : WORLD_CELL_DESKTOP,
        WORLD_MIN_LEVEL,
      );

      const moods: Record<THiveState, THREE.Texture> = {
        idle: toTexture(idle),
        listening: toTexture(listening),
        thinking: toTexture(thinking),
        speaking: toTexture(speaking),
      };
      const earlyTex = toTexture(early);
      const lateTex = toTexture(late);
      const backdropTex = toTexture(backdrop);
      const maskTex = toTexture(mask);

      const artCenter = new THREE.Vector2();
      const artHalf = new THREE.Vector2(1, 1);
      const sourceNdc = new THREE.Vector2();

      const faceNdc = new THREE.Vector2();
      // Shared by every layer, so the ring passes through them as one.
      const wave = {
        uFaceNdc: { value: faceNdc },
        uAspect: { value: 1 },
        uWaveR: { value: 0 },
        uWaveFade: { value: 0 },
      };

      const atmosphereUniforms = {
        ...wave,
        uSourceNdc: { value: sourceNdc },
        uSourceGlow: { value: 0 },
      };
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: atmosphereUniforms,
        vertexShader: ATMOSPHERE_VERTEX,
        fragmentShader: ATMOSPHERE_FRAGMENT,
        depthTest: false,
        depthWrite: false,
      });
      const atmosphereGeometry = new THREE.PlaneGeometry(2, 2);
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.frustumCulled = false;
      atmosphere.renderOrder = 0;

      const worldUniforms = {
        ...wave,
        uBackdrop: { value: backdropTex },
        uMask: { value: maskTex },
        uCover: { value: new THREE.Vector2(1, 1) },
        uTilePx: { value: 2 },
        uTileUv: { value: new THREE.Vector2(0.01, 0.01) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uArtCenter: { value: artCenter },
        uArtHalf: { value: artHalf },
        uPointerNdc: { value: new THREE.Vector2(9, 9) },
        uPointerOn: { value: 0 },
        uReveal: { value: -1 },
        uTime: { value: 0 },
        uLights: { value: 0 },
      };
      const maxBlend = {
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendEquation: THREE.MaxEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
      };
      const worldMaterial = new THREE.ShaderMaterial({
        uniforms: worldUniforms,
        vertexShader: WORLD_TILE_VERTEX,
        fragmentShader: WORLD_TILE_FRAGMENT,
        ...maxBlend,
      });
      const worldGeometry = new THREE.BufferGeometry();
      worldGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(worldTiles.positions, 3),
      );
      const world = new THREE.Points(worldGeometry, worldMaterial);
      world.frustumCulled = false;
      world.renderOrder = 1;

      const uniforms = {
        ...wave,
        uHeadCenter: { value: new THREE.Vector2(ART_HEAD.x, ART_HEAD.y) },
        uHeadRadius: {
          value: new THREE.Vector3(ART_HEAD.rx, ART_HEAD.ry, ART_HEAD.rz),
        },
        uYaw: { value: 0 },
        uPitch: { value: 0 },
        uBreath: { value: 0 },
        uArtCenter: { value: artCenter },
        uArtHalf: { value: artHalf },
        uTilePx: { value: 2 },
        uTileUv: { value: 1 / tiles.size },
        uSparkPx: { value: 2 },
        uAssembly: { value: 0 },
        uSource: { value: new THREE.Vector2(ART_SOURCE.x, ART_SOURCE.y) },
        uFace: { value: new THREE.Vector2(ART_FACE.x, ART_FACE.y) },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uPointerOn: { value: 0 },
        uTapAge: { value: 99 },
        uFrom: { value: moods.idle },
        uTo: { value: moods.idle },
        uEarly: { value: earlyTex },
        uLate: { value: lateTex },
        uBloom: { value: 2 },
        uIgnite: { value: 0 },
        uBuild: { value: 0 },
        uFlare: { value: 0 },
      };
      // MAX blending: overlapping neighbours show the same artwork pixel, so
      // seams can't brighten, and the figure never washes out the world.
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: TILE_VERTEX,
        fragmentShader: TILE_FRAGMENT,
        ...maxBlend,
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(tiles.positions, 3),
      );
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      points.renderOrder = 2;

      const scene = new THREE.Scene();
      scene.add(atmosphere, world, points);
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      let width = 1;
      let height = 1;
      let side = 1;
      let waveReach = 3;
      const resize = () => {
        width = host.clientWidth || 1;
        height = host.clientHeight || 1;
        const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
        renderer.setPixelRatio(ratio);
        renderer.setSize(width, height, false);

        // The square artwork fills the height, standing on the bottom edge.
        // On narrow screens the shoulders run off the sides, but the head
        // always fits.
        side = Math.min(height, width / ART_HEAD_WIDTH);
        artHalf.set(side / width, side / height);
        artCenter.set(0, -1 + side / height);
        sourceNdc.set(
          artCenter.x + (ART_SOURCE.x - 0.5) * 2 * artHalf.x,
          artCenter.y + (ART_SOURCE.y - 0.5) * 2 * artHalf.y,
        );

        const tileDevicePx = (side * ratio) / tiles.size;
        const tilePx = Math.ceil(tileDevicePx) + 1;
        uniforms.uTilePx.value = tilePx;
        uniforms.uTileUv.value = tilePx / (side * ratio);
        uniforms.uSparkPx.value = Math.max(2, 1.6 * ratio);

        const aspect = width / height;
        const imageAspect = backdrop.naturalWidth / backdrop.naturalHeight;
        wave.uAspect.value = aspect;
        faceNdc.set(
          artCenter.x + (ART_FACE.x - 0.5) * 2 * artHalf.x,
          artCenter.y + (ART_FACE.y - 0.5) * 2 * artHalf.y,
        );
        // Far enough to clear the furthest corner.
        waveReach =
          Math.hypot(
            (1 + Math.abs(faceNdc.x)) * aspect,
            1 + Math.abs(faceNdc.y),
          ) + 0.25;
        const coverX = aspect > imageAspect ? 1 : aspect / imageAspect;
        const coverY = aspect > imageAspect ? imageAspect / aspect : 1;
        worldUniforms.uCover.value.set(coverX, coverY);
        worldUniforms.uRes.value.set(width * ratio, height * ratio);
        const worldTilePx =
          Math.ceil((width * ratio) / coverX / worldTiles.size) + 1;
        worldUniforms.uTilePx.value = worldTilePx;
        worldUniforms.uTileUv.value.set(
          (worldTilePx * coverX) / (width * ratio),
          (worldTilePx * coverY) / (height * ratio),
        );
        const particles = tiles.count + worldTiles.count;
        setStats((shown) =>
          shown?.particles === particles &&
          shown.grid === tiles.size &&
          shown.pixelRatio === ratio &&
          shown.tilePx === tilePx
            ? shown
            : { particles, grid: tiles.size, pixelRatio: ratio, tilePx },
        );
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      const onMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        input.pointerX = e.clientX - rect.left;
        input.pointerY = e.clientY - rect.top;
        input.pointerActive = true;
      };
      const onLeave = () => {
        input.pointerActive = false;
      };
      const onDown = (e: PointerEvent) => {
        onMove(e);
        input.tap += 1;
      };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointerdown", onDown);

      let assembly = input.effects ? 0 : 1;
      let lastReplay = input.replay;
      let lastSkip = input.skip;
      let lastTap = input.tap;
      let wasPinching = false;
      let tapAge = 99;
      let time = 0;
      let last = performance.now();
      let shown = -1;
      let toState: THiveState = input.state;
      let bloom = 1;
      let pointerOn = 0;
      let flare = 0;
      let waveAge = -1;
      let worldShown = !input.effects;
      let yaw = 0;
      let pitch = 0;
      let smoothX = 0;
      let smoothY = 0;
      let hasPointer = false;
      uniforms.uFrom.value = moods[toState];
      uniforms.uTo.value = moods[toState];

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
        last = now;
        time += dt;
        const fx = input.effects;

        if (input.replay !== lastReplay) {
          lastReplay = input.replay;
          if (fx) {
            assembly = 0;
            waveAge = -1;
            worldShown = false;
          }
        }
        if (input.skip !== lastSkip) {
          lastSkip = input.skip;
          assembly = 1;
          waveAge = -1;
          worldShown = true;
        }
        const building = assembly < 1;
        assembly = fx ? Math.min(1, assembly + dt / ASSEMBLY_S) : 1;
        // The figure just finished by itself: one shockwave.
        if (fx && building && assembly >= 1) waveAge = 0;
        if (!fx) {
          waveAge = -1;
          worldShown = true;
        }

        const pct = Math.floor(assembly * 100);
        if (pct !== shown) {
          shown = pct;
          setProgress(pct);
        }

        // Mood: the latest real state wins. A change that arrives mid-bloom
        // hurries the current one along rather than queueing.
        const want = input.state;
        if (!fx) {
          toState = want;
          bloom = 1;
          uniforms.uFrom.value = moods[want];
          uniforms.uTo.value = moods[want];
        } else {
          if (want !== toState && bloom >= 1) {
            uniforms.uFrom.value = moods[toState];
            uniforms.uTo.value = moods[want];
            toState = want;
            bloom = 0;
          }
          const hurry = want !== toState ? 6 : 1;
          bloom = Math.min(1, bloom + (dt / BLOOM_S) * hurry);
        }
        uniforms.uBloom.value =
          bloom >= 1 ? 2 : smooth(0, 1, bloom) * (BLOOM_REACH + 0.09);

        uniforms.uAssembly.value = assembly;
        uniforms.uBuild.value = smooth(0.34, 0.62, assembly);
        uniforms.uIgnite.value =
          assembly >= 1 ? 2 : smooth(0.8, 1, assembly) * (BLOOM_REACH + 0.09);
        if (waveAge >= 0) {
          waveAge += dt;
          const t = Math.min(1, waveAge / WAVE_S);
          const radius = (1 - (1 - t) * (1 - t)) * waveReach;
          wave.uWaveR.value = radius;
          wave.uWaveFade.value = 1 - smooth(0.62, 1, t);
          worldUniforms.uReveal.value = radius;
          if (t >= 1) {
            waveAge = -1;
            worldShown = true;
          }
        } else {
          wave.uWaveFade.value = 0;
          worldUniforms.uReveal.value = worldShown ? 99 : -1;
        }
        atmosphereUniforms.uSourceGlow.value =
          assembly >= 1
            ? 0
            : smooth(0, 0.06, assembly) * (1 - smooth(0.82, 1, assembly));
        worldUniforms.uTime.value = time;
        worldUniforms.uLights.value = fx ? 1 : 0;

        if (input.pinching && !wasPinching) tapAge = 0;
        wasPinching = input.pinching;
        if (input.tap !== lastTap) {
          lastTap = input.tap;
          tapAge = 0;
        }
        tapAge += dt;
        uniforms.uTapAge.value = fx ? tapAge : 99;

        // Follows the real loudness of the voice. Browser speech can't be
        // measured, so the fallback is a plain "is speaking" glow.
        const speakGlow =
          input.state !== "speaking"
            ? 0
            : input.voiceLevel >= 0
              ? 0.03 + input.voiceLevel * 0.42
              : 0.08 + 0.05 * Math.sin(time * 2.4);
        const tapGlow = Math.exp(-tapAge * 2.5) * 0.45;
        const flareTarget = fx
          ? speakGlow + tapGlow + (input.pinching ? 0.35 : 0)
          : 0;
        flare += (flareTarget - flare) * (1 - Math.exp(-dt * 10));
        uniforms.uFlare.value = flare < 0.002 && !flareTarget ? 0 : flare;

        const ring = handRingRef.current;
        const pointing = fx && (input.handActive || input.pointerActive);
        let aimX = smoothX;
        let aimY = smoothY;
        if (input.handActive) {
          aimX = input.handX * width;
          aimY = input.handY * height;
          if (ring) {
            ring.style.opacity = "1";
            ring.style.transform = `translate(${aimX}px, ${aimY}px) translate(-50%, -50%) scale(${input.pinching ? 0.55 : 1})`;
          }
        } else {
          if (ring) ring.style.opacity = "0";
          if (input.pointerActive) {
            aimX = input.pointerX;
            aimY = input.pointerY;
          }
        }
        if (pointing && !hasPointer) {
          smoothX = aimX;
          smoothY = aimY;
        }
        hasPointer = pointing;
        const follow = 1 - Math.exp(-dt * 18);
        smoothX += (aimX - smoothX) * follow;
        smoothY += (aimY - smoothY) * follow;
        setPointer(smoothX, smoothY);

        // Eases to zero so everything returns to the untouched artwork.
        pointerOn += ((pointing ? 1 : 0) - pointerOn) * (1 - Math.exp(-dt * 7));
        const push = pointerOn < 0.002 && !pointing ? 0 : pointerOn;
        uniforms.uPointerOn.value = push;
        worldUniforms.uPointerOn.value = push;

        // The head glides toward the cursor, never snaps.
        const headX = width / 2 + (ART_HEAD.x - 0.5) * side;
        const headY = height - ART_HEAD.y * side;
        const yawTarget = pointing
          ? Math.max(-1, Math.min(1, (smoothX - headX) / (width * 0.42))) *
            HEAD_MAX_YAW
          : 0;
        const pitchTarget = pointing
          ? Math.max(-1, Math.min(1, (headY - smoothY) / (height * 0.5))) *
            HEAD_MAX_PITCH
          : 0;
        const glide = 1 - Math.exp(-dt * 5);
        yaw += (yawTarget - yaw) * glide;
        pitch += (pitchTarget - pitch) * glide;
        if (!pointing && Math.abs(yaw) < 0.0008) yaw = 0;
        if (!pointing && Math.abs(pitch) < 0.0008) pitch = 0;
        uniforms.uYaw.value = fx ? yaw : 0;
        uniforms.uPitch.value = fx ? pitch : 0;

        // Breath waits for the finished figure, then runs through every mood.
        uniforms.uBreath.value =
          fx && assembly >= 1
            ? BREATH_AMOUNT * Math.sin((time / BREATH_S) * Math.PI * 2)
            : 0;

        renderer.render(scene, camera);
      };

      const setPointer = (px: number, py: number) => {
        const left = (width - side) / 2;
        const top = height - side;
        uniforms.uPointer.value.set((px - left) / side, 1 - (py - top) / side);
        worldUniforms.uPointerNdc.value.set(
          (px / width) * 2 - 1,
          1 - (py / height) * 2,
        );
      };

      setReady(true);
      last = performance.now();
      raf = requestAnimationFrame(frame);

      teardown = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointerdown", onDown);
        geometry.dispose();
        material.dispose();
        worldGeometry.dispose();
        worldMaterial.dispose();
        atmosphereGeometry.dispose();
        atmosphereMaterial.dispose();
        [
          ...Object.values(moods),
          earlyTex,
          lateTex,
          backdropTex,
          maskTex,
        ].forEach((t) => t.dispose());
        renderer.dispose();
      };
    };

    // No WebGL or a failed image: the HUD and chat still work.
    begin().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [inputRef]);

  return { canvasRef, handRingRef, progress, ready, failed, stats };
}
