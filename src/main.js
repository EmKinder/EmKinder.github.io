"use strict";
import * as THREE from 'three'
import { VRButton } from 'https://unpkg.com/three@latest/examples/jsm/webxr/VRButton.js';

//var http = require('http');


var width = window.innerWidth;
var height = window.innerHeight;
var rotationVal = 0.05;
var mouseX;
var prevMouseX;
var mouseY;
var prevMouseY;
var cubeRotate = false;
var renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app')
});
renderer.setSize(width, height);
var mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100); //FOV, aspect, near plane, far plane
var scene = new THREE.Scene();
var geometry = new THREE.BoxGeometry;
var material = new THREE.MeshPhongMaterial({ color: 0xFFAD00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.z = -5;
cube.position.y = 1;
scene.add(cube);
var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 4, 2);
scene.add(light);
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
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
