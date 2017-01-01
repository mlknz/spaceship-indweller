precision highp float;
precision highp int;

#define M_PI 3.141592653589

varying vec2 vUv;

const vec3 backgroundColor = vec3(0.04, 0.05, 0.09);

float hash( float n ) { return fract(sin(n) * 753.5453123); }
// Noise by inigo quilez - iq/2013 : https://www.shadertoy.com/view/4sfGzS#
float noise( vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float noiseOctaves ( vec3 v ) {
    float result = 0.0;
    for (float i = 2.0; i < 11.0; i++) {
        result += noise(v * i)/((i - 1.0) * 2.0);
    }
    return result;
}

void main() {
    float phi = M_PI*(vUv.x*2.0);
    float theta = M_PI*(vUv.y);
	vec3 unitSpherePosition = vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta));

    float noiseValue = noiseOctaves(unitSpherePosition * 50.);

    float stars = max(noiseValue - 0.9, 0.0);

    noiseValue = noiseOctaves(unitSpherePosition * 3.);
    vec3 value = backgroundColor * noiseValue + stars;

    gl_FragColor.rgb = value;
    gl_FragColor.a = 1.;
}
