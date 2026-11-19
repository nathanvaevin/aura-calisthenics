/**
 * The Aura around one character.
 *
 * Nine independent components, each a single draw call whose shape is worked
 * out on the graphics card from a few shared numbers: time, intensity, the
 * last pulse and burst, and the space the body takes up. A theme only sets
 * levels and colours; intensity moves everything smoothly from nothing to a
 * full release.
 *
 * The field measures the body every frame, so it wraps a standing athlete, a
 * plank and someone hanging from a bar alike.
 */
import {
  AdditiveBlending, BackSide, NormalBlending, BufferAttribute, BufferGeometry, Color, DoubleSide, DynamicDrawUsage, Group, Mesh, PlaneGeometry, Points, ShaderMaterial,
  SkinnedMesh, Vector3, type PerspectiveCamera,
} from 'three'
import type { Actor } from '../character'
import { SKIN_BLEND, SKIN_DECL } from '../body/skinning'
import { SIGNS, type AuraTheme, type ComponentId, type ThemeTuning } from './themes'

const GLSL = /* glsl */ `
uniform vec3 uPal[6];
uniform float uPalN, uTime, uIntensity, uPulse, uBurst, uSurge, uBase, uFloor, uPaint;
uniform vec3 uSize;
vec3 pal(float x) {
  float f = fract(x) * uPalN;
  int i = int(floor(f));
  int j = int(mod(float(i + 1), uPalN));
  return mix(uPal[i], uPal[j], smoothstep(0.0, 1.0, fract(f)));
}
float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
`

type U = Record<string, { value: unknown }>

function shader(shared: U, own: Record<string, unknown>, vertex: string, fragment: string, opts: Partial<ShaderMaterial> = {}) {
  const uniforms: U = { ...shared }
  for (const [k, v] of Object.entries(own)) uniforms[k] = { value: v }
  // Every component ends in the same step: on a paper stage its light is turned into paint.
  const painted = `${fragment.replace('void main()', 'void lit()')}
    void main() {
      lit();
      if (uPaint > 0.5) {
        vec3 c = gl_FragColor.rgb;
        float pale = min(c.r, min(c.g, c.b));
        // What was a white-hot core has no white to be on paper: it takes the colour, deepened.
        c = mix(c, c * c * 0.9, 0.55) * (1.0 - 0.35 * pale);
        gl_FragColor = vec4(c, min(1.0, gl_FragColor.a * 1.1));
      }
    }`
  return new ShaderMaterial({
    uniforms, vertexShader: `${GLSL}\n${vertex}`, fragmentShader: `${GLSL}\n${painted}`,
    transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide, ...opts,
  })
}

const rnd = (n: number, width: number) => { const a = new Float32Array(n * width); for (let i = 0; i < a.length; i++) a[i] = Math.random(); return a }
const smooth = (a: number, b: number, x: number) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u) }

/** How long a charge gathers before it bursts, in seconds. */
export const CHARGE_SECONDS = 1.2
/** At rest an Aura is a glow round the body; nothing below shows until it is let go. */
const LOOSE: ComponentId[] = ['rays', 'ribbons', 'motes', 'streams', 'rings', 'arcs', 'sparks']
/** How long an activation's sign stands behind the body, in seconds. */
const SIGN_SECONDS = 2.8
/** Every Aura burns at rest at least this much: a working body's heat, not a still light. */
const FLAME_FLOOR = 0.75

const RIBBONS = 12, SEGMENTS = 56, MOTES = 260, SPARKS = 140, TRAIL = 4, STREAMS = 24, ARCS = 10, ARC_POINTS = 14

export class AuraField {
  /** Follows the body: everything that orbits it. */
  readonly group = new Group()
  /** Stays in the world: the outline shells (in the character's own space) and the lightning. */
  readonly world = new Group()
  private readonly actor: Actor
  private readonly shared: U
  private readonly parts = {} as Record<ComponentId, { objects: (Mesh | Points)[]; gain: { value: number } }>
  private readonly waves = [-99, -99, -99, -99]
  private theme!: AuraTheme
  private tuning: ThemeTuning = {}
  private time = 0
  private clock = 0
  private level = 0
  private pulse = 0
  private burstAge = 99
  /** Seconds into a charge, or -1. */
  private chargeAge = -1
  private arcClock = 0
  private readonly centre = new Vector3()
  private readonly size = new Vector3(0.45, 1.9, 0.45)
  private heading = 0
  private base = 0
  private measured = false
  private readonly shells: SkinnedMesh[] = []
  /** The sign of this Aura's activation: one sheet behind the body, drawn only in a burst. */
  private readonly sign: Mesh
  private readonly arcs: { geometry: BufferGeometry; position: Float32Array; side: Float32Array }

