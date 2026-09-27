in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform float time;
uniform float kick;
uniform float snare;
uniform float damage;
uniform float fade;
float hash(vec2 p){return fract(sin(dot(p,vec2(41.32,289.9)))*45758.33);}
void main(){
 vec2 uv=texCoord;float tear=step(.986,hash(vec2(floor(uv.y*34.),floor(time*12.))))*damage;
 uv.x+=tear*.026*sin(time*91.);vec2 d=(uv-.5)*(.0007+damage*.006+snare*.0006);
 vec3 c=vec3(texture(texture0,uv+d).r,texture(texture0,uv).g,texture(texture0,uv-d).b);
 // Small spatial highlight spread. All source pixels come from JML's scene FBO.
 vec3 glow=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.785398;vec3 x=texture(texture0,uv+vec2(cos(a),sin(a))*.003).rgb;glow+=max(x-.65,0.);}
 c+=glow*.085;c*=.97+.03*sin(uv.y*1080.*3.14159);
 c+=(hash(gl_FragCoord.xy+time)-.5)*.018;
 c*=1.-.18*dot((uv-.5)*vec2(1.2,1.),(uv-.5)*vec2(1.2,1.));
 fragColor=vec4(c*fade,1.);
}
