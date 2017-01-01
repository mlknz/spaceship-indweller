precision highp float;
precision highp int;

#define M_PI 3.141592653589

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float radius;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float phi = M_PI*(uv.x*2.0);
    float theta = M_PI*(uv.y);
	vec3 unitSpherePosition = vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta));

    vec3 spherePosition = unitSpherePosition * radius;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePosition, 1.);

    vNormal = unitSpherePosition;
    vUv = uv;
}
