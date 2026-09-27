import numpy as np,json,subprocess
from pathlib import Path
Path("verification").mkdir(exist_ok=True)
from PIL import Image,ImageDraw
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','public/data/music.mp3','-f','f32le','-ac','1','-ar','22050','pipe:1']),dtype='float32');sr=22050; hop=256; n=1024
s=np.abs(np.fft.rfft(np.lib.stride_tricks.sliding_window_view(x,n)[::hop]*np.hanning(n),axis=1));flux=np.maximum(np.diff(s,axis=0),0).sum(axis=1);ts=(np.arange(len(flux))+1)*hop/sr
best=[]
for bpm in np.arange(114,118,.01):
 period=60/bpm; z=np.sum(flux*np.exp(2j*np.pi*ts/period));best.append((abs(z),bpm,np.angle(z)*period/2/np.pi%period))
print('grid',sorted(best,reverse=True)[:4])
# band envelope and spectrogram evidence
arr=(np.clip((np.log10(s[:,1:350].T+0.05)+1.3)/3,0,1)*255).astype('uint8');im=Image.fromarray(arr[::-1]).resize((1800,450));out=Image.new('RGB',(1800,540));out.paste(im,(0,0));d=ImageDraw.Draw(out)
for t in range(0,131,5):
 xx=int(t/130.4*1800);d.line((xx,0,xx,470),fill=(100,65,30));d.text((xx,480),str(t),fill='white')
out.save('verification/music-analysis.png')
# 50 Hz band magnitudes for engine-controlled visual modulation; no audio emitted.
bands=[]
for lo,hi in [(35,180),(500,3000),(4000,10000)]:
 a=s[:,int(lo*n/sr):int(hi*n/sr)].mean(axis=1);a/=np.quantile(a,.98);bands.append(a)
values=[]
for t in np.arange(0,len(x)/sr,.02):
 k=min(len(s)-1,int(t*sr/hop));values.append([round(float(np.clip(a[k],0,1.4)),3) for a in bands])
open('public/data/envelope.js','w').write('window.SOUND_ENVELOPE='+json.dumps(values,separators=(',',':'))+';')
