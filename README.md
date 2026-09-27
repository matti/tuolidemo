# SEISOMAPAIKKA

**A Jumalauta demo. Standing room.**

Kaikille on tilaa. Kaikille ei ole tuolia.

An ordinary waiting-room chair becomes an industrial product, a council, a ballet and a planet. The furniture receives every privilege. You keep standing.

## Run

Requires Node.js 20.19+ or 22.12+ and a browser with WebGL 2 and hardware acceleration.

```sh
npm ci
npm run dev
```

Open **http://localhost:5173/**. Click **OTA NUMERO** once. This requests fullscreen and starts JML Engine's loader and player. Sound should be on. The entire production then runs without input and ends in black after the track. Reload to replay. Escape is the engine's emergency exit.

A ready-to-serve build is in `dist/` (also packaged as `seisomapaikka.zip`). To regenerate and serve it:

```sh
npm run build
npm run preview
```

Open **http://localhost:4173/**. Alternatively, serve `dist/` with any static HTTP server. Do not open the HTML as a `file://` URL: the engine needs to load assets over HTTP. There are no runtime CDN or external service dependencies. Desktop landscape presentation is intended; other aspect ratios are letterboxed by JML Engine. Browser fullscreen availability depends on the platform.

## Music and credits

Exactly one track, **Rock Hybrid — Kevin MacLeod**, from `music-catalog.json`. The complete, unchanged MP3 is `public/data/music.mp3`; there is no other audio or video in the demo. JML Engine derives the end time directly from the decoded audio buffer: **130.403265 seconds** in the verified Chromium run (catalog container duration: 130.403278 seconds).

> "Rock Hybrid" by Kevin MacLeod (incompetech.com)
> Licensed under Creative Commons Attribution 4.0 International
> https://creativecommons.org/licenses/by/4.0/
> Source: https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100094
> Original audio: https://incompetech.com/music/royalty-free/mp3-royaltyfree/rock%20hybrid.mp3
> ISRC: USUAN1100094
> Music unchanged.

The complete supplied credit file is also included verbatim at `public/data/music.credits.txt`, and the author, title, license and license URL appear in the production's closing credits.

Concept, texts, code, chair mesh, graphics, choreography and shaders: **Codex**. Engine: **Jumalauta JML Engine**, zlib license, see `engine/LICENSE`. Lettering is rasterized from DejaVu Sans/Mono; its license is included at `public/data/FONT-LICENSE.txt`. No image generation model was used. Assets are generated from geometry and drawing code in `scripts/`.

Audio SHA-256:

```text
a56fe686900e20c75e3ec02c191338a9f4a69f11808677959e687f46b2e32054
```

## Engine implementation

The **unmodified engine checkout** is pinned to `e58a1f6fc16e75003b2509a5471db27645191b41`. Engine and example revisions come from the provided `research-sources.json`.

`bootstrap.js` supplies the launch click. After that, the engine owns loading, asset caching, scene scheduling, animation evaluation, the clock, music playback, the render loop, cameras, lighting and rendering. There is no separate renderer, private playback loop, video texture or prerecorded visual sequence.

The production uses:

- Eight named scenes, each scheduled by JML's main timeline with its own local clock and FBO.
- An original OBJ/MTL chair, engine primitive geometry, cameras and lights.
- JML instancing for the conveyor, council, chair orbit, 121-chair dance and 180-chair sphere; shader injection applies instance colors to lit materials.
- A stream of 180 engine-rendered paper tickets, and independently scheduled digit images for the live queue counter.
- Original GLSL floor, background and FBO postprocessing shaders, loaded and bound by the engine.
- Engine keyframe primitives for entrances, plus deterministic dynamic animation values for camera paths and furniture motion. Every scene can be sought without simulation warm-up.
- A measured 116 BPM beat grid and 50 Hz frequency-band envelopes derived from the selected MP3. The envelopes control visuals only. The soundtrack itself is not processed.

The phrases begin at 0, 16.552, 33.103, 49.655, 66.207, 82.759, 99.310 and 115.862 seconds. Intermediate gestures and captions use shorter beat subdivisions. The engine's final visual fade leaves the full audio untouched.

## Research

Full notes, links, credits observed, viewing method and exact example revisions are in [SOURCES.md](SOURCES.md).

Visual sequence study covered **Opium Als Religion Des Volkes +++** (GBA, 2003), **Buick** (2005), **We** (Game Boy, 2009), **JUHA 001** (2017), **Hauho** (2019), **The Last Färjan of Late Capitalism** (2020), **This Thing Is Killing Me** (MSX, 2021), **Auto 2000** (2024), **All Stars** (TIC-80, with TEOS, 2024), and **Automata Et Saltatio** (2026). Additional catalogue and source studies are identified separately in the notes.

Research was performed through chronological frame sequences spanning downloaded captures, source reading and release documentation. This is sampled visual review, not a claim of continuous human audiovisual viewing. The environment does not provide native auditory perception; soundtrack inspection used decoded-sample analysis, and testing played the actual demo with audio enabled and captured its output.

## Verification

See [verification/REPORT.md](verification/REPORT.md) and the machine-readable playthrough/audio reports. The complete production was launched with one click in Chromium and allowed to run to its own end, without seeking or changing playback speed. Browser audio was unmuted, the audio context stayed running, and the output bus was recorded and compared against the complete source track. Screenshots were inspected across the actual run. Separate seek-based checks inspected scene composition.

The first review fixed invalid material parameters, overlay occlusion and instance tint bindings. The final full-duration run completed after the fixes with no JavaScript or shader errors; its captured audio correlation with the source was 0.999732. Build warnings about `eval` originate in the unchanged engine's effect construction.

For development verification only, `npm ci --prefix tools` installs Playwright; `npx --prefix tools playwright install --with-deps chromium` installs its browser. `node scripts/verify-playback.cjs` checks the preview server. These tools are not shipped inside `dist/`.

To regenerate the original assets, use `node scripts/make-models.mjs` and `python3 scripts/make-type.py` (Pillow and DejaVu fonts). `python3 scripts/analyze-music.py` requires NumPy, Pillow and FFmpeg and derives only visual control data from the unchanged soundtrack.
