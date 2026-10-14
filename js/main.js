import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfe9f7); // fondo celeste claro

const camera = new THREE.PerspectiveCamera(
  45,                                      
  window.innerWidth / window.innerHeight,  
  0.1,                                     
  100                                     
);
camera.position.set(0, 2, 8); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0); 

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(luzAmbiente);

const luzSol = new THREE.DirectionalLight(0xffffff, 2);
luzSol.position.set(5, 8, 6); 
scene.add(luzSol);

const luzPunto = new THREE.PointLight(0x88ccff, 30, 20);
luzPunto.position.set(-5, 3, 4);
scene.add(luzPunto);

const azul        = new THREE.MeshStandardMaterial({ color: 0x3f8fe0, roughness: 0.5 });
const azulClaro   = new THREE.MeshStandardMaterial({ color: 0x7ec0f2, roughness: 0.5 });
const azulOscuro  = new THREE.MeshStandardMaterial({ color: 0x2a6fb8, roughness: 0.5 });
const blanco      = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
const negro       = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
const rojo        = new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.6 });

function crearEsfera(radio, material, x, y, z, escala = [1, 1, 1]) {
  const geometria = new THREE.SphereGeometry(radio, 32, 32); 
  const malla = new THREE.Mesh(geometria, material);
  malla.position.set(x, y, z);
  malla.scale.set(escala[0], escala[1], escala[2]); 
  return malla;
}

const marill = new THREE.Group();

marill.add(crearEsfera(1, azul, 0, 0.2, 0, [1, 1, 0.95]));          
marill.add(crearEsfera(0.7, blanco, 0, 0.1, 0.75, [1, 1.1, 0.35])); 

//Cabeza 
marill.add(crearEsfera(0.9, azul, 0, 1.5, 0));

//Orejas (redondas, con parte interna clara) 
marill.add(crearEsfera(0.4, azul, -0.7, 2.25, 0));
marill.add(crearEsfera(0.4, azul, 0.7, 2.25, 0));
marill.add(crearEsfera(0.25, azulClaro, -0.7, 2.25, 0.2, [1, 1, 0.5]));
marill.add(crearEsfera(0.25, azulClaro, 0.7, 2.25, 0.2, [1, 1, 0.5]));

//Ojos (negros con brillo blanco) 
marill.add(crearEsfera(0.1, negro, -0.32, 1.65, 0.8));
marill.add(crearEsfera(0.1, negro, 0.32, 1.65, 0.8));
marill.add(crearEsfera(0.035, blanco, -0.35, 1.69, 0.88)); 
marill.add(crearEsfera(0.035, blanco, 0.29, 1.69, 0.88));  

//Boca (mitad de una dona, asi da la sonrisa) 
const geometriaBoca = new THREE.TorusGeometry(0.15, 0.025, 16, 32, Math.PI); 
const boca = new THREE.Mesh(geometriaBoca, negro);
boca.position.set(0, 1.3, 0.87);
boca.rotation.z = Math.PI; 
marill.add(boca);

//Mejillas (dos círculos rojizos pequeños) 
marill.add(crearEsfera(0.1, rojo, -0.55, 1.4, 0.68, [1, 1, 0.3]));
marill.add(crearEsfera(0.1, rojo, 0.55, 1.4, 0.68, [1, 1, 0.3]));

//Brazos
marill.add(crearEsfera(0.25, azul, -0.9, 0.4, 0.4));
marill.add(crearEsfera(0.25, azul, 0.9, 0.4, 0.4));

//Pies (esferas aplastadas)
marill.add(crearEsfera(0.3, azul, -0.55, -0.75, 0.5, [1, 0.6, 1.3]));
marill.add(crearEsfera(0.3, azul, 0.55, -0.75, 0.5, [1, 0.6, 1.3]));

//Cola: un cilindro inclinado y una bola grande 
const geometriaCola = new THREE.CylinderGeometry(0.12, 0.15, 1.2, 16); 
const cola = new THREE.Mesh(geometriaCola, azulOscuro);
cola.position.set(0, 0.5, -1.1);
cola.rotation.x = -0.5;
marill.add(cola);
marill.add(crearEsfera(0.5, azulClaro, 0, 1.2, -1.5));

marill.position.y = 0.8;
scene.add(marill);

//animaciòn
const reloj = new THREE.Clock();

function animar() {
  requestAnimationFrame(animar); 

  const tiempo = reloj.getElapsedTime();
  marill.rotation.y = tiempo * 0.5;         
  marill.position.y = 0.8 + Math.sin(tiempo * 2) * 0.1; 

  controls.update();
  renderer.render(scene, camera); 
}
animar();

//ajuste de la ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
