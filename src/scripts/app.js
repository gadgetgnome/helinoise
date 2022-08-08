import * as THREE from "three";
import { Noise } from "noisejs";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0, 0, 4);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GEO // TERRAIN
const geometry = new THREE.PlaneGeometry(100, 100, 1600, 1600);

// https://www.npmjs.com/package/noisejs

const geoArr = geometry.attributes.position.array;
console.time("terrain");
const noise = new Noise(0);
const noiseFrequency = 0.2;
const noiseAmp = 1;
for (let index = 2; index < geoArr.length; index += 3) {
  geoArr[index] =
    noise.simplex2(
      geoArr[index - 2] * noiseFrequency,
      geoArr[index - 1] * noiseFrequency
    ) * noiseAmp;
}
console.timeEnd("terrain");

geometry.computeBoundingBox();
geometry.computeBoundingSphere();
geometry.computeVertexNormals();
geometry.computeTangents();

// Material
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});
const cube = new THREE.Mesh(geometry, material);
material.wireframe = true;

window.material = material;

scene.add(cube);

const heli = new THREE.Object3D();
heli.add(camera);
heli.position.y = 0.2;
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

function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);

  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  heli.position.z -= 0.002;
  heli.rotation.z = Math.sin(new Date() / 1000) / 4;
  // controls.update(delta);
}

animate();
