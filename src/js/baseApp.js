/**
 * Created by atg on 14/05/2014.
 */
//Common baseline for visualisation app
import * as THREE from "three";
let TrackballControls = require("three-trackballcontrols");

export class BaseApp {
    constructor() {
        this.renderer = null;
        this.scenes = [];
        this.currentScene = 0;
        this.camera = null;
        this.controls = null;
        this.stats = null;
        this.container = null;
        this.objectList = [];
        this.root = null;
        this.mouse = new THREE.Vector2();
        this.pickedObjects = [];
        this.selectedObject = null;
        this.hoverObjects = [];
        this.startTime = 0;
        this.elapsedTime = 0;
        this.clock = new THREE.Clock();
        this.clock.start();
        this.raycaster = new THREE.Raycaster();
        this.objectsPicked = false;
    }

    init(container) {
        this.container = container;
        this.createRenderer();
        this.createCamera();
        this.createControls();
        //this.stats = initStats();
        this.statsShowing = false;
        //$("#Stats-output").hide();
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer( {antialias : true, alpha: true});
        this.renderer.setClearColor(0x7d818c, 1.0);
        this.renderer.shadowMap.enabled = true;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild( this.renderer.domElement );

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        window.addEventListener('keydown', event => {
            this.keyDown(event);
        }, false);

        window.addEventListener('resize', event => {
            this.windowResize(event);
        }, false);

        this.container.addEventListener('mousedown', event => {
            this.mouseClicked(event);
        }, false);
    }

    keyDown(event) {
        //Key press functionality
        switch(event.keyCode) {
            case 83: //'S'
                if (this.stats) {
                    if (this.statsShowing) {
                        $("#Stats-output").hide();
                        this.statsShowing = false;
                    } else {
                        $("#Stats-output").show();
                        this.statsShowing = true;
                    }
                }
                break;
            case 80: //'P'
                console.log('Cam =', this.camera.position);
                console.log('Look =', this.controls.getLookAt());
        }
    }

    mouseClicked(event) {
        //Update mouse state
        this.mouseUpdated = true;
        event.preventDefault();
        this.pickedObjects.length = 0;

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects( this.scenes[this.currentScene].children, true );
        this.selectedObject = undefined;
        if(intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            //DEBUG
            //console.log("Picked = ", this.selectedObject.name);
        }
    }

    mouseMoved(event) {
        //Update mouse state
        this.mouse.endX = event.clientX;
        this.mouse.endY = event.clientY;
    }

    windowResize(event) {
        //Handle window resize
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    createScene() {
        let scene = new THREE.Scene();
        this.scenes.push(scene);

        let ambientLight = new THREE.AmbientLight(0x383838);
        scene.add(ambientLight);

        /*
         let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
         directionalLight.position.set( 0, 100, 0 );
         directionalLight.name = "sunlight";
         scene.add( directionalLight );
         */


        let pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0,40,150);
        pointLight.name = 'PointLight';
        scene.add(pointLight);


        return this.scenes.length-1;
    }

    addToScene(object) {
        this.scenes[this.currentScene].add(object);
    }

    getObjectByName(name) {
        return this.scenes[this.currentScene].getObjectByName(name);
    }

    createCamera() {
        const CAM_X = 0, CAM_Y = -0.05, CAM_Z = 0.63;
        const NEAR_PLANE = 0.01, FAR_PLANE = 100;
        this.defaultCamPos = new THREE.Vector3(CAM_X, CAM_Y, CAM_Z);
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / window.innerHeight, NEAR_PLANE, FAR_PLANE );
        this.camera.position.copy(this.defaultCamPos);
    }

    createControls() {
        this.controls = new TrackballControls(this.camera, this.container);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 1.0;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.noRotate = true;
        this.controls.noRoll = true;
        this.controls.noPan = true;
        this.controls.noZoom = true;

        this.controls.keys = [ 65, 83, 68 ];

        const LOOK_X = 0, LOOK_Y = -0.05, LOOK_Z = 0;
        let lookAt = new THREE.Vector3(LOOK_X, LOOK_Y, LOOK_Z);
        this.controls.target.copy(lookAt);
    }

    setCamera(cameraProp) {
        this.camera.position.set(cameraProp[0].x, cameraProp[0].y, cameraProp[0].z);
        this.controls.target.copy(cameraProp[1]);
    }

    update() {
        //Do any updates
        this.controls.update();
    }

    run() {
        this.renderer.render( this.scenes[this.currentScene], this.camera );
        this.update();
        if(this.stats) this.stats.update();
        requestAnimationFrame(() => {
            this.run();
        });
    }

    initStats() {
        let stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append( stats.domElement );

        return stats;
    }
}
