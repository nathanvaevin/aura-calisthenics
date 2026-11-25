/**
 * What is behind the subject: a place, painted live.
 *
 * One rectangle that covers the whole picture and is drawn before everything
 * else. For every pixel it works out which way the camera is looking there
 * and paints what lies in that direction: a floor where the look meets the
 * ground, walls where it meets a room, a sky beyond. So the place turns
 * correctly as the camera goes round the subject, and the subject's shadow
 * falls on a floor that is really there.
 *
 * Each place moves a little: dust in the light, cloud going over, petals
 * coming down. Nothing in it is loaded; it is rules and noise (`scenes.ts`
 * says which places exist and where they are offered).
 */
import { logoTexture } from './logo'
import { SIGNATURE, SIGNATURE_MAIN } from './signature'
import { Camera, LinearFilter, Matrix4, Mesh, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderTarget, type PerspectiveCamera, type WebGLRenderer } from 'three'

const VERT = /* glsl */ `
  varying vec2 vNdc;
  void main() { vNdc = position.xy; gl_Position = vec4(position.xy, 1.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform mat4 uInvProj, uCamWorld;
  uniform vec3 uCam;
  uniform float uTime, uAspect, uDim, uPix, uHigh, uFacing, uPair;
  uniform sampler2D uLogo;
  uniform vec2 uAt;
  varying vec2 vNdc;

  const float PI = 3.14159265;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) { return noise(p) * 0.5 + noise(p * 2.03 + 7.1) * 0.3 + noise(p * 4.1 + 3.3) * 0.2; }
  float wrap(float a) { return mod(a + PI, 2.0 * PI) - PI; }

  // Small things adrift between the camera and the place: one soft speck in a few of the cells of a moving grid.
  float specks(vec2 uv, float scale, vec2 drift, float size, float seed) {
    vec2 q = uv * scale + drift;
    vec2 c = floor(q), f = fract(q) - 0.5;
    vec2 off = (vec2(hash(c + seed + 1.7), hash(c + seed + 9.2)) - 0.5) * 0.7;
    return smoothstep(size, 0.0, length(f - off)) * step(0.8, hash(c + seed));
  }
  // Cloud in a band above the horizon, without a seam round it. 'ring' is the direction read off a circle.
  float band(vec2 ring, float el, float scale, float t) { return fbm(vec2(ring.x * scale + el * 9.0 + t, ring.y * scale - el * 7.0)); }

#if SCENE == 1 || SCENE == 2
  // ── A hall: a room with a floor, four walls and a roof ───────────────────

  // Light through a wall of windows, at a place along the wall (u) and a height (v). kind 1: paper screens in a lattice. kind 2: tall panes, high up.
  float panes(float u, float v, int kind) {
    if (kind == 1) {
      float bay = abs(fract(u / 3.0) - 0.5) * 3.0;
      float inside = step(bay, 1.28) * step(1.25, v) * step(v, 4.35);
      float bars = step(0.035, abs(fract(u / 0.52) - 0.5) * 0.52) * step(0.03, abs(fract(v / 0.44) - 0.5) * 0.44);
      return inside * bars;
    }
    float bay = abs(fract(u / 4.4) - 0.5) * 4.4;
    float inside = step(bay, 1.9) * step(3.3, v) * step(v, 8.3);
    float bars = step(0.05, abs(fract(u / 0.95) - 0.5) * 0.95) * step(0.045, abs(fract(v / 0.83) - 0.5) * 0.83);
    return inside * bars;
  }

  vec3 hall(vec3 o, vec3 d, int kind) {
    vec3 HALL = kind == 1 ? vec3(10.0, 6.4, 10.0) : vec3(15.0, 10.0, 17.0);
    o.xz = clamp(o.xz, -HALL.xz + 0.6, HALL.xz - 0.6);
    o.y = clamp(o.y, 0.05, HALL.y - 0.3);
    d += vec3(1e-5);
    float tx = ((d.x > 0.0 ? HALL.x : -HALL.x) - o.x) / d.x;
    float tz = ((d.z > 0.0 ? HALL.z : -HALL.z) - o.z) / d.z;
    float ty = ((d.y > 0.0 ? HALL.y : 0.0) - o.y) / d.y;
    float t = min(tx, min(ty, tz));
    vec3 p = o + d * t;
    // Where the sun comes in, low: through the right-hand wall of the dojo, through the far wall of the sports hall.
    vec3 sun = kind == 1 ? normalize(vec3(-1.0, -0.27, 0.2)) : normalize(vec3(0.22, -0.3, 1.0));
    vec3 warm = kind == 1 ? vec3(1.0, 0.78, 0.52) : vec3(1.0, 0.6, 0.4);
    vec3 col;
    if (t == ty && d.y < 0.0) {
      // The floor: boards, the sun lying on them in the shape of the windows, and the windows mirrored in the polish.
      float board = floor(p.x / 0.3);
      float seam = smoothstep(0.0, 0.012, abs(fract(p.x / 0.3) - 0.5) * 0.3 - 0.142);
      vec3 wood = kind == 1 ? mix(vec3(0.3, 0.16, 0.09), vec3(0.4, 0.22, 0.12), hash(vec2(board, 3.0))) : mix(vec3(0.06, 0.07, 0.1), vec3(0.09, 0.1, 0.14), hash(vec2(board, 3.0)));
      wood *= 1.0 - 0.3 * seam;
      float lit;
      vec3 r = reflect(d, vec3(0.0, 1.0, 0.0));
      float mirror = 0.0;
      if (kind == 1) {
        vec3 q = p - sun * ((HALL.x - p.x) / -sun.x);
        lit = panes(q.z, q.y, 1);
        if (r.x > 0.0) { vec3 m = p + r * ((HALL.x - p.x) / r.x); mirror = panes(m.z, m.y, 1); }
        if (r.z < 0.0) { vec3 m = p + r * ((-HALL.z - p.z) / r.z); mirror = max(mirror, 0.5 * panes(m.x, m.y, 1)); }
      } else {
        vec3 q = p - sun * ((p.z + HALL.z) / sun.z);
        lit = panes(q.x, q.y, 2);
        if (r.z < 0.0) { vec3 m = p + r * ((-HALL.z - p.z) / r.z); mirror = panes(m.x, m.y, 2); }
      }
      // The light lies soft on the boards: far from the windows the bars of the lattice have blurred away.
      float soft = kind == 1 ? mix(lit, 0.55, smoothstep(2.0, 10.0, HALL.x - p.x)) : lit;
      col = wood * (kind == 1 ? 0.85 : 0.85) + wood * warm * soft * (kind == 1 ? 1.05 : 2.4) + warm * mirror * (kind == 1 ? 0.1 : 0.18);
    } else if (t == ty) {
      // The roof: dark, with its beams.
      float beam = step(0.82, abs(fract(p.x / 2.2) - 0.5) * 2.0) + step(0.9, abs(fract(p.z / 5.5) - 0.5) * 2.0);
      col = (kind == 1 ? vec3(0.2, 0.1, 0.07) : vec3(0.05, 0.055, 0.08)) * (1.0 - 0.5 * min(1.0, beam));
    } else {
      bool side = t == tx;
      float u = side ? p.z : p.x, v = p.y;
      bool sunny = kind == 1 ? (side && d.x > 0.0) : (!side && d.z < 0.0);
      if (kind == 1) {
        float bay = abs(fract(u / 3.0) - 0.5) * 3.0;
        float post = step(1.36, bay);
        float open = panes(u, v, 1);
        float screen = step(bay, 1.28) * step(1.25, v) * step(v, 4.35);
        vec3 woodDark = vec3(0.17, 0.09, 0.06), woodMid = vec3(0.28, 0.15, 0.09);
        col = mix(woodMid, woodDark, post);
        // Paper screens: glowing on the sunny wall, holding a little of the evening on the others.
        col = mix(col, sunny ? vec3(1.0, 0.84, 0.62) * (0.86 + 0.14 * open) : vec3(0.72, 0.52, 0.4) * (0.78 + 0.22 * open), screen);
        col = mix(col, woodDark, screen * (1.0 - open));
        // A band of dull red above them, with a plain roundel over each bay.
        float frieze = step(4.5, v) * step(v, 5.5);
        float ringD = length(vec2(bay, v - 5.0));
        float roundel = smoothstep(0.42, 0.4, ringD) * (0.55 + 0.45 * step(0.5, fract(ringD * 6.0)));
        col = mix(col, mix(vec3(0.42, 0.15, 0.12), vec3(0.78, 0.6, 0.48), roundel * (1.0 - post)), frieze);
        col *= 0.55 + 0.45 * smoothstep(0.0, 1.6, v);
        col *= 1.0 - 0.5 * smoothstep(5.5, 6.3, v);
      } else {
        // Ribbed walls, dark; and one wall of tall panes, high up, with the evening behind it.
        float rib = 0.9 + 0.1 * step(0.5, fract(u / 0.34));
        col = vec3(0.065, 0.075, 0.115) * rib * (0.55 + 0.45 * smoothstep(0.0, 3.0, v));
        if (sunny) {
          float open = panes(u, v, 2);
          float frame = step(abs(fract(u / 4.4) - 0.5) * 4.4, 1.9) * step(3.3, v) * step(v, 8.3);
          vec3 evening = mix(vec3(0.94, 0.5, 0.3), vec3(0.74, 0.52, 0.6), smoothstep(3.3, 8.3, v));
          col = mix(col, mix(vec3(0.035, 0.04, 0.065), evening, open), frame);
        }
      }
    }
    // Sun hanging in the air towards the windows.
    float into = max(0.0, dot(d, -sun));
    col += warm * pow(into, 4.0) * (kind == 1 ? 0.2 : 0.12);
    return col;
  }
#endif
${SIGNATURE}
  void main() {
    vec4 far = uInvProj * vec4(vNdc, 1.0, 1.0);
    vec3 d = normalize((uCamWorld * vec4(normalize(far.xyz / far.w), 0.0)).xyz);
    vec3 o = uCam;
    // The place stands round the subject, turned so that what it is about (its -z) lies behind it for the angle an exercise is shown from.
    float cf = cos(uFacing), sf = sin(uFacing);
    o.xz -= uAt;
    d.xz = vec2(d.x * cf - d.z * sf, d.x * sf + d.z * cf);
    o.xz = vec2(o.x * cf - o.z * sf, o.x * sf + o.z * cf);
    vec2 uv = vNdc * vec2(uAspect, 1.0);
    float az = atan(d.z, d.x), el = asin(clamp(d.y, -1.0, 1.0));
    // Round the horizon without a seam: what varies with direction is read off a circle.
    vec2 ring = vec2(cos(az), sin(az));
    bool down = d.y < 0.0;
    vec3 g = o + d * (-o.y / min(d.y, -1e-4));
    float away = length(g.xz - o.xz);
    vec3 col = vec3(0.0);
    // The camera looks a little down at the subject, so only a low band of sky is ever in the picture:
    // everything that makes a place (ridge, trees, cloud) is kept within about ten degrees of the horizon.

#if SCENE == 1 || SCENE == 2
      col = hall(o, d, SCENE);
      // Dust, turning slowly in the light.
      float dust = specks(uv, 5.0, vec2(uTime * 0.02, uTime * 0.035), 0.06, 1.0) + specks(uv, 9.0, vec2(-uTime * 0.015, uTime * 0.03), 0.05, 5.0);
      col += (SCENE == 1 ? vec3(1.0, 0.82, 0.6) : vec3(1.0, 0.7, 0.5)) * dust * 0.2;
#elif SCENE == 3
      // Mountain meadow.
      vec3 sky = mix(vec3(0.82, 0.91, 0.97), vec3(0.34, 0.58, 0.92), smoothstep(0.0, 0.3, el));
      float cloud = smoothstep(0.5, 0.72, band(ring, el, 2.4, uTime * 0.012)) * smoothstep(0.02, 0.1, el);
      col = mix(sky, vec3(1.0, 0.99, 0.96), cloud * 0.92);
      // A far range, then the mountain itself.
      float range = 0.03 + 0.05 * noise(ring * 2.6 + 9.0) + 0.012 * noise(ring * 11.0);
      if (el < range) col = mix(vec3(0.62, 0.7, 0.86), vec3(0.74, 0.82, 0.92), smoothstep(range, 0.0, el));
      float peak = 0.02 + 0.2 * pow(noise(ring * 1.25 + 4.0), 2.2) + 0.03 * noise(ring * 5.0 + 1.0) + 0.008 * noise(ring * 21.0);
      if (el < peak) {
        float face = noise(ring * 9.0 + vec2(el * 30.0, 0.0));
        vec3 rock = mix(vec3(0.4, 0.4, 0.55), vec3(0.68, 0.68, 0.8), face);
        col = mix(rock, vec3(0.68, 0.78, 0.9), smoothstep(peak, 0.0, el) * 0.6);
      }
      // Woods at its foot: a darker line behind, a lighter one in front.
      float woods = 0.028 + 0.02 * noise(ring * 9.0 + 2.0) + 0.008 * noise(ring * 31.0 + 5.0);
      if (el < woods) col = mix(vec3(0.12, 0.34, 0.2), vec3(0.3, 0.56, 0.26), noise(vec2(az * 90.0, el * 260.0)));
      float bushes = 0.012 + 0.012 * noise(ring * 17.0 + 7.0) + 0.005 * noise(ring * 60.0);
      if (el < bushes) col = mix(vec3(0.3, 0.58, 0.24), vec3(0.56, 0.8, 0.32), noise(vec2(az * 140.0, el * 420.0)));
      if (down) {
        float patchy = fbm(g.xz * 0.32);
        // Wind going through the grass.
        float wind = noise(g.xz * 0.7 + vec2(uTime * 0.35, uTime * 0.1));
        vec3 grass = mix(vec3(0.27, 0.58, 0.2), vec3(0.52, 0.8, 0.3), patchy * 0.65 + wind * 0.35);
        grass *= 0.88 + 0.24 * noise(g.xz * vec2(18.0, 9.0));
        // Small flowers, near.
        vec2 cell = floor(g.xz * 3.0);
        float flower = smoothstep(0.1, 0.03, length(fract(g.xz * 3.0) - 0.5 - (vec2(hash(cell), hash(cell + 4.0)) - 0.5) * 0.6)) * step(0.82, hash(cell + 9.0));
        grass = mix(grass, hash(cell + 2.0) > 0.5 ? vec3(1.0, 0.98, 0.9) : vec3(1.0, 0.86, 0.36), flower * smoothstep(16.0, 5.0, away));
        col = mix(grass, vec3(0.4, 0.66, 0.3), smoothstep(8.0, 44.0, away));
      }
      float seeds = specks(uv, 4.0, vec2(uTime * 0.06, sin(uTime * 0.4) * 0.05), 0.04, 2.0) + specks(uv, 7.0, vec2(uTime * 0.045, -uTime * 0.012), 0.035, 7.0);
      col += vec3(1.0, 1.0, 0.92) * seeds * 0.55;
#elif SCENE == 4
      // Blossom garden at dusk.
      col = mix(vec3(1.0, 0.76, 0.56), vec3(0.3, 0.4, 0.52), smoothstep(-0.01, 0.2, el));
      float wood = 0.035 + 0.04 * noise(ring * 3.0 + 1.0) + 0.012 * noise(ring * 12.0);
      if (el < wood) col = mix(vec3(0.08, 0.16, 0.17), vec3(0.16, 0.29, 0.26), noise(vec2(az * 40.0, el * 160.0)));
      // Cherry trees in a ring round the garden: trunks, and the blossom on them in heaps.
      float lump = noise(ring * 7.0 + 3.0) * 0.5 + noise(ring * 23.0 + 8.0) * 0.32 + noise(ring * 70.0) * 0.18;
      float crown = 0.045 + 0.1 * lump;
      float foot = 0.02 + 0.016 * noise(ring * 15.0 + 2.0);
      float between = abs(fract(az / (2.0 * PI / 11.0) + 0.13) - 0.5) * (2.0 * PI / 11.0);
      float trunk = smoothstep(0.009, 0.004, between + 0.004 * sin(el * 120.0)) * step(el, foot + 0.02) * step(0.0, el);
      if (el < foot) col = mix(vec3(0.07, 0.15, 0.13), vec3(0.13, 0.23, 0.16), noise(vec2(az * 70.0, el * 300.0)));
      col = mix(col, vec3(0.13, 0.085, 0.08), trunk);
      if (el < crown && el > foot) {
        float puff = noise(vec2(az * 60.0, el * 210.0)) * 0.6 + noise(vec2(az * 150.0, el * 520.0)) * 0.4;
        // Lit from below by the lanterns, deeper pink where the heaps turn away.
        vec3 petal = mix(vec3(0.74, 0.4, 0.56), vec3(1.0, 0.86, 0.9), puff * 0.6 + 0.4 * smoothstep(crown, foot, el));
        col = mix(col, petal, smoothstep(foot, foot + 0.008, el) * smoothstep(crown, crown - 0.006, el));
      }
      if (down) {
        float path = smoothstep(1.5, 0.3, abs(g.x - sin(g.z * 0.28) * 1.4));
        vec3 lawn = mix(vec3(0.1, 0.2, 0.12), vec3(0.2, 0.34, 0.17), fbm(g.xz * 0.5));
        lawn = mix(lawn, vec3(0.52, 0.42, 0.3), path * 0.45);
        vec2 cell = floor(g.xz * 4.0);
        lawn = mix(lawn, vec3(1.0, 0.82, 0.88), smoothstep(0.12, 0.04, length(fract(g.xz * 4.0) - 0.5 - (vec2(hash(cell), hash(cell + 3.0)) - 0.5) * 0.6)) * step(0.7, hash(cell + 6.0)) * 0.55 * smoothstep(22.0, 4.0, away));
        col = mix(lawn, vec3(0.1, 0.2, 0.17), smoothstep(6.0, 30.0, away));
      }
      // Lanterns strung between the trees, swaying a little, and the light they keep round them.
      if (el > -0.03 && el < 0.11) for (int i = 0; i < 22; i++) {
        float k = float(i);
        float a = k * 0.2856 + 0.2 + 0.1 * hash(vec2(k, 1.0));
        float e = 0.026 + 0.022 * hash(vec2(k, 2.0)) + 0.002 * sin(uTime * 0.8 + k * 2.0);
        vec2 off = vec2(wrap(az - a) * cos(el), el - e);
        float body = smoothstep(0.011, 0.008, length(off * vec2(1.0, 0.74)));
        col += vec3(1.0, 0.56, 0.24) * exp(-dot(off, off) * 520.0) * 0.55;
        col = mix(col, vec3(1.0, 0.8, 0.46), body);
      }
      float petals = specks(uv + vec2(sin(uTime * 0.5 + uv.y * 3.0) * 0.03, 0.0), 4.5, vec2(uTime * 0.03, uTime * 0.1), 0.05, 3.0) + specks(uv, 8.0, vec2(-uTime * 0.02, uTime * 0.14), 0.045, 8.0);
      col = mix(col, vec3(1.0, 0.8, 0.86), min(1.0, petals) * 0.85);
#elif SCENE == 5
      // Ember sky: the sun has just gone, behind the subject.
      float toSun = max(0.0, dot(normalize(vec3(d.x, 0.0, d.z) + 1e-4), vec3(0.0, 0.0, -1.0)));
      vec3 low = mix(vec3(1.0, 0.44, 0.2), vec3(1.0, 0.9, 0.66), pow(toSun, 4.0));
      col = mix(low, vec3(0.2, 0.08, 0.26), smoothstep(0.0, 0.34, el + 0.1 * (1.0 - toSun)));
      // Cloud lit from below: fire on its underside, violet above.
      float cloud = smoothstep(0.44, 0.7, band(ring, el, 2.0, uTime * 0.008)) * smoothstep(0.012, 0.07, el);
      float under = smoothstep(0.35, 0.75, band(ring, el + 0.03, 2.0, uTime * 0.008));
      vec3 lit = mix(vec3(0.3, 0.11, 0.3), vec3(1.0, 0.4, 0.2), under * (0.4 + 0.6 * toSun));
      col = mix(col, lit, cloud * 0.92);
      vec2 cell = floor(vec2(az * cos(el), el) * 120.0);
      col += vec3(1.0, 0.92, 0.84) * smoothstep(0.2, 0.0, length(fract(vec2(az * cos(el), el) * 120.0) - 0.5)) * step(0.96, hash(cell)) * smoothstep(0.16, 0.3, el) * (1.0 - cloud);
      // The field, black against it, with the grass standing up along its edge.
      float field = 0.008 + 0.01 * noise(ring * 80.0) + 0.006 * noise(ring * 260.0);
      if (el < field) {
        col = vec3(0.045, 0.022, 0.05);
        if (down) col += vec3(0.5, 0.16, 0.08) * toSun * smoothstep(3.0, 40.0, away) * 0.35 * (0.6 + 0.4 * noise(g.xz * 3.0));
      }
      float sparks = specks(uv, 6.0, vec2(sin(uTime * 0.3) * 0.1, -uTime * 0.1), 0.035, 4.0) + specks(uv, 11.0, vec2(0.0, -uTime * 0.17), 0.03, 9.0);
      col += vec3(1.0, 0.58, 0.22) * sparks * 0.6;
#elif SCENE == 6
      // Storm night.
      col = mix(vec3(0.12, 0.2, 0.5), vec3(0.03, 0.05, 0.2), smoothstep(0.0, 0.32, el));
      col += vec3(0.46, 0.2, 0.4) * smoothstep(0.1, 0.0, el) * 0.3;
      float cloud = smoothstep(0.4, 0.74, band(ring, el, 1.8, uTime * 0.01));
      vec2 sp = vec2(az * cos(el), el) * 110.0;
      vec2 cell = floor(sp);
      vec2 at = fract(sp) - 0.5 - (vec2(hash(cell + 1.0), hash(cell + 2.0)) - 0.5) * 0.6;
      float star = smoothstep(0.16, 0.0, length(at)) * step(0.9, hash(cell)) * (0.5 + 0.5 * sin(uTime * (1.0 + 3.0 * hash(cell + 3.0)) + hash(cell + 5.0) * 6.3));
      col += vec3(0.86, 0.93, 1.0) * star * step(0.0, el) * (1.0 - cloud * 0.85) * 1.2;
      col = mix(col, vec3(0.2, 0.34, 0.72), cloud * 0.5 * smoothstep(0.0, 0.1, el));
      // Lightning, far off and seldom: the cloud lights up, and a thread of it shows.
      float turn = floor(uTime / 6.5), since = fract(uTime / 6.5) * 6.5;
      float where = hash(vec2(turn, 7.0)) * 2.0 * PI - PI;
      float flash = exp(-since * 6.0) * (0.6 + 0.4 * sin(since * 55.0)) * step(since, 0.9);
      float nearby = exp(-pow(wrap(az - where), 2.0) * 2.4);
      col += vec3(0.5, 0.68, 1.0) * flash * nearby * (0.25 + 0.75 * cloud) * 0.5 * step(0.0, el);
      float path = where + (noise(vec2(el * 30.0, turn)) - 0.5) * 0.22 + (noise(vec2(el * 110.0, turn + 3.0)) - 0.5) * 0.04;
      float bolt = smoothstep(0.004, 0.0, abs(wrap(az - path)) * cos(el)) * step(0.02, el) * step(el, 0.3);
      col += vec3(0.82, 0.92, 1.0) * bolt * flash;
      // Hills, black on the horizon, and still water this side of them holding the sky.
      float hills = 0.008 + 0.022 * noise(ring * 4.0 + 6.0) + 0.006 * noise(ring * 19.0);
      if (el < hills) col = vec3(0.02, 0.03, 0.08);
      if (down) {
        float ripple = noise(vec2(g.x * 0.6, g.z * 2.4 + uTime * 0.2));
        vec3 water = mix(vec3(0.03, 0.05, 0.13), vec3(0.09, 0.15, 0.36), smoothstep(4.0, 60.0, away) * (0.7 + 0.3 * ripple));
        col = water + vec3(0.3, 0.45, 0.8) * flash * nearby * 0.1;
      }
#elif SCENE == 7
      // Ink mountains, on paper.
      vec3 paper = vec3(0.914, 0.906, 0.886);
      col = paper;
      float mist = noise(vec2(ring.x * 3.0 + uTime * 0.015, el * 40.0) + ring.y * 3.0);
      for (int i = 0; i < 3; i++) {
        float k = float(i);
        float ridge = 0.15 - 0.05 * k + (0.1 - 0.02 * k) * (noise(ring * (1.6 + k * 1.4) + 3.0 * k) - 0.5) + 0.012 * noise(ring * (9.0 + 6.0 * k));
        float inside = smoothstep(ridge, ridge - 0.004, el);
        // Dark at the crest, washed away to paper where the mist lies at its foot.
        float body = smoothstep(ridge - 0.085, ridge, el);
        vec3 wash = mix(vec3(0.76, 0.76, 0.75), vec3(0.42, 0.42, 0.46), k / 2.0);
        col = mix(col, wash, inside * (0.2 + 0.8 * body) * (0.7 + 0.3 * mist));
      }
      if (down) col = mix(paper * (0.95 + 0.05 * noise(g.xz * 1.3)), paper, smoothstep(2.0, 14.0, away));
      float petals = specks(uv, 4.0, vec2(uTime * 0.02, uTime * 0.07), 0.035, 6.0);
      col = mix(col, vec3(0.89, 0.31, 0.18), petals * 0.85);
${SIGNATURE_MAIN}#endif
    gl_FragColor = vec4(col * uDim, 1.0);
  }
`

