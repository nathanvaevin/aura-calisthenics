/**
 * A master character on stage: the loaded 3D asset, its three visual layers
 * (base look, muscle activation, the body's own charge) and its skeleton.
 *
 * The layers are uniforms on one material, so they change smoothly and
 * independently of each other and of the pose.
 */
import { CanvasTexture, Color, Group, MeshStandardMaterial, SRGBColorSpace, type Bone, type Mesh, type Object3D, type Texture } from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { BONES, type BoneName, type CharacterId } from './body/skeleton'
import { SLOTS } from './body/muscles'
import { Rig, type Pose } from './rig'

const assets = new Map<CharacterId, Promise<GLTF>>()

/** The characters are files in public/characters, built by `npm run character:build`. */
export function loadCharacter(id: CharacterId): Promise<GLTF> {
  let p = assets.get(id)
  if (!p) {
    p = new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}characters/aura-${id}.glb`)
    p.catch(() => assets.delete(id))
    assets.set(id, p)
  }
  return p
}

let wordmark: Texture | null = null

/** The Aura wordmark as it is drawn in the app: the serif name and the dot. */
function logoTexture(): Texture {
  if (wordmark) return wordmark
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 174
  const g = c.getContext('2d')!
  const draw = () => {
    g.clearRect(0, 0, c.width, c.height)
    g.font = `400 150px 'Instrument Serif', Georgia, serif`
    g.textBaseline = 'alphabetic'
    g.fillStyle = '#f4f2ec'
    const w = g.measureText('Aura').width
    const x = (c.width - w - 40) / 2
    g.fillText('Aura', x, 138)
    g.fillStyle = '#ecc77f'
    g.beginPath()
    g.arc(x + w + 22, 138 - 13, 13.5, 0, Math.PI * 2)
    g.fill()
  }
  draw()
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  // The serif may still be on its way.
  void document.fonts?.load(`150px 'Instrument Serif'`).then(() => { draw(); tex.needsUpdate = true })
  wordmark = tex
  return tex
}

export interface Look {
  /** Activation per muscle slot, 0..1. */
  act: Float32Array
  /** Master level of the muscle layer. */
  muscle: { value: number }
  glowA: { value: Color }
  glowB: { value: Color }
  /** The body's own luminance in the Full Aura state, 0..1. */
  charge: { value: number }
  chargeColor: { value: Color }
  rim: { value: number }
}

const VERT_DECL = /* glsl */ `
attribute vec4 _muscle;
uniform float uAct[${SLOTS}];
varying vec2 vMus;
varying vec3 vRest;
varying float vFront;
`
const VERT_MAIN = /* glsl */ `
{
  float a0 = uAct[int(_muscle.x + 0.5)], a1 = uAct[int(_muscle.z + 0.5)];
  float m0 = _muscle.y / 255.0, m1 = _muscle.w / 255.0;
  vMus = a0 * m0 >= a1 * m1 ? vec2(a0, m0) : vec2(a1, m1);
  vRest = position;
  vFront = normal.z;
}
`
const FRAG_DECL = /* glsl */ `
varying vec2 vMus;
varying vec3 vRest;
varying float vFront;
uniform float uMuscle, uCharge, uRim, uCloth;
uniform vec3 uGlowA, uGlowB, uChargeColor;
uniform sampler2D uLogo;
uniform vec4 uLogoRect;
`
const FRAG_MAIN = /* glsl */ `
{
  float fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.4);
  // Muscle layer: the working muscle takes on the colour and gives off light, with a brighter contour.
  // Through clothing only the middle of a muscle shows: the cloth is a coarser surface than the skin.
  float fill = smoothstep(mix(0.08, 0.3, uCloth), mix(0.5, 0.8, uCloth), vMus.y);
  float line = smoothstep(0.03, 0.22, vMus.y) * (1.0 - smoothstep(0.26, 0.6, vMus.y));
  // Clamped: at the very edge of a triangle the interpolated value can dip below zero.
  float level = pow(max(vMus.x, 0.0), 0.8) * uMuscle * mix(1.0, 0.5, uCloth);
  float lit = level * fill;
  float edge = level * line * (1.0 - uCloth);
  // The lit skin takes the colour and stops mirroring the room, so it stays a colour; the studio light still models it.
  diffuseColor.rgb = mix(diffuseColor.rgb, uGlowA * 0.62, saturate(lit * 0.95 + edge * 0.5));
  roughnessFactor = mix(roughnessFactor, 0.8, saturate(lit));
  metalnessFactor *= 1.0 - saturate(lit);
  totalEmissiveRadiance += uGlowA * lit * (0.3 + 0.5 * fres) + uGlowB * (edge * 0.7 + lit * fres * 0.5);
  // Base: a quiet rim of light. Charge: the body itself glows.
  totalEmissiveRadiance += vec3(0.62, 0.7, 1.0) * fres * uRim * mix(1.0, 0.35, uCloth);
  totalEmissiveRadiance += uChargeColor * uCharge * (0.1 + 1.5 * fres) * mix(1.0, 0.5, uCloth);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(1.0), 0.35) , uCharge * (1.0 - uCloth));
  if (uCloth > 0.5 && vFront > 0.35) {
    vec2 uv = (vRest.xy - uLogoRect.xy) / uLogoRect.zw + 0.5;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec4 mark = texture2D(uLogo, uv);
      diffuseColor.rgb = mix(diffuseColor.rgb, mark.rgb, mark.a * smoothstep(0.35, 0.6, vFront));
    }
  }
}
`

function material(kind: 'skin' | 'cloth' | 'hair', look: Look, logo: { x: number; y: number; width: number; height: number }) {
  const mat = new MeshStandardMaterial(
    kind === 'cloth' ? { color: 0x121216, roughness: 0.78, metalness: 0 }
      : kind === 'hair' ? { color: 0xb9b9c2, roughness: 0.5, metalness: 0.3 }
      : { color: 0xc6c6ce, roughness: 0.4, metalness: 0.32 },
  )
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uAct: { value: look.act }, uMuscle: look.muscle, uGlowA: look.glowA, uGlowB: look.glowB,
      uCharge: look.charge, uChargeColor: look.chargeColor, uRim: look.rim,
      uCloth: { value: kind === 'cloth' ? 1 : 0 },
      uLogo: { value: logoTexture() }, uLogoRect: { value: [logo.x, logo.y, logo.width, logo.height] },
    })
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERT_DECL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERT_MAIN}`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAG_DECL}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${FRAG_MAIN}`)
  }
  mat.customProgramCacheKey = () => `aura-${kind}`
  return mat
}

export class Actor {
  readonly id: CharacterId
  readonly group = new Group()
  readonly rig: Rig
  readonly look: Look = {
    act: new Float32Array(SLOTS),
    muscle: { value: 1 },
    glowA: { value: new Color(0xff2f8f) },
    glowB: { value: new Color(0xd9b8ff) },
    charge: { value: 0 },
    chargeColor: { value: new Color(0xa78bff) },
    rim: { value: 0.22 },
  }
  /** The skinned meshes, for effects that need to draw the body again (an outline of light). */
  readonly meshes: Mesh[] = []
  private readonly bones = {} as Record<BoneName, Bone>
  private readonly materials: MeshStandardMaterial[] = []

  constructor(id: CharacterId, gltf: GLTF) {
    this.id = id
    this.rig = new Rig(id)
    const scene = clone(gltf.scene) as Object3D
    const logo = (gltf.scene.userData.logo ?? gltf.scenes[0]?.userData.logo ?? { x: 0, y: 0, width: 0.001, height: 0.001 }) as { x: number; y: number; width: number; height: number }
    scene.traverse((o) => {
      if ((o as Bone).isBone && BONES.includes(o.name as BoneName)) this.bones[o.name as BoneName] = o as Bone
      const mesh = o as Mesh
      if (!mesh.isMesh) return
      const kind = (mesh.material as MeshStandardMaterial).name as 'skin' | 'cloth' | 'hair'
      const mat = material(kind, this.look, logo)
      // Hair and anything without muscle data still runs the same shader: give it empty data.
      if (!mesh.geometry.getAttribute('_muscle')) {
        mesh.geometry = mesh.geometry.clone()
        mesh.geometry.setAttribute('_muscle', mesh.geometry.getAttribute('skinIndex').clone())
        ;(mesh.geometry.getAttribute('_muscle').array as Uint8Array).fill(0)
      }
      mesh.material = mat
      mesh.frustumCulled = false
      mesh.castShadow = true
      this.materials.push(mat)
      this.meshes.push(mesh)
    })
    this.group.add(scene)
  }

  pose(p: Pose) {
    const rig = this.rig
    rig.solve(p)
    for (const b of BONES) rig.local(b, this.bones[b].quaternion)
    this.bones.hips.position.copy(rig.pos.hips)
  }

  dispose() {
    this.materials.forEach((m) => m.dispose())
    this.group.removeFromParent()
  }
}

export async function createActor(id: CharacterId): Promise<Actor> {
  return new Actor(id, await loadCharacter(id))
}
