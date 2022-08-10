uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;

void main() {
    float fogDist = distance(vUv.xy, vec2(0, 2)) * .5;
    if(fogDist < 0.1) {
        gl_FragColor = vec4(1., 0, 0, 1.0);
    } else {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z / fogDist), 1.0);

    }
}
