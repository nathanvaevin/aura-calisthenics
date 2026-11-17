/**
 * The studio the characters are shown in: a dark floor, soft key light, two
 * rim lights from behind, and a camera that can be put at the usual coaching
 * angles. One WebGL canvas.
 */
import {
  ACESFilmicToneMapping, CircleGeometry, Color, DirectionalLight, HemisphereLight, Mesh,
  PCFSoftShadowMap, PerspectiveCamera, PMREMGenerator, Scene, ShaderMaterial, ShadowMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

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

export class Stage {
  readonly renderer: WebGLRenderer
  readonly scene = new Scene()
  readonly camera = new PerspectiveCamera(26, 1, 0.05, 60)
  readonly view: View = { azimuth: 0, elevation: 6, distance: 5, target: new Vector3(0, 0.95, 0) }
  private readonly key: DirectionalLight

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
    key.shadow.camera.left = -2.2; key.shadow.camera.right = 2.2
    key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -1.2
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 12
    key.shadow.bias = -0.0006
    key.shadow.normalBias = 0.02
    key.shadow.radius = 5
    this.key = key
    scene.add(key, key.target)
    const rimL = new DirectionalLight(0xb9c8ff, 1.5)
    rimL.position.set(-3, 2.4, -3)
    const rimR = new DirectionalLight(0xd9ccff, 1.2)
    rimR.position.set(3, 2, -2.6)
    scene.add(rimL, rimR, new HemisphereLight(0xdfe6ff, 0x14141c, 0.35))

    // Floor: catches the shadow, and fades into the backdrop so it has no edge.
    const shadow = new Mesh(new CircleGeometry(7, 48), new ShadowMaterial({ opacity: 0.42 }))
    shadow.rotation.x = -Math.PI / 2
    shadow.receiveShadow = true
    const sheen = new Mesh(new CircleGeometry(7, 48), new ShaderMaterial({
      transparent: true, depthWrite: false,
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec2 vP; void main(){ float r = length(vP); gl_FragColor = vec4(vec3(0.62, 0.66, 0.85), 0.085 * exp(-r * r * 0.42)); }',
    }))
    sheen.rotation.x = -Math.PI / 2
    sheen.position.y = -0.001
    sheen.renderOrder = -2
    shadow.renderOrder = -1
    scene.add(sheen, shadow)
  }

  add(...objects: Parameters<Scene['add']>) { this.scene.add(...objects) }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / Math.max(1, height)
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
    this.key.position.set(target.x + 1.6, 4.2, target.z + 3.2)
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as Mesh
      if (!m.isMesh) return
      m.geometry.dispose()
      ;(Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose())
    })
    this.scene.environment?.dispose()
    this.renderer.dispose()
  }
}
