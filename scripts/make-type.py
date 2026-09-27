from PIL import Image,ImageDraw,ImageFont
import os
os.makedirs('public/data/type',exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
mono='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
def label(name,lines):
 im=Image.new('RGBA',(1920,1080));d=ImageDraw.Draw(im)
 if name=='queue':d.rectangle((630,55,1290,205),fill=(3,8,9,245))
 for text,x,y,size,color,kind in lines:
  f=ImageFont.truetype(mono if kind=='mono' else font,size)
  d.text((x,y),text,font=f,fill=color,anchor='mm' if x==960 else 'lm',stroke_width=0)
 im.save('public/data/type/'+name+'.png')
cream='#eee9d9';red='#ff502d'
label('intro',[('JUMALAUTA',110,116,34,cream,'mono'),('001',110,255,152,red,''),('OLKAA HYVÄ.',110,400,60,cream,''),('ODOTTAKAA.',110,470,60,cream,''),('PLEASE REMAIN STANDING',110,545,24,cream,'mono'),('PALVELU PARANEE ODOTTAMALLA',110,965,22,cream,'mono')])
label('title',[('SEISOMA',100,260,238,cream,''),('PAIKKA',100,460,238,cream,''),('STANDING ROOM',110,650,32,red,'mono'),('JUMALAUTA  /  2026',110,945,30,cream,'mono')])
label('assembly',[('LISÄÄ',110,160,134,cream,''),('TUOLEJA.',110,285,134,cream,''),('MORE CHAIRS.',115,389,27,red,'mono')])
label('capacity',[('EI LISÄÄ',110,160,120,cream,''),('PAIKKOJA.',110,275,120,cream,''),('NO MORE SEATS.',115,377,27,red,'mono')])
label('premium',[('ISTUMINEN',960,145,98,cream,''),('ON LISÄPALVELU.',960,245,98,cream,''),('SITTING SOLD SEPARATELY',960,340,28,red,'mono')])
label('council',[('PÄÄTETTY',110,860,138,cream,''),('ISTUA.',110,988,138,cream,''),('THE BOARD HAS TAKEN ITS SEAT',1000,977,24,red,'mono')])
label('queue',[('TEIDÄN EDELLÄNNE',960,105,47,cream,''),('PEOPLE AHEAD OF YOU',960,165,23,red,'mono')])
label('standing',[('NOUSUKAAMME.',960,870,116,cream,''),('PLEASE RISE.',960,970,28,red,'mono')])
label('revolt',[('TUOLIT',100,245,210,cream,''),('TANSSIVAT.',100,440,210,cream,''),('SINÄ SEISOT.',110,600,65,red,''),('THE CHAIRS DANCE. YOU STAND.',110,710,26,cream,'mono')])
label('everyone',[('KAIKILLE',960,340,188,cream,''),('ON TILAA.',960,515,188,cream,''),('THERE IS ROOM FOR EVERYONE.',960,690,29,red,'mono')])
label('except',[('EI SINULLE.',960,530,208,cream,''),('EXCEPT YOU.',960,730,35,red,'mono')])
label('end',[('VUOROSI OLI ÄSKEN.',960,250,98,cream,''),('YOU JUST MISSED YOUR TURN.',960,350,26,red,'mono'),('SEISOMAPAIKKA',960,520,55,cream,''),('JUMALAUTA',960,595,33,red,'mono'),('MUSIC: “ROCK HYBRID” — KEVIN MACLEOD',960,759,25,cream,'mono'),('(incompetech.com) · Music unchanged',960,804,22,cream,'mono'),('Creative Commons Attribution 4.0 International',960,849,22,cream,'mono'),('https://creativecommons.org/licenses/by/4.0/',960,894,22,cream,'mono'),('KONSEPTI / KUVA / KOODI: CODEX  ·  JML ENGINE',960,978,20,cream,'mono')])
# Printed texture for live 3D paper stream.
im=Image.new('RGBA',(256,512),'#eee9d9');d=ImageDraw.Draw(im)
f=ImageFont.truetype(mono,18);big=ImageFont.truetype(font,100)
d.text((128,45),'VUORONUMERO',font=f,fill='#14232a',anchor='mm');d.text((128,160),'001',font=big,fill='#14232a',anchor='mm');d.line((20,255,236,255),fill='#14232a',width=3)
for j in range(8):d.line((24,295+j*15,232-(j%3)*27,295+j*15),fill='#14232a',width=3)
d.text((128,460),'ODOTA.',font=f,fill='#f04425',anchor='mm');im.save('public/data/ticket.png')
# Digit atlas as individual transparent textures for real-time counter.
for i in range(10):
 im=Image.new('RGBA',(128,192));d=ImageDraw.Draw(im);d.text((64,94),str(i),font=ImageFont.truetype(mono,158),fill=cream,anchor='mm');im.save(f'public/data/type/digit{i}.png')
