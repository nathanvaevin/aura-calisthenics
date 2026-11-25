/**
 * The studio the characters are shown in: a dark floor, soft key light, two
 * rim lights from behind, and a camera that can be put at the usual coaching
 * angles. One WebGL canvas.
 */
import {
  ACESFilmicToneMapping, AdditiveBlending, CircleGeometry, Color, DirectionalLight, HemisphereLight, Mesh,
  NormalBlending, PCFSoftShadowMap, PerspectiveCamera, PMREMGenerator, Scene, ShaderMaterial, ShadowMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Backdrop } from './backdrop'
import { sceneLook, type SceneDef, type StageKey } from './scenes'
import { STYLES, type StageLook } from './styles'

export type CameraAngle = 'front' | 'side' | 'three-quarter' | 'back'

export interface View {
  /** Degrees round the subject: 0 is in front of it, 90 on its left. */
  azimuth: number
  /** Degrees above the horizon. */
  elevation: number
  distance: number
  target: Vector3
}

export const ANGLE: Record<CameraAngle, number> = { front: 0, 'three-quarter': 38, side: 90, back: 180 }

export const BACKDROP = 0x08090d

/** Someone who asked their device for less movement sees the place standing still. */
const STILL = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : undefined

export class Stage {
  readonly renderer: WebGLRenderer
  readonly scene = new Scene()
  readonly camera = new PerspectiveCamera(26, 1, 0.05, 60)
  readonly view: View = { azimuth: 0, elevation: 6, distance: 5, target: new Vector3(0, 0.95, 0) }
  private readonly key: DirectionalLight
  private readonly rims: [DirectionalLight, DirectionalLight]
  private readonly fill: HemisphereLight
  private readonly shadow: ShadowMaterial
  private readonly sheen: ShaderMaterial
  private readonly sun: Mesh<CircleGeometry, ShaderMaterial>
  private readonly back = new Vector3()
  private look: StageLook = STYLES.aura.stage
  /** The place painted behind the subject, when the stage has been given one. */
  private readonly place = new Backdrop()
  private readonly size = { width: 1, height: 1 }
  /** How much of the canvas is covered from the top and from the bottom, in the units given to `resize`: now, and where it is heading. */
  private readonly cover = { top: 0, bottom: 0 }
  private readonly coverTo = { top: 0, bottom: 0 }

  constructor(canvas: HTMLCanvasElement, opts: { shadows?: boolean } = {}) {
    const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = SRGBColorSpace
    renderer.shadowMap.enabled = opts.shadows ?? true
    renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer = renderer

    const scene = this.scene
    scene.background = new Color(BACKDROP)
    const pmrem = new PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.42
    pmrem.dispose()

    const key = new DirectionalLight(0xffffff, 2.1)
    key.position.set(1.6, 4.2, 3.2)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.left = -2.8; key.shadow.camera.right = 2.8
    key.shadow.camera.top = 3; key.shadow.camera.bottom = -2.4
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 14
    key.shadow.bias = -0.0006
    key.shadow.normalBias = 0.02
    key.shadow.radius = 5
    this.key = key
    scene.add(key, key.target)
    const rimL = new DirectionalLight(0xb9c8ff, 1.5)
    rimL.position.set(-3, 2.4, -3)
    const rimR = new DirectionalLight(0xd9ccff, 1.2)
    rimR.position.set(3, 2, -2.6)
    this.rims = [rimL, rimR]
    this.fill = new HemisphereLight(0xdfe6ff, 0x14141c, 0.35)
    scene.add(rimL, rimR, this.fill)

    // Floor: catches the shadow, and fades into the backdrop so it has no edge.
    this.shadow = new ShadowMaterial({ opacity: 0.42 })
    const shadow = new Mesh(new CircleGeometry(7, 48), this.shadow)
    shadow.rotation.x = -Math.PI / 2
    shadow.receiveShadow = true
    this.sheen = new ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uColour: { value: new Color(0x9ea8d9) }, uWash: { value: 1 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 uColour; uniform float uWash; varying vec2 vP; void main(){ float r = length(vP); gl_FragColor = vec4(uColour, 0.085 * uWash * exp(-r * r * 0.42)); }',
    })
    const sheen = new Mesh(new CircleGeometry(7, 48), this.sheen)
    sheen.rotation.x = -Math.PI / 2
    sheen.position.y = -0.001
    sheen.renderOrder = -2
    shadow.renderOrder = -1
    scene.add(sheen, shadow)

