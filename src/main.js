import "../style.css"
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
const FLOOR = - 250;

let camera, controls, scene, renderer, Game;
let stats, container;

const NEAR = 10, FAR = 3000;

let mixer;

const morphs = [];

let light;
let lightShadowMapViewer;

const clock = new THREE.Clock();

let showHUD = false;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 23, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
	camera.position.set( 700, 50, 1900 );

	// SCENE
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x59472b );
	scene.fog = new THREE.Fog( 0x59472b, 1000, FAR );

	// LIGHTS
	const ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );

	light = new THREE.DirectionalLight( 0xffffff, 3 );
	light.position.set( 0, 1500, 1000 );
	light.castShadow = true;
	light.shadow.camera.top = 2000;
	light.shadow.camera.bottom = - 2000;
	light.shadow.camera.left = - 2000;
	light.shadow.camera.right = 2000;
	light.shadow.camera.near = 1200;
	light.shadow.camera.far = 2500;
	light.shadow.bias = 0.0001;

	light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
	light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

	scene.add( light );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );

	renderer.autoClear = false;

	//
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	// CONTROLS
		controls = new FirstPersonControls( camera, renderer.domElement );

		controls.lookSpeed = 0.015;//0.015
		controls.movementSpeed = 500;
		controls.lookVertical = false;

		controls.lookAt( scene.position );

	// STATS
		stats = new Stats();
		//container.appendChild( stats.dom );

		//
		window.addEventListener( 'resize', onWindowResize );
		window.addEventListener( 'keydown', onKeyDown );

	// CREATE CONTROL
	createHUD();
	createScene();
}

function onWindowResize() {
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	controls.handleResize();
}

function onKeyDown( event ) {
	switch ( event.keyCode ) {
		case 84:	/*t*/
			showHUD = ! showHUD;
			break;
	}
}

function createHUD() {
	lightShadowMapViewer = new ShadowMapViewer( light );
	lightShadowMapViewer.position.x = 10;
	lightShadowMapViewer.position.y = SCREEN_HEIGHT - ( SHADOW_MAP_HEIGHT / 4 ) - 10;
	lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
	lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
	lightShadowMapViewer.update();
}

function createScene( ) {
	//createPanel();
	ModelText();
	//GeoText();
	Objects();
	//Control() Sin funcionar
	//AnimationMixer() Sin funcionar

	// MORPHS
	mixer = new THREE.AnimationMixer( scene );

	function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor ) {

		mesh = mesh.clone();
		mesh.material = mesh.material.clone();

		if ( fudgeColor ) {
			mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );
		}

		mesh.speed = speed;

		mixer.clipAction( clip, mesh ).
			setDuration( duration ).
		// to shift the playback out of phase:
			startAt( - duration * Math.random() ).
			play();

		mesh.position.set( x, y, z );
		mesh.rotation.y = Math.PI / 2;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add( mesh );

		morphs.push( mesh );
	}
}

function Objects() {
    // GROUND
	const geometry = new THREE.PlaneGeometry( 100, 100 );
	const planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );

	const ground = new THREE.Mesh( geometry, planeMaterial );

	ground.position.set( 0, FLOOR, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 100, 100, 100 );

	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );

    // CUBES
	const cubes1 = new THREE.Mesh( new THREE.BoxGeometry( 1500, 220, 150 ), planeMaterial );

	cubes1.position.y = FLOOR - 50;
	cubes1.position.z = 20;

	cubes1.castShadow = true;
	cubes1.receiveShadow = true;

	scene.add( cubes1 );

	const cubes2 = new THREE.Mesh( new THREE.BoxGeometry( 1600, 170, 250 ), planeMaterial );

	cubes2.position.y = FLOOR - 50;
	cubes2.position.z = 20;

	cubes2.castShadow = true;
	cubes2.receiveShadow = true;

	scene.add( cubes2 );
}

