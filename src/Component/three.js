import * as THREE from 'three';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
//import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let camera, container, scene, renderer, stats, controls;
let DracoLoader, Loader, Models;
let zoom, Clock;
let cube, light, mesh;

init ();

function init() {
	container = document.getElementById( 'container' );

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0X000000, 0X000000, 0);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;
	camera.position.y = 5;

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
	zoom.zoomSpeed = 2;
	zoom.minDistance = 2;
	zoom.maxDistance = 8;
	zoom.maxPolarAngle = 1.4;
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
	const geometry = new THREE.BoxGeometry( 15, 0.2, 15 );
	geometry.position = new THREE.Vector3( 0, 0, 0 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );

	const light = new THREE.AmbientLight( 0x909090 ); // soft white light

	scene.add( cube, light );

	Loader3d();
}

function Loader3d () {
	DracoLoader = new DRACOLoader();
	DracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/' );
	/*Todavia no se que hace
	DracoLoader.setDecoderConfiguration({type: 'js'});
	Loader.setDRACOLoader(DracoLoader);*/

	Loader = new GLTFLoader();
	Loader.setDRACOLoader( DracoLoader );
	Loader.load( '/models/gltf/Cubo-Textura.gltf', function ( gltf ) {
		Models = gltf.scene
		Models.position.set( 0, 1, 0 );
		Models.scale.set( 0.5, 0.5, 0.5 );
		scene.add( Models );
		//gltf.animations; // Array<THREE.AnimationClip>
		//gltf.scene; // THREE.Group
		//gltf.scenes; // Array<THREE.Group>
		//gltf.cameras; // Array<THREE.Camera>
		//gltf.asset; // Object
	})
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.render( scene, camera );
}

function Animacion () {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}

function animate() {
	//Animacion();

	//Control Libre de la camara
	//Clock = new THREE.Clock();
	//controls.update( Clock.getDelta() );
	zoom.update();
	stats.update();

	renderer.render( scene, camera );
}