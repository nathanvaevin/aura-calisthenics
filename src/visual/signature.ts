/**
 * The signature places, as shader text for `backdrop.ts`: one for each
 * character, each a real place with things standing in it.
 *
 * 8 · Aura inside: a training hall with a round window, a rack before it.
 * 9 · Aura outside: a stone terrace over the sea at the end of the day, a rack on it.
 * 10 · The pit: a ring of planks and sand with a crowd round it (Baki).
 * 11 · World ring: a disc of stone afloat among nebulae (Goku); 12 is the same in ink on paper.
 *
 * All drawn for this app, from rules. Emblems and patterns are ours: a brush
 * ring, the six circles, the Aura wordmark. Nothing here is taken from a picture.
 *
 * A place faces -z: what it is about stands there, and `Backdrop.facing`
 * turns that behind the subject for the angle an exercise is shown from.
 */
export const SIGNATURE = /* glsl */ `
#if SCENE >= 8
  // A round bar between two points, laid over what is behind it. 'zb' is how far away the nearest thing so far is.
  void rod(vec3 o, vec3 d, vec3 a, vec3 b, float r, vec3 L, vec3 base, vec3 hot, inout vec3 col, inout float zb) {
    vec3 ab = b - a, ao = a - o;
    float bb = dot(ab, ab), bd = dot(ab, d), ad = dot(ao, d), aab = dot(ao, ab);
    float s = clamp((bd * ad - aab) / max(bb - bd * bd, 1e-5), 0.0, 1.0);
    float t = ad + bd * s;
    if (t <= 0.0 || t > zb) return;
    vec3 w = (o + d * t) - (a + ab * s);
    float px = uPix * t;
    float cov = 1.0 - smoothstep(r - px, r + px, length(w));
    if (cov <= 0.0) return;
    vec3 k = w / r;
    vec3 n = normalize(k - d * sqrt(max(0.0, 1.0 - dot(k, k))));
    float lit = max(0.0, dot(n, L));
    col = mix(col, base * (0.3 + 0.7 * lit) + hot * pow(1.0 - abs(dot(n, d)), 1.6) * max(0.0, 0.35 + 0.65 * dot(n, L)), cov);
    zb = min(zb, t);
  }
  // A box, turned about the upright by 'turn'. Returns the distance (or -1) and the face it is hit on.
  float box(vec3 o, vec3 d, vec3 c, vec3 h, float turn, out vec3 n) {
    float cs = cos(turn), sn = sin(turn);
    mat2 m = mat2(cs, -sn, sn, cs);
    vec3 q = o - c; q.xz = m * q.xz;
    vec3 e = d; e.xz = m * e.xz;
    vec3 inv = 1.0 / (e + 1e-6);
    vec3 near = -q * inv - abs(inv) * h, farr = -q * inv + abs(inv) * h;
    float a = max(near.x, max(near.y, near.z)), b = min(farr.x, min(farr.y, farr.z));
    if (a > b || a < 0.0) return -1.0;
    n = -sign(e) * step(near.yzx, near.xyz) * step(near.zxy, near.xyz);
    n.xz = transpose(m) * n.xz;
    return a;
  }
  // How much of the Aura wordmark there is at a place on a plate: 'at' from its middle, 'wide' metres across.
  vec4 wordmark(vec2 at, float wide) {
    // The letters fill 0.62 of the picture's width; the picture is 512 by 174.
    vec2 size = vec2(wide / 0.62, wide / 0.62 * 174.0 / 512.0);
    vec2 uv = at / size + 0.5;
    vec4 s = texture2D(uLogo, clamp(uv, 0.0, 1.0));
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    return vec4(pow(max(s.rgb, 0.0), vec3(1.0 / 2.2)), s.a * inside);
  }
  float cylinder(vec3 o, vec3 d, float R) {
    float A = dot(d.xz, d.xz), B = dot(o.xz, d.xz), C = dot(o.xz, o.xz) - R * R;
    return (-B + sqrt(max(0.0, B * B - A * C))) / max(A, 1e-5);
  }
  vec3 within(vec3 o, float R) { float l = length(o.xz); if (l > R) o.xz *= R / l; return o; }
#endif

#if SCENE == 8
  // ── Aura inside ──────────────────────────────────────────────────────────
  const vec3 HALL = vec3(6.4, 5.4, 9.0);
  const vec2 EYE = vec2(0.0, 2.5);
  const float EYE_R = 1.95;

  // The dawn outside the round window.
  vec3 dawn(vec2 q) {
    float h = (q.y - EYE.y) / EYE_R;
    vec3 c = mix(vec3(1.0, 0.73, 0.46), vec3(0.86, 0.5, 0.5), smoothstep(-0.75, 0.3, h));
    c = mix(c, vec3(0.4, 0.34, 0.56), smoothstep(0.1, 1.05, h));
    float cloud = fbm(vec2(q.x * 0.7 + uTime * 0.016, q.y * 2.4));
    c = mix(c, vec3(1.0, 0.84, 0.66), smoothstep(0.48, 0.8, cloud) * 0.45);
    // A far ridge, and the sun just over it.
    float ridge = EYE.y - 1.05 + 0.34 * noise(vec2(q.x * 0.9 + 3.0, 1.0)) + 0.06 * noise(vec2(q.x * 5.0, 2.0));
    c += vec3(1.0, 0.72, 0.36) * exp(-dot(q - vec2(-0.45, EYE.y - 0.5), q - vec2(-0.45, EYE.y - 0.5)) * 1.8) * 0.5;
    float far2 = ridge + 0.2 + 0.14 * noise(vec2(q.x * 1.6 + 9.0, 4.0));
    c = mix(c, vec3(0.74, 0.47, 0.46), smoothstep(far2, far2 - 0.05, q.y) * 0.65);
    c = mix(c, vec3(0.3, 0.19, 0.26), smoothstep(ridge, ridge - 0.03, q.y));
    return c;
  }

  // Where the name hangs: beside one athlete; between the two bars, over their heads, when two stand side by side.
  vec2 nameAt() { return mix(vec2(1.08, 1.89), vec2(0.0, 2.615), uPair); }

  // Walls and roof, and what stands before them. The floor is drawn by the caller, which also looks at this in its polish.
  vec3 inside(vec3 o, vec3 d, float breath) {
    d += vec3(1e-5);
    float tx = ((d.x > 0.0 ? HALL.x : -HALL.x) - o.x) / d.x;
    float tz = ((d.z > 0.0 ? HALL.z : -HALL.z) - o.z) / d.z;
    float ty = d.y > 0.0 ? (HALL.y - o.y) / d.y : 1e5;
    float t = min(tx, min(ty, tz));
    vec3 p = o + d * t, col;
    vec3 warm = vec3(1.0, 0.7, 0.42);
    if (t == tz) {
      vec2 q = p.xy - EYE;
      float rr = length(q), aa = uPix * t * 1.5;
      vec3 plaster = vec3(0.135, 0.115, 0.115) * (0.82 + 0.36 * fbm(p.xy * 1.1));
      // Cast in panels, with the small holes a shutter leaves.
      vec2 panel = abs(fract(p.xy / vec2(2.15, 1.35) + vec2(0.5, 0.15)) - 0.5) * vec2(2.15, 1.35);
      plaster *= 1.0 - 0.45 * smoothstep(0.016, 0.0, min(vec2(2.15, 1.35).x * 0.5 - panel.x, vec2(2.15, 1.35).y * 0.5 - panel.y));
      plaster *= 0.45 + 0.55 * smoothstep(-0.2, 1.6, p.y);
      if (d.z < 0.0) {
        // Light spilling from the window over the wall.
        col = plaster + warm * exp(-max(0.0, rr - EYE_R) * 1.55) * (0.34 + 0.07 * breath) * (0.75 + 0.5 * fbm(p.xy * 1.1));
        vec3 q2 = o + d * (t + 0.5 / -d.z);
        float deep = length(q2.xy - EYE);
        vec3 through = deep < EYE_R ? dawn(q2.xy) : mix(vec3(1.0, 0.74, 0.5), vec3(0.5, 0.28, 0.2), clamp((deep - EYE_R) * 1.4, 0.0, 1.0)) * (0.55 + 0.45 * smoothstep(-1.0, 1.0, -q.y / EYE_R));
        col = mix(through, col, smoothstep(EYE_R - aa, EYE_R + aa, rr));
        // A thin edge of brass round it.
        col = mix(col, vec3(0.98, 0.8, 0.52), smoothstep(0.035 + aa, 0.035 - aa, abs(rr - EYE_R - 0.035)) * 0.9);
      } else col = plaster * 0.8;
    } else if (t == tx) {
      // Timber slats, a line of warm light between every few of them.
      float slat = fract(p.z / 0.17);
      float edge = smoothstep(0.0, 0.12, slat) * smoothstep(1.0, 0.8, slat);
      col = mix(vec3(0.05, 0.034, 0.028), vec3(0.23, 0.145, 0.095) * (0.75 + 0.5 * hash(vec2(floor(p.z / 0.17), 2.0))), edge);
      col *= 0.8 + 0.2 * noise(vec2(p.z * 30.0, p.y * 1.3));
      float strip = abs(fract(p.z / 3.2 + 0.5) - 0.5) * 3.2;
      float tall = smoothstep(0.1, 0.5, p.y) * smoothstep(HALL.y - 0.1, HALL.y - 0.9, p.y);
      col *= 0.55 + 1.1 * exp(-strip * 1.5) * tall + 0.5 * smoothstep(5.0, -9.0, p.z);
      col += warm * smoothstep(0.035, 0.012, strip) * tall * 0.95 + warm * exp(-strip * 5.5) * tall * 0.13;
      // Wall bars along the left.
      if (p.x < 0.0 && p.z > -6.6 && p.z < -2.4) {
        float bay = abs(fract((p.z + 6.6) / 1.4) - 0.5) * 1.4;
        float post = step(0.63, bay) * step(p.y, 2.75);
        float bar = step(abs(fract(p.y / 0.21) - 0.5) * 0.21, 0.026) * step(0.2, p.y) * step(p.y, 2.65);
        col = mix(col, vec3(0.52, 0.34, 0.2) * (0.5 + 0.6 * smoothstep(0.0, 3.0, p.y)), max(post, bar) * 0.95);
      }
    } else {
      col = vec3(0.07, 0.06, 0.06);
      // A ring of light overhead.
      float halo = abs(length(p.xz - vec2(0.0, -1.5)) - 2.1);
      col += warm * (smoothstep(0.06, 0.02, halo) + 0.2 * exp(-halo * 2.6));
    }

    // The rack, before the window: steel uprights and bars at three heights, dip handles, a pair of rings.
    float zb = t;
    vec3 L = normalize(vec3(-0.15, 0.3, -1.0)), steel = vec3(0.075, 0.07, 0.075), hot = vec3(1.0, 0.72, 0.46) * 0.95;
    if (d.z < 0.0 && abs((o + d * ((-5.4 - o.z) / d.z)).x) < 4.2) {
      rod(o, d, vec3(-1.75, 0.0, -6.5), vec3(-1.75, 2.95, -6.5), 0.045, L, steel, hot, col, zb);
      rod(o, d, vec3(1.75, 0.0, -6.5), vec3(1.75, 2.95, -6.5), 0.045, L, steel, hot, col, zb);
      rod(o, d, vec3(-1.75, 2.95, -6.5), vec3(1.75, 2.95, -6.5), 0.045, L, steel, hot, col, zb);
      for (int i = 0; i < 2; i++) {
        float x = i == 0 ? -1.75 : 1.75;
        rod(o, d, vec3(x, 2.95, -6.5), vec3(x, 2.95, -5.2), 0.04, L, steel, hot, col, zb);
        rod(o, d, vec3(x, 0.0, -5.2), vec3(x, 2.95, -5.2), 0.05, L, steel, hot, col, zb);
        float rx = i == 0 ? -1.32 : -0.72;
        rod(o, d, vec3(rx, 2.95, -5.9), vec3(rx + 0.02 * sin(uTime * 0.9 + rx), 1.95, -5.9), 0.012, L, vec3(0.2, 0.17, 0.14), hot * 0.4, col, zb);
        if (uPair < 0.5) rod(o, d, vec3(i == 0 ? 0.68 : 1.48, 2.28, -5.2), vec3(i == 0 ? 0.68 : 1.48, 2.06, -5.2), 0.009, L, steel, hot, col, zb);
      }
      rod(o, d, vec3(-1.75, 2.95, -5.2), vec3(1.75, 2.95, -5.2), 0.045, L, steel, hot, col, zb);
      rod(o, d, vec3(-1.75, 2.28, -5.2), vec3(1.75, 2.28, -5.2), 0.03, L, vec3(0.14, 0.13, 0.13), hot, col, zb);
      // The rings, wooden.
      float tr = (-5.9 - o.z) / d.z;
      if (tr > 0.0 && tr < zb) {
        vec2 r = (o + d * tr).xy;
        for (int i = 0; i < 2; i++) {
          float rx = i == 0 ? -1.32 : -0.72, x = rx + 0.02 * sin(uTime * 0.9 + rx);
          float ringd = abs(length(r - vec2(x, 1.83)) - 0.115);
          col = mix(col, vec3(0.5, 0.33, 0.19) * 0.8, 1.0 - smoothstep(0.02 - uPix * tr, 0.02 + uPix * tr, ringd));
        }
      }
      // Dip handles, out from the right-hand post, and a low bar on the left.
      rod(o, d, vec3(1.75, 1.2, -5.2), vec3(1.75, 1.2, -4.4), 0.028, L, steel, hot, col, zb);
      rod(o, d, vec3(2.35, 1.2, -5.2), vec3(2.35, 1.2, -4.4), 0.028, L, steel, hot, col, zb);
      rod(o, d, vec3(2.35, 0.0, -5.2), vec3(2.35, 1.2, -5.2), 0.04, L, steel, hot, col, zb);
      rod(o, d, vec3(-1.75, 1.0, -5.2), vec3(-3.0, 1.0, -5.2), 0.028, L, steel, hot, col, zb);
      rod(o, d, vec3(-3.0, 0.0, -5.2), vec3(-3.0, 1.0, -5.2), 0.04, L, steel, hot, col, zb);
      // The name, on a plate hung from the bar.
      float tp = (-5.16 - o.z) / d.z;
      if (tp > 0.0 && tp < zb + 0.2) {
        vec2 at = (o + d * tp).xy - nameAt();
        float plate = (1.0 - smoothstep(0.52 - uPix * tp, 0.52 + uPix * tp, abs(at.x))) * (1.0 - smoothstep(0.185 - uPix * tp, 0.185 + uPix * tp, abs(at.y)));
        vec4 name = wordmark(at + vec2(0.0, 0.008), 0.8);
        vec3 face = vec3(0.055, 0.048, 0.05) + warm * 0.03 * breath;
        face += warm * 0.24 * exp(-abs(at.y) * 9.0) * exp(-at.x * at.x * 2.4);
        col = mix(col, mix(face, name.rgb * (0.96 + 0.06 * breath), name.a), plate);
      }
    }
    return col;
  }
#endif

#if SCENE == 9
  // ── Aura outside ─────────────────────────────────────────────────────────
  const vec3 SUN = normalize(vec3(0.105, 0.05, -1.0));
  vec3 evening(vec3 d) {
    float el = asin(clamp(d.y, -1.0, 1.0));
    float toSun = max(0.0, dot(d, SUN));
    vec3 c = mix(vec3(1.0, 0.62, 0.36), vec3(0.8, 0.4, 0.42), smoothstep(0.0, 0.1, el));
    c = mix(c, vec3(0.4, 0.28, 0.5), smoothstep(0.06, 0.24, el));
    c = mix(c, vec3(0.13, 0.15, 0.34), smoothstep(0.18, 0.6, el));
    // Away from the sun the evening is further on.
    c = mix(c, mix(vec3(0.42, 0.3, 0.46), vec3(0.14, 0.17, 0.36), smoothstep(0.0, 0.3, el)), smoothstep(0.2, -0.7, dot(d, SUN)));
    c += vec3(1.0, 0.7, 0.36) * (pow(toSun, 60.0) * 0.4 + pow(toSun, 900.0) * 0.8);
    c = mix(c, vec3(1.3, 1.2, 0.98), smoothstep(0.99938, 0.99956, dot(d, SUN)));
    // Long thin cloud, lit from underneath.
    vec2 ring = normalize(d.xz + 1e-5);
    float streak = fbm(vec2(ring.x * 2.2 + el * 3.0 + uTime * 0.006, el * 26.0 + ring.y));
    float cloud = smoothstep(0.5, 0.74, streak) * smoothstep(0.015, 0.06, el) * smoothstep(0.5, 0.2, el);
    c = mix(c, mix(vec3(0.46, 0.24, 0.4), vec3(1.0, 0.6, 0.42), pow(toSun, 3.0)), cloud * 0.75);
    return c;
  }
#endif

#if SCENE == 10
  // ── The pit ──────────────────────────────────────────────────────────────
  // One row of the crowd: heads, shoulders, arms thrown up, boards held over them. Laid over what is behind.
  void row(vec3 o, vec3 d, float k, inout vec3 col) {
    float R = 9.9 + 1.25 * k, base = 0.98 + 0.66 * k;
    float t = cylinder(o, d, R);
    vec3 p = o + d * t;
    if (p.y < base - 0.2 || p.y > base + 1.5) return;
    float N = floor(6.28318 * R / 0.6);
    float u = (atan(p.x, -p.z) / 6.28318 + 0.5) * N;
    float id = mod(floor(u), N), x = (fract(u) - 0.5) * 0.6;
    float h1 = hash(vec2(id, k)), h2 = hash(vec2(id + 31.0, k)), h3 = hash(vec2(id + 77.0, k)), h4 = hash(vec2(id + 11.0, k + 5.0));
    float loud = step(0.42, h2);
    float y = p.y - base - loud * abs(sin(uTime * (1.6 + 1.6 * h3) + h1 * 6.28)) * 0.06;
    float px = uPix * t * 1.4, dim = pow(0.66, k) * 0.95;
    x -= (h1 - 0.5) * 0.12;
    vec3 cloth = h3 < 0.28 ? vec3(0.34, 0.1, 0.09) : h3 < 0.5 ? vec3(0.5, 0.45, 0.37) : h3 < 0.75 ? vec3(0.17, 0.17, 0.2) : vec3(0.29, 0.21, 0.15);
    vec3 skin = mix(vec3(0.64, 0.49, 0.39), vec3(0.42, 0.29, 0.22), step(0.6, h4));
    vec3 line = vec3(0.035, 0.028, 0.026);
    // Arms up.
    if (loud > 0.5) {
      float side = sign(x + 1e-4);
      vec2 a = vec2(0.16, 0.4), b = vec2(0.2 + 0.05 * h4, 0.94), q = vec2(abs(x), y);
      float s = clamp(dot(q - a, b - a) / dot(b - a, b - a), 0.0, 1.0);
      float arm = length(q - mix(a, b, s)) - 0.042;
      if (side > 0.0 || h4 > 0.35) { col = mix(col, line * dim, 1.0 - smoothstep(0.016, 0.016 + px, arm)); col = mix(col, skin * dim, 1.0 - smoothstep(0.0, px, arm)); }
    }
    float body = max(abs(x) - 0.2 + 0.35 * max(0.0, y - 0.28), y - 0.44);
    col = mix(col, line * dim, 1.0 - smoothstep(0.016, 0.016 + px, body));
    col = mix(col, cloth * dim * (0.7 + 0.3 * smoothstep(0.0, 0.4, y)), 1.0 - smoothstep(0.0, px, body));
    float head = length(vec2(x, (y - 0.56) * 0.86)) - 0.1;
    col = mix(col, line * dim, 1.0 - smoothstep(0.016, 0.016 + px, head));
    col = mix(col, skin * dim, 1.0 - smoothstep(0.0, px, head));
    float hair = max(head, 0.55 + 0.05 * h1 - y - 0.0);
    col = mix(col, vec3(0.06, 0.045, 0.04) * (0.4 + dim), 1.0 - smoothstep(0.0, px, hair));
    // Boards, red or bone, with a ring brushed on them.
    if (h4 > 0.6 && loud > 0.5) {
      float tilt = (h1 - 0.5) * 0.5 + 0.05 * sin(uTime * 1.3 + h2 * 6.28);
      vec2 q = vec2(x, y - 1.12); q = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * q;
      float card = max(abs(q.x) - 0.2, abs(q.y) - 0.16);
      vec3 face = h2 > 0.72 ? vec3(0.62, 0.13, 0.09) : vec3(0.72, 0.66, 0.55);
      vec3 mark = h2 > 0.72 ? vec3(0.8, 0.72, 0.6) : vec3(0.6, 0.12, 0.08);
      face = mix(face, mark, 1.0 - smoothstep(0.022, 0.022 + px, abs(length(q) - 0.085)));
      col = mix(col, line * dim, 1.0 - smoothstep(0.016, 0.016 + px, card));
      col = mix(col, face * dim, 1.0 - smoothstep(0.0, px, card));
    }
  }
#endif

#if SCENE == 11 || SCENE == 12
  // ── World ring ───────────────────────────────────────────────────────────
  const float DISC = 8.6;
  // The sky all round, above and below, laid out flat from straight underneath so that it has no seam.
  vec2 lay(vec3 d) { return d.xz / (1.06 + d.y); }
  vec3 nebula(vec3 d) {
    vec2 p = lay(d) * 1.9;
    vec2 w = vec2(fbm(p + vec2(uTime * 0.012, 3.0)), fbm(p * 1.1 + vec2(7.0, -uTime * 0.01)));
    float a = fbm(p * 1.5 + w * 2.6), b = fbm(p * 2.6 - w * 2.0 + 5.0);
    vec3 c = vec3(0.03, 0.028, 0.07);
    c = mix(c, vec3(0.3, 0.1, 0.42), smoothstep(0.38, 0.78, a) * 0.9);
    c = mix(c, vec3(0.05, 0.4, 0.46), smoothstep(0.34, 0.8, b) * 0.85);
    c += vec3(0.95, 0.4, 0.2) * pow(smoothstep(0.5, 0.86, a * 0.6 + w.x * 0.45), 2.0) * 0.55;
    c *= 0.55 + 0.75 * smoothstep(0.28, 0.7, w.y);
    vec2 sp = lay(d) * 95.0, cell = floor(sp);
    vec2 off = fract(sp) - 0.5 - (vec2(hash(cell + 1.0), hash(cell + 2.0)) - 0.5) * 0.7;
    c += vec3(1.0, 0.95, 0.88) * smoothstep(0.13, 0.0, length(off)) * step(0.93, hash(cell)) * (0.6 + 0.4 * sin(uTime * (0.8 + 2.0 * hash(cell + 3.0)) + hash(cell + 5.0) * 6.28));
    return c;
  }
  // How far a place on the disc is from the nearest inlaid line: the six circles of the Aura wheel, and the circle round them.
  float inlay(vec2 p) {
    float m = abs(length(p) - 5.6);
    for (int i = 0; i < 6; i++) { float a = float(i) * 1.0471976; m = min(m, abs(length(p - 2.8 * vec2(sin(a), -cos(a))) - 2.8)); }
    return m;
  }
#endif
`

