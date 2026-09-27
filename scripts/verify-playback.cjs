// Verification only: never imported by the production.
const { chromium } = require("../tools/node_modules/playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ignoreDefaultArgs: ["--mute-audio"],
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  const report = {
    startedAt: new Date().toISOString(),
    url: "http://localhost:4173",
    errors: [],
    warnings: [],
    samples: [],
  };
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") report.errors.push(m.text());
    if (m.type() === "warning" && !report.warnings.includes(m.text()))
      report.warnings.push(m.text());
  });
  await page.goto(report.url);
  await page.locator("#start").click();
  await page.waitForFunction(
    () =>
      window.DemoEngine?.Effect.loading === false &&
      new DemoEngine.Timer().getTime() > 0,
    null,
    { timeout: 60000 },
  );
  report.initial = await page.evaluate(() => {
    const timer = new DemoEngine.Timer(),
      a = timer.music.audioFile.audio;
    window.__analyser = a.context.createAnalyser();
    a.gain.connect(window.__analyser);
    window.__frames = [];
    window.__lastFrame = performance.now();
    window.__lastDemoTime = -1;
    const renderer = DemoEngine.getRenderer();
    const oldRender = renderer.render.bind(renderer);
    renderer.render = function (...args) {
      const t = performance.now();
      const demoTime = timer.getTime();
      if (demoTime !== window.__lastDemoTime) {
        window.__frames.push(t - window.__lastFrame);
        window.__lastFrame = t;
        window.__lastDemoTime = demoTime;
      }
      return oldRender(...args);
    };
    return {
      duration: timer.getEndTime() / 1000,
      audioState: a.context.state,
      playing: a.isPlaying,
      loop: a.loop,
      volume: a.getVolume(),
      fullscreen: !!document.fullscreenElement,
      rate: a.playbackRate,
    };
  });
  console.log("START", JSON.stringify(report.initial));
  const wallStart = Date.now();
  let ix = 0;
  while (Date.now() - wallStart < 140000) {
    await page.waitForTimeout(2000);
    const sample = await page.evaluate(() => {
      let t = new DemoEngine.Timer(),
        a = t.music.audioFile.audio;
      let data = new Float32Array(__analyser.fftSize);
      __analyser.getFloatTimeDomainData(data);
      let rms = Math.sqrt(data.reduce((s, x) => s + x * x, 0) / data.length);
      return {
        time: t.getTime() / 1000,
        playing: !!a?.isPlaying,
        audioState: a?.context.state,
        rms,
        canvasVisible: document.getElementById("canvas")?.style.display,
      };
    });
    report.samples.push(sample);
    console.log(JSON.stringify(sample));
    if (sample.time > 0 && ix++ % 4 === 0)
      await page.screenshot({
        path: `verification/play-${Math.round(sample.time)}.png`,
      });
    if (sample.time === 0 && !sample.playing) {
      report.finished = true;
      break;
    }
  }
  report.wallSeconds = (Date.now() - wallStart) / 1000;
  report.frames = await page.evaluate(() => {
    let a = __frames
      .filter((x) => x < 1000)
      .slice(3)
      .sort((a, b) => a - b);
    return {
      count: a.length,
      medianMs: a[Math.floor(a.length * 0.5)],
      p95Ms: a[Math.floor(a.length * 0.95)],
    };
  });
  fs.writeFileSync(
    "verification/playthrough.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    "DONE",
    JSON.stringify({
      finished: report.finished,
      errors: report.errors,
      frames: report.frames,
    }),
  );
  await browser.close();
  if (!report.finished || report.errors.length || report.initial.audioState !== "running" || !report.initial.fullscreen) process.exitCode = 1;
})();
