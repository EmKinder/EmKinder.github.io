import * as THREE from '../libs/three125/three.module.js';
import { VRButton } from '../libs/VRButton.js';
import { XRControllerModelFactory } from '../libs/three125/XRControllerModelFactory.js';
import { XRHandModelFactory } from '../libs/three125/XRHandModelFactory.js';
import { OrbitControls } from '../libs/three125/OrbitControls.js';
import { CanvasUI } from '../libs/CanvasUI.js'

class App{
	constructor(){
		const container = document.createElement( 'div' );
        this.handPos = 0;
        this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x444444 );
        this.ui = new CanvasUI();
        this.uiEnabled = false;

		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
		this.camera.position.set( 0, 1.6, 3 );

		this.controls = new OrbitControls( this.camera, container );
		this.controls.target.set( 0, 1.6, 0 );
		this.controls.update();


		this.initScene();

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.shadowMap.enabled = true;
		this.renderer.xr.enabled = true;

        container.appendChild( this.renderer.domElement );
        
        this.setupVR();

        window.addEventListener('resize', this.resize.bind(this) );
        
         this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    initScene(){
        const floorGeometry = new THREE.PlaneGeometry( 4, 4 );
		const floorMaterial = new THREE.MeshStandardMaterial( { color: 0x222222 } );
		const floor = new THREE.Mesh( floorGeometry, floorMaterial );
		floor.rotation.x = - Math.PI / 2;
		floor.receiveShadow = true;
		this.scene.add( floor );

		this.scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

		const light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 6, 0 );
		light.castShadow = true;
		light.shadow.camera.top = 2;
		light.shadow.camera.bottom = - 2;
		light.shadow.camera.right = 2;
		light.shadow.camera.left = - 2;
		light.shadow.mapSize.set( 4096, 4096 );
		this.scene.add( light );

    }
    
    setupVR(){
        //Notice added optional feature hand-tracking
        const button = new VRButton( this.renderer, { sessionInit:{ optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] } } );
        
        this.controller1 = this.renderer.xr.getController( 0 );
        this.scene.add( this.controller1 );

        this.controller2 = this.renderer.xr.getController( 1 );
		this.scene.add( this.controller2 );

        const controllerModelFactory = new XRControllerModelFactory();
        
        this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
        this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
        this.scene.add( this.controllerGrip1 );
        
        this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
        this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
        this.scene.add( this.controllerGrip2 );
        
		const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

        const line = new THREE.Line( geometry );
        line.name = 'line';
        line.scale.z = 5;

        this.controller1.add( line.clone() );
		this.controller2.add( line.clone() );

        const cubeGeo = new THREE.BoxBufferGeometry(1, 1, 1);
        const cubeMat = new THREE.MeshPhongMaterial(0xFF00000);
        const cube = new THREE.Mesh(cubeGexo, cubeMat);
        cube.position.z = -2; 
        cube.position.y = 1;
        this.scene.add(cube);
        
        //Add hand code here

        const handModelFactory = new XRHandModelFactory().setPath("../../assets/");

        this.handModels = {
            left: null,
            right: null
        };

        this.currentHandModel = {
            left: 0, 
            right: 0
        }

        //Hand 1
        this.hand1 = this.renderer.xr.getHand(0);
        this.scene.add(this.hand1);
        handModelFactory.createHandModel(this.hand1, "boxes")
        this.handModels.right = [
            handModelFactory.createHandModel(this.hand1, "boxes"),
            handModelFactory.createHandModel(this.hand1, "spheres"),
            handModelFactory.createHandModel(this.hand1, "oculus", {
                model: "lowpoly"
            }),
            handModelFactory.createHandModel(this.hand1, "oculus")
        ];
        
        this.handModels.right.forEach(model =>{
            model.visible = false;
            this.hand1.add(model);
        })

        const self = this;

        this.handModels.right [this.currentHandModel.right].visible = true;
        //this.hand1.addEventListener('pinchend', evt =>{
           // self.rotateCube(evt.handedness);
       //    cube.rotation.x += 0.5;
       // })

       this.hand1.addEventListener( 'pinchstart', evt =>{
        self.onPinchStartRight();
       });
       this.hand1.addEventListener( 'pinchend', () => {

           scaling.active = false;

       } );

        this.hand2 = this.renderer.xr.getHand(1);
        this.scene.add(this.hand2);
        handModelFactory.createHandModel(this.hand2, "boxes")
        this.handModels.left = [
            handModelFactory.createHandModel(this.hand2, "boxes"),
            handModelFactory.createHandModel(this.hand2, "spheres"),
            handModelFactory.createHandModel(this.hand2, "oculus", {
                model: "lowpoly"
            }),
            handModelFactory.createHandModel(this.hand2, "oculus")
        ];
        
        this.handModels.left.forEach(model =>{
            model.visible = false;
            this.hand2.add(model);
        })

       // const self = this;

        this.handModels.left [this.currentHandModel.left].visible = true;

        this.createUI();
    }

    createUI(){
       //this.ui = new CanvasUI();
        this.ui.updateElement("body", "Hello World");
        this.ui.update();
        this.ui.mesh.position.set(0, 1.5, -1.2);
        this.scene.add(ui.mesh);
    }

   /* toggleUI( event , isOn){
        if(isOn != uiEnabled){
            uiEnabled = isOn;
            this.ui.updateElemt("body", isOn);
        }

    }*/

     
    onPinchStartRight( event ) {

        const controller = event.target;
        const indexTip = controller.joints[ 'index-finger-tip' ];
        const object = collideObject( indexTip );
        if ( object ) {

            grabbing = true;
            indexTip.attach( object );
            controller.userData.selected = object;
            console.log( 'Selected', object );

        }

    }

     onPinchEndRight( event ) {

        const controller = event.target;

        if ( controller.userData.selected !== undefined ) {

            const object = controller.userData.selected;
            object.material.emissive.b = 0;
            scene.attach( object );

            controller.userData.selected = undefined;
            grabbing = false;

        }

        scaling.active = false;

    }

    rotateCube(hand){
        // if(hand.position.x < this.handPos){
        //     cube.rotation.x -= 0.1;
        // }
        // else if(hand.position.x > this.handPos){
        //     cube.rotation.x += 0.1;
        // }
        // this.handPos = hand.position.x;
        cube.rotation.x += 0.5;
    }

    
    cycleHandModel( hand ) {
        this.handModels[ hand ][ this.currentHandModel[ hand ] ].visible = false;
        this.currentHandModel[ hand ] = ( this.currentHandModel[ hand ] + 1 ) % this.handModels[ hand ].length;
        this.handModels[ hand ][ this.currentHandModel[ hand ] ].visible = true;
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.renderer.render( this.scene, this.camera );
    }
}

export {App};