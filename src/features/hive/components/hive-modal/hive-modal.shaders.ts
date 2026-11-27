// Colours are passed through untouched: textures are not decoded and these
// shaders don't encode, so a resting tile shows the artwork's exact pixels.

// The shockwave's bright band, shared by every layer. Distances are in screen
// heights / 2, measured from the face so the ring stays round on any aspect.
const WAVE = /* glsl */ `
uniform vec2 uFaceNdc;
uniform float uAspect;
uniform float uWaveR;
uniform float uWaveFade;

float waveBand(vec2 ndc) {
  if (uWaveFade <= 0.0) return 0.0;
  float d = length((ndc - uFaceNdc) * vec2(uAspect, 1.0));
  float x = (d - uWaveR) / 0.075;
  return exp(-x * x) * uWaveFade;
}
`;

// The artwork is square, so the shoulders run off its sides. Across this
// share of its width they break up into loose particles and fade out, and the
// backdrop shows through behind them instead of ending in a hard edge.
const SIDE_FADE = /* glsl */ `
float sideFade(float x) {
  return smoothstep(0.0, 0.15, min(x, 1.0 - x));
}
`;

// Each particle is a small square tile of the artwork. position.xy is the
// tile's centre in image space (0..1, y up); position.z is a random seed.
export const TILE_VERTEX = /* glsl */ `
uniform vec2 uArtCenter;
uniform vec2 uArtHalf;
uniform float uTilePx;
uniform float uSparkPx;
uniform float uAssembly;
uniform vec2 uSource;
uniform vec2 uFace;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform float uTapAge;
uniform vec2 uHeadCenter;
uniform vec3 uHeadRadius;
uniform float uYaw;
uniform float uPitch;
uniform float uBreath;
${SIDE_FADE}

varying vec2 vUv;
varying vec2 vNdc;
varying float vLand;
varying float vSpark;
varying float vGrow;
varying float vShade;
varying float vRim;
varying float vFade;

void main() {
  vec2 target = position.xy;
  float seed = position.z;
  vUv = target;
  vGrow = 1.0;
  vShade = 1.0;
  vRim = 0.0;
  vFade = sideFade(target.x);

  // Toward the sides, fewer and fewer tiles remain.
  if (fract(seed * 53.3) > vFade * 1.25) {
    vLand = 0.0;
    vSpark = 0.0;
    vNdc = vec2(2.0);
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  // Built from the base upward, leaning left to right.
  float order = target.y * 0.72 + target.x * 0.28;
  float start = order * 0.66 + seed * 0.06;
  float p = clamp((uAssembly - start) / 0.26, 0.0, 1.0);

  if (p <= 0.0) {
    vLand = 0.0;
    vSpark = 0.0;
    vNdc = vec2(2.0);
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  vec2 home = target;

  // The head is the front of a rounded skull. Its tiles rotate together
  // around the neck, each keeping its own patch of the artwork.
  // Fades in up the neck, so the jaw turns with the face and the neck
  // stretches smoothly beneath it instead of tearing.
  float head = smoothstep(0.24, 0.4, target.y);
  if (head > 0.0 && (uYaw != 0.0 || uPitch != 0.0)) {
    vec2 q = target - uHeadCenter;
    // The lower half of the skull reaches further down, so the chin and jaw
    // sit inside it with real depth rather than flat on its outline.
    vec2 n = q / vec2(uHeadRadius.x, uHeadRadius.y * (q.y < 0.0 ? 1.3 : 1.0));
    float nn = dot(n, n);
    float nz = sqrt(max(0.0, 1.0 - nn));
    // A soft dome: depth reaches zero at the outline with a gentle slope, so
    // the edge doesn't tear.
    float z = uHeadRadius.z * max(0.0, 1.0 - nn);
    float yaw = uYaw * head;
    float pitch = uPitch * head;
    float x1 = q.x * cos(yaw) + z * sin(yaw);
    float z1 = -q.x * sin(yaw) + z * cos(yaw);
    float y1 = q.y * cos(pitch) + z1 * sin(pitch);
    // The whole head also swings a little on the neck as it turns.
    x1 += sin(yaw) * uHeadRadius.z * 0.3;
    home = uHeadCenter + vec2(x1, y1);

    // The far side dims and the edge lights into a profile line. Kept gentle,
    // so nothing goes dark near the chin.
    float turn = clamp((abs(uYaw) + abs(uPitch)) / 0.16, 0.0, 1.0) * head;
    float facing = -n.x * sin(yaw) + nz * cos(yaw);
    vShade = mix(1.0, smoothstep(-0.35, 0.4, facing), turn * 0.55);
    if (nn <= 1.1) {
      float edge = 1.0 - clamp(facing, 0.0, 1.0);
      vRim = turn * edge * edge * edge;
    }
    // Slightly larger tiles cover the gaps a rotation opens.
    vGrow = 1.0 + turn * 0.6;
  }

  // Breath: the chest swells from a low anchor, so the head barely moves.
  float chest = 1.0 - smoothstep(0.16, 0.46, target.y);
  home += (home - vec2(0.497, -0.05)) * uBreath * chest;

  // Up from the source, over in a river, and down onto its place.
  float e = p * p * (3.0 - 2.0 * p);
  vec2 bend = vec2(0.88, max(target.y, 0.55) + 0.12);
  bend += (vec2(fract(seed * 7.13), fract(seed * 13.7)) - 0.5) * 0.14;
  float u = 1.0 - e;
  vec2 pos = u * u * uSource + 2.0 * u * e * bend + e * e * home;

  // Pushed aside by the cursor or hand, always measured from home so
  // nothing accumulates and rest is exact.
  vec2 dp = home - uPointer;
  float dl = length(dp);
  if (dl > 0.0001) {
    pos += dp / dl * uPointerOn * (1.0 - smoothstep(0.0, 0.11, dl)) * 0.018;
  }

  // A ripple out from the face on a tap or pinch.
  vec2 dc = target - uFace;
  float dcl = length(dc);
  if (dcl > 0.0001 && uTapAge < 3.0) {
    float wave = exp(-uTapAge * 2.2) * sin(dcl * 34.0 - uTapAge * 10.0)
      * (1.0 - smoothstep(0.0, 0.7, dcl)) * smoothstep(0.0, 0.05, uTapAge) * 0.007;
    pos += dc / dcl * wave;
  }

  // The survivors near the sides drift loose, outward and a little apart.
  float loose = (1.0 - vFade) * e;
  pos += vec2(
    sign(target.x - 0.5) * fract(seed * 17.1) * 0.035,
    (fract(seed * 29.3) - 0.5) * 0.025
  ) * loose;

  vLand = smoothstep(0.9, 1.0, p);
  // Only some of the river is lit, so it reads as a stream, not a sheet.
  vSpark = step(fract(seed * 91.7), 0.4);
  vNdc = uArtCenter + (pos - 0.5) * 2.0 * uArtHalf;
  gl_Position = vec4(vNdc, 0.0, 1.0);
  gl_PointSize = mix(uSparkPx, uTilePx * vGrow, vLand);
}
`;

