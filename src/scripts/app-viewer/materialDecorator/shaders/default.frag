precision highp float;
precision highp int;

uniform sampler2D map;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(map, vUv);
}
