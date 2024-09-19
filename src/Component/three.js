import * as THREE from 'three';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
//import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, container, scene, renderer, stats, controls;
let zoom, Clock;
let cube, light, mesh;

init ();

function init() {
	container = document.getElementById( 'container' );

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0XFFFFFF);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;

	Objetos3d()
	render();
	Zoom();
	//Control libre
	//Controls();

	window.addEventListener('resize', onWindowResize, false);
}

function render() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animate );
	container.appendChild( renderer.domElement );
	stats = new Stats();

	container.appendChild( stats.dom );
}
//Movimiento de la camara con mouse
function Zoom() {
	zoom = new OrbitControls(camera, renderer.domElement);
	zoom.autoRotate = false;
}
//Movimien de la camara con teclados
function Controls () {
	controls = new FlyControls(camera, renderer.domElement)
	controls.movementSpeed = 20;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
	controls.handleResize();
}

function Objetos3d () {
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.render( scene, camera );
}

function animate() {
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	//Control Libre de la camara
	//Clock = new THREE.Clock();
	//controls.update( Clock.getDelta() );
	zoom.update();
	stats.update();

	renderer.render( scene, camera );
}