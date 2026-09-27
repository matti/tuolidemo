"""Compare the recorded browser output with the one supplied music track."""
import json
import subprocess
import numpy as np

RATE = 8000

def decode(path):
    return np.frombuffer(subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le',
        '-ac', '1', '-ar', str(RATE), 'pipe:1'
    ]), dtype='float32')

x = decode('public/data/music.mp3')
y = decode('verification/browser-output.wav')
n = 1 << (len(x) + len(y) - 1).bit_length()
z = np.fft.irfft(np.fft.rfft(y, n) * np.conj(np.fft.rfft(x, n)), n)
k = int(np.argmax(z))

def correlation(a, b):
    assert len(a) == len(b), 'Browser capture truncated the track'
    return float(np.dot(a, b) / np.sqrt(np.dot(a, a) * np.dot(b, b)))

report = {
    'source': 'public/data/music.mp3',
    'output': 'verification/browser-output.wav',
    'sampleRateCompared': RATE,
    'capturedSeconds': len(y) / RATE,
    'sourceOffsetInCaptureSeconds': k / RATE,
    'correlation': correlation(x, y[k:k + len(x)]),
    'sourceDurationSeconds': len(x) / RATE,
    'segments': []
}
for t in [0, 10, 30, 60, 90, 120, 128]:
    a = x[t * RATE:(t + 2) * RATE]
    b = y[k + t * RATE:k + (t + 2) * RATE]
    report['segments'].append({'sourceTimeSeconds': t, 'correlation': correlation(a, b)})
with open('verification/audio-output-check.json', 'w') as f:
    json.dump(report, f, indent=2)
print(json.dumps(report, indent=2))
assert report['correlation'] > .99
assert all(s['correlation'] > .99 for s in report['segments'])