/** What each signature place paints, in the shader's main. Everything common (ray, time, horizon) is worked out before it. */
export const SIGNATURE_MAIN = /* glsl */ `
#elif SCENE == 8
  o.xz = clamp(o.xz, -HALL.xz + 0.4, HALL.xz - 0.4);
  o.y = clamp(o.y, 0.05, HALL.y - 0.3);
  float breath = 0.5 + 0.5 * sin(uTime * 0.7);
  vec3 toSun = normalize(vec3(-0.03, 0.22, -1.0));
  float tFloor = d.y < 0.0 ? -o.y / d.y : 1e5;
  vec3 pf = o + d * tFloor;
  if (d.y < 0.0 && abs(pf.x) < HALL.x && abs(pf.z) < HALL.z) {
    // Polished stone: large slabs, the window's light lying across them, the hall mirrored in it.
    vec2 slab = abs(fract(pf.xz / vec2(1.6, 1.6)) - 0.5) * 1.6;
    float joint = smoothstep(0.794 - uPix * tFloor, 0.798, max(slab.x, slab.y));
    vec3 stone = vec3(0.1, 0.086, 0.085) * (0.8 + 0.4 * fbm(pf.xz * 1.7)) * (0.92 + 0.16 * hash(floor(pf.xz / 1.6)));
    stone *= 1.0 - 0.35 * joint;
    vec3 q = pf + toSun * ((-HALL.z - pf.z) / toSun.z);
    float soft = 0.06 + 0.03 * (pf.z + HALL.z);
    float patchy = 1.0 - smoothstep(EYE_R - soft, EYE_R + soft, length(q.xy - EYE));
    // The bars of the rack lie in it as shadow.
    vec3 s = pf + toSun * ((-5.2 - pf.z) / toSun.z);
    float bars = pf.z > -5.2 ? smoothstep(0.02, 0.09, min(abs(abs(s.x) - 1.75), min(abs(s.y - 2.28), abs(s.y - 2.95)))) : 1.0;
    if (pf.z > -5.2) bars *= 1.0 - 0.9 * step(abs(s.x - nameAt().x), 0.52) * step(abs(s.y - nameAt().y), 0.185);
    stone += vec3(1.0, 0.64, 0.38) * patchy * (0.1 + 0.9 * bars) * 0.34 * (0.85 + 0.3 * fbm(pf.xz * 1.7));
    float graze = pow(1.0 - clamp(-d.y, 0.0, 1.0), 3.0);
    vec3 seen = inside(pf + vec3(0.0, 0.002, 0.0), vec3(d.x, -d.y, d.z), breath);
    col = stone + seen * (0.1 + 0.42 * graze) * (1.0 - 0.5 * joint);
  } else col = inside(o, d, breath);
  // The light in the air, and dust in it.
  vec3 toEye = normalize(vec3(EYE.x, EYE.y, -HALL.z) - o);
  col += vec3(1.0, 0.66, 0.38) * pow(max(0.0, dot(d, toEye)), 18.0) * (0.1 + 0.02 * breath);
  col += vec3(1.0, 0.82, 0.6) * (specks(uv, 5.0, vec2(uTime * 0.018, uTime * 0.03), 0.055, 1.0) + specks(uv, 9.0, vec2(-uTime * 0.014, uTime * 0.026), 0.045, 5.0)) * 0.2;

#elif SCENE == 9
  o.y = max(o.y, 0.05);
  vec3 toSun = normalize(vec3(SUN.x, 0.2, SUN.z));
  float edge = -7.2;
  float tb = 1e5;
  // What is seen over the terrace only; the stones underfoot cover the rest.
  bool deck = down && g.z > edge && abs(g.x) < 9.5 && g.z < 14.0;
  if (!deck) {
  col = evening(d);
  // Headlands, one behind the other, paler the further off.
  for (int i = 0; i < 3; i++) {
    float k = float(i);
    float side = smoothstep(-0.25, 0.75, d.x + 0.12 * k - 0.1) ;
    float ridge = (0.012 + 0.05 * noise(ring * (2.2 + 1.3 * k) + 4.0 * k + 1.0) + 0.012 * noise(ring * (11.0 + 5.0 * k))) * (0.18 + 0.82 * side) - 0.006 * k;
    vec3 tone = mix(vec3(0.66, 0.4, 0.43), vec3(0.2, 0.14, 0.24), k / 2.0);
    col = mix(col, mix(tone, vec3(0.95, 0.56, 0.38), 0.4 * smoothstep(ridge, 0.0, el)), smoothstep(ridge, ridge - 0.003, el) * step(-0.002, el));
  }
  if (down) {
    // The sea, a long way below, and the sun's road on it.
    float ts = -(o.y + 16.0) / d.y;
    vec3 w = o + d * ts;
    float swell = noise(w.xz * vec2(0.1, 0.3) + vec2(0.0, uTime * 0.25)) + 0.6 * noise(w.xz * vec2(0.28, 0.8) - vec2(0.0, uTime * 0.4));
    vec3 n = normalize(vec3((noise(w.xz * vec2(0.22, 0.6) + uTime * 0.2) - 0.5) * 0.16, 1.0, (noise(w.xz * vec2(0.2, 0.7) - uTime * 0.24 + 8.0) - 0.5) * 0.2));
    vec3 r = reflect(d, n); r.y = abs(r.y);
    float graze = pow(1.0 - clamp(-d.y, 0.0, 1.0), 4.0);
    vec3 sea = mix(vec3(0.06, 0.09, 0.17), evening(normalize(r)), 0.2 + 0.6 * graze) * (0.82 + 0.14 * swell);
    float road = exp(-pow(wrap(atan(d.x, -d.z) - atan(SUN.x, -SUN.z)) * 7.0, 2.0));
    sea += vec3(1.0, 0.7, 0.4) * road * smoothstep(0.62, 0.95, noise(w.xz * vec2(0.35, 1.5) + vec2(0.0, uTime * 0.7))) * 0.75;
    col = mix(sea, vec3(0.94, 0.58, 0.42), smoothstep(150.0, 1500.0, ts) * 0.55);
  }
  }
  // The terrace: stone slabs up to a low wall, the last sun lying along them.
  if (deck) {
    tb = -o.y / d.y;
    vec2 slab = g.xz / vec2(1.5, 0.95); slab.x += 0.5 * mod(floor(slab.y), 2.0);
    vec2 f = abs(fract(slab) - 0.5) * vec2(1.5, 0.95);
    float joint = max(smoothstep(0.735, 0.742, f.x), smoothstep(0.46, 0.467, f.y)) * smoothstep(30.0, 6.0, away);
    vec3 stone = mix(vec3(0.34, 0.27, 0.26), vec3(0.46, 0.36, 0.32), hash(floor(slab))) * (0.78 + 0.4 * fbm(g.xz * 2.3));
    stone *= 1.0 - 0.5 * joint;
    // Moss and small grass in the joints, shadow of the wall at the far end, sheen towards the sun.
    stone = mix(stone, vec3(0.2, 0.22, 0.12), joint * step(0.55, noise(g.xz * 1.3)) * 0.8);
    float graze = pow(1.0 - clamp(-d.y, 0.0, 1.0), 3.0);
    stone += vec3(1.0, 0.56, 0.3) * graze * pow(max(0.0, dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(SUN.x, 0.0, SUN.z)))), 14.0) * 0.45;
    stone *= mix(0.45, 1.0, smoothstep(edge, edge + 3.0, g.z));
    col = stone;
  }
  // The low wall at the edge.
  vec3 nb;
  float tw = box(o, d, vec3(0.0, 0.2, edge - 0.2), vec3(9.5, 0.24, 0.2), 0.0, nb);
  if (tw > 0.0 && tw < tb) {
    tb = tw;
    vec3 p = o + d * tw;
    vec3 stone = vec3(0.3, 0.23, 0.23) * (0.8 + 0.4 * fbm(p.xy * 3.0 + p.z));
    col = stone * (nb.y > 0.5 ? 1.5 : 0.55) + vec3(1.0, 0.6, 0.36) * step(0.5, nb.y) * 0.25;
  }
  // A standing stone, with the name set into it in brass.
  float tm = box(o, d, vec3(-1.4, 0.98, -5.6), vec3(0.46, 1.0, 0.12), -0.14, nb);
  if (tm > 0.0 && tm < tb) {
    tb = tm;
    vec3 p = o + d * tm;
    vec3 stone = vec3(0.21, 0.165, 0.175) * (0.75 + 0.5 * fbm(p.xy * 2.6));
    col = stone * (0.75 + 0.25 * smoothstep(0.0, 2.0, p.y));
    if (abs(nb.z) > 0.5) {
      float cs = cos(-0.14), sn = sin(-0.14);
      vec2 at = vec2((mat2(cs, -sn, sn, cs) * (p.xz - vec2(-1.4, -5.6))).x, p.y - 1.5);
      vec4 name = wordmark(at, 0.68);
      col += vec3(1.0, 0.62, 0.3) * 0.16 * exp(-dot(at, at) * 7.0);
      col = mix(col, vec3(1.0, 0.8, 0.5) * (0.92 + 0.08 * sin(uTime * 0.7)), name.a);
    } else col += vec3(1.0, 0.56, 0.32) * max(0.0, dot(nb, toSun)) * 0.5;
  }
  // The rack: three bars at their own heights, and dip bars in front.
  {
    vec3 L = toSun, steel = vec3(0.07, 0.06, 0.075), hot = vec3(1.0, 0.62, 0.34) * 1.1;
    float zb = tb;
    rod(o, d, vec3(0.95, 0.0, -5.6), vec3(0.95, 2.5, -5.6), 0.05, L, steel, hot, col, zb);
    rod(o, d, vec3(2.45, 0.0, -5.6), vec3(2.45, 2.5, -5.6), 0.05, L, steel, hot, col, zb);
    rod(o, d, vec3(3.95, 0.0, -5.6), vec3(3.95, 2.15, -5.6), 0.05, L, steel, hot, col, zb);
    rod(o, d, vec3(0.95, 2.42, -5.6), vec3(2.45, 2.42, -5.6), 0.03, L, steel, hot, col, zb);
    rod(o, d, vec3(2.45, 2.08, -5.6), vec3(3.95, 2.08, -5.6), 0.03, L, steel, hot, col, zb);
    rod(o, d, vec3(0.95, 1.35, -5.6), vec3(2.45, 1.35, -5.6), 0.026, L, steel, hot, col, zb);
    for (int i = 0; i < 2; i++) {
      float z = i == 0 ? -4.5 : -5.05;
      rod(o, d, vec3(1.15, 1.15, z), vec3(2.35, 1.15, z), 0.028, L, steel, hot, col, zb);
      rod(o, d, vec3(1.25, 0.0, z), vec3(1.25, 1.15, z), 0.034, L, steel, hot, col, zb);
      rod(o, d, vec3(2.25, 0.0, z), vec3(2.25, 1.15, z), 0.034, L, steel, hot, col, zb);
    }
  }
  // Gulls, a long way off.
  for (int i = 0; i < 4; i++) {
    float k = float(i);
    vec2 q = vec2(wrap(atan(d.x, -d.z) - (mod(uTime * (0.008 + 0.002 * k) + 0.21 * k, 0.9) - 0.45)), el - 0.062 - 0.016 * k - 0.006 * sin(uTime * 0.5 + k * 2.0)) * 105.0;
    float flap = 0.28 + 0.2 * sin(uTime * 3.0 + k * 1.7);
    float wing = abs(q.y - flap * (abs(q.x) - 0.35 * q.x * q.x)) - 0.045;
    col = mix(col, vec3(0.3, 0.18, 0.25), 0.8 * (1.0 - smoothstep(0.0, 0.12, wing)) * step(abs(q.x), 0.75) * step(1e4, tb + 1e4 * step(9.0, tb)));
  }
  col += vec3(1.0, 0.8, 0.55) * (specks(uv, 5.0, vec2(uTime * 0.05, uTime * 0.012), 0.04, 2.0) + specks(uv, 9.0, vec2(uTime * 0.035, -uTime * 0.01), 0.035, 6.0)) * 0.3;

#elif SCENE == 10
  o = within(o, 8.0);
  o.y = max(o.y, 0.05);
  float tw = cylinder(o, d, 8.6);
  float tf = d.y < 0.0 ? -o.y / d.y : 1e5;
  vec3 p = o + d * tw;
  if (tf < tw) {
    // Sand, raked by feet, hard light in the middle of it.
    vec3 q = o + d * tf;
    float r = length(q.xz);
    float grain = fbm(q.xz * 1.6) * 0.6 + 0.4 * noise(q.xz * 11.0);
    vec3 sand = mix(vec3(0.34, 0.27, 0.19), vec3(0.62, 0.52, 0.39), grain);
    // Scuffs, drawn like strokes of a dry brush.
    float scuff = smoothstep(0.66, 0.8, noise(vec2(dot(q.xz, vec2(0.8, 0.6)) * 0.7, dot(q.xz, vec2(-0.6, 0.8)) * 5.0)));
    sand *= 1.0 - 0.22 * scuff * smoothstep(16.0, 4.0, tf);
    sand *= 0.3 + 0.85 * exp(-r * r * 0.03);
    sand *= 1.0 - 0.45 * smoothstep(7.4, 8.6, r);
    col = sand;
  } else if (p.y < 1.42) {
    // Planks, upright, held by two bands; a ring brushed on them every so often.
    float th = atan(p.x, -p.z);
    float u = th * 8.6;
    float N = floor(6.28318 * 8.6 / 0.42), pl = (th / 6.28318 + 0.5) * N, id = floor(pl);
    vec3 wood = mix(vec3(0.36, 0.23, 0.13), vec3(0.54, 0.37, 0.22), hash(vec2(id, 1.0)));
    wood *= 0.72 + 0.4 * noise(vec2(pl * 7.0, p.y * 1.4 + id * 3.0));
    float gap = abs(fract(pl) - 0.5);
    wood *= 1.0 - 0.8 * smoothstep(0.455, 0.49, gap);
    float bandY = min(abs(p.y - 0.28), abs(p.y - 1.14));
    wood = mix(wood, vec3(0.075, 0.066, 0.062), 1.0 - smoothstep(0.055, 0.065, bandY));
    float nail = length(vec2((fract(pl) - 0.5) * 0.42, bandY));
    wood = mix(wood, vec3(0.3, 0.26, 0.23), 1.0 - smoothstep(0.014, 0.02, nail));
    // The brush ring: thick where the brush was set down, thin where it left.
    float mk = mod(th, 6.28318 / 16.0) - 3.14159 / 16.0;
    vec2 q = vec2(mk * 8.6, p.y - 0.71);
    float a = atan(q.y, q.x) / 6.28318 + 0.5;
    float dry = noise(vec2(a * 34.0, length(q) * 40.0));
    float stroke = abs(length(q) - 0.3) - mix(0.02, 0.06, a) * (0.75 + 0.4 * noise(vec2(a * 9.0, 3.0)));
    wood = mix(wood, vec3(0.52, 0.09, 0.06), (1.0 - smoothstep(0.0, 0.012, stroke)) * step(0.06, a) * (a > 0.75 ? step(0.45 * (a - 0.75) * 4.0, dry) : 1.0) * 0.9);
    wood *= 0.55 + 0.45 * smoothstep(0.0, 0.5, p.y);
    col = wood * 0.95;
    col = mix(col, vec3(0.03, 0.024, 0.022), smoothstep(1.375, 1.39, p.y));
  } else {
    // The stands, going up into the dark; pillars; lamps.
    float t2 = cylinder(o, d, 17.5);
    vec3 s = o + d * t2;
    float th = atan(s.x, -s.z);
    float tier = floor(s.y / 0.62);
    float N = 150.0;
    vec2 seat = vec2(fract((th / 6.28318 + 0.5) * N + 0.5 * mod(tier, 2.0)) - 0.5, fract(s.y / 0.62) - 0.4);
    float who = hash(vec2(floor((th / 6.28318 + 0.5) * N + 0.5 * mod(tier, 2.0)), tier));
    float up = smoothstep(9.5, 2.5, s.y);
    col = vec3(0.062, 0.038, 0.034) * (0.5 + 0.8 * up);
    col = mix(col, mix(vec3(0.2, 0.1, 0.08), vec3(0.15, 0.13, 0.13), step(0.5, who)) * (0.35 + 0.8 * up), (1.0 - smoothstep(0.2, 0.3, length(seat * vec2(1.0, 1.15)))) * step(0.18, who));
    float pillar = abs(fract(th / 6.28318 * 14.0) - 0.5) / 14.0 * 6.28318 * 17.5;
    col = mix(col, vec3(0.17, 0.155, 0.15) * (0.4 + 0.6 * smoothstep(0.0, 0.9, pillar)) * (0.45 + 0.7 * up), 1.0 - smoothstep(0.62, 0.66, pillar));
    // Long cloths hanging from them, red.
    float hang = 1.0 - smoothstep(0.36, 0.39, pillar + 0.03 * sin(s.y * 2.0 + uTime * 0.7));
    col = mix(col, vec3(0.42, 0.07, 0.05) * (0.45 + 0.6 * up), hang * step(2.6, s.y) * step(s.y, 6.2));
    col = mix(col, vec3(0.72, 0.64, 0.52) * (0.45 + 0.6 * up), hang * (1.0 - smoothstep(0.05, 0.08, abs(length(vec2((fract(th / 6.28318 * 14.0) - 0.5) / 14.0 * 6.28318 * 17.5, s.y - 4.7)) - 0.22))));
    float lampAt = abs(fract(th / 6.28318 * 14.0 + 0.5) - 0.5) / 14.0 * 6.28318 * 17.5;
    float glow = length(vec2(lampAt, s.y - 7.4));
    col += vec3(1.0, 0.86, 0.62) * ((1.0 - smoothstep(0.24, 0.3, glow)) + 0.22 * exp(-glow * 0.9));
    // Dots in the dark parts, as a screen of ink.
    vec2 hp = mat2(0.866, -0.5, 0.5, 0.866) * gl_FragCoord.xy / max(3.0, uHigh / 210.0);
    float dots = length(fract(hp) - 0.5);
    col *= 1.0 - 0.4 * smoothstep(0.42, 0.3, dots) * smoothstep(0.34, 0.06, dot(col, vec3(0.333)));
    for (int k = 4; k >= 0; k--) row(o, d, float(k), col);
  }
  // Breath and dust hanging in the light.
  float smoke = fbm(uv * vec2(1.6, 1.0) + vec2(uTime * 0.03, -uTime * 0.05) + fbm(uv * 1.4 - uTime * 0.02));
  col = mix(col, vec3(0.72, 0.66, 0.58), smoothstep(0.52, 0.85, smoke) * 0.13);
  col += vec3(1.0, 0.86, 0.66) * (specks(uv, 6.0, vec2(uTime * 0.03, -uTime * 0.02), 0.04, 3.0) + specks(uv, 10.0, vec2(-uTime * 0.02, uTime * 0.02), 0.035, 8.0)) * 0.16;

#elif SCENE == 11 || SCENE == 12
  o = within(o, DISC - 0.3);
  o.y = max(o.y, 0.05);
  bool paper = SCENE == 12;
  vec3 sheet = vec3(0.914, 0.906, 0.886);
  vec3 sunAt = normalize(vec3(0.118, 0.112, -1.0));
  // The disc covers most of the picture; the sky is worked out only where it shows.
  bool onDisc = down && length(g.xz) < DISC;
  if (onDisc) col = sheet;
  else if (paper) {
    // The same sky in grey wash.
    vec2 q = lay(d) * 1.7;
    float w = fbm(q + vec2(uTime * 0.01, 0.0)), a = fbm(q * 1.5 + w * 2.2);
    col = mix(sheet, vec3(0.56, 0.56, 0.6), smoothstep(0.46, 0.86, a) * 0.55 * (0.4 + 0.6 * smoothstep(0.5, -0.1, el)));
    vec2 sp = lay(d) * 34.0, cell = floor(sp);
    col = mix(col, vec3(0.25, 0.25, 0.29), smoothstep(0.1, 0.05, length(fract(sp) - 0.5 - (vec2(hash(cell), hash(cell + 2.0)) - 0.5) * 0.6)) * step(0.9, hash(cell + 4.0)) * 0.6);
  } else col = nebula(d);
  // A world with a ring, its sun coming up behind it.
  if (!onDisc) {
    vec3 X = normalize(cross(vec3(0.0, 1.0, 0.0), sunAt)), Y = cross(sunAt, X);
    vec2 q = vec2(dot(d, X), dot(d, Y)) / max(0.05, dot(d, sunAt));
    q.x = -q.x;
    if (dot(d, sunAt) > 0.0) {
      float R = 0.062, r = length(q);
      vec2 lean = mat2(0.94, -0.34, 0.34, 0.94) * q;
      float halo = length(vec2(lean.x, lean.y * 4.2));
      float band = smoothstep(0.09, 0.093, halo) * smoothstep(0.134, 0.131, halo) * (0.55 + 0.45 * noise(vec2(halo * 260.0, 1.0)));
      float front = step(lean.y, 0.0);
      vec3 ringTone = paper ? vec3(0.3, 0.3, 0.34) : vec3(0.95, 0.66, 0.42);
      if (!paper) col += vec3(1.0, 0.56, 0.26) * exp(-length(q - vec2(0.036, 0.036)) * 13.0) * 0.6;
      col = mix(col, ringTone, band * (1.0 - front) * 0.7);
      float world = 1.0 - smoothstep(R - 0.001, R + 0.001, r);
      vec3 n = vec3(q / R, sqrt(max(0.0, 1.0 - r * r / (R * R))));
      float lit = smoothstep(-0.1, 0.75, dot(n, normalize(vec3(0.75, 0.62, -0.05))));
      float stripe = noise(vec2(lean.y * 100.0, lean.x * 9.0 + uTime * 0.02));
      vec3 face = paper ? mix(vec3(0.4, 0.4, 0.44), sheet, 0.25 + 0.75 * lit) : mix(vec3(0.05, 0.035, 0.09), mix(vec3(0.95, 0.5, 0.24), vec3(1.0, 0.82, 0.56), stripe), lit);
      col = mix(col, face, world);
      if (!paper) col += vec3(1.0, 0.8, 0.5) * exp(-pow((r - R) * 210.0, 2.0)) * smoothstep(-0.2, 0.9, dot(normalize(q + 1e-5), vec2(0.77, 0.64))) * 0.9;
      col = mix(col, ringTone, band * front * 0.85);
    }
  }
  // Rock adrift, near and far, lit along one side.
  if (!onDisc) for (int i = 0; i < 7; i++) {
    float k = float(i);
    float a = k * 0.8976 + 0.5 + 0.3 * hash(vec2(k, 1.0)), e = -0.1 + 0.3 * hash(vec2(k, 2.0)) + 0.008 * sin(uTime * 0.5 + k * 1.9);
    vec2 q = vec2(wrap(az - a) * cos(el), el - e) / (0.03 + 0.035 * hash(vec2(k, 3.0)));
    float lump = length(q * vec2(1.0, q.y > 0.0 ? 1.9 : 0.9)) - 0.75 - 0.35 * (noise(q * 2.3 + k * 7.0) - 0.5) - 0.12 * (noise(q * 8.0 + k) - 0.5);
    if (lump < 0.1) {
      vec3 rock = paper ? mix(vec3(0.5, 0.5, 0.53), sheet * 0.96, step(0.0, q.y) * 0.8) : mix(vec3(0.07, 0.055, 0.1), vec3(0.5, 0.33, 0.27), smoothstep(-0.1, 0.5, q.y + 0.3 * noise(q * 5.0)));
      if (paper) col = mix(col, vec3(0.16, 0.16, 0.19), 1.0 - smoothstep(0.05, 0.09, lump));
      col = mix(col, rock, 1.0 - smoothstep(0.0, 0.05, lump));
    }
  }
  float td = d.y < 0.0 ? -o.y / d.y : 1e5;
  float r = length(g.xz), aa = uPix * td;
  // Light coming up round the rim of the disc from underneath.
  if (d.y < 0.0) {
    float beyond = r - DISC;
    if (!paper) col += vec3(1.0, 0.5, 0.16) * exp(-max(0.0, beyond) * 1.1) * 0.75 * (0.85 + 0.15 * sin(uTime * 1.1));
    if (r < DISC) {
      float th = atan(g.x, -g.z);
      // Six bands of cut stone, each with its own number of blocks, two tones to a band.
      float bandN = floor(r / 1.43), blocks = 6.0 + 6.0 * bandN;
      float bl = (th / 6.28318 + 0.5) * blocks + 0.5 * mod(bandN, 2.0);
      float tone = hash(vec2(mod(floor(bl), blocks), bandN));
      float alt = mod(floor(bl) + bandN, 2.0);
      vec3 stone = mix(vec3(0.15, 0.15, 0.2), vec3(0.4, 0.34, 0.32), alt * 0.75 + 0.25 * tone);
      if (mod(bandN, 3.0) == 1.0) stone = mix(vec3(0.2, 0.13, 0.13), vec3(0.42, 0.27, 0.2), alt * 0.7 + 0.3 * tone);
      stone *= 0.72 + 0.5 * fbm(g.xz * 1.9);
      float jr = abs(fract(r / 1.43 + 0.5) - 0.5) * 1.43, jt = abs(fract(bl + 0.5) - 0.5) / blocks * 6.28318 * r;
      float joint = 1.0 - smoothstep(0.012, 0.026 + aa, min(jr, jt));
      float line = inlay(g.xz);
      // Fading towards the camera: a screen's controls lie over that part of the floor.
      float near = 1.0 - 0.85 * smoothstep(0.9, 2.9, g.z);
      float gold = (1.0 - smoothstep(0.03, 0.034 + aa * 1.5, line)) * near;
      if (paper) {
        stone = mix(sheet, vec3(0.8, 0.79, 0.78), alt * 0.6 + 0.25 * fbm(g.xz * 1.2));
        stone = mix(stone, vec3(0.36, 0.36, 0.4), joint * 0.6);
        stone = mix(stone, vec3(0.86, 0.3, 0.17), gold * 0.85);
        stone = mix(stone, vec3(0.1, 0.1, 0.12), smoothstep(DISC - 0.1 - aa, DISC - 0.07, r));
        // A washed edge, so the subject stands on clean paper.
        col = mix(stone, sheet, 0.35 * smoothstep(1.2, 0.2, r));
      } else {
        stone *= 1.0 - 0.7 * joint;
        stone *= 0.62 + 0.38 * smoothstep(0.0, 7.0, r) + 0.3 * exp(-r * r * 0.12);
        float pulse = 0.6 + 0.4 * sin(uTime * 0.9 - r * 0.8);
        stone = mix(stone, vec3(1.0, 0.66, 0.28) * (0.65 + 0.4 * pulse), gold);
        stone += vec3(1.0, 0.45, 0.12) * exp(-line * 9.0) * 0.16 * pulse * near;
        stone += vec3(1.0, 0.55, 0.2) * (smoothstep(DISC - 0.16, DISC - 0.05, r) * 0.9 + 0.25 * exp(-(DISC - r) * 1.6));
        col = stone;
      }
    }
  }
  // Standing stones off the rim, floating, a line of light down each.
  if (el > -0.2) for (int i = 0; i < 10; i++) {
    // In pairs, like gates, one before the subject and four more round the rim.
    float k = float(i), a = floor(k * 0.5) * 1.2566371 + (mod(k, 2.0) * 2.0 - 1.0) * 0.215;
    float tall = 1.0 + 0.75 * hash(vec2(floor(k * 0.5), 4.0)) + 0.12 * hash(vec2(k, 8.0));
    vec3 c = vec3(sin(a) * 10.2, tall - 0.2 + 0.1 * sin(uTime * 0.6 + k * 2.1), -cos(a) * 10.2), nb;
    float t = box(o, d, c, vec3(0.4 + 0.12 * hash(vec2(k, 5.0)), tall, 0.22), -a + 0.2 * (hash(vec2(k, 6.0)) - 0.5), nb);
    if (t > 0.0) {
      vec3 p = o + d * t;
      float seam = abs((p.x - c.x) * cos(a) + (p.z - c.z) * sin(a));
      float grain = fbm(vec2(seam * 4.0 + k, p.y * 2.0));
      if (paper) { col = mix(vec3(0.34, 0.34, 0.38), vec3(0.74, 0.73, 0.72), grain * 0.7 + 0.35 * smoothstep(0.0, 4.0, p.y)); col = mix(col, sheet, 0.5 * smoothstep(1.0, -0.4, p.y)); }
      else {
        col = mix(vec3(0.09, 0.075, 0.12), vec3(0.3, 0.23, 0.22), grain) * (0.55 + 0.5 * max(0.0, dot(nb, sunAt)));
        col += vec3(1.0, 0.5, 0.18) * 0.35 * smoothstep(1.4, -0.4, p.y - c.y + tall);
        col += vec3(1.0, 0.62, 0.24) * ((1.0 - smoothstep(0.012, 0.03, seam)) * 0.8 + 0.1 * exp(-seam * 9.0)) * step(abs(p.y - c.y), tall * 0.72) * (0.7 + 0.3 * sin(uTime * 1.2 + k));
      }
    }
  }
  if (paper) col = mix(col, vec3(0.89, 0.31, 0.18), specks(uv, 4.0, vec2(uTime * 0.02, uTime * 0.06), 0.032, 6.0) * 0.8);
  else col += vec3(1.0, 0.64, 0.26) * (specks(uv, 6.0, vec2(sin(uTime * 0.3) * 0.08, -uTime * 0.09), 0.032, 4.0) + specks(uv, 11.0, vec2(0.0, -uTime * 0.15), 0.028, 9.0)) * 0.5;
`