    // What stands behind the subject. On paper: a flat disc, its edge broken like dry brush. On a dark stage: a fire.
    this.sun = new Mesh(new CircleGeometry(1, 72), new ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uColour: { value: new Color(0xe4502e) }, uBlaze: { value: 0 }, uTime: { value: 0 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform vec3 uColour; uniform float uBlaze, uTime; varying vec2 vP;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
        float fbm(vec2 p){ return noise(p) * 0.5 + noise(p * 2.03 + 7.1) * 0.3 + noise(p * 4.1 + 3.3) * 0.2; }
        void main(){
          float r = length(vP);
          if (uBlaze > 0.5) {
            // Flames that climb: the noise travels upward, and the glow reaches higher than it reaches down.
            vec2 q = vec2(vP.x * 2.6, vP.y * 1.7 - uTime * 0.55);
            float f = fbm(q + fbm(q * 1.7 + uTime * 0.2) * 0.9);
            float reach = r * mix(1.5, 0.86, smoothstep(-0.5, 0.8, vP.y));
            float body = exp(-reach * reach * 5.2);
            float tongues = smoothstep(0.5, 0.86, f) * exp(-reach * reach * 2.3);
            // A ring of white heat, as round a sun that is covered.
            float ring = exp(-pow((r - 0.2) * 11.0, 2.0));
            float core = exp(-r * r * 26.0);
            float a = (body * (0.3 + 0.8 * f) + tongues * 0.9 + ring * 0.42 + core * 0.35) * (1.0 - smoothstep(0.8, 1.0, r));
            vec3 hot = mix(uColour, vec3(1.0, 0.93, 0.78), saturate(ring * 0.75 + core * 0.8 + tongues * 0.22));
            // Laid on as light, like the Aura itself: undo the conversion below so the colour stays as deep as it was chosen.
            gl_FragColor = vec4(pow(hot, vec3(2.2)), a);
          } else {
            vec2 q = mat2(0.8, -0.6, 0.6, 0.8) * vP;
            float cloud = noise(q * 2.3) * 0.55 + noise(q * 5.1 + 3.7) * 0.3 + noise(q * 11.0 + 9.1) * 0.15;
            float streak = noise(vec2(vP.x * 2.4 + 4.0, vP.y * 38.0));
            // Solid to the edge above; washed away by a wet brush towards the bottom.
            float edge = 1.0 - smoothstep(0.962, 0.978, r + (cloud - 0.5) * 0.035);
            float worn = smoothstep(-1.0, 0.05, vP.y + (cloud - 0.5) * 0.9);
            gl_FragColor = vec4(uColour, edge * worn * (0.94 + 0.06 * streak));
          }
          #include <colorspace_fragment>
        }`,
    }))
    this.sun.renderOrder = -3
    this.sun.visible = false
    scene.add(this.sun)
    scene.add(this.place.mesh)
  }

  add(...objects: Parameters<Scene['add']>) { this.scene.add(...objects) }

  private facing = 0
  /** Puts the place round the subject, and turns it so that what it is about lies behind it as seen now. */
  face() { this.facing = this.view.azimuth; this.place.face(this.facing, this.view.target.x, this.view.target.z) }

  /**
   * Lights the stage the way a universe is lit, and puts it in a place if it is given one (`scenes.ts`): the place is
   * painted behind everything and lends the stage its light. `on` says which stage it is, for how bright the place is there.
   */
  setLook(own: StageLook, scene?: SceneDef, on: StageKey = 'aura') {
    const look = sceneLook(own, scene)
    this.place.set(scene?.paint ?? 0, scene?.on[on] ?? 1)
    this.look = look
    ;(this.scene.background as Color).set(look.backdrop)
    this.key.color.set(look.key.colour)
    this.key.intensity = look.key.power
    look.rims.forEach((r, i) => { this.rims[i].color.set(r.colour); this.rims[i].intensity = r.power })
    this.fill.color.set(look.fill.sky)
    this.fill.groundColor.set(look.fill.ground)
    this.fill.intensity = look.fill.power
    this.scene.environmentIntensity = look.room
    this.renderer.toneMappingExposure = look.exposure
    this.shadow.opacity = look.floor.shadow
    ;(this.sheen.uniforms.uColour.value as Color).set(look.floor.colour)
    this.sheen.uniforms.uWash.value = look.floor.wash ?? 1
    this.sun.visible = !!look.sun
    if (look.sun) {
      const m = this.sun.material
      ;(m.uniforms.uColour.value as Color).set(look.sun.colour)
      m.uniforms.uBlaze.value = look.sun.blaze ? 1 : 0
      m.blending = look.sun.blaze ? AdditiveBlending : NormalBlending
      this.sun.scale.setScalar(look.sun.radius)
    }
  }

  /** The colour of what burns behind the subject, and of the light it throws. `null`: the stage's own. */
  setAccent(colour: string | null) {
    const sun = this.look.sun
    if (!sun) return
    ;(this.sun.material.uniforms.uColour.value as Color).set(colour ?? sun.colour)
    this.rims[0].color.set(colour ?? this.look.rims[0].colour)
    ;(this.sheen.uniforms.uColour.value as Color).set(colour ?? this.look.floor.colour)
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false)
    this.size.width = width
    this.size.height = Math.max(1, height)
    this.project()
  }

  /**
   * Parts of the canvas that something else lies over (a screen's controls,
   * drawn on top of a stage that fills it). The subject is framed in the band
   * between them, and the rest of the canvas shows the room round it. Moves
   * there smoothly unless `now`.
   */
  setCover(top: number, bottom: number, now = false) {
    this.coverTo.top = Math.max(0, top)
    this.coverTo.bottom = Math.max(0, bottom)
    if (now) { this.cover.top = this.coverTo.top; this.cover.bottom = this.coverTo.bottom; this.project() }
  }

  /** Moves the covered parts towards where they are heading. True while they are still moving: the subject then needs fitting again. */
  settleCover(dt: number): boolean {
    const dTop = this.coverTo.top - this.cover.top, dBottom = this.coverTo.bottom - this.cover.bottom
    if (dTop === 0 && dBottom === 0) return false
    const k = dt > 0 ? 1 - Math.exp(-dt * 9) : 1
    const near = Math.abs(dTop) < 0.5 && Math.abs(dBottom) < 0.5
    this.cover.top = near ? this.coverTo.top : this.cover.top + dTop * k
    this.cover.bottom = near ? this.coverTo.bottom : this.cover.bottom + dBottom * k
    this.project()
    return true
  }

  /** The camera sees the band as its whole picture, and the canvas as a taller window round it. */
  private project() {
    const { width, height } = this.size
    const band = Math.max(height * 0.22, height - this.cover.top - this.cover.bottom)
    this.camera.aspect = width / band
    if (this.cover.top > 0 || this.cover.bottom > 0) this.camera.setViewOffset(width, band, 0, -Math.min(this.cover.top, height - band), width, height)
    else this.camera.clearViewOffset()
    this.camera.updateProjectionMatrix()
  }

  /** Distance from which a subject of this height and width fills the frame. */
  fit(height: number, width: number, margin = 1.18): number {
    const v = (this.camera.fov * Math.PI) / 360
    const h = Math.atan(Math.tan(v) * this.camera.aspect)
    return Math.max(height / 2 / Math.tan(v), width / 2 / Math.tan(h)) * margin
  }

  render() {
    const { azimuth, elevation, distance, target } = this.view
    const a = (azimuth * Math.PI) / 180, e = (elevation * Math.PI) / 180
    this.camera.position.set(target.x + Math.sin(a) * Math.cos(e) * distance, target.y + Math.sin(e) * distance, target.z + Math.cos(a) * Math.cos(e) * distance)
    this.camera.lookAt(target)
    this.key.target.position.set(target.x, 0, target.z)
    // In a place, the light comes with it: from the same side of the picture whichever angle an exercise is shown from.
    const f = this.place.mesh.visible ? (this.facing * Math.PI) / 180 : 0, cf = Math.cos(f), sf = Math.sin(f)
    const turned = (x: number, z: number): [number, number] => [x * cf + z * sf, -x * sf + z * cf]
    const [kx, ky, kz] = this.look.key.from
    const [tx, tz] = turned(kx, kz)
    this.key.position.set(target.x + tx, ky, target.z + tz)
    const [lx, lz] = turned(-3, -3), [rx, rz] = turned(3, -2.6)
    this.rims[0].position.set(lx, 2.4, lz)
    this.rims[1].position.set(rx, 2, rz)
    if (this.look.sun) {
      this.sun.material.uniforms.uTime.value = performance.now() / 1000
      // Always behind the subject as the camera goes round it, and facing the camera.
      this.back.set(-Math.sin(a), 0, -Math.cos(a))
      this.sun.position.set(target.x + this.back.x * 2.6, target.y + this.look.sun.lift, target.z + this.back.z * 2.6)
      this.sun.lookAt(this.camera.position.x, this.sun.position.y, this.camera.position.z)
    }
    this.place.update(this.renderer, this.camera, STILL?.matches ? 0 : performance.now() / 1000)
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as Mesh
      if (!m.isMesh) return
      m.geometry.dispose()
      ;(Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose())
    })
    this.place.dispose()
    this.scene.environment?.dispose()
    this.renderer.dispose()
  }
}
