import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';



const http = require("http")

const width = window.innerWidth
const height = window.innerHeight
const rotationVal: number = 0.05
var mouseX: number
var prevMouseX: number
var mouseY: number
var prevMouseY: number
var cubeRotate: boolean = false

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('app') as HTMLCanvasElement
})

renderer.setSize(width, height)

const mainCamera = new THREE.PerspectiveCamera(60, width/height, 0.1, 100) //FOV, aspect, near plane, far plane

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry
const material = new THREE.MeshPhongMaterial({ color: 0xFFAD00 })
const cube = new THREE.Mesh(geometry, material)
cube.position.z = -5
cube.position.y = 1
scene.add(cube)

const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 4, 2)
scene.add(light)

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;



function updateLoop(){
    /* Move rotation controls to a different class */
    renderer.render(scene, mainCamera)
    if(cubeRotate){
        if(mouseX == prevMouseX)
            cube.rotation.z += 0
        else if(mouseX < prevMouseX){
            if(cube.rotation.y > 90 && cube.rotation.y < 270)
                cube.rotation.z -= rotationVal
            else
                cube.rotation.z += rotationVal
        } 
        else{
            if(cube.rotation.y > 90 && cube.rotation.y < 270)
                cube.rotation.z += rotationVal
            else
                cube.rotation.z -= rotationVal
        }
        prevMouseX = mouseX
        if(mouseY == prevMouseY)
            cube.rotation.x += 0
        else if(mouseY > prevMouseY)
            cube.rotation.x += rotationVal
        else
            cube.rotation.x -= rotationVal
        prevMouseY = mouseY
    }

    requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);

document.addEventListener('mousemove', (event) =>{
    mouseX = event.clientX
    mouseY = event.clientY
})

document.addEventListener('mousedown',function () {
    cubeRotate = true
})

document.addEventListener('mouseup', (event) =>{
    cubeRotate = false
})

export {}