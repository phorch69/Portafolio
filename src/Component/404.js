import * as THREE from 'three';
//import * as THREE from "../node_modules/three/build/three.module.js";
//import * as THREE from './path/to/three.module.js';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
//import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
//import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
//import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';

let camera, container, scene, renderer, stats, controls;
let DracoLoader, Loader, Models, HDRLoader, HDR;
let zoom, Clock, water, Manager, ProgresBar, Load, Start;
let cube, light, mesh;

init ();

function init() {
	container = document.getElementById( 'container' );

	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0X000000, 0X000000, 0);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 50;
	camera.position.y = 50;
	camera.position.x = 50;

	LoadingManager();
	//Objetos3d();
	Ilumination();
	Loader3d();
	render();
	Zoom();
	Oceano();
	//Control libre
	//Controls();
	Background();

	window.addEventListener('resize', onWindowResize, false);
}

function render() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animate );
	container.appendChild( renderer.domElement );
	stats = new Stats();

	//renderer.toneMapping = new THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 0.25;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//container.appendChild( stats.dom );
}

//Movimiento de la camara con mouse
function Zoom() {
	zoom = new OrbitControls(camera, renderer.domElement);
	zoom.autoRotate = true;
	zoom.zoomSpeed = 3;
	zoom.minDistance = 7;
	zoom.maxDistance = 55;
	zoom.maxPolarAngle = 1.4;
	zoom.maxTargetRadius = 0;
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



function Background() {
	//HDRLoader = new RGBELoader();
    //HDRLoader.setDataType( THREE.FloatType );
	//HDRLoader.setDataType( THREE[ HalfFloatType ] );
    new RGBELoader(Manager).load( '/public/models/HDRs/Cielo.hdr', ( environmentMap ) => {

        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		//environmentMap.needsUpdate = true;

		scene.background = environmentMap;
		scene.environment = environmentMap;
    } );
}

function Oceano() {
	const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

	water = new Water( waterGeometry, {
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( '/public/models/Texturas/water.jpg', function ( texture ) {

						texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 0.5,
						fog: scene.fog !== undefined
					}
				);

	water.rotation.x = - Math.PI / 2;

	//water.material.uniforms['time'].value += 0.01;

	scene.add( water );
}

function Objetos3d () {
	const geometry = new THREE.BoxGeometry( 15, 0.2, 15 );
	geometry.position = new THREE.Vector3( 0, 0, 0 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
}

function LoadingManager() {
	Manager = new THREE.LoadingManager();
	ProgresBar = document.getElementById('progress-bar');
	Load = document.querySelector('.Load');
	Start = document.querySelector('.Start');

	Manager.onStart = function ( item, loaded, total ) {
        Start.style.display = 'none';
    };

    Manager.onProgress = function ( item, loaded, total ) {
        ProgresBar.value = ( loaded / total ) * 100 ;
    };

	Manager.onLoad = function () {
        Load.style.display = 'none';
		Start.style.display = 'block';
    };

    //Manager.onError = function () {
    //    console.error( 'Started loading: ' );
    //};
}

function Loader3d () {
	DracoLoader = new DRACOLoader();
	DracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/' );
	/*Todavia no se que hace
	DracoLoader.setDecoderConfiguration({type: 'js'});
	Loader.setDRACOLoader(DracoLoader);*/

	Loader = new GLTFLoader(Manager);
	Loader.setDRACOLoader( DracoLoader );
	Loader.load( '/public/models/gltf/Cubo-Textura.gltf', function ( gltf ) {
		Models = gltf.scene
		Models.position.set( 0, 0.3, 0 );
		Models.scale.set( 8, 0.1, 8 );
		scene.add( Models );
		//gltf.animations; // Array<THREE.AnimationClip>
		//gltf.scene; // THREE.Group
		//gltf.scenes; // Array<THREE.Group>
		//gltf.cameras; // Array<THREE.Camera>
		//gltf.asset; // Object
	})
}

function Ilumination() {
	const Ambient = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
	const light = new THREE.DirectionalLight( 0xffffff, 5 );
	light.position.set( 0, 10, 0 );
	scene.add( Ambient, light );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.render( scene, camera );
}

function Animacion () {
	
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
