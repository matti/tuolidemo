# Research notebook

The broad catalogue was the starting point: https://demozoo.org/groups/1297/ . It listed 615 productions during this session. I read the release titles, platform and party information, production pages, available credits and several original info files. This range matters: reducing the group to a WebGL aesthetic would miss both its old hardware work and its gleefully disposable productions.

## Viewing method and limits

I downloaded ten video captures and inspected chronological frame sequences spanning their complete durations (36 frames per capture, with the time printed below each frame). Those sequences are in `research/frames/`; original page snapshots are in `research/pages/`. This is **sampled visual review**, not a claim of human, continuous audiovisual viewing. This environment does not provide native auditory perception. I used music metadata, decoded sample analysis and actual browser audio playback/output measurement for the new demo. The blocked Feles capture was studied as source code and metadata only.

## Productions reviewed visually

| Production | Date / platform at release | Capture | Observations informing judgment, not assets or effects copied |
|---|---|---|---|
| [Opium Als Religion Des Volkes +++](https://demozoo.org/productions/63977/) | 2003 / GBA | [Video](https://www.youtube.com/watch?v=i5AhikeJknY) | Monochrome geometry is aggressively reframed and crushed into near abstraction. A limited visual vocabulary can carry a whole piece. The closing credit names annie & sauli. |
| [Buick](https://demozoo.org/productions/80289/) | 2005 / Windows, macOS | [Video](https://www.youtube.com/watch?v=N3Jqaw-M-IQ) | Advertising manners turn into a confrontational political collage. The apparent public-information voice is part of the joke. Credits and acknowledgments are irreverent, not corporate polish. |
| [We](https://demozoo.org/productions/857/) | 2009 / Game Boy | [Video](https://www.youtube.com/watch?v=fNEa_K7PH50) | Hand-lettered political propositions alternate with genuinely abrasive raster destruction. The restrained handheld palette does not imply a gentle piece. |
| [JUHA 001](https://github.com/jumalauta/demo-jml-juha001/tree/0101852a88b245de4f89edc7574f0dd34133c0b4) | 2017 / Windows | [Video](https://www.youtube.com/watch?v=wwfzf_VCz0M) | Specific Finnish political subject matter, terse captions and a disorienting density of images. Text is a strike within the rhythm rather than explanatory prose. |
| [Hauho](https://demozoo.org/productions/282997/) | 2019 / Windows, invitation; with Jukupliut | [Video](https://www.youtube.com/watch?v=Ct3v-Oq3xV0) | Deliberately naive drawn motifs retain a coherent moving world. The local name is stretched into a whole event. Original info: code/gfx Haluttu, maksullinen; music Kara Square. |
| [The Last Färjan of Late Capitalism](https://demozoo.org/productions/284324/) | 2020 / Windows | [Video](https://www.youtube.com/watch?v=7AqWbEDcyxg) | Repetition, crowded satire and escalation have conviction. The abrasive composition is serving a position, not just displaying effects. |
| [This Thing Is Killing Me](https://demozoo.org/productions/302276/) | 2021 / MSX | [Video](https://www.youtube.com/watch?v=0xiFg7Z9DuE) | A tiny repeated-effects vocabulary, economical title pacing and unexpectedly plain closing credits. Maitotuote, Anteeksi and Soluttautuja appear in the end sequence. |
| [Auto 2000](https://demozoo.org/productions/349979/) | 2024 / Windows | [Video](https://www.youtube.com/watch?v=duul6JfFYGo) | An overcommitted technological sales pitch gives the hero object a reason to exist. The comedy requires the demo to believe its own ridiculous claim. |
| [All Stars](https://demozoo.org/productions/355754/) | 2024 / TIC-80; with TEOS | [Video](https://www.youtube.com/watch?v=t6Dt4-h5fWk) | A single graphic motif gets multiple spatial lives. Playfulness and clean visual timing coexist with the group's rougher work. End credits name Felor, Tsuiya and Valtteri. |
| [Automata Et Saltatio](https://demozoo.org/productions/390047/) | 2026 / Windows | [Video](https://www.youtube.com/watch?v=CkTt3IRoV7A) | An apparently playful central performer survives increasingly grotesque changes of context. Credits name Haluttu Maksullinen Engine, Anteeksi, Vasen Oikee Keskilaaja and Naetti Tyttoe; technical ambition supports an actual argument. |

Additional catalogue/page study: **Kolmannen valtakunnan salaisuus** (2000, Windows 64K), **Jumalauta Megademo** (2002, C64), **Innovaatiopolitiikka** (2019, C64), and **Feles Contra Omnia** (2025, Windows). These were not counted as viewed captures. The Innovaatiopolitiikka credits explicitly distinguish syncing/data generation from the main code and graphics, a useful reminder that timing is authored work.

## What I took from it

This is my interpretation, not a definition imposed on a varied group: conviction about an often ludicrous premise; unembarrassed repetition; a social or local bite; theatrical escalation; humor that can coexist with serious craft; and no obligation to look expensive or tasteful. The group is not a collection of interchangeable logos, ferries or technical effects.

For **SEISOMAPAIKKA**, the new premise is a queue where the furniture receives every privilege. The same original chair first promises a place, then becomes industrial inventory, a hierarchy, a dancing crowd and a whole planet. The crowd gets more chairs; the viewer never gets a seat. The ending returns to the ordinary administrative cruelty of having just missed one's turn. No existing production's assets, scripts, scene sequence, logos, recordings or shader effects appear in the demo.

## Engine study

Engine: `e58a1f6fc16e75003b2509a5471db27645191b41`, with its dependency lock. Read `documentation.md` and the implementation of `main`, `Effect`, `Loader`, `Scene`, `Player`, `Timer`, `Music`, `AudioFile`, `Image`, `Model`, `Instancer`, `Shader`, `Fbo`, `Camera`, `Light`, `Settings`, `Utils`, `FileManager`, `DemoRenderer` and `Fullscreen`.

Examples repository: `e3290b9a71b7bec6f813569843c5b49583180741`. Checked out exactly the following submodule revisions from `research-sources.json`:

- Auto 2000 — `2ae56af8cbaabb8d513c8ff1a6a502df130508d8`: animation primitives, camera tracks, object presentation, FBO layering.
- Feles Contra Omnia — `6657cf85b4f56db07e41489e73eb2e2d95321ddd`: named scene composition, local clocks, postprocessing organization.
- Fight 21XX — `acf8fa0830fc49ff2351c678133e4131794bb1f2`: read project information and inspected its script organization.
- Hauho — `e9b2104b44c70a83955221b26aa4862152a6fa52`: images transformed by the engine and custom shader loading.
- JUHA 001 — `0101852a88b245de4f89edc7574f0dd34133c0b4`: short-form timing and source/release relationship.
- The Last Färjan of Late Capitalism — `35a3acce2acaf128f3084b2b6be9dd7daeee1861`: layered render targets and audio-derived visual modulation.
- Automata Et Saltatio — `81668fea635f6af404e448f13bb02ddbd82f4f7f`: shader injection and scene-to-FBO composition.

The engine checkout is unmodified. Examples remain research material outside `public/` and `dist/`.
