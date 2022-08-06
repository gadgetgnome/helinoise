import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0, 0, 1);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(100, 100, 1600, 1600);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});
const cube = new THREE.Mesh(geometry, material);
material.wireframe = true;

window.material = material;

scene.add(cube);

camera.position.y = 0.1;
// camera.rotation.x = -Math.PI / 4;

const controls = new FlyControls(camera, renderer.domElement);

controls.movementSpeed = 0.5;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = true;
controls.dragToLook = false;

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);

  cube.rotation.x = Math.PI / 2;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
  controls.update(delta);
}

animate();
