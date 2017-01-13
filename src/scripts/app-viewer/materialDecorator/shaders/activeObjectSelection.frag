uniform vec3 diffuse;
uniform float opacity;

uniform float time;
uniform vec3 waveHeightSpeedPause;

varying float vWorldPosY;

void main() {
    float waveHeight = waveHeightSpeedPause.x;
    float waveSpeed = waveHeightSpeedPause.y;
    float wavePause = waveHeightSpeedPause.z;

    float wave = mod(vWorldPosY - time * waveSpeed, waveHeight + wavePause); // [0, h+p]
    wave = max(0., wave - wavePause) / waveHeight; // [0, 1]
    gl_FragColor.rgb = diffuse.rgb * wave;
    gl_FragColor.a = opacity * min(wave + 0.5, 1.);
}