export const TILE_FRAGMENT = /* glsl */ `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform sampler2D uEarly;
uniform sampler2D uLate;
uniform float uTileUv;
uniform vec2 uFace;
uniform float uBloom;
uniform float uIgnite;
uniform float uBuild;
uniform float uFlare;
${WAVE}

varying vec2 vUv;
varying vec2 vNdc;
varying float vLand;
varying float vSpark;
varying float vGrow;
varying float vShade;
varying float vRim;
varying float vFade;

const float EDGE = 0.09;

void main() {
  vec2 pc = gl_PointCoord - 0.5;

  if (vLand <= 0.0) {
    float a = (1.0 - smoothstep(0.08, 0.5, length(pc))) * vSpark;
    if (a <= 0.01) discard;
    gl_FragColor = vec4(vec3(0.46, 0.87, 1.0) * a, 1.0);
    return;
  }

  vec2 uv = vUv + vec2(pc.x, -pc.y) * uTileUv * vGrow;
  float dist = distance(uv, uFace);

  // A new mood blooms out of the face behind a soft circular edge.
  float inside = 1.0 - smoothstep(uBloom - EDGE, uBloom, dist);
  vec3 mood = mix(texture2D(uFrom, uv).rgb, texture2D(uTo, uv).rgb, inside);
  if (uBloom < 1.0) {
    float rim = inside * (1.0 - inside) * 4.0;
    mood += mood * rim * 0.45;
  }

  vec3 col = mood;
  if (uIgnite < 1.0) {
    // Until the face lights, landed tiles show the half-built artwork.
    vec3 built = mix(texture2D(uEarly, uv).rgb, texture2D(uLate, uv).rgb, uBuild);
    col = mix(built, mood, 1.0 - smoothstep(uIgnite - EDGE, uIgnite, dist));
  }

  if (uFlare > 0.0) {
    col *= 1.0 + uFlare * (1.0 - smoothstep(0.05, 0.3, dist));
  }

  col *= vShade;
  if (vRim > 0.0) {
    col += col * vRim * 0.5 + vec3(0.1, 0.42, 0.55) * vRim * 0.1;
  }

  col += col * waveBand(vNdc) * 1.4;
  col *= mix(0.3, 1.0, vFade);
  gl_FragColor = vec4(col, 1.0);
}
`;