function ModelText () {
	// TEXT
	const loader = new FontLoader();
	loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
		const textGeo = new TextGeometry( '3D', {
			font: font,

			size: 200,
			depth: 50,
			curveSegments: 12,

			bevelThickness: 2,
			bevelSize: 5,
			bevelEnabled: true
		} );

		textGeo.computeBoundingBox();
		const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

		const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

		const mesh = new THREE.Mesh( textGeo, textMaterial );
		mesh.position.x = centerOffset;
		mesh.position.y = FLOOR + 67;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add( mesh );
	} );
}

function GeoText() {
	const Leter = new FontLoader();
	Leter.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
		const Geo = new TextGeometry( 'THREE.JS', {
			font: font,

			size: 200,
			depth: 50,
			curveSegments: 12,

			bevelThickness: 2,
			bevelSize: 5,
			bevelEnabled: true
		} );

		Geo.computeBoundingBox();
		const center = - 0.4 * ( Geo.boundingBox.max.x - Geo.boundingBox.min.x );

		const Material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

		const mes = new THREE.Mesh( Geo, Material );
		mes.position.x = center;
		mes.position.y = FLOOR + 68;

		mes.castShadow = true;
		mes.receiveShadow = true;

		scene.add( mes );
	} );
}

function createPanel() {
	const panel = new GUI( { width: 300 } );

	const folder1 = panel.addFolder( 'Visibility' );
	const folder2 = panel.addFolder( 'Activation/Deactivation' );
	const folder3 = panel.addFolder( 'Pausing/Stepping' );
	const folder4 = panel.addFolder( 'Crossfading' );
	const folder5 = panel.addFolder( 'Blend Weights' );
	const folder6 = panel.addFolder( 'General Speed' );

	folder1.open();
	folder2.open();
	folder3.open();
	folder4.open();
	folder5.open();
	folder6.open();
}

function AnimationMixer () {
	const gltfloader = new GLTFLoader();

	gltfloader.load( 'models/gltf/Horse.glb', function ( gltf ) {
		const mesh = gltf.scene.children[ 0 ];

		const clip = gltf.animations[ 0 ];

		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 300, true );
		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 450, true );
		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 600, true );

		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 300, true );
		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 450, true );
		addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 600, true );
	} );

	gltfloader.load( 'models/gltf/Flamingo.glb', function ( gltf ) {
		const mesh = gltf.scene.children[ 0 ];
		const clip = gltf.animations[ 0 ];

		addMorph( mesh, clip, 500, 1, 500 - Math.random() * 500, FLOOR + 350, 40 );
	} );

	gltfloader.load( 'models/gltf/Stork.glb', function ( gltf ) {
		const mesh = gltf.scene.children[ 0 ];
		const clip = gltf.animations[ 0 ];

		addMorph( mesh, clip, 350, 1, 500 - Math.random() * 500, FLOOR + 350, 340 );
	} );

	gltfloader.load( 'models/gltf/Parrot.glb', function ( gltf ) {
		const mesh = gltf.scene.children[ 0 ];
		const clip = gltf.animations[ 0 ];

		addMorph( mesh, clip, 450, 0.5, 500 - Math.random() * 500, FLOOR + 300, 700 );
        
	} );
}

function Control () {
	Game = new PointerLockControls( Camera, document.body );
	const blocker = document.getElementById( 'blocker' );
	const instructions = document.getElementById( 'instructions' );

	instructions.addEventListener( 'click', function () {
		Game.Lock();
    } );

	Game.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	} );

	Game.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	} );
}

function updateSize() {

	const width = canvas.clientWidth;
	const height = canvas.clientHeight;

	if ( canvas.width !== width || canvas.height !== height ) {

		renderer.setSize( width, height, false );

	}

}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	const delta = clock.getDelta();

	mixer.update( delta );

	for ( let i = 0; i < morphs.length; i ++ ) {
		const morph = morphs[ i ];

		morph.position.x += morph.speed * delta;

		if ( morph.position.x > 2000 ) {
		morph.position.x = - 1000 - Math.random() * 500;
		}
	}

	controls.update( delta );

	renderer.clear();
	renderer.render( scene, camera );

	// Render debug HUD with shadow map
	if ( showHUD ) {
		lightShadowMapViewer.render( renderer );
	}
}