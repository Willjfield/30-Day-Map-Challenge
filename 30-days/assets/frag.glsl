#version 300 es
precision mediump float;

uniform float u_frame;
uniform vec4 u_bbox;
uniform highp vec2 u_resolution;

float glitchArray[4];
out highp vec4 fragColor;
float random (in float _s) {
    return fract(sin(dot(_s,
                         78.233))*
        43758.5453123);
}

void main() {
    float rand = random (gl_FragCoord.x*sin(gl_FragCoord.y)+gl_FragCoord.z*u_frame);
    fragColor = vec4(vec3(1.-rand), rand);
}
