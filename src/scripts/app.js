import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 100);
const geoMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1,
  linecap: "round", //ignored by WebGLRenderer
  linejoin: "round", //ignored by WebGLRenderer
});
const planeMesh = new THREE.Mesh(planeGeo, geoMaterial);

scene.add(planeMesh);

camera.position.x = camera.position.z = camera.position.y = 10;
camera.lookAt(planeMesh);

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

console.log("OK");
