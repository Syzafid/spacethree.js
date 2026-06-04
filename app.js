import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1C1F26);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 8, 25);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI/2;

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -4;
floor.receiveShadow = true;
scene.add(floor);

const objects = [];

const matahari = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff8800, emissiveIntensity: 0.6, roughness: 0.8, metalness: 0 })
);
matahari.castShadow = true;
matahari.userData.label = 'Matahari';
scene.add(matahari);
objects.push(matahari);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x1155cc, roughness: 0.7, metalness: 0.1 })
);
planet.position.set(10, 0, 0);
planet.castShadow = true;
planet.receiveShadow = true;
planet.userData.label = 'Planet miller';
scene.add(planet);
objects.push(planet);

const stasiunISS = new THREE.Mesh(
  new THREE.BoxGeometry( 1, 1, 4, 8, 1),
  new THREE.MeshStandardMaterial({ color: 0xfffffff, roughness: 0.1, metalness: 0.4 })
);
stasiunISS.position.set(-8, 2, 5);
stasiunISS.castShadow = true;
stasiunISS.receiveShadow = true;
stasiunISS.userData.label = 'Stasiun Luar Angkasa';
scene.add(stasiunISS);
objects.push(stasiunISS);


const nebula = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.4, 16, 60),
  new THREE.MeshStandardMaterial({ color: 0xaa44ff, roughness: 0.5, metalness: 0.2 })
);
nebula.position.set(-19, 7, -8);
nebula.castShadow = true;
nebula.receiveShadow = true;
nebula.userData.label = 'Ring Nebula';
scene.add(nebula);
objects.push(nebula);

const Meteoroid = new THREE.Mesh(
  new THREE.DodecahedronGeometry(1),
  new THREE.MeshStandardMaterial({ color: 0x807055, roughness: 0.3, metalness: 0.4 })
);
Meteoroid.position.set(8, 5, 0);
Meteoroid.castShadow = true;
Meteoroid.receiveShadow = true;
Meteoroid.userData.label = 'Meteoroid';
scene.add(Meteoroid);
objects.push(Meteoroid);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.6, 2.5, 16),
  new THREE.MeshStandardMaterial({ color: 0x99A38B, roughness: 0.4, metalness: 0.5 })
);
cone.position.set(5, 2, 8);
cone.castShadow = true;
cone.receiveShadow = true;
cone.userData.label = 'Kepala Roket';
scene.add(cone);
objects.push(cone);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const info = document.getElementById('info');
let selected = null;
let hovered = null;

window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if (hovered && hovered !== selected) {
    hovered.material.emissive.set(0x000000);
    hovered = null;
  }

  if (hits.length > 0) {
    hovered = hits[0].object;
    if (hovered !== selected) {
      hovered.material.emissive.set(0x333333);
    }
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});

window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  const hitObject = hits.length > 0 ? hits[0].object : null;

  if (selected) {
    selected.material.emissive.set(0x000000);
    selected.scale.setScalar(1);
    info.textContent = '';
  }

  if (hitObject && hitObject !== selected) {
    selected = hitObject;
    selected.material.emissive.set(0x222200);
    selected.scale.setScalar(1.2);
    info.textContent = `${selected.userData.label}`;
  } else {
    selected = null;
  }
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let t = 0;
renderer.setAnimationLoop(() => {
  t += 0.01;

  matahari.rotation.y += 0.005;

  planet.position.x = Math.cos(t * 0.5) * 10;
  planet.position.z = Math.sin(t * 0.5) * 10;
  planet.rotation.y += 0.01;

  stasiunISS.rotation.y += 0.008;

  nebula.rotation.x += 0.01;
  nebula.rotation.y += 0.005;

  Meteoroid.rotation.x += 0.01;
  Meteoroid.rotation.y += 0.005;

  cone.position.y = 2 + Math.sin(t) * 0.5;
  cone.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
});