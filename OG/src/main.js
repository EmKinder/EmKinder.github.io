"use strict";
import * as THREE from 'three'; // Adjust the path
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js'
//import { Handy } from '../node_modules/three/examples/jsm/webxr/Handy.js'; // Adjust the path



//var http = require('http');
var width = window.innerWidth;
var height = window.innerHeight;
var rotationVal = 0.05;
var mouseX;
var prevMouseX;
var mouseY;
var prevMouseY;
var cubeRotate = false;

//THREE SETUP

var renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app'), antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
var mainCamera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000); //FOV, aspect, near plane, far plane
var scene = new THREE.Scene();
scene.add(mainCamera)

//world = new THREE.Group()
//scene.add( world )

renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 4, 2);
scene.add(light);

window.addEventListener( 'resize', function(){
	
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
    controls.update()

}, false )




window.THREE = THREE
//window.Handy = Handy

function setupHands(){
    const handModelFactory = new XRHandModelFactory(), 
    cycleHandModel = function(event){
        const hand = event.hand
    
    hand.models.forEach(function(model){
        model.visible = false
    })
    hand.modelIndex = (hand.modelIndex + 1) % hand.models.length
    hand.models[hand.modelIndex].visible = true
    }
    const [hand0, hand1]= [ {}, {}].map(function(hand, i){
        hand = renderer.xr.getHand(i)
        scene.add(hand)
        hand.models = [
            handModelFactory.createHandModel(hand, 'boxes'),
            handModelFactory.createHandModel(hand, 'spheres'),
            handModelFactory.createHandModel(hand, 'mesh')
        ]
        hand.modelIndex = 0

      //  Handy.makeHandy(hand)

        hand.displayFrameAnchor = new THREE.Object3D()
        hand.add(hand.displayFrameAnchor)

        hand.addEventListener('connected', function(event){
            hand.handedness = event.data.handedness
            hand.models.forEach(function(model){
                hand.add(model)
                model.visible = false
            })
            hand.models[hand.modelIndex].visible = true
        })
    })
   // return hand
}

var geometry = new THREE.BoxGeometry;
var material = new THREE.MeshPhongMaterial({ color: 0xFFAD00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.z = -5;
cube.position.y = 1;
scene.add(cube);


function updateLoop() {
    /* Move rotation controls to a different class */
    renderer.render(scene, mainCamera);
    if (cubeRotate) {
        if (mouseX == prevMouseX)
            cube.rotation.z += 0;
        else if (mouseX < prevMouseX) {
            if (cube.rotation.y > 90 && cube.rotation.y < 270)
                cube.rotation.z -= rotationVal;
            else
                cube.rotation.z += rotationVal;
        }
        else {
            if (cube.rotation.y > 90 && cube.rotation.y < 270)
                cube.rotation.z += rotationVal;
            else
                cube.rotation.z -= rotationVal;
        }
        prevMouseX = mouseX;
        if (mouseY == prevMouseY)
            cube.rotation.x += 0;
        else if (mouseY > prevMouseY)
            cube.rotation.x += rotationVal;
        else
            cube.rotation.x -= rotationVal;
        prevMouseY = mouseY;
    }
    requestAnimationFrame(updateLoop);
}
requestAnimationFrame(updateLoop);
document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
document.addEventListener('mousedown', function () {
    cubeRotate = true;
});
document.addEventListener('mouseup', function (event) {
    cubeRotate = false;
});

window.addEventListener( 'DOMContentLoaded', function(){

	//setupThree()
	//Bolt.setup( scene )
	setupHands()
	//setupContent()
})