// SEISOMAPAIKKA. Every animation below is scheduled and drawn by JML Engine.
// No private animation loop, renderer, audio player or video texture.
includeFile("envelope.js");
const settings = new Settings();
settings.engine.tool = false;
settings.tool.server.enabled = false;
settings.engine.preload = true;
settings.engine.preloadSteps = 30;
settings.engine.enabledLogLevels = ["info", "warn", "error"];
settings.demo.music.musicFile = "music.mp3";
settings.demo.music.spectogramFile = undefined;
settings.demo.sync.beatsPerMinute = 116;
settings.demo.duration = undefined; // JML uses the decoded, complete track duration.
settings.demo.renderer.antialias = true;
settings.demo.renderer.sortObjects = true;
settings.demo.screen.width = 1920;
settings.demo.screen.height = 1080;
settings.demo.model.shape.material.type = "Phong";
settings.demo.fbo.quality = 0.85;
window.SEISOMA = {
  beat: 60 / 116,
  cuts: [
    0, 16.551724, 33.103448, 49.655172, 66.206897, 82.758621, 99.310345,
    115.862069,
  ],
  title: "SEISOMAPAIKKA",
};
const B = 60 / 116,
  TAU = Math.PI * 2;
const now = () => getGlobalTimeFromStart();
const loc = () => getSceneTimeFromStart();
const sat = (x) => Math.max(0, Math.min(1, x));
const env = (band) => {
  let t = now() * 50,
    i = Math.floor(t),
    a = window.SOUND_ENVELOPE || [];
  return a[i]
    ? a[i][band] * (1 - t + i) + (a[i + 1] || a[i])[band] * (t - i)
    : 0;
};
const kick = () => env(0),
  snare = () => env(1);
const pulse = () => Math.exp(-((((now() / B) % 1) + 1) % 1) * 10);
const rgb = (r, g, b) => ({ r, g, b });
const orange = rgb(1, 0.19, 0.045),
  cream = rgb(0.82, 0.86, 0.74),
  teal = rgb(0.08, 0.55, 0.55);
Demo.prototype.init = function () {
  const L = this.loader;
  const overlays = [];
  let sceneIndex = -1;
  const add = (a) => L.addAnimation(a);
  const box = (id, w, h, d, pos, col, extra = {}) =>
    add({
      id,
      object: null,
      shape: { type: "CUBE", width: w, height: h, depth: d },
      position: pos,
      color: col,
      material: { type: "Phong", shininess: 60, transparent: false },
      ...extra,
    });
  const chair = (id, pos, scale = 1, color = orange, extra = {}) =>
    add({
      id,
      object: "chair.obj",
      position: pos,
      scale: { uniform3d: scale },
      color,
      material: { type: "Phong", shininess: 80, transparent: false },
      ...(extra.instancer
        ? {
            shader: {
              vertexShaderPrefix:
                "attribute vec4 instanceVertexColor;\nvarying vec4 seatTint;",
              vertexShaderSuffix: "seatTint=instanceVertexColor;",
              fragmentShaderPrefix: "varying vec4 seatTint;",
              fragmentShaderSuffix: "gl_FragColor.rgb*=seatTint.rgb;",
            },
          }
        : {}),
      ...extra,
    });
  const type = (name, start, duration, extra = {}) => {
    const at = sceneIndex * 32 * B + start;
    overlays.push({
      start: at,
      duration,
      layer: 90,
      material: { depthTest: false, depthWrite: false, transparent: true },
      image: "type/" + name + ".png",
      color: {
        r: 1,
        g: 1,
        b: 1,
        a: () =>
          sat((now() - at) / 0.18) *
          sat((at + duration - now()) / 0.2) *
          sat((new DemoEngine.Timer().getEndTime() / 1000 - now()) / 1.4),
      },
      ...extra,
    });
  };
  const bg = (mode) =>
    add({
      layer: 0,
      material: { depthTest: false, depthWrite: false, transparent: false },
      image: "_embedded/defaultWhite.png",
      shader: {
        name: "world.fs",
        variable: [
          { name: "mode", value: [mode] },
          { name: "kick", value: [kick] },
          { name: "snare", value: [snare] },
          { name: "localTime", value: [loc] },
        ],
      },
    });
  const camera = (
    position,
    lookAt = { x: 0, y: 1, z: 0 },
    fov = 49,
    up = { x: 0, y: 1, z: 0 },
  ) =>
    add({
      layer: 1,
      camera: "camera",
      position,
      lookAt,
      up,
      perspective: { fov, near: 0.1, far: 180, aspect: 16 / 9 },
    });
  const light = () => {
    add({
      light: { type: "Ambient", properties: { intensity: 0.65 } },
      color: rgb(0.6, 0.74, 0.8),
    });
    add({
      light: { type: "Directional", properties: { intensity: 1.8 } },
      position: { x: 5, y: 9, z: 7 },
      color: rgb(1, 0.85, 0.64),
    });
    add({
      light: { type: "Directional", properties: { intensity: 1.2 } },
      position: { x: -7, y: 3, z: -5 },
      color: rgb(0.18, 0.8, 1),
    });
  };
  const floor = () =>
    add({
      layer: 2,
      object: null,
      shape: { type: "PLANE", width: 100, height: 100 },
      material: { transparent: false },
      angle: { degreesX: -90 },
      position: { y: -0.035 },
      shader: {
        name: "floor.fs",
        variable: [
          { name: "kick", value: [kick] },
          { name: "phase", value: [loc] },
        ],
      },
    });
  const ring = (r, y, color, extra = {}) =>
    add({
      layer: 5,
      object: null,
      shape: {
        type: "RING",
        innerRadius: r - 0.035,
        outerRadius: r + 0.035,
        thetaSegments: 128,
      },
      angle: { degreesX: -90 },
      position: { y },
      color,
      material: { type: "Basic", side: "DoubleSide" },
      ...extra,
    });
  const scene = (name, mode) => {
    sceneIndex++;
    L.setScene(name);
    bg(mode);
    light();
  };
  // 1. The modest original promise. Empty chairs extend beyond the room.
  scene("odotushuone", 0);
  camera(
    {
      x: () => 3.7 + Math.sin(loc() * 0.15) * 0.5,
      y: () => 2.4 + loc() * 0.025,
      z: () => 7.6 - loc() * 0.07,
    },
    { x: -1.25, y: 1.0, z: 0 },
    46,
  );
  floor();
  chair("theChair", { x: 1.05, y: 0, z: 0 }, 1.25, orange, {
    angle: { degreesY: () => -18 + Math.sin(loc() * 0.15) * 5 },
  });
  chair("waitingChairs", {}, 1, teal, {
    instancer: {
      count: 22,
      runInstanceFunction: (p) => {
        let i = p.index;
        p.object.position.set(
          (i % 2 ? 1 : -1) * 7,
          0,
          -Math.floor(i / 2) * 3.2,
        );
        p.angle.degreesY = i % 2 ? -1.57 : 1.57;
      },
    },
  });
  // Fluorescent ceiling fixtures and numbered service hatches recede into darkness.
  for (let i = 0; i < 8; i++) {
    box("lamp" + i, 5, 0.07, 0.24, { x: 0, y: 5.2, z: -i * 4 }, cream, {
      material: { type: "Basic" },
    });
    box(
      "hatch" + i,
      1.8,
      2.8,
      0.16,
      { x: -9, y: 1.4, z: -i * 4 },
      rgb(0.045, 0.09, 0.1),
    );
  }
  type("intro", 0.4, 7.3);
  type("title", 16 * B, 16 * B, {
    position: [{ x: -0.015 }, { duration: 4 * B, x: 0 }],
    scale: [{ uniform2d: 1.05 }, { duration: 4 * B, uniform2d: 1 }],
  });
  // 2. Capacity is produced, never delivered. An endless, beat-stepped conveyor.
  scene("tuotanto", 1);
  camera(
    {
      x: () => 6.5 + Math.sin(loc() * 0.18) * 2,
      y: () => 4.3 + Math.sin(loc() * 0.27),
      z: () => 8.0 - Math.sin(loc() * 0.2) * 2,
    },
    { x: 0, y: 0.9, z: -3 },
    54,
  );
  floor();
  box("belt", 7, 0.25, 100, { x: 0, y: 0.1, z: -25 }, rgb(0.018, 0.026, 0.028));
  chair("production", {}, 1, cream, {
    instancer: {
      count: 45,
      runInstanceFunction: (p) => {
        const i = p.index,
          t = loc();
        p.object.position.set(
          ((i % 3) - 1) * 2.05,
          0.22 + (i % 3 === 1 ? 0.12 * pulse() : 0),
          5 - ((Math.floor(i / 3) * 3.1 + (t * 3.1) / B / 2) % 46.5),
        );
        p.angle.degreesY = (Math.floor(t / (B * 4)) % 2) * Math.PI;
        p.color.r = i % 3 === 1 ? 1 : 0.21;
        p.color.g = i % 3 === 1 ? 0.23 : 0.6;
        p.color.b = i % 3 === 1 ? 0.045 : 0.6;
      },
    },
  });
  for (let x of [-4.2, 4.2])
    box("rail" + x, 0.06, 0.09, 100, { x, y: 1.8, z: -25 }, orange, {
      material: { type: "Basic" },
    });
  type("assembly", 0, 7 * B);
  type("capacity", 16 * B, 7 * B);
  // 3. A meeting that contains only office furniture. Rotation becomes hierarchy.
  scene("valtuusto", 2);
  camera(
    {
      x: () => Math.sin(loc() * 0.16) * 13,
      y: () => 10 + Math.sin(loc() * 0.2) * 3,
      z: () => Math.cos(loc() * 0.16) * 13,
    },
    { x: 0, y: 1.7, z: 0 },
    52,
    { x: () => Math.sin(loc() * 0.12) * 0.1, y: 1, z: 0 },
  );
  floor();
  for (let r of [3.7, 6.4, 9.1, 12]) ring(r, 0.03, teal);
  chair(
    "chairman",
    { x: 0, y: () => 1.1 + 0.13 * Math.sin((now() / B) * Math.PI), z: 0 },
    2.15,
    orange,
    { angle: { degreesY: () => loc() * 0.24 } },
  );
  box("plinth", 3.6, 1, 3.6, { x: 0, y: 0.48, z: 0 }, rgb(0.04, 0.09, 0.1));
  chair("board", {}, 1, cream, {
    instancer: {
      count: 48,
      runInstanceFunction: (p) => {
        const i = p.index;
        let row = Math.floor(i / 16),
          a = ((i % 16) / 16) * TAU + loc() * (row % 2 ? -0.07 : 0.07),
          r = 5 + row * 2.3;
        p.object.position.set(Math.sin(a) * r, 0.18 * pulse(), Math.cos(a) * r);
        p.angle.degreesY = a + Math.PI;
      },
    },
  });
  type("premium", 0, 8 * B);
  type("council", 16 * B, 8 * B);
  // 4. The queue is a physical thing: hundreds of printed tickets through space.
  scene("jono", 3);
  camera(
    {
      x: () => Math.sin(loc() * 0.3) * 0.7,
      y: () => Math.cos(loc() * 0.2) * 0.6,
      z: 8,
    },
    { x: 0, y: 0, z: -30 },
    65,
    { x: () => Math.sin(loc() * 0.13) * 0.25, y: 1, z: 0 },
  );
  add({
    layer: 4,
    image: "ticket.png",
    perspective: "3d",
    material: { side: "DoubleSide", transparent: true },
    instancer: {
      count: 180,
      runInstanceFunction: (p) => {
        const i = p.index,
          t = loc(),
          z = 8 - ((i * 0.73 + t * 7.5) % 100),
          a = i * 2.399 + t * 0.16,
          r = 4 + 1.1 * Math.sin(i * 0.7 + t * 0.4);
        p.object.position.set(Math.sin(a) * r, Math.cos(a) * r, z);
        p.object.scale.set(1.6, 1.6, 1.6);
        p.angle.degreesX = Math.sin(i) * 0.2;
        p.angle.degreesY = Math.cos(i) * 0.35;
        p.angle.degreesZ = a * 0.15 + Math.sin(t + i) * 0.12;
      },
    },
  });
  type("queue", 0, 32 * B);
  overlays.push({
    start: 96 * B,
    duration: 32 * B,
    layer: 70,
    image: "_embedded/defaultWhite.png",
    scale: { x: 0.66, y: 0.24 },
    color: { r: 0.012, g: 0.025, b: 0.03, a: 0.94 },
    material: { depthTest: false, depthWrite: false, transparent: true },
  });
  // Each digit is an engine-loaded image with engine visibility, no DOM counter.
  for (let slot = 0; slot < 6; slot++)
    for (let digit = 0; digit < 10; digit++)
      overlays.push({
        start: 96 * B,
        duration: 32 * B,
        layer: 80,
        material: { depthTest: false, depthWrite: false, transparent: true },
        image: "type/digit" + digit + ".png",
        scale: { uniform2d: 1.4 },
        position: { x: (slot - 2.5) * 0.095, y: 0 },
        visible: () => {
          const count = Math.min(
            999999,
            Math.floor(Math.pow(1 + (now() - 96 * B) * 4.1, 3.0)),
          );
          return Math.floor(count / Math.pow(10, 5 - slot)) % 10 === digit;
        },
      });
  // 5. Solemn levitation becomes a furniture ballet.
  scene("nousu", 4);
  camera(
    {
      x: () => Math.sin(loc() * 0.27) * 5.5,
      y: () => 2.5 + Math.sin(loc() * 0.3) * 1.1,
      z: () => Math.cos(loc() * 0.27) * 5.5,
    },
    { x: 0, y: 1.5, z: 0 },
    52,
    { x: () => Math.sin(loc() * 0.21) * 0.24, y: 1, z: 0 },
  );
  chair(
    "ascension",
    { x: 0, y: () => 0.25 + Math.sin(loc() * 0.7) * 0.2, z: 0 },
    1.25,
    orange,
    {
      angle: {
        degreesY: () => loc() * 0.5,
        degreesZ: () => Math.sin(loc() * 1.4) * 14,
        degreesX: () => Math.sin(loc() * 0.7) * 9,
      },
    },
  );
  for (let r of [2, 2.3, 3.8])
    ring(r, 0, orange, {
      position: { y: () => 0.3 + Math.sin(loc() * 0.5 + r) * 0.3 },
      angle: {
        degreesX: () => 65 + Math.sin(loc() * 0.2 + r) * 25,
        degreesY: () => loc() * 9 + r * 20,
      },
    });
  type("standing", 0, 8 * B);
  // Chairs burst outward at the second phrase; deterministic, seekable trajectories.
  chair("orbiters", {}, 0.6, cream, {
    start: 8 * B,
    instancer: {
      count: 30,
      runInstanceFunction: (p) => {
        let t = Math.max(0, loc() - 8 * B),
          a = (p.index / 30) * TAU + t * 0.3,
          r = 2.8 + Math.sin(p.index * 3.1) * 0.4;
        p.object.position.set(
          Math.cos(a) * r,
          1.3 + Math.sin(a * 3 + t) * 1.5,
          Math.sin(a) * r,
        );
        p.object.scale.setScalar(sat(t / 2));
        p.angle.degreesY = -a;
        p.angle.degreesZ = Math.sin((now() / B) * Math.PI + p.index) * 0.3;
      },
    },
  });
  // 6. No humans are admitted to the dance floor.
  scene("tanssi", 5);
  camera(
    {
      x: () => Math.sin(loc() * 0.13) * 11,
      y: () => 8 + Math.sin(loc() * 0.21) * 3,
      z: () => 15 - Math.sin(loc() * 0.2) * 3,
    },
    { x: 0, y: 1, z: 0 },
    56,
    { x: () => Math.sin(loc() * 0.3) * 0.1, y: 1, z: 0 },
  );
  floor();
  chair("dancers", {}, 1, cream, {
    instancer: {
      count: 121,
      runInstanceFunction: (p) => {
        const i = p.index,
          t = loc(),
          x = (i % 11) - 5,
          z = Math.floor(i / 11) - 5,
          phase = (now() / B) * Math.PI + Math.hypot(x, z) * 0.75;
        const leap = Math.max(0, Math.sin(phase));
        p.object.position.set(x * 2, leap * 0.8, z * 2);
        p.object.scale.set(1, 1 - leap * 0.08, 1);
        p.angle.degreesY =
          Math.sin(t * 0.8 + z * 0.3) * 0.5 +
          (Math.floor(t / (B * 4)) * Math.PI) / 2;
        p.angle.degreesZ = Math.sin(phase) * 0.15;
        p.color.r = i % 3 ? 0.15 : 1;
        p.color.g = i % 3 ? 0.7 : 0.24;
        p.color.b = i % 3 ? 0.66 : 0.035;
      },
    },
  });
  type("revolt", 0, 8 * B);
  // 7. The room becomes a planet. The punchline is exclusion, not scarcity.
  scene("kaikille", 2);
  camera(
    {
      x: () => Math.sin(loc() * 0.13) * 18,
      y: () => 5 + Math.sin(loc() * 0.2) * 3,
      z: () => Math.cos(loc() * 0.13) * 18,
    },
    { x: 0, y: 0, z: 0 },
    52,
    { x: () => Math.sin(loc() * 0.12) * 0.2, y: 1, z: 0 },
  );
  chair("chairSphere", {}, 0.65, cream, {
    instancer: {
      count: 180,
      runInstanceFunction: (p) => {
        const i = p.index,
          t = loc(),
          v = (i + 0.5) / 180,
          y = 1 - 2 * v,
          r = Math.sqrt(1 - y * y),
          a = i * 2.399963 + t * 0.18,
          R = 7.5 + kick() * 0.1;
        p.object.position.set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
        p.angle.degreesY = -a + Math.PI / 2;
        p.angle.degreesZ = Math.acos(y) - Math.PI / 2;
        p.color.r = i % 7 ? 0.15 : 1;
        p.color.g = i % 7 ? 0.65 : 0.25;
        p.color.b = i % 7 ? 0.61 : 0.05;
      },
    },
  });
  chair("throne", { y: -2, z: 0 }, 2, orange, {
    angle: { degreesY: () => loc() * 0.5 },
  });
  type("everyone", 0, 8 * B);
  type("except", 16 * B, 6 * B, {
    scale: [{ uniform2d: 1.15 }, { duration: B, uniform2d: 1 }],
  });
  // 8. Back at the beginning. The only change: your number has already passed.
  scene("suljettu", 0);
  camera(
    { x: () => 3 + loc() * 0.17, y: 2.6, z: () => 7 + loc() * 0.2 },
    { x: 0, y: 1, z: 0 },
    48,
  );
  floor();
  chair("lastChair", { x: 0, y: 0, z: 0 }, 1, orange, {
    angle: { degreesY: () => -loc() * 4 },
  });
  type("end", 0.15, 20);
  // Main timeline: scene-local clocks, FBOs and final compositing all belong to JML.
  L.setScene("main");
  overlays.forEach(add);
  const names = [
    "odotushuone",
    "tuotanto",
    "valtuusto",
    "jono",
    "nousu",
    "tanssi",
    "kaikille",
    "suljettu",
  ];
  names.forEach((name, i) => {
    const start = i * 32 * B,
      duration = i === 7 ? 30 : 32 * B;
    add({
      start,
      duration,
      layer: 1,
      scene: { name, fbo: { name: name + "Fbo" } },
    });
    add({
      start,
      duration,
      layer: 2,
      image: name + "Fbo.color.fbo",
      shader: {
        name: "post.fs",
        variable: [
          { name: "kick", value: [kick] },
          { name: "snare", value: [snare] },
          {
            name: "damage",
            value: [
              () => (i === 3 ? 0.22 : now() - start > duration - B ? 0.28 : 0),
            ],
          },
          {
            name: "fade",
            value: [
              () =>
                sat(now() / 0.5) *
                sat((new DemoEngine.Timer().getEndTime() / 1000 - now()) / 1.4),
            ],
          },
        ],
      },
    });
  });
};
