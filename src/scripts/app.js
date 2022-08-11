import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import Stats from "three/examples/jsm/libs/stats.module";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

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

const renderer = new THREE.WebGLRenderer({
  resolution: 2,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GEO // TERRAIN
const geometry = new THREE.PlaneGeometry(planeSize, planeSize, 200, 200);

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

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});
const cube = new THREE.Mesh(geometry, material);
material.wireframe = true;

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
// cube.position.z = -planeSize / 2;

let pointer = (() => {
  const ret = {};

  window.addEventListener("pointermove", (e) => {
    ret.x = (e.clientX - window.innerWidth / 2) / window.innerWidth / 2;
  });

  return ret;
})();

function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  const heliSpeedForward = delta * 0.5;

  renderer.render(scene, camera);
  heli.rotation.z =
    pointer.x == undefined
      ? Math.sin(new Date() / 1000) / 4
      : heli.rotation.z + (Math.PI / 2) * -pointer.x * 0.04;

  heli.rotation.z = Math.max(
    -Math.PI / 3,
    Math.min(Math.PI / 3, heli.rotation.z)
  );

  heli.rotation.y += heli.rotation.z * 0.01;

  material.uniforms.offset.value.y +=
    heliSpeedForward * Math.cos(-heli.rotation.y);
  material.uniforms.offset.value.x +=
    heliSpeedForward * Math.sin(-heli.rotation.y);

  stats.update();
}

animate();

window.m = material;
