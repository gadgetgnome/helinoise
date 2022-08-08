import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

const stats = Stats();
document.body.appendChild(stats.dom);

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0, 0, 4);

const planeSize = 20;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.05,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GEO // TERRAIN
const geometry = new THREE.PlaneGeometry(planeSize, planeSize, 160, 160);

// https://www.npmjs.com/package/noisejs

const geoArr = geometry.attributes.position.array;

geometry.computeBoundingBox();
geometry.computeBoundingSphere();
geometry.computeVertexNormals();
geometry.computeTangents();

// Material
let uniforms = {
  colorB: { type: "vec3", value: new THREE.Color(0x24ebd5) },
  colorA: { type: "vec3", value: new THREE.Color(0x0) },
  offset: { type: "vec2", value: new THREE.Vector2(0, 0) },
};

function vertexShader() {
  return `
    varying vec3 vUv;
    uniform vec2 offset;
    
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    void main() {
      vec3 pos = position;
      float noiseFrequency = .3;
      pos.z += noise(vec2 (pos.x * noiseFrequency + offset.x, pos.y * noiseFrequency + offset.y) * 5.);


      vUv = pos; 
      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
      
    }
  `;
}

function fragmentShader() {
  return `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  varying vec3 vUv;

  void main() {
    gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
  }
`;
}

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
});
const cube = new THREE.Mesh(geometry, material);
// material.wireframe = true;

window.material = material;

scene.add(cube);

const heli = new THREE.Object3D();
heli.add(camera);
heli.position.y = 1.1;
scene.add(heli);
// camera.rotation.x = -Math.PI / 4;

// Lights
// const light = new THREE.PointLight(0xffffff, 1, 1);
// heli.add(light);
// window.light = light;

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

// Controls

// const controls = new FlyControls(camera, renderer.domElement);

// controls.movementSpeed = 0.5;
// controls.domElement = renderer.domElement;
// controls.rollSpeed = Math.PI / 24;
// controls.autoForward = true;
// controls.dragToLook = false;

const clock = new THREE.Clock();
cube.rotation.x = -Math.PI / 2;
cube.position.z = -planeSize / 2;

function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);

  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  material.uniforms.offset.value.y += 0.008;
  // heli.position.z -= 0.002;
  heli.rotation.z = Math.sin(new Date() / 1000) / 4;
  // controls.update(delta);

  stats.update();
}

animate();

window.m = material;