// The backdrop as its own particle layer, so the cursor can push it around.
export const WORLD_TILE_VERTEX = /* glsl */ `
uniform vec2 uCover;
uniform float uTilePx;
uniform float uAspect;
uniform vec2 uPointerNdc;
uniform float uPointerOn;
uniform float uReveal;

varying vec2 vUv;
varying vec2 vNdc;
varying float vGlow;

void main() {
  vUv = position.xy;
  vGlow = 0.0;
  if (uReveal <= 0.0) {
    vNdc = vec2(2.0);
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  // Anchored to the top, so any trimming comes off the foreground.
  vec2 screen = vec2(
    (position.x - 0.5) / uCover.x + 0.5,
    1.0 - (1.0 - position.y) / uCover.y
  );
  vec2 ndc = screen * 2.0 - 1.0;

  if (uPointerOn > 0.0) {
    vec2 dp = (ndc - uPointerNdc) * vec2(uAspect, 1.0);
    float dl = length(dp);
    float force = (1.0 - smoothstep(0.0, 0.3, dl)) * uPointerOn;
    if (dl > 0.0001) {
      float scatter = 0.65 + 0.7 * position.z;
      ndc += dp / dl * force * 0.085 * scatter / vec2(uAspect, 1.0);
    }
    vGlow = force;
  }

  vNdc = ndc;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = uTilePx;
}
`;

export const WORLD_TILE_FRAGMENT = /* glsl */ `
uniform sampler2D uBackdrop;
uniform sampler2D uMask;
uniform vec2 uTileUv;
uniform vec2 uRes;
uniform vec2 uArtCenter;
uniform vec2 uArtHalf;
uniform float uTime;
uniform float uLights;
uniform float uReveal;
${WAVE}
${SIDE_FADE}

varying vec2 vUv;
varying vec2 vNdc;
varying float vGlow;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 ndc = gl_FragCoord.xy / uRes * 2.0 - 1.0;

  // The shockwave uncovers the world as it passes.
  float d = length((ndc - uFaceNdc) * vec2(uAspect, 1.0));
  float reveal = 1.0 - smoothstep(uReveal - 0.2, uReveal, d);
  if (reveal <= 0.0) discard;

  // The figure stands in front of the world.
  vec2 art = (ndc - uArtCenter) / (2.0 * uArtHalf) + 0.5;
  float mask = 0.0;
  if (art.x >= 0.0 && art.x <= 1.0 && art.y >= 0.0 && art.y <= 1.0) {
    mask = texture2D(uMask, art).r * sideFade(art.x);
  }
  if (mask >= 0.99) discard;

  vec2 pc = gl_PointCoord - 0.5;
  vec2 uv = vUv + vec2(pc.x, -pc.y) * uTileUv;
  vec3 col = texture2D(uBackdrop, uv).rgb;

  if (uLights > 0.0) {
    // A few of the image's own bright points wake and fade, slowly.
    vec2 cell = floor(uv * vec2(240.0, 160.0));
    float h = hash(cell);
    float wake = pow(max(0.0, sin(uTime * (0.25 + h * 0.4) + h * 40.0)), 14.0);
    float lum = max(col.r, max(col.g, col.b));
    col += col * smoothstep(0.22, 0.65, lum) * step(0.6, h) * wake * 1.5 * uLights;
  }

  col += col * vGlow * 0.7;
  col += col * waveBand(ndc) * 2.4;
  gl_FragColor = vec4(col * (1.0 - mask) * reveal, 1.0);
}
`;

// Full-screen layer under the particles: the assembly source and the ring.
export const ATMOSPHERE_VERTEX = /* glsl */ `
varying vec2 vScreen;

void main() {
  vScreen = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const ATMOSPHERE_FRAGMENT = /* glsl */ `
uniform vec2 uSourceNdc;
uniform float uSourceGlow;
${WAVE}

varying vec2 vScreen;

void main() {
  vec2 ndc = vScreen * 2.0 - 1.0;
  vec3 col = vec3(0.0);

  if (uSourceGlow > 0.0) {
    vec2 d = (ndc - uSourceNdc) * vec2(uAspect, 1.0);
    col += vec3(0.46, 0.87, 1.0) * exp(-dot(d, d) / 0.012) * uSourceGlow;
  }

  if (uWaveFade > 0.0) {
    float r = length((ndc - uFaceNdc) * vec2(uAspect, 1.0));
    // A faint glassy trail just inside the bright edge.
    float trail = smoothstep(uWaveR - 0.42, uWaveR, r) * (1.0 - smoothstep(uWaveR, uWaveR + 0.01, r));
    col += vec3(0.46, 0.87, 1.0) * (waveBand(ndc) * 0.42 + trail * 0.07 * uWaveFade);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;
