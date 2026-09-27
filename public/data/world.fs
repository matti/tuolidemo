in vec2 texCoord;
out vec4 fragColor;
uniform float time;
uniform float mode;
uniform float kick;
uniform float snare;
uniform float localTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
void main(){
 vec2 p=(texCoord-.5)*vec2(1.77778,1.);vec3 c=vec3(.018,.038,.045);
 float r=length(p),a=atan(p.y,p.x);
 if(mode<.5){
  float light=exp(-length((p-vec2(.26,.08))*vec2(1.2,.8))*3.8);
  c+=vec3(.14,.21,.21)*light;
  float slats=step(.91,fract((p.x+p.y*.23)*18.));
  c+=slats*.025*(.5+light);
 }else if(mode<1.5){
  c+=vec3(.045,.045,.03)*(1.-r);
  vec2 q=p;q*=rot(.15*sin(localTime*.2));
  float bars=step(.84,fract(q.x*8.+q.y*2.-time*.8));
  c+=bars*vec3(.075,.036,.008)*(1.+kick);
 }else if(mode<2.5){
  float rays=pow(max(0.,sin(a*32.+time*.18)),14.);
  float halo=exp(-abs(r-.29-kick*.004)*35.);
  c=vec3(.016,.045,.056)+vec3(.15,.085,.025)*rays*(.3+r)+vec3(.26,.17,.055)*halo;
  c+=vec3(.03,.16,.16)*exp(-r*3.);
 }else if(mode<3.5){
  vec2 q=p*rot(sin(localTime*.13)*.5);
  float depth=.21/max(abs(q.x),abs(q.y));
  float run=fract(depth+time*1.1);
  float line=pow(run,16.);
  c=vec3(.01,.025,.032)+vec3(.2,.36,.32)*line/(1.+depth*.12);
  c+=vec3(.08,.026,.003)*step(.9,fract(a*11.))*run;
 }else if(mode<4.5){
  float rays=pow(max(0.,sin(a*18.-time*.4)),5.);
  c=mix(vec3(.035,.008,.012),vec3(.32,.045,.006),rays)*(.7+kick*.25);
  c+=vec3(.6,.22,.035)*exp(-abs(r-.32)*35.);
 }else{
  vec2 q=p*rot(.05*sin(time));
  float rings=sin(30.*r-time*3.+sin(a*7.+time)*1.3);
  c=mix(vec3(.015,.10,.12),vec3(.17,.025,.035),smoothstep(-.3,.3,rings))*(.7+r);
  c+=vec3(.1,.24,.21)*pow(max(0.,cos(a*20.-time*.2)),20.)*r;
 }
 float grain=(hash(gl_FragCoord.xy+fract(time)*100.)-.5)*.022;
 c+=grain;c*=1.-.34*dot(p,p);fragColor=vec4(c,1.);
}
