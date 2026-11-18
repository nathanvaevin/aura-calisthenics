/**
 * A master character on stage: the loaded 3D asset, its three visual layers
 * (base look, muscle activation, the body's own charge) and its skeleton.
 *
 * The layers are uniforms on one material, so they change smoothly and
 * independently of each other and of the pose.
 */
import { BackSide, CanvasTexture, Color, Group, MeshDepthMaterial, MeshStandardMaterial, RGBADepthPacking, ShaderMaterial, SkinnedMesh, SRGBColorSpace, Vector3, type Bone, type Mesh, type Object3D, type Texture } from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { BONES, type BoneName, type BuildId, type CharacterId } from './body/skeleton'
import { SLOTS } from './body/muscles'
import { SKIN_BLEND, SKIN_DECL, withSkin } from './body/skinning'
import { Rig, type Pose } from './rig'
import { STYLES, styleOf, type CharacterStyle, type PerformerStyle } from './styles'

const assets = new Map<string, Promise<GLTF>>()

/** The characters are files in public/characters, built by `npm run character:build`: one per build and sex. */
export function loadCharacter(id: CharacterId, build: BuildId = 'aura'): Promise<GLTF> {
  const key = `${build}-${id}`
  let p = assets.get(key)
  if (!p) {
    p = new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}characters/${key}.glb`)
    p.catch(() => assets.delete(key))
    assets.set(key, p)
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
  /** How the body is drawn: 0 modelled by light, 1 flat colour in two tones, 2 ink. */
  shade: { value: number }
  rimColor: { value: Color }
  shadeTint: { value: Vector3 }
  deep: { value: number }
  /** How far the body has become a night sky (0 to 1), its two colours, and the time its stars twinkle by. */
  cosmos: { value: number }
  cosmosA: { value: Color }
  cosmosB: { value: Color }
  clock: { value: number }
  /** Hair that takes the colour of the Aura: the colour, and how far it has turned. */
  hairGlow: { value: Color }
  hairCharge: { value: number }
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
uniform float uMuscle, uCharge, uRim, uCloth, uShade, uHair, uHairCharge;
uniform vec3 uGlowA, uGlowB, uChargeColor, uHairGlow, uRimColor, uShadeTint, uCosmosA, uCosmosB;
uniform float uDeep, uCosmos, uClock;
float skyHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float skyNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(skyHash(i), skyHash(i + vec3(1, 0, 0)), f.x), mix(skyHash(i + vec3(0, 1, 0)), skyHash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(skyHash(i + vec3(0, 0, 1)), skyHash(i + vec3(1, 0, 1)), f.x), mix(skyHash(i + vec3(0, 1, 1)), skyHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
// Stars that stay where they are on the body: one, perhaps, in each cell of a grid laid through it.
float skyStars(vec3 p, float cells, float share, float size) {
  vec3 g = p * cells, id = floor(g);
  float h = skyHash(id);
  vec3 at = vec3(skyHash(id + 3.1), skyHash(id + 7.7), skyHash(id + 5.3)) * 0.6 + 0.2;
  float d = length(fract(g) - at);
  float twinkle = 0.65 + 0.35 * sin(uClock * (1.0 + 3.0 * h) + h * 40.0);
  return step(1.0 - share, h) * pow(max(0.0, 1.0 - d / size), 2.5) * twinkle;
}
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
  totalEmissiveRadiance += uRimColor * fres * min(uRim, 0.6) * mix(1.0, 0.35, uCloth);
  // A drawn body keeps its colours: the charge shows at its edge only.
  float drawnBody = step(0.5, uShade);
  totalEmissiveRadiance += uChargeColor * uCharge * mix(0.1 + 1.5 * fres, 0.9 * pow(fres, 1.6), drawnBody) * mix(1.0, 0.5, uCloth);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(1.0), 0.35) , uCharge * (1.0 - uCloth) * (1.0 - drawnBody));
  // Hair that turns the colour of the Aura.
  float turned = uHair * uHairCharge;
  diffuseColor.rgb = mix(diffuseColor.rgb, uHairGlow, turned * 0.9);
  totalEmissiveRadiance += uHairGlow * turned * (0.35 + 0.9 * fres);
  if (uCloth > 0.5 && vFront > 0.35) {
    vec2 uv = (vRest.xy - uLogoRect.xy) / uLogoRect.zw + 0.5;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec4 mark = texture2D(uLogo, uv);
      diffuseColor.rgb = mix(diffuseColor.rgb, mark.rgb, mark.a * smoothstep(0.35, 0.6, vFront));
    }
  }
}
`

/**
 * Drawn shading, after the lights: the body as flat tones instead of a
 * modelled surface. The key light decides where the tones fall, shadows cast
 * by the body on itself included.
 */
const FRAG_SHADE = /* glsl */ `
if (uShade > 0.5) {
  #if NUM_DIR_LIGHTS > 0
    float ndl = dot(normal, directionalLights[0].direction);
  #else
    float ndl = normal.y;
  #endif
  float open = 1.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow keyShadow = directionalLightShadows[0];
    open = receiveShadow ? getShadow(directionalShadowMap[0], keyShadow.shadowMapSize, keyShadow.shadowIntensity, keyShadow.shadowBias, keyShadow.shadowRadius, vDirectionalShadowCoord[0]) : 1.0;
  #endif
  float lightv = (ndl * 0.5 + 0.5) * mix(0.62, 1.0, open);
  float edge = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
  vec3 base = diffuseColor.rgb;
  vec3 drawn;
  if (uShade < 1.5) {
    // Cel: light and shade, a small highlight, and a cool tint in the shade.
    float lit = smoothstep(0.6, 0.62, lightv);
    float hot = smoothstep(0.9, 0.925, lightv);
    drawn = mix(base * uShadeTint, base, lit) + base * 0.14 * hot;
    // A third tone where the light does not reach at all: black, as a brush would leave it.
    drawn = mix(drawn, base * 0.06, uDeep * (1.0 - smoothstep(0.3, 0.32, lightv)));
    // Light from behind catches the edge that is turned away from the key.
    drawn += uRimColor * smoothstep(0.62, 0.66, edge) * (1.0 - lit) * uRim * 0.5;
  } else {
    // Ink: black, a hatched middle tone, and bare paper where the light lands.
    float mid = smoothstep(0.36, 0.375, lightv);
    float lit = smoothstep(0.6, 0.615, lightv);
    float hatch = step(0.5, fract((gl_FragCoord.x + gl_FragCoord.y) * 0.16));
    float tone = mix(0.05, mix(0.34 + 0.2 * hatch, 1.0, lit), mid);
    // The lines between muscles: wherever the surface folds inward.
    vec3 px = -dFdx(vViewPosition), py = -dFdy(vViewPosition);
    float bend = (dot(dFdx(normal), px) + dot(dFdy(normal), py)) / max(dot(px, px) + dot(py, py), 1e-9);
    float groove = smoothstep(7.0, 22.0, -bend) * (1.0 - uCloth);
    drawn = base * tone * (1.0 - 0.8 * groove);
    drawn += vec3(1.0, 0.36, 0.24) * smoothstep(0.7, 0.74, edge) * (1.0 - mid) * 0.22;
  }
  outgoingLight = drawn + totalEmissiveRadiance;
}
// A body that has become a piece of night sky: cloud in two colours, stars near and far, and light at its edge.
if (uCosmos > 0.001) {
  vec3 p = vRest;
  float cloud = skyNoise(p * 3.2 + vec3(0.0, uClock * 0.05, 0.0)) * 0.6 + skyNoise(p * 8.5 - vec3(uClock * 0.03)) * 0.4;
  vec3 sky = mix(uCosmosA, uCosmosB, smoothstep(0.42, 0.8, cloud)) * (0.2 + 0.5 * cloud);
  float stars = skyStars(p, 30.0, 0.34, 0.24) + skyStars(p + 4.7, 13.0, 0.26, 0.3) * 1.3 + skyStars(p + 9.1, 64.0, 0.45, 0.34) * 0.7;
  float rim = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 3.2);
  vec3 night = sky + vec3(1.0, 0.97, 1.0) * stars * 2.4 + mix(uCosmosA, vec3(1.0), 0.8) * rim * 1.1;
  outgoingLight = mix(outgoingLight, night, uCosmos);
}
`

let shadow: MeshDepthMaterial | null = null
function shadowMaterial() {
  if (shadow) return shadow
  shadow = new MeshDepthMaterial({ depthPacking: RGBADepthPacking })
  shadow.onBeforeCompile = (shader) => { shader.vertexShader = withSkin(shader.vertexShader) }
  shadow.customProgramCacheKey = () => 'aura-shadow'
  return shadow
}

type Kind = 'skin' | 'cloth' | 'hair' | 'accent'

function material(kind: Kind, look: Look, logo: { x: number; y: number; width: number; height: number }) {
  const mat = new MeshStandardMaterial(
    kind === 'cloth' ? { color: 0x121216, roughness: 0.78, metalness: 0 }
      : kind === 'hair' ? { color: 0xb9b9c2, roughness: 0.5, metalness: 0.3 }
      : kind === 'accent' ? { color: 0xecc77f, roughness: 0.7, metalness: 0 }
      : { color: 0xc6c6ce, roughness: 0.4, metalness: 0.32 },
  )
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uAct: { value: look.act }, uMuscle: look.muscle, uGlowA: look.glowA, uGlowB: look.glowB,
      uCharge: look.charge, uChargeColor: look.chargeColor, uRim: look.rim, uRimColor: look.rimColor, uShadeTint: look.shadeTint, uDeep: look.deep, uCosmos: look.cosmos, uClock: look.clock, uCosmosA: look.cosmosA, uCosmosB: look.cosmosB,
      uCloth: { value: kind === 'cloth' || kind === 'accent' ? 1 : 0 },
      uShade: look.shade, uHair: { value: kind === 'hair' ? 1 : 0 }, uHairGlow: look.hairGlow, uHairCharge: look.hairCharge,
      uLogo: { value: logoTexture() }, uLogoRect: { value: [logo.x, logo.y, logo.width, logo.height] },
    })
    shader.vertexShader = withSkin(shader.vertexShader)
      .replace('#include <common>', `#include <common>\n${VERT_DECL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERT_MAIN}`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAG_DECL}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${FRAG_MAIN}`)
      .replace('#include <opaque_fragment>', `${FRAG_SHADE}\n#include <opaque_fragment>`)
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
    shade: { value: 0 },
    rimColor: { value: new Color('#cfdaff') },
    shadeTint: { value: new Vector3(0.5, 0.48, 0.66) },
    deep: { value: 0 },
    cosmos: { value: 0 },
    cosmosA: { value: new Color('#7a4dff') },
    cosmosB: { value: new Color('#ff7ad9') },
    clock: { value: 0 },
    hairGlow: { value: new Color(0xffffff) },
    hairCharge: { value: 0 },
  }
  style: CharacterStyle = STYLES.aura
  /** The skinned meshes, for effects that need to draw the body again (an outline of light). */
  readonly meshes: Mesh[] = []
  private readonly bones = {} as Record<BoneName, Bone>
  private readonly materials: MeshStandardMaterial[] = []
  private readonly kinds = new Map<MeshStandardMaterial, Kind>()
  private readonly outlines: SkinnedMesh[] = []

  constructor(id: CharacterId, gltf: GLTF) {
    this.id = id
    this.rig = new Rig(id)
    const scene = clone(gltf.scene) as Object3D
    const logo = (gltf.scene.userData.logo ?? gltf.scenes[0]?.userData.logo ?? { x: 0, y: 0, width: 0.001, height: 0.001 }) as { x: number; y: number; width: number; height: number }
    scene.traverse((o) => {
      if ((o as Bone).isBone && BONES.includes(o.name as BoneName)) this.bones[o.name as BoneName] = o as Bone
      const mesh = o as Mesh
      if (!mesh.isMesh) return
      const name = (mesh.material as MeshStandardMaterial).name
      const kind: Kind = name === 'cloth' || name === 'hair' || name === 'accent' ? name : 'skin'
      const mat = material(kind, this.look, logo)
      this.kinds.set(mat, kind)
      // Hair and anything without muscle data still runs the same shader: give it empty data.
      if (!mesh.geometry.getAttribute('_muscle')) {
        mesh.geometry = mesh.geometry.clone()
        mesh.geometry.setAttribute('_muscle', mesh.geometry.getAttribute('skinIndex').clone())
        ;(mesh.geometry.getAttribute('_muscle').array as Uint8Array).fill(0)
      }
      mesh.material = mat
      mesh.frustumCulled = false
      mesh.castShadow = true
      // The shadow is cast by the body as it is drawn, not as the usual skinning would have it.
      mesh.customDepthMaterial = shadowMaterial()
      this.materials.push(mat)
      this.meshes.push(mesh)
    })
    this.group.add(scene)
  }

  /** Draws the character the way a universe does, in the colours the athlete chose. */
  setStyle(spec: PerformerStyle | undefined) {
    const style = styleOf(spec)
    this.style = style
    this.look.rimColor.value.set(style.rimColour)
    this.look.shadeTint.value.set(...(style.shadeTint ?? [0.5, 0.48, 0.66]))
    this.look.deep.value = style.deep ?? 0
    const drawn = style.shading !== 'studio'
    this.look.shade.value = style.shading === 'cel' ? 1 : style.shading === 'ink' ? 2 : 0
    this.look.rim.value = style.rim
    if (!style.hairGlow) this.look.hairCharge.value = 0
    for (const mat of this.materials) {
      const kind = this.kinds.get(mat)!
      if (kind === 'skin') { mat.color.set(spec?.skin ?? '#c6c6ce'); if (style.skinWash) mat.color.lerp(new Color(style.skinWash.colour), style.skinWash.amount); mat.roughness = style.roughness; mat.metalness = style.metalness }
      else if (kind === 'hair') { mat.color.set(spec?.hair ?? '#b9b9c2'); mat.roughness = drawn ? 1 : 0.5; mat.metalness = drawn ? 0 : 0.3 }
      else if (kind === 'accent') mat.color.set(spec?.accent ?? '#ecc77f')
      else mat.color.set(style.cloth)
      mat.envMapIntensity = drawn ? 0 : 1
    }
    for (const m of this.meshes) m.receiveShadow = drawn

    // The drawn line round the figure: the body again, slightly larger, seen from inside.
    for (const o of this.outlines) { o.removeFromParent(); (o.material as ShaderMaterial).dispose() }
    this.outlines.length = 0
    if (style.outline > 0) {
      for (const src of this.meshes as SkinnedMesh[]) {
        const m = new SkinnedMesh(src.geometry, new ShaderMaterial({
          side: BackSide,
          uniforms: { uWidth: { value: style.outline * this.rig.body.scale }, uColour: { value: new Color(style.outlineColour) }, uCosmos: this.look.cosmos },
          vertexShader: /* glsl */ `
            #include <common>
            #include <skinning_pars_vertex>
            ${SKIN_DECL}
            uniform float uWidth;
            void main() {
              vec3 objectNormal = normal;
              #include <skinbase_vertex>
              ${SKIN_BLEND}
              #include <skinnormal_vertex>
              vec3 transformed = position;
              #include <skinning_vertex>
              transformed += normalize(objectNormal) * uWidth;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
            }`,
          // The drawn line turns to light when the body turns to sky.
          fragmentShader: 'uniform vec3 uColour; uniform float uCosmos; void main() { gl_FragColor = vec4(mix(uColour, vec3(1.0), uCosmos), 1.0); }',
        }))
        m.bind(src.skeleton, src.bindMatrix)
        m.frustumCulled = false
        src.parent!.add(m)
        this.outlines.push(m)
      }
    }
  }

  pose(p: Pose) {
    const rig = this.rig
    rig.solve(p)
    for (const b of BONES) rig.local(b, this.bones[b].quaternion)
    this.bones.hips.position.copy(rig.pos.hips)
  }

  dispose() {
    for (const o of this.outlines) { o.removeFromParent(); (o.material as ShaderMaterial).dispose() }
    this.materials.forEach((m) => m.dispose())
    this.group.removeFromParent()
  }
}

export async function createActor(id: CharacterId, build: BuildId = 'aura'): Promise<Actor> {
  return new Actor(id, await loadCharacter(id, build))
}
