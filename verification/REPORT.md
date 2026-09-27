# Playback verification

The production was built with Vite and exercised in Chromium using software WebGL (SwiftShader) at 1280×720. The launch button was clicked once, fullscreen was entered, and the demo ran to completion with audio enabled, normal speed, gain 1 and looping disabled. No seek occurred during the full playthrough.

`playthrough.json` records the browser's audio state and sample RMS throughout playback, the decoded duration, automatic completion and collected errors. `audio-output-check.json` records comparison of the actual PulseAudio browser output capture against the supplied track, downsampled to 8 kHz for comparison. The source and shipped MP3 hashes match exactly. The audio capture is verification material only and is not loaded by the demo.

The final complete run produced no JavaScript or shader errors and stopped automatically at the decoded track duration of 130.403265 seconds. Its recorded audio correlation with the source was 0.999732, with matching samples near 0, 10, 30, 60, 90, 120 and 128 seconds. This is strong evidence of full, unchanged playback, not a substitute for human listening; native auditory perception is unavailable in this environment.

Frame inspection found and corrected:

1. A numeric specular value passed to the engine's material-property assignment instead of a Three color object. It poisoned the chair lighting. The OBJ now uses an explicit MTL and valid material values.
2. Per-instance tint referenced a preprocessor symbol unavailable in the fragment stage. Explicit JML shader injection now transfers the instance attribute.
3. Captions could be covered by 3D paper. Text and the queue counter now use the engine's main overlay layers after scene FBO compositing.
4. Moving captions to the main timeline exposed missing RGB defaults. Explicit white modulation now preserves the authored lettering colors, and the queue header has a dark backing for contrast.
5. The title's initial beat count overlapped the first caption. The entrance now occupies the second half of the opening phrase.

Temporal frame captures in `play-*.png` show the actual uninterrupted run. Files named `t*.png` come from separate seek-based scene checks. Chromium logs include the pinned engine's render-target-uniform cloning warning and software-GPU readback warnings; neither is a shader compile failure. Shader programs and page errors are checked in the verification script.

The final software-rendered run recorded 4,670 distinct engine frames, a median frame interval of 23.9 ms and a 95th-percentile interval of 56.7 ms. This includes screenshot readbacks and is not a hardware-GPU benchmark. `final-contact-sheet.jpg` collects sixteen frames from this final uninterrupted run.

Reproduce audio checking with an unmuted PulseAudio browser: capture its output sink using FFmpeg, then run `python3 scripts/compare-audio.py`. This checks alignment and correlation over the full track and seven intervals including its ending.
