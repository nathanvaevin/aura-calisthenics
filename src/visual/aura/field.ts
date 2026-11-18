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
import type { AuraTheme, ComponentId, ThemeTuning } from './themes'

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
  private arcClock = 0
  private readonly centre = new Vector3()
  private readonly size = new Vector3(0.45, 1.9, 0.45)
  private heading = 0
  private base = 0
  private measured = false
  private readonly shells: SkinnedMesh[] = []
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
      uniform float uReach, uFlame, uInner;
      varying float vEdge, vY, vLick;
      void main() {
        vec3 objectNormal = normal;
        #include <skinbase_vertex>
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
    set('shell', { uFlame: theme.shell.flame })
    set('rays', { uCount: theme.rays.count, uSharp: theme.rays.sharp })
    set('ribbons', { uTurns: theme.ribbons.turns, uSpread: theme.ribbons.spread, uWidth: theme.ribbons.width, uSpeed: theme.ribbons.speed, uRipple: theme.ribbons.ripple })
    set('motes', { uRise: theme.motes.rise, uSwirl: theme.motes.swirl, uTwinkle: theme.motes.twinkle, uDot: theme.motes.size })
    set('sparks', { uSpeed: theme.sparks.speed, uCrackle: theme.sparks.crackle })
    set('streams', { uHeight: theme.streams.height })
    set('rings', { uDashes: theme.rings.dashes, uSpin: theme.rings.spin })
    this.actor.look.chargeColor.value.set(theme.palette[0])
  }

  /** A beat: a wave across the floor and a moment of extra light. */
  beat(strength = 0.6) {
    this.pulse = Math.max(this.pulse, strength)
    this.waves.shift()
    this.waves.push(this.clock)
  }

  /** The release at the end of a set: everything at once. */
  release() {
    this.burstAge = 0
    this.beat(1)
  }

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
    const surge = Math.exp(-this.burstAge * 1.3)
    const want = Math.min(1, Math.max(intensity * (tune.intensity ?? 1), surge))
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
      const g = off.includes(id) ? 0 : level * smooth(from, Math.min(1, from + span), I)
      const part = this.parts[id]
      part.gain.value = g
      for (const o of part.objects) o.visible = g > 0.002
      return g
    }
    const reach = this.actor.rig.body.scale * 0.006 * t.shell.reach * (0.6 + 0.8 * I + 0.5 * this.pulse)
    gain('shell', t.shell.level * (0.55 + 0.75 * I) * (0.85 + 0.15 * breath), t.shell.from, 0.2)
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
    const sparkGain = off.includes('sparks') ? 0 : t.sparks.level * Math.max(this.burstAge < 2 ? 1 : 0, t.sparks.crackle * smooth(t.sparks.from - 0.5, t.sparks.from, I))
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

    if (arcGain > 0.002) {
      this.arcClock -= dt
      if (this.arcClock <= 0) {
        this.arcClock = 0.045 + Math.random() * 0.07
        this.strike(Math.round(Math.min(ARCS, t.arcs.count * density * (0.35 + 0.65 * I))), camera)
      }
    }

    // The body's own light.
    const look = this.actor.look
    look.charge.value = t.body * smooth(0.18, 0.95, I) * (0.88 + 0.12 * breath) + this.pulse * 0.12
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