  constructor(actor: Actor) {
    this.actor = actor
    const S = this.shared = {
      uPal: { value: Array.from({ length: 6 }, () => new Color(1, 1, 1)) }, uPalN: { value: 4 },
      uTime: { value: 0 }, uIntensity: { value: 0 }, uPulse: { value: 0 }, uBurst: { value: 99 }, uSurge: { value: 0 },
      uBase: { value: 0 }, uFloor: { value: 0.004 }, uSize: { value: this.size }, uPaint: { value: 0 },
    }
    const part = (id: ComponentId, ...objects: (Mesh | Points)[]) => {
      const gain = { value: 0 }
      for (const o of objects) {
        ;((o.material as ShaderMaterial).uniforms.uGain = gain)
        o.frustumCulled = false
        o.visible = false
      }
      this.parts[id] = { objects, gain }
    }

    // ── Outline: the body drawn again, a little larger, lit only at its edge ──
    const shellMat = (inner: boolean) => shader(S, { uReach: 0.01, uFlame: 0, uPower: inner ? 2.2 : 1.4, uInner: inner ? 1 : 0 }, /* glsl */ `
      #include <common>
      #include <skinning_pars_vertex>
      ${SKIN_DECL}
      uniform float uReach, uFlame, uInner;
      varying float vEdge, vY, vLick;
      void main() {
        vec3 objectNormal = normal;
        #include <skinbase_vertex>
        ${SKIN_BLEND}
        #include <skinnormal_vertex>
        vec3 transformed = position;
        #include <skinning_vertex>
        vec3 n = normalize(objectNormal);
        vec4 w = modelMatrix * vec4(transformed, 1.0);
        float lick = noise(vec3(w.xz * 6.0, w.y * 3.4 - uTime * 1.9));
        float reach = uReach * mix(2.6, 1.0, uInner) * (1.0 + uFlame * (lick * 2.6 - 0.6) * (1.0 - uInner));
        transformed += n * reach + vec3(0.0, uFlame * uReach * lick * 2.2 * (1.0 - uInner), 0.0);
        vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
        vEdge = 1.0 - abs(dot(normalize(normalMatrix * n), normalize(-mv.xyz)));
        vY = w.y; vLick = lick;
        gl_Position = projectionMatrix * mv;
      }`, /* glsl */ `
      uniform float uGain, uPower, uFlame, uInner;
      varying float vEdge, vY, vLick;
      void main() {
        float a = pow(vEdge, uPower) * uGain * mix(0.55 + 0.75 * mix(1.0, vLick, uFlame), 1.0, uInner);
        vec3 c = mix(pal(vY * 0.3 + uTime * 0.04 + vLick * 0.25), uPal[0], uInner * 0.6);
        gl_FragColor = vec4(c, a);
      }`)
    const shellMeshes: Mesh[] = []
    for (const src of actor.meshes as SkinnedMesh[]) {
      for (const inner of [true, false]) {
        const m = new SkinnedMesh(src.geometry, shellMat(inner))
        m.bind(src.skeleton, src.bindMatrix)
        src.parent!.add(m)
        this.shells.push(m)
        shellMeshes.push(m)
      }
    }
    part('shell', ...shellMeshes)

    // ── Field and rays: one sheet of light behind the body, always facing the camera ──
    const sheet = (fragment: string, own: Record<string, unknown>) => new Mesh(new PlaneGeometry(1, 1), shader(S, own,
      'varying vec2 vP; void main() { vP = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragment))
    const halo = sheet(/* glsl */ `
      uniform float uGain; varying vec2 vP;
      void main() {
        float r = length(vP * vec2(1.0, 0.86));
        float n = noise(vec3(vP * 2.4 + vec2(0.0, -uTime * 0.32), uTime * 0.11));
        float a = exp(-r * r * 4.2) * (0.5 + 0.7 * n) * uGain * (0.75 + 0.25 * uPulse) * smoothstep(1.0, 0.72, max(abs(vP.x), abs(vP.y)));
        gl_FragColor = vec4(mix(uPal[0], pal(0.28 + 0.3 * n + r * 0.3), smoothstep(0.05, 0.75, r)), a * 0.42);
      }`, {})
    const rays = sheet(/* glsl */ `
      uniform float uGain, uCount, uSharp; varying vec2 vP;
      void main() {
        float r = length(vP), ang = atan(vP.y, vP.x);
        float ray = pow(0.5 + 0.5 * sin(ang * uCount + uTime * 0.22) * sin(ang * (uCount * 0.618 + 2.0) - uTime * 0.16 + 1.3), uSharp);
        float fall = exp(-r * (3.8 - 2.0 * uSurge)) * smoothstep(0.03, 0.22, r) * smoothstep(1.0, 0.7, r);
        gl_FragColor = vec4(mix(pal(ang * 0.159 + 0.1), vec3(1.0), 0.35), ray * fall * uGain * 0.9);
      }`, { uCount: 9, uSharp: 3 })
    halo.renderOrder = -3
    rays.renderOrder = -3
    part('halo', halo)
    part('rays', rays)
    this.world.add(halo, rays)

    // ── The sign of the activation: what this Aura is, shown behind the body for the length of a burst ──
    // One sheet, one pattern per Aura (themes.ts `act.sign`). `q` is in body heights: feet at -0.5, the top of the head at +0.5.
    const sign = sheet(/* glsl */ `
      uniform float uGain, uKind, uManner; varying vec2 vP;
      float band(float r, float R, float w) { float d = (r - R) / w; return exp(-d * d); }
      void main() {
        if (uKind < 0.5) discard;
        vec2 q = vP * 1.6;
        float b = uBurst;
        float inn = smoothstep(0.0, 0.12, b);
        float fade = 1.0 - smoothstep(1.5, 2.7, b);
        float grow = 1.0 - exp(-b * 2.4);
        float r = length(q), ang = atan(q.y, q.x);
        vec3 col = vec3(1.0); float a = 0.0;

        if (uKind < 1.5) {
          // Galaxy: a spiral disc seen at a slant opens behind the body, and its stars come out. (Manner 1: wider, slower, more stars.)
          vec2 g = vec2(q.x, (q.y - 0.05) * mix(2.1, 1.7, uManner));
          float gr = length(g) / ((0.4 + 0.8 * grow) * mix(1.0, 1.3, uManner)), ga = atan(g.y, g.x);
          float arms = pow(0.5 + 0.5 * cos(2.0 * (ga + log(gr + 0.06) * 2.6) - uTime * 0.9 - b * 2.0), 2.5);
          float dust = 0.55 + 0.45 * noise(vec3(g * 6.0, uTime * 0.2));
          float disc = exp(-gr * gr * 2.6) * arms * dust;
          float core = exp(-gr * gr * 26.0);
          float cells = mix(40.0, 54.0, uManner);
          float h = hash(vec3(floor(q * cells), 7.0));
          float star = step(mix(0.975, 0.955, uManner), h) * (0.5 + 0.5 * sin(uTime * (2.0 + 6.0 * h) + h * 90.0)) * smoothstep(0.4, 0.0, length(fract(q * cells) - 0.5)) * exp(-gr * 0.8);
          col = mix(pal(gr * 0.5 + ga * 0.159), vec3(1.0), min(1.0, core * 0.8 + star));
          a = (disc * 1.5 + core * 0.9 + star) * inn * fade;
        } else if (uKind < 2.5) {
          // Bolt: lightning comes down out of the dark and meets at the head, again and again, with a flash.
          float flick = floor(b * 11.0);
          float sum = 0.0;
          for (int i = 0; i < 3; i++) {
            float fi = float(i);
            float seed = fi * 7.31 + flick * 1.7;
            float on = step(0.12, hash(vec3(seed, 1.0, 2.0)));
            float top = smoothstep(0.44, 1.5, q.y);
            float px = ((fi - 1.0) * 0.6 + (noise(vec3(q.y * 3.2, seed, 0.0)) - 0.5) * 0.8 + (noise(vec3(q.y * 11.0, seed, 3.0)) - 0.5) * 0.18) * top;
            float d = abs(q.x - px);
            sum += on * (0.006 / (d + 0.005)) * exp(-d * 5.0) * step(0.44, q.y);
          }
          float flash = exp(-b * 8.0) * exp(-r * 1.3);
          col = mix(uPal[1], vec3(1.0), 0.78);
          a = (min(sum, 2.5) * 0.7 * (1.0 - smoothstep(1.0, 1.6, b)) + flash) * inn;
        } else if (uKind < 3.5) {
          // Sun: it rises behind the shoulders, a bright disc with a turning corona, and the body stands against it.
          vec2 d2 = q - vec2(0.0, mix(-0.3, 0.2, grow));
          float R = 0.46, sr = length(d2), sa = atan(d2.y, d2.x);
          float disc = smoothstep(R + 0.012, R - 0.012, sr);
          float limb = 0.5 + 0.5 * sqrt(max(0.0, 1.0 - (sr / R) * (sr / R)));
          float boil = 0.8 + 0.2 * noise(vec3(d2 * 9.0, uTime * 0.6));
          float beams = pow(0.5 + 0.5 * sin(sa * 12.0 + uTime * 0.35) * sin(sa * 7.0 - uTime * 0.22 + 1.0), 2.0);
          float corona = step(R, sr) * exp(-(sr - R) * (5.5 - 3.0 * beams)) * (0.4 + 0.6 * beams);
          col = mix(uPal[1], uPal[2], disc * limb);
          a = (disc * limb * boil * 0.8 + corona * 0.85) * inn * fade;
        } else if (uKind < 4.5) {
          // Aurora: curtains of light hang in an arch behind the shoulders, like wings, and sway.
          float arch = q.y + 0.22 * q.x * q.x;
          float sway = q.x * 2.2 + 0.35 * sin(q.y * 2.4 + uTime * 0.7) + uTime * 0.12;
          float fold = noise(vec3(sway * 1.3, uTime * 0.18, 0.0));
          float streak = 0.5 + 0.5 * noise(vec3(sway * 9.0, q.y * 0.6, uTime * 0.3));
          float top = 0.5 + 0.9 * fold * grow;
          float curtain = smoothstep(-0.3, 0.35, arch) * smoothstep(top, top - 0.8, arch) * pow(fold, 1.3) * streak;
          col = pal(fold * 0.9 + q.x * 0.15 + 0.1);
          a = curtain * (0.3 + 0.7 * smoothstep(0.08, 0.3, abs(q.x))) * 1.7 * smoothstep(1.6, 1.1, abs(q.x)) * inn * fade;
        } else if (uKind < 5.5) {
          // Pillar: fire goes up from the floor through the body, far above the head. (Manner 1: an eruption, wider and rougher.)
          float y0 = q.y + 0.5;
          float H = (0.8 + 1.3 * grow) * (1.0 - 0.6 * smoothstep(1.3, 2.6, b));
          float n = noise(vec3(q.x * 5.0, q.y * 2.6 - uTime * 3.4, uTime * 0.5));
          float n2 = noise(vec3(q.x * 14.0, q.y * 6.0 - uTime * 6.5, 2.0));
          float w = mix(0.3, 0.52, uManner) * (1.0 - 0.6 * smoothstep(0.0, H + 0.5, y0));
          float edge = abs(q.x) + (n - 0.5) * mix(0.2, 0.5, uManner) + (n2 - 0.5) * 0.08;
          float column = smoothstep(w, w * 0.2, edge) * (1.0 - smoothstep(H * 0.5, H + 0.45, y0 + (n - 0.5) * 0.7));
          col = mix(pal(0.08 + y0 * 0.3), vec3(1.0), pow(column, 3.0) * 0.6);
          a = min(1.0, column * 1.25) * inn * fade;
        } else if (uKind < 6.5) {
          // Wheel: the six discipline colours light one after another round a ring, each with its beam.
          vec2 d2 = q - vec2(0.0, 0.22);
          float wr = length(d2);
          float t = fract(0.25 - atan(d2.y, d2.x) / 6.2832);
          float seg = floor(t * 6.0), sc = fract(t * 6.0) - 0.5;
          float lit = smoothstep(seg / 6.0, seg / 6.0 + 0.1, b * 1.9);
          float R = 0.44 + 0.2 * grow;
          float rim = (band(wr, R, 0.013) + 0.35 * band(wr, R, 0.05)) * smoothstep(0.5, 0.44, abs(sc));
          float beam = exp(-sc * sc * 70.0) * smoothstep(R, R + 0.04, wr) * exp(-(wr - R) * 2.4);
          float wedge = step(wr, R) * exp(-(R - wr) * 5.0) * 0.16;
          col = mix(uPal[int(seg)], vec3(1.0), 0.25 * rim);
          a = lit * (rim + beam * 0.85 + wedge) * inn * fade;
        } else if (uKind < 7.5) {
          // Eclipse: a full moon rises, a shadow crosses it, and what is left is a ring of white fire.
          vec2 d2 = q - vec2(0.0, mix(-0.05, 0.3, grow));
          float R = 0.44, mr = length(d2);
          float slide = mix(0.8, 0.0, smoothstep(0.15, 1.15, b));
          float moon = smoothstep(R + 0.01, R - 0.01, mr);
          float shadow = smoothstep(R * 0.97 + 0.01, R * 0.97 - 0.01, length(d2 - vec2(slide, slide * 0.25)));
          float face = moon * (1.0 - shadow) * (0.7 + 0.3 * noise(vec3(d2 * 7.0, 3.0)));
          float total = smoothstep(0.9, 1.2, b);
          float rim = band(mr, R, 0.012) * (0.6 + 2.2 * total);
          float glow = step(R, mr) * exp(-(mr - R) * 5.0) * 0.4 * total;
          col = mix(uPal[1], vec3(1.0), 0.65);
          a = (face * 0.7 + rim * 0.8 + glow) * inn * fade;
        } else if (uKind < 8.5) {
          // Nimbus: a ring of fine light opens behind the head, ring within ring, turning slowly.
          vec2 d2 = q - vec2(0.0, 0.3);
          float nr = length(d2) / (0.3 + 0.7 * grow), na = atan(d2.y, d2.x) + uTime * 0.12;
          float circles = band(nr, 0.42, 0.012) + band(nr, 0.6, 0.008) + 0.7 * band(nr, 0.86, 0.006);
          float fine = pow(abs(cos(na * 12.0)), 40.0) * smoothstep(0.42, 0.46, nr) * smoothstep(0.86, 0.8, nr);
          float points = pow(abs(cos(na * 6.0 + 0.26)), 14.0) * smoothstep(0.86, 0.9, nr) * exp(-(nr - 0.86) * 4.0);
          col = mix(uPal[0], vec3(1.0), 0.45);
          a = (circles + fine * 0.8 + points * 0.6 + exp(-nr * nr * 5.0) * 0.3) * inn * fade;
        } else if (uKind < 9.5) {
          // Sphere: a ball of force grows out of the chest until it is past the edge of sight, cracked through with light.
          vec2 d2 = q - vec2(0.0, 0.08);
          float sr = length(d2), R = 0.12 + 1.05 * (1.0 - exp(-b * 1.7));
          float rim = band(sr, R, 0.016 + 0.02 * R);
          float cracks = pow(1.0 - abs(noise(vec3(d2 * 4.0, uTime * 0.8)) * 2.0 - 1.0), 14.0);
          float inside = smoothstep(R, R - 0.05, sr) * (0.08 + 0.55 * cracks) * (0.35 + 0.65 * sr / R);
          col = mix(uPal[1], uPal[3], rim);
          a = (rim * 1.1 + inside) * inn * (1.0 - smoothstep(1.3, 2.4, b));
        } else if (uKind < 10.5) {
          // Pulse: ring after ring races out of the body, faster than they can be counted. (Manner 1: three heavy beats.)
          float pr = length(q * vec2(1.0, 0.85));
          float freq = mix(22.0, 8.0, uManner), speed = mix(2.6, 1.25, uManner);
          float waves = pow(0.5 + 0.5 * cos((pr - b * speed) * freq), mix(7.0, 3.5, uManner));
          float front = smoothstep(b * speed + 0.05, b * speed - 0.1, pr);
          float rush = pow(noise(vec3(q.x * 26.0, q.y * 1.5 - uTime * 7.0, 1.0)), 5.0) * exp(-abs(q.x) * 2.4) * (1.0 - uManner);
          col = mix(uPal[0], vec3(1.0), 0.2 + 0.5 * waves * uManner);
          a = (waves * front * exp(-pr * mix(1.5, 1.0, uManner)) * mix(0.9, 1.5, uManner) + rush * 1.2) * inn * fade;
        } else if (uKind < 11.5) {
          // Ripple: one ring leaves the body, quietly, and a veil of silver shimmers where it stood. (Manner 1: a hard white edge and nothing else.)
          float R = 0.2 + 1.2 * (1.0 - exp(-b * 1.5));
          float line = mix(band(r, R, 0.03), smoothstep(R - 0.04, R - 0.034, r) * smoothstep(R + 0.006, R, r) + 0.7 * smoothstep(R * 0.72 - 0.014, R * 0.72 - 0.01, r) * smoothstep(R * 0.72 + 0.004, R * 0.72, r), uManner);
          float haze = noise(vec3(q.x * 5.0, q.y * 2.0 - uTime * 1.1, uTime * 0.25));
          float veil = exp(-q.x * q.x * 9.0) * smoothstep(-0.5, 0.0, q.y) * smoothstep(1.5, 0.4, q.y) * haze * 0.5 * (1.0 - uManner);
          float glint = step(0.975, hash(vec3(floor(q * 30.0), floor(uTime * 4.0)))) * pow(max(0.0, 1.0 - 2.4 * length(fract(q * 30.0) - 0.5)), 2.0) * exp(-r * 1.2) * (1.0 - uManner);
          col = mix(uPal[0], vec3(1.0), 0.5);
          a = (line * (1.0 - smoothstep(0.9, 1.4, R)) + veil + glint * 0.8) * inn * fade;
        } else if (uKind < 12.5) {
          // Steam: it comes off the body in a rush and climbs, widening, the way it does off hot iron. (Manner 1: lit red from below, as at a quench.)
          float y0 = q.y + 0.5;
          float rise = uTime * 1.5 + b * 0.8;
          float n1 = noise(vec3(q.x * 3.4, q.y * 1.1 - rise, uTime * 0.3));
          float n2 = noise(vec3(q.x * 6.5 + n1 * 1.5, q.y * 2.2 - rise * 1.8, 4.0));
          float n3 = noise(vec3(q.x * 5.5 - n1, q.y * 1.6 - rise * 1.3, 9.0));
          float billow = smoothstep(0.2, 0.62, n1 * 0.5 + n2 * 0.2 + n3 * 0.4);
          float spread = 0.28 + 0.5 * smoothstep(0.0, 1.6, y0);
          float mask = smoothstep(spread, spread * 0.3, abs(q.x)) * smoothstep(0.0, 0.25, y0) * (1.0 - smoothstep(0.5 + 1.3 * grow, 0.9 + 1.4 * grow, y0));
          col = mix(mix(uPal[0], uPal[1], n2), mix(uPal[0], vec3(1.0), 0.7), uManner * smoothstep(0.2, 1.2, y0));
          a = billow * mask * 0.85 * inn * fade;
        } else {
          // Strike: one blow at the floor, as a hammer on an anvil: a white line, spikes of light, and the red of struck metal left behind.
          vec2 d2 = q - vec2(0.0, -0.46);
          float life = exp(-b * 1.9);
          float sa = atan(d2.y, d2.x), sl = length(d2);
          float streak = exp(-abs(d2.y) * 40.0) * exp(-abs(d2.x) * 1.0);
          float up = exp(-abs(d2.x) * 26.0) * exp(-max(0.0, d2.y) * 1.6) * step(0.0, d2.y);
          float spikes = pow(0.5 + 0.5 * cos(sa * 9.0), 30.0) * exp(-sl * 2.4) * step(0.0, d2.y);
          // Sparks leave along their own lines and fall short one after another.
          float lane = floor(sa * 14.0), far = 0.5 + 1.1 * hash(vec3(lane, 3.0, 1.0));
          spikes += pow(0.5 + 0.5 * cos(sa * 14.0 * 6.2832), 8.0) * band(sl, far * (1.0 - exp(-b * 2.6)), 0.05) * step(0.02, d2.y) * 1.6;
          float heat = exp(-length(d2 * vec2(0.6, 2.2)) * 2.6) * 0.5 * (1.0 - smoothstep(1.0, 2.4, b));
          col = mix(uPal[0], uPal[2], life);
          a = ((streak + up * 0.8 + spikes) * life * 2.0 + heat) * inn;
        }
        // Nothing of it shows below the floor the body stands on.
        a *= smoothstep(-0.6, -0.5, q.y);
        gl_FragColor = vec4(col, a * uGain);
      }`, { uKind: 0, uManner: 0, uGain: 0 })
    sign.renderOrder = -4
    sign.frustumCulled = false
    sign.visible = false
    this.sign = sign
    this.world.add(sign)

    // ── Ribbons: strips of light whose path is computed per vertex ──
    {
      const n = RIBBONS * (SEGMENTS + 1) * 2
      const u = new Float32Array(n), v = new Float32Array(n), idx = new Float32Array(n), seed = new Float32Array(n * 4)
      const index: number[] = []
      const seeds = rnd(RIBBONS, 4)
      for (let r = 0, k = 0; r < RIBBONS; r++) {
        // Spread evenly round the body, alternating direction.
        seeds[r * 4] = (r + 0.3 * seeds[r * 4]) / RIBBONS
        seeds[r * 4 + 3] = r % 2
        for (let s = 0; s <= SEGMENTS; s++) for (const side of [-1, 1]) {
          u[k] = s / SEGMENTS; v[k] = side; idx[k] = r
          seed.set(seeds.subarray(r * 4, r * 4 + 4), k * 4)
          if (s < SEGMENTS && side === -1) index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
          k++
        }
      }
      const g = new BufferGeometry()
      g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
      g.setAttribute('aU', new BufferAttribute(u, 1)); g.setAttribute('aV', new BufferAttribute(v, 1))
      g.setAttribute('aIdx', new BufferAttribute(idx, 1)); g.setAttribute('aSeed', new BufferAttribute(seed, 4))
      g.setIndex(index)
      const ribbons = new Mesh(g, shader(S, { uTurns: 0.75, uSpread: 1, uWidth: 0.1, uSpeed: 1, uRipple: 0.5, uCount: 0 }, /* glsl */ `
        attribute float aU, aV, aIdx; attribute vec4 aSeed;
        uniform float uTurns, uSpread, uWidth, uSpeed, uRipple, uCount;
        varying float vU, vV, vShow; varying vec4 vSeed;
        vec3 path(float u, vec4 s) {
          float dir = s.w > 0.5 ? 1.0 : -1.0;
          float th = s.x * 6.2832 + dir * (uTurns * u * 6.2832 + uTime * uSpeed * (0.18 + 0.3 * s.y));
          float flare = pow(sin(3.14159 * clamp(u, 0.0, 1.0)), 0.7);
          float r = (0.32 + uSpread * (0.4 + 0.8 * s.z) * flare) * (1.0 + 0.4 * uSurge) * (0.72 + 0.28 * uIntensity);
          float y = mix(-0.02, 1.1 + 0.22 * s.y, pow(u, 0.85)) + uRipple * 0.07 * sin(u * 9.0 + s.y * 20.0 + uTime * 1.3 * uSpeed) * flare;
          return vec3(cos(th) * r * uSize.x, uBase + y * uSize.y, sin(th) * r * uSize.z);
        }
        void main() {
          vec4 a = modelMatrix * vec4(path(aU, aSeed), 1.0), b = modelMatrix * vec4(path(aU + 0.012, aSeed), 1.0);
          vec3 side = normalize(cross(normalize(b.xyz - a.xyz), normalize(cameraPosition - a.xyz)));
          a.xyz += side * aV * uWidth * (0.45 + 0.9 * aSeed.z) * pow(sin(3.14159 * aU), 0.6);
          vU = aU; vV = aV; vSeed = aSeed; vShow = clamp(uCount - aIdx, 0.0, 1.0);
          gl_Position = projectionMatrix * viewMatrix * a;
        }`, /* glsl */ `
        uniform float uGain, uSpeed; varying float vU, vV, vShow; varying vec4 vSeed;
        void main() {
          float across = 1.0 - abs(vV);
          float core = pow(across, 9.0);
          float flow = 0.55 + 0.45 * sin(vU * 14.0 - uTime * 3.0 * uSpeed + vSeed.x * 30.0);
          float ends = smoothstep(0.0, 0.14, vU) * smoothstep(1.0, 0.78, vU);
          float a = (pow(across, 1.5) * 0.62 * flow + core * 0.8) * ends * uGain * vShow;
          gl_FragColor = vec4(mix(pal(vSeed.x + vU * 0.3), vec3(1.0), core * 0.55), a);
        }`))
      part('ribbons', ribbons)
      this.group.add(ribbons)
    }

    // ── Motes: points that rise and circle ──
    {
      const g = new BufferGeometry()
      g.setAttribute('position', new BufferAttribute(new Float32Array(MOTES * 3), 3))
      g.setAttribute('aSeed', new BufferAttribute(rnd(MOTES, 4), 4))
      g.setAttribute('aIdx', new BufferAttribute(Float32Array.from({ length: MOTES }, (_, i) => i / MOTES), 1))
      const motes = new Points(g, shader(S, { uRise: 0.22, uSwirl: 1, uTwinkle: 0.5, uDot: 1, uShow: 1, uPx: 800 }, /* glsl */ `
        attribute vec4 aSeed; attribute float aIdx;
        uniform float uRise, uSwirl, uTwinkle, uDot, uShow, uPx;
        varying float vA, vHue;
        void main() {
          vec4 s = aSeed;
          float life = fract(uTime * uRise * (0.4 + 0.9 * s.y) + s.x);
          float th = s.z * 6.2832 + life * uSwirl * 2.5 + uTime * 0.12 * uSwirl;
          float r = (0.25 + 0.95 * sqrt(s.w)) * (0.85 + 0.5 * life) * (1.0 + 0.3 * uSurge);
          vec3 p = vec3(cos(th) * r * uSize.x, uBase + (life * 1.3 - 0.03) * uSize.y, sin(th) * r * uSize.z);
          p.x += 0.04 * sin(uTime * 1.7 + s.x * 40.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float fade = sin(3.14159 * life);
          float tw = 1.0 - uTwinkle * 0.7 * (0.5 + 0.5 * sin(uTime * (3.0 + 5.0 * s.y) + s.z * 50.0));
          vA = fade * tw * step(aIdx, uShow);
          vHue = s.z + s.x * 0.3;
          gl_PointSize = uPx * 0.04 * uDot * (0.45 + s.y) * fade / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`, /* glsl */ `
        uniform float uGain; varying float vA, vHue;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = pow(max(0.0, 1.0 - d), 2.2) * vA * uGain;
          gl_FragColor = vec4(mix(pal(vHue), vec3(1.0), 0.5 * pow(max(0.0, 1.0 - d), 4.0)), a);
        }`))
      part('motes', motes)
      this.group.add(motes)
    }

    // ── Sparks: thrown out by a release, and (in some themes) crackling all the time ──
    {
      const n = SPARKS * TRAIL
      const seed = new Float32Array(n * 4), dir = new Float32Array(n * 3), lag = new Float32Array(n)
      const s0 = rnd(SPARKS, 4)
      for (let i = 0; i < SPARKS; i++) {
        const z = Math.random() * 1.5 - 0.5, a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.max(0, 1 - Math.min(1, z * z)))
        for (let t = 0; t < TRAIL; t++) {
          const k = i * TRAIL + t
          seed.set(s0.subarray(i * 4, i * 4 + 4), k * 4)
          dir.set([Math.cos(a) * r, z, Math.sin(a) * r], k * 3)
          lag[k] = t / TRAIL
        }
      }
      const g = new BufferGeometry()
      g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
      g.setAttribute('aSeed', new BufferAttribute(seed, 4)); g.setAttribute('aDir', new BufferAttribute(dir, 3)); g.setAttribute('aLag', new BufferAttribute(lag, 1))
      const sparks = new Points(g, shader(S, { uSpeed: 1, uCrackle: 0, uPx: 800 }, /* glsl */ `
        attribute vec4 aSeed; attribute vec3 aDir; attribute float aLag;
        uniform float uSpeed, uCrackle, uPx;
        varying float vA, vHue;
        void main() {
          vec4 s = aSeed;
          float life = 0.8 + 0.9 * s.y;
          // Either the time since the last release, or a loop of its own.
          float loop = fract(uTime * (0.5 + 0.9 * s.x) + s.z) * life * 0.55;
          float loopy = step(s.w, uCrackle * 0.6);
          float t = mix(uBurst, loop, loopy) - aLag * 0.07;
          float u = t / life;
          float reach = uSpeed * (0.7 + 1.9 * s.x) * mix(1.0, 0.32, loopy);
          vec3 from = vec3((s.z - 0.5) * 0.3 * uSize.x, uBase + uSize.y * (0.3 + 0.4 * s.w), (s.x - 0.5) * 0.3 * uSize.z);
          vec3 p = from + aDir * reach * (1.0 - exp(-t * 2.4)) * 0.62 * vec3(uSize.x * 2.0, 1.0, uSize.z * 2.0) + vec3(0.0, -0.55 * t * t, 0.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vA = step(0.0, t) * step(u, 1.0) * pow(max(0.0, 1.0 - u), 1.4) * (1.0 - aLag * 0.8);
          vHue = s.z;
          gl_PointSize = uPx * 0.02 * (0.5 + s.y) * (1.0 - aLag * 0.6) / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`, /* glsl */ `
        uniform float uGain; varying float vA, vHue;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          gl_FragColor = vec4(mix(pal(vHue), vec3(1.0), 0.65), pow(max(0.0, 1.0 - d), 2.0) * vA * uGain);
        }`))
      part('sparks', sparks)
      this.group.add(sparks)
    }

    // ── Streams: thin columns of light rising from the floor ──
    {
      const n = STREAMS * 4
      const corner = new Float32Array(n * 2), seed = new Float32Array(n * 4), idx = new Float32Array(n)
      const index: number[] = []
      const s0 = rnd(STREAMS, 4)
      for (let i = 0; i < STREAMS; i++) {
        ;[[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([x, y], c) => {
          const k = i * 4 + c
          corner.set([x, y], k * 2); seed.set(s0.subarray(i * 4, i * 4 + 4), k * 4); idx[k] = i
        })
        index.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 1, i * 4 + 3, i * 4 + 2)
      }
      const g = new BufferGeometry()
      g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
      g.setAttribute('aCorner', new BufferAttribute(corner, 2)); g.setAttribute('aSeed', new BufferAttribute(seed, 4)); g.setAttribute('aIdx', new BufferAttribute(idx, 1))
      g.setIndex(index)
      const streams = new Mesh(g, shader(S, { uHeight: 1, uCount: 0 }, /* glsl */ `
        attribute vec2 aCorner; attribute vec4 aSeed; attribute float aIdx;
        uniform float uHeight, uCount;
        varying vec2 vC; varying vec4 vSeed; varying float vShow;
        void main() {
          vec4 s = aSeed;
          float th = s.x * 6.2832, r = 0.14 + 0.62 * s.y;
          vec4 w = modelMatrix * vec4(cos(th) * r * uSize.x, uFloor, sin(th) * r * uSize.z, 1.0);
          vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), cameraPosition - w.xyz));
          float h = uHeight * (0.45 + 0.9 * s.z) * (0.35 + 0.65 * uIntensity + 0.5 * uSurge) * max(uSize.y, 1.0);
          w.xyz += right * aCorner.x * (0.014 + 0.03 * s.w) + vec3(0.0, aCorner.y * h, 0.0);
          vC = aCorner; vSeed = s; vShow = clamp(uCount - aIdx, 0.0, 1.0);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`, /* glsl */ `
        uniform float uGain; varying vec2 vC; varying vec4 vSeed; varying float vShow;
        void main() {
          float flick = 0.5 + 0.5 * sin(uTime * (2.0 + 4.0 * vSeed.y) + vSeed.x * 40.0 - vC.y * 6.0);
          float a = pow(1.0 - abs(vC.x), 2.0) * pow(1.0 - vC.y, 1.3) * smoothstep(0.0, 0.03, vC.y) * (0.45 + 0.75 * flick) * uGain * vShow;
          gl_FragColor = vec4(mix(pal(vSeed.z), vec3(1.0), 0.3 * (1.0 - vC.y)), a);
        }`))
      part('streams', streams)
      this.group.add(streams)
    }

    // ── Rings on the floor, and the waves a pulse sends out across it ──
    {
      const rings = new Mesh(new PlaneGeometry(1, 1), shader(S, { uDashes: 36, uSpin: 0.25, uWave: this.waves, uClock: 0 }, /* glsl */ `
        varying vec2 vP; void main() { vP = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`, /* glsl */ `
        uniform float uGain, uDashes, uSpin, uClock; uniform float uWave[4];
        varying vec2 vP;
        float ring(float r, float at, float w) { float d = (r - at) / w; return exp(-d * d); }
        void main() {
          float r = length(vP) * 1.7, ang = atan(vP.y, vP.x);
          float breath = 0.5 + 0.5 * sin(uTime * 1.4);
          float dash = uDashes > 0.5 ? smoothstep(0.1, 0.4, 0.5 + 0.5 * sin(ang * uDashes + uTime * uSpin * 6.0)) : 1.0;
          float a = exp(-r * r * 2.2) * 0.75 + ring(r, 0.62 + 0.03 * breath, 0.014) * 1.3 + ring(r, 0.86, 0.008) * 1.0 * dash + ring(r, 0.4, 0.022) * 0.5 + ring(r, 1.05, 0.004) * 0.5;
          for (int i = 0; i < 4; i++) {
            float age = uClock - uWave[i];
            a += ring(r, 0.3 + age * 1.25, 0.03 + age * 0.03) * max(0.0, 1.0 - age / 1.5) * 1.3;
          }
          a *= uGain * smoothstep(1.7, 1.35, r);
          gl_FragColor = vec4(mix(pal(ang * 0.159 + uTime * 0.02 * uSpin), vec3(1.0), 0.2), a);
        }`))
      rings.rotation.x = -Math.PI / 2
      rings.renderOrder = -1
      part('rings', rings)
      this.group.add(rings)
    }

    // ── Lightning: rebuilt a few times a second between points on the body ──
    {
      const n = ARCS * ARC_POINTS * 2
      const position = new Float32Array(n * 3), side = new Float32Array(n * 2)
      const index: number[] = []
      for (let a = 0, k = 0; a < ARCS; a++) for (let p = 0; p < ARC_POINTS; p++) for (const s of [-1, 1]) {
        side.set([s, p / (ARC_POINTS - 1)], k * 2)
        if (p < ARC_POINTS - 1 && s === -1) index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
        k++
      }
      const g = new BufferGeometry()
      const pos = new BufferAttribute(position, 3)
      pos.setUsage(DynamicDrawUsage)
      g.setAttribute('position', pos); g.setAttribute('aSide', new BufferAttribute(side, 2))
      g.setIndex(index)
      const arcs = new Mesh(g, shader(S, {}, /* glsl */ `
        attribute vec2 aSide; varying vec2 vS;
        void main() { vS = aSide; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`, /* glsl */ `
        uniform float uGain; varying vec2 vS;
        void main() {
          float across = 1.0 - abs(vS.x);
          float a = (pow(across, 6.0) + 0.25 * pow(across, 1.5)) * sin(3.14159 * vS.y) * uGain;
          gl_FragColor = vec4(mix(uPal[1], vec3(1.0), pow(across, 5.0)), a);
        }`))
      part('arcs', arcs)
      this.world.add(arcs)
      this.arcs = { geometry: g, position, side }
    }
  }

  /** On a paper stage the Aura is laid on as paint; on a dark one it is light. */
  setPaint(on: boolean) {
    this.shared.uPaint.value = on ? 1 : 0
    for (const part of Object.values(this.parts)) for (const o of part.objects) (o.material as ShaderMaterial).blending = on ? NormalBlending : AdditiveBlending
    ;(this.sign.material as ShaderMaterial).blending = on ? NormalBlending : AdditiveBlending
    // Paint would coat the body where light only brightened it: keep the outline to what stands outside the figure.
    for (const s of this.shells) { const m = s.material as ShaderMaterial; m.side = on ? BackSide : DoubleSide; m.needsUpdate = true }
  }

  setTheme(theme: AuraTheme, tuning: ThemeTuning = {}) {
    this.theme = theme
    this.tuning = tuning
    const pal = this.shared.uPal.value as Color[]
    pal.forEach((c, i) => c.set(theme.palette[i % theme.palette.length]))
    this.shared.uPalN.value = Math.min(6, theme.palette.length)
    const set = (id: ComponentId, values: Record<string, number>) => {
      for (const o of this.parts[id].objects) for (const [k, v] of Object.entries(values)) (o.material as ShaderMaterial).uniforms[k].value = v
    }
    set('shell', { uFlame: Math.max(theme.shell.flame, FLAME_FLOOR) })
    set('rays', { uCount: theme.rays.count, uSharp: theme.rays.sharp })
    set('ribbons', { uTurns: theme.ribbons.turns, uSpread: theme.ribbons.spread, uWidth: theme.ribbons.width, uSpeed: theme.ribbons.speed, uRipple: theme.ribbons.ripple })
    set('motes', { uRise: theme.motes.rise, uSwirl: theme.motes.swirl, uTwinkle: theme.motes.twinkle, uDot: theme.motes.size })
    set('sparks', { uSpeed: theme.sparks.speed, uCrackle: theme.sparks.crackle })
    set('streams', { uHeight: theme.streams.height })
    set('rings', { uDashes: theme.rings.dashes, uSpin: theme.rings.spin })
    const sign = (this.sign.material as ShaderMaterial).uniforms
    sign.uKind.value = SIGNS.indexOf(theme.act.sign)
    sign.uManner.value = theme.act.manner
    this.actor.look.chargeColor.value.set(theme.palette[0])
  }

  /** A beat: a wave across the floor and a moment of extra light. */
  beat(strength = 0.6) {
    this.pulse = Math.max(this.pulse, strength)
    this.waves.shift()
    this.waves.push(this.clock)
  }

  /** The release: everything at once. */
  release() {
    this.chargeAge = -1
    this.burstAge = 0
    this.beat(1)
  }

  /** Activate: the Aura gathers itself, tighter and brighter, then bursts. A charge or a burst already under way is left to finish. */
  charge() {
    if (this.chargeAge >= 0 || this.burstAge < 1.4) return
    this.chargeAge = 0
  }

  /** Whether a charge or its burst is under way. */
  get busy() { return this.chargeAge >= 0 || this.burstAge < 2.2 }

  /** Where the body is and how much room it takes, from the solved skeleton. */
  private measure(dt: number) {
    const rig = this.actor.rig
    const p = rig.pos
    const head = p.head.clone().add(new Vector3(0, 0.2 * rig.body.scale, 0).applyQuaternion(rig.rot.head))
    const points = [head, p.handL, p.handR, p.footL, p.footR, p.hips, p.upperChest]
    let lo = Infinity, hi = -Infinity
    const mid = new Vector3()
    for (const q of points) { lo = Math.min(lo, q.y); hi = Math.max(hi, q.y); mid.add(q) }
    mid.multiplyScalar(1 / points.length)
    const feet = p.footL.clone().add(p.footR).multiplyScalar(0.5)
    const lie = new Vector3(head.x - feet.x, 0, head.z - feet.z)
    const length = lie.length()
    const s = rig.body.scale
    const lying = smooth(0.5 * s, 1.1 * s, length)
    const target = new Vector3(0.46 * s + lying * (length * 0.5 - 0.1 * s), Math.max(hi - lo + 0.12 * s, 0.6 * s), 0.46 * s)
    const heading = lying > 0.01 ? Math.atan2(-lie.z, lie.x) : 0
    const k = this.measured ? 1 - Math.exp(-dt * 7) : 1
    this.measured = true
    this.centre.lerp(new Vector3(mid.x, 0, mid.z), k)
    this.size.lerp(target, k)
    this.heading += (heading * lying - this.heading) * k
    this.base += (Math.max(0, lo - 0.05 * s) - this.base) * k
  }

  /**
   * One frame. `intensity` is the level asked for (0..1); the field follows
   * it smoothly and breathes around it.
   */
  update(dt: number, intensity: number, camera: PerspectiveCamera, viewportHeight: number) {
    const t = this.theme
    const tune = this.tuning
    const off = tune.off ?? []
    this.clock += dt
    this.time += dt * t.flow * (tune.pulse ?? 1)
    this.pulse *= Math.exp(-dt * 2.6)
    this.burstAge += dt
    // A charge: the light gathers and quickens, and at its height bursts.
    let gather = 0
    if (this.chargeAge >= 0) {
      this.chargeAge += dt
      gather = Math.min(1, this.chargeAge / CHARGE_SECONDS)
      this.pulse = Math.max(this.pulse, 0.5 * gather * (0.5 + 0.5 * Math.sin(this.clock * (16 + 34 * gather))))
      if (gather >= 1) this.release()
    }
    const surge = Math.exp(-this.burstAge * 1.3)
    /** How far the Aura is let go beyond its glow: nothing at rest, a little as it gathers, all of it in a burst. */
    const loose = surge
    /** While it gathers, only what rises from the floor shows: the power coming up, not yet let go. */
    const rising = Math.max(surge, 0.8 * gather)
    /** Only what this Aura's activation names joins its burst. */
    const joins = (id: ComponentId) => t.act.with.includes(id)
    const want = Math.min(1, Math.max(intensity * (tune.intensity ?? 1), surge, this.chargeAge >= 0 ? 0.55 + 0.45 * gather : 0))
    this.level += (want - this.level) * (1 - Math.exp(-dt * (want > this.level ? 9 : 2.2)))
    const breath = 0.5 + 0.5 * Math.sin(this.clock * Math.PI * 2 * t.breath * (tune.pulse ?? 1))
    const I = Math.min(1, this.level * (0.86 + 0.14 * breath) + this.pulse * 0.18)

    this.measure(dt)
    this.group.position.copy(this.actor.group.localToWorld(this.centre.clone()))
    this.group.rotation.y = this.heading + this.actor.group.rotation.y

    const S = this.shared
    S.uTime.value = this.time
    S.uIntensity.value = I
    S.uPulse.value = this.pulse
    S.uBurst.value = this.burstAge
    S.uSurge.value = surge
    S.uBase.value = this.base
    const px = (viewportHeight / (2 * Math.tan((camera.fov * Math.PI) / 360)))
    const density = tune.density ?? 1

    const gain = (id: ComponentId, level: number, from: number, span = 0.3) => {
      const g = off.includes(id) ? 0 : level * smooth(from, Math.min(1, from + span), I) * (!LOOSE.includes(id) ? 1 : !joins(id) ? 0 : id === 'streams' || id === 'motes' ? rising : loose)
      const part = this.parts[id]
      part.gain.value = g
      for (const o of part.objects) o.visible = g > 0.002
      return g
    }
    // The glow is held close while it gathers, and thrown wide by the burst.
    const reach = this.actor.rig.body.scale * 0.006 * Math.min(1.35, Math.max(t.shell.reach, 0.8)) * (0.6 + 0.8 * I + 0.2 * this.pulse) * (1.45 - 0.55 * gather - 0.3 * surge)
    gain('shell', Math.max(t.shell.level, 0.9) * (0.7 + 0.8 * I) * (0.85 + 0.15 * breath), t.shell.from, 0.2)
    for (const m of this.shells) (m.material as ShaderMaterial).uniforms.uReach.value = reach
    gain('halo', t.halo.level * (0.25 + 0.75 * I), t.halo.from, 0.35)
    gain('rays', t.rays.level * (0.5 + 0.5 * I + 0.6 * surge), t.rays.from, 0.3)
    gain('ribbons', t.ribbons.level, t.ribbons.from, 0.25)
    ;(this.parts.ribbons.objects[0].material as ShaderMaterial).uniforms.uCount.value = Math.min(RIBBONS, t.ribbons.count * density * smooth(t.ribbons.from, 0.9, I) + 1)
    gain('motes', t.motes.level, t.motes.from, 0.25)
    const motes = (this.parts.motes.objects[0].material as ShaderMaterial).uniforms
    motes.uShow.value = Math.min(1, (t.motes.count / MOTES) * density * (0.25 + 0.75 * I))
    motes.uPx.value = px
    gain('streams', t.streams.level, t.streams.from, 0.3)
    ;(this.parts.streams.objects[0].material as ShaderMaterial).uniforms.uCount.value = Math.min(STREAMS, t.streams.count * density * smooth(t.streams.from, 1, I) + 1)
    gain('rings', t.rings.level * (0.4 + 0.6 * I), t.rings.from, 0.3)
    const rings = this.parts.rings.objects[0]
    ;(rings.material as ShaderMaterial).uniforms.uClock.value = this.clock
    rings.scale.set(this.size.x * 4.6, this.size.z * 4.6, 1)
    // Sparks show on a release whatever the level, and crackle in themes that ask for it.
    const sparkGain = off.includes('sparks') || !joins('sparks') ? 0 : t.sparks.level * Math.max(this.burstAge < 2 ? 1 : 0, t.sparks.crackle * loose * smooth(t.sparks.from - 0.5, t.sparks.from, I))
    this.parts.sparks.gain.value = sparkGain
    this.parts.sparks.objects[0].visible = sparkGain > 0.002
    ;(this.parts.sparks.objects[0].material as ShaderMaterial).uniforms.uPx.value = px
    const arcGain = gain('arcs', t.arcs.level, t.arcs.from, 0.3)

    // The sheet of light sits just behind the body, facing whoever is looking.
    const middle = new Vector3(this.group.position.x, this.base + this.size.y * 0.5, this.group.position.z)
    const away = middle.clone().sub(camera.position).normalize()
    const span = Math.max(this.size.y, this.size.x * 2) * t.halo.size
    for (const [sheet, k] of [[this.parts.halo.objects[0], 2.3], [this.parts.rays.objects[0], 3.4 + 1.2 * surge]] as const) {
      sheet.position.copy(middle).addScaledVector(away, 0.5)
      sheet.quaternion.copy(camera.quaternion)
      sheet.scale.set(span * k, span * k, 1)
    }

    // The sign stands behind the body for as long as a burst lasts.
    const signing = this.burstAge < SIGN_SECONDS && t.act.sign !== 'none'
    this.sign.visible = signing
    if (signing) {
      ;(this.sign.material as ShaderMaterial).uniforms.uGain.value = Math.min(1, 0.55 + 0.6 * (tune.intensity ?? 1) * Math.max(intensity, 0.5))
      const side = Math.max(this.size.y, this.actor.rig.body.scale * 1.2) * 3.2
      this.sign.position.copy(middle).addScaledVector(away, 0.6)
      this.sign.quaternion.copy(camera.quaternion)
      this.sign.scale.set(side, side, 1)
    }

    if (arcGain > 0.002) {
      this.arcClock -= dt
      if (this.arcClock <= 0) {
        this.arcClock = 0.045 + Math.random() * 0.07
        this.strike(Math.round(Math.min(ARCS, t.arcs.count * density * (0.35 + 0.65 * I))), camera)
      }
    }

    // The body's own light.
    const look = this.actor.look
    look.charge.value = t.body * smooth(0.18, 0.95, I) * (0.88 + 0.12 * breath) + this.pulse * 0.12 + 0.45 * gather
    look.rim.value = 0.22 + 0.55 * I
  }

  private strike(count: number, camera: PerspectiveCamera) {
    const { position } = this.arcs
    const p = this.actor.rig.pos
    const spots = [p.head, p.handL, p.handR, p.lowerArmL, p.lowerArmR, p.upperArmL, p.upperArmR, p.hips, p.upperChest, p.lowerLegL, p.lowerLegR, p.footL, p.footR].map((v) => this.actor.group.localToWorld(v.clone()))
    const a = new Vector3(), b = new Vector3(), q = new Vector3(), tangent = new Vector3(), side = new Vector3(), jitter = new Vector3()
    const s = this.actor.rig.body.scale
    let k = 0
    for (let arc = 0; arc < ARCS; arc++) {
      const live = arc < count
      a.copy(spots[Math.floor(Math.random() * spots.length)])
      // Half of them leap from limb to limb, half out into the air.
      if (Math.random() < 0.5) b.copy(spots[Math.floor(Math.random() * spots.length)])
      else b.copy(a).add(jitter.set(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).multiplyScalar(0.9 * s))
      const span = a.distanceTo(b)
      const width = live ? (0.006 + 0.01 * Math.random()) * s : 0
      for (let i = 0; i < ARC_POINTS; i++) {
        const u = i / (ARC_POINTS - 1)
        q.copy(a).lerp(b, u).add(jitter.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(span * 0.16 * Math.sin(Math.PI * u)))
        tangent.copy(b).sub(a).normalize()
        side.crossVectors(tangent, jitter.copy(camera.position).sub(q).normalize()).normalize().multiplyScalar(width)
        position.set([q.x - side.x, q.y - side.y, q.z - side.z, q.x + side.x, q.y + side.y, q.z + side.z], k)
        k += 6
      }
    }
    this.arcs.geometry.getAttribute('position').needsUpdate = true
  }

  dispose() {
    for (const part of Object.values(this.parts)) for (const o of part.objects) {
      o.removeFromParent()
      ;(o.material as ShaderMaterial).dispose()
      if (!(o as SkinnedMesh).isSkinnedMesh) o.geometry.dispose()
    }
    this.group.removeFromParent()
    this.world.removeFromParent()
  }
}
