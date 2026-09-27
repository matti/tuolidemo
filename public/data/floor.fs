in vec2 texCoord;
out vec4 fragColor;
uniform float time;
uniform float kick;
uniform float phase;
void main(){vec2 q=texCoord*40.;vec2 fw=fwidth(q);vec2 d=abs(fract(q-.5)-.5)/fw;float grid=1.-min(min(d.x,d.y),1.);float checker=mod(floor(q.x)+floor(q.y),2.);vec3 c=mix(vec3(.018,.039,.045),vec3(.03,.065,.067),checker);c+=grid*vec3(.065,.12,.11);float band=pow(max(0.,1.-abs(fract(q.y*.08-time*.13)-.5)*2.),22.);c+=band*vec3(.11,.065,.015)*(1.+kick);fragColor=vec4(c,1.);}