/**
 * How finely a place is painted: this many dots to a point of the screen. A phone's screen has two or three; painting
 * fewer costs it a good deal less, and the little softness that comes with it keeps the eye on the subject.
 */
const FINE = 1.25
/** And on a device that was not keeping up. */
const COARSE = 0.75

export class Backdrop {
  /** The finished picture of the place, laid over the whole stage before anything else. */
  readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>
  /** Painted more coarsely, for a device that was not keeping up. */
  coarse = false
  private readonly paint: Mesh<PlaneGeometry, ShaderMaterial>
  private readonly easel = new Scene()
  private readonly lens = new Camera()
  private readonly target = new WebGLRenderTarget(2, 2, { depthBuffer: false, minFilter: LinearFilter, magFilter: LinearFilter })

  constructor() {
    this.paint = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
      depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: {
        uInvProj: { value: new Matrix4() }, uCamWorld: { value: new Matrix4() }, uCam: { value: new Vector3() }, uTime: { value: 0 }, uAspect: { value: 1 },
        uDim: { value: 1 }, uPix: { value: 0.001 }, uHigh: { value: 800 }, uFacing: { value: 0 }, uPair: { value: 0 }, uAt: { value: new Vector2() }, uLogo: { value: null },
      },
      // Each place is a program of its own: a phone compiles only the one it shows.
      defines: { SCENE: 0 },
      vertexShader: VERT, fragmentShader: FRAG,
    }))
    this.paint.frustumCulled = false
    this.easel.add(this.paint)
    this.mesh = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
      depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { uPicture: { value: this.target.texture } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }',
      // A grain too fine to see, so that a long soft gradient does not show steps.
      fragmentShader: 'uniform sampler2D uPicture; varying vec2 vUv; void main() { float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453); gl_FragColor = vec4(texture2D(uPicture, vUv).rgb + (n - 0.5) / 255.0, 1.0); }',
    }))
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -100
    this.mesh.visible = false
  }

  /** Which place to paint (0: none, and nothing is drawn), and how bright. */
  set(paint: number, dim = 1) {
    this.mesh.visible = paint > 0
    const m = this.paint.material
    if (paint > 0 && m.defines.SCENE !== paint) { m.defines.SCENE = paint; m.needsUpdate = true }
    // The name is on the two Aura places.
    if ((paint === 8 || paint === 9) && !m.uniforms.uLogo.value) m.uniforms.uLogo.value = logoTexture()
    m.uniforms.uDim.value = dim
  }

  /** Two or more stand in it, side by side. */
  set pair(on: boolean) { this.paint.material.uniforms.uPair.value = on ? 1 : 0 }

  /** Where the place stands and which way it faces: round this point, what it is about opposite this camera angle (degrees). */
  face(degrees: number, x: number, z: number) {
    this.paint.material.uniforms.uFacing.value = (degrees * Math.PI) / 180
    ;(this.paint.material.uniforms.uAt.value as Vector2).set(x, z)
  }

  /** Call before each render: the camera has moved, and time has passed. */
  update(renderer: WebGLRenderer, camera: PerspectiveCamera, seconds: number) {
    if (!this.mesh.visible) return
    const { width, height } = renderer.domElement
    const share = Math.min(1, (this.coarse ? COARSE : FINE) / renderer.getPixelRatio())
    const w = Math.max(2, Math.round(width * share)), h = Math.max(2, Math.round(height * share))
    if (this.target.width !== w || this.target.height !== h) this.target.setSize(w, h)
    const u = this.paint.material.uniforms
    camera.updateMatrixWorld()
    ;(u.uInvProj.value as Matrix4).copy(camera.projectionMatrix).invert()
    ;(u.uCamWorld.value as Matrix4).copy(camera.matrixWorld)
    ;(u.uCam.value as Vector3).setFromMatrixPosition(camera.matrixWorld)
    u.uTime.value = seconds
    u.uAspect.value = width / height
    u.uHigh.value = h
    // How much of the view one pixel takes, to soften edges by exactly that.
    u.uPix.value = 2 / (h * camera.projectionMatrix.elements[5])
    renderer.setRenderTarget(this.target)
    renderer.render(this.easel, this.lens)
    renderer.setRenderTarget(null)
  }

  dispose() {
    this.target.dispose()
    this.paint.geometry.dispose()
    this.paint.material.dispose()
  }
}
