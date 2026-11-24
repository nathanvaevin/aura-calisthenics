/**
 * How the skin follows the bones.
 *
 * The usual way averages the places each bone would carry a point to. Where
 * two bones are turned far apart (an arm raised overhead, a hand turned palm
 * up) that average falls inside the limb: the shoulder cap caves in and a
 * forearm thins to a ribbon. Here the bones' movements themselves are
 * blended (as dual quaternions) into one rigid movement per point, so a point
 * turns part of the way with each bone and keeps its distance from the joint.
 * The limb keeps its girth however far it turns.
 *
 * Shader text only, shared by everything that draws the body: the body's own
 * materials, its drawn outline, its shadow and the Aura's shells. Put
 * `SKIN_DECL` after `#include <skinning_pars_vertex>` and `SKIN_BLEND` after
 * `#include <skinbase_vertex>`; the rest of three.js's skinning then works
 * on the one blended movement.
 */
/** How far soft tissue gives, in metres, for each unit that gravity has turned against the chest (upside down is two). She wears a sports top: it is little. */
export const SOFT_GIVE = 0.005

export const SKIN_DECL = /* glsl */ `
#ifdef USE_SKINNING
  // How far this point gives to gravity (soft tissue). Absent from a character that has none, and then it reads 0.
  attribute float _soft;
  vec4 auraQuat(mat3 m) {
    float t = m[0][0] + m[1][1] + m[2][2];
    if (t > 0.0) { float s = sqrt(t + 1.0) * 2.0; return vec4((m[1][2] - m[2][1]) / s, (m[2][0] - m[0][2]) / s, (m[0][1] - m[1][0]) / s, 0.25 * s); }
    if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) { float s = sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]) * 2.0; return vec4(0.25 * s, (m[1][0] + m[0][1]) / s, (m[2][0] + m[0][2]) / s, (m[1][2] - m[2][1]) / s); }
    if (m[1][1] > m[2][2]) { float s = sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]) * 2.0; return vec4((m[1][0] + m[0][1]) / s, 0.25 * s, (m[2][1] + m[1][2]) / s, (m[2][0] - m[0][2]) / s); }
    float s = sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]) * 2.0;
    return vec4((m[2][0] + m[0][2]) / s, (m[2][1] + m[1][2]) / s, 0.25 * s, (m[0][1] - m[1][0]) / s);
  }
  vec4 auraMul(vec4 a, vec4 b) { return vec4(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz)); }
  // One bone's movement, as a turn and (in the second half) where it carries things to.
  void auraDual(mat4 m, float w, vec4 like, inout vec4 turn, inout vec4 carry, inout float size) {
    if (w <= 0.0) return;
    float s = length(m[0].xyz);
    vec4 q = auraQuat(mat3(m[0].xyz / s, m[1].xyz / s, m[2].xyz / s));
    // The same turn can be written two ways; take the one on the side of the first bone, or the blend goes the long way round.
    if (dot(q, like) < 0.0) q = -q;
    turn += w * q;
    carry += w * 0.5 * auraMul(vec4(m[3].xyz, 0.0), q);
    size += w * s;
  }
  mat4 auraBlend(mat4 a, mat4 b, mat4 c, mat4 d, vec4 w) {
    float sa = length(a[0].xyz);
    vec4 like = auraQuat(mat3(a[0].xyz / sa, a[1].xyz / sa, a[2].xyz / sa));
    vec4 turn = vec4(0.0), carry = vec4(0.0);
    float size = 0.0;
    auraDual(a, w.x, like, turn, carry, size);
    auraDual(b, w.y, like, turn, carry, size);
    auraDual(c, w.z, like, turn, carry, size);
    auraDual(d, w.w, like, turn, carry, size);
    float n = length(turn);
    if (n < 1e-6) return a;
    turn /= n; carry /= n;
    float total = w.x + w.y + w.z + w.w;
    size /= max(total, 1e-6);
    float x = turn.x, y = turn.y, z = turn.z, r = turn.w;
    vec3 at = 2.0 * auraMul(carry, vec4(-turn.xyz, turn.w)).xyz;
    return mat4(
      vec4(1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + z * r), 2.0 * (x * z - y * r), 0.0) * size,
      vec4(2.0 * (x * y - z * r), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + x * r), 0.0) * size,
      vec4(2.0 * (x * z + y * r), 2.0 * (y * z - x * r), 1.0 - 2.0 * (x * x + y * y), 0.0) * size,
      vec4(at, 1.0));
  }
#endif
`

export const SKIN_BLEND = /* glsl */ `
#ifdef USE_SKINNING
  {
    mat4 auraSkin = auraBlend(boneMatX, boneMatY, boneMatZ, boneMatW, skinWeight);
    // Soft tissue hangs the way gravity pulls it. Standing is how the body was made, so only the difference from
    // standing is added: nothing upright, towards the head when upside down, a little flatter lying on the back.
    // The upper chest is bone 3; its second column is which way "up along the chest" points now.
    if (_soft > 0.0) auraSkin[3].xyz += _soft * ${SOFT_GIVE.toFixed(4)} * (vec3(0.0, -1.0, 0.0) + normalize(getBoneMatrix(3.0)[1].xyz));
    boneMatX = auraSkin; boneMatY = auraSkin; boneMatZ = auraSkin; boneMatW = auraSkin;
  }
#endif
`

/** For a three.js material's own vertex shader. */
export const withSkin = (vertexShader: string) => vertexShader
  .replace('#include <skinning_pars_vertex>', `#include <skinning_pars_vertex>\n${SKIN_DECL}`)
  .replace('#include <skinbase_vertex>', `#include <skinbase_vertex>\n${SKIN_BLEND}`)
