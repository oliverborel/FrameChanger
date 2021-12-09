import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { createRefFrame } from './referenceFrame'


// -------------- Setup ThreeJS main canvas ---------------
THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

var renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });
renderer.setClearColor(0xffffff, 1);
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.x = -500;
camera.position.y = -500;
camera.position.z = 150;
camera.lookAt(0, 0, 0);

var controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 500;
controls.target.set(0, 0, 100);
controls.update();


// Grid
const size = 10000;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.geometry.rotateX(Math.PI / 2);
scene.add(gridHelper);

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // set render target sizes here
}
const resizeObserver = new ResizeObserver(resizeCanvasToDisplaySize);
resizeObserver.observe(renderer.domElement, { box: 'content-box' });

// ---------------------- Setu up ThreeJS reference Axis canvas ----------------------

var CANVAS_WIDTH = 200;
var CANVAS_HEIGHT = 200;
var axisRenderer = new THREE.WebGLRenderer({ alpha: true }); // clear

axisRenderer.setClearColor(0x000000, 0);
axisRenderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

var axisCanvas = document.body.appendChild(axisRenderer.domElement);
axisCanvas.setAttribute('id', 'axisCanvas');
axisCanvas.style.width = CANVAS_WIDTH;
axisCanvas.style.height = CANVAS_HEIGHT;

var axisScene = new THREE.Scene();

var axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
//axisCamera.up = camera.up; // important!

var axis = createRefFrame(0, 0, 0);
axisScene.add(axis);


// ---------------------- ThreeJS canvas Sizes ----------------------

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width - CANVAS_WIDTH, sizes.height - CANVAS_HEIGHT)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ---------------------- dat gui  ----------------------

// const gui = new dat.GUI({ name: 'My GUI' });
// const actor1Folder = gui.addFolder('Actor 1')
// const positionFolder = actor1Folder.addFolder('Position')
// positionFolder.add(actor1.position, 'x', 0, 10)
// positionFolder.add(actor1.position, 'y', 0, 10)
// positionFolder.add(actor1.position, 'z', 0, 10)
// positionFolder.open()
// const rotationFolder = actor1Folder.addFolder('Rotation')
// rotationFolder.add(actor1.rotation, 'x', 0, Math.PI * 2)
// rotationFolder.add(actor1.rotation, 'y', 0, Math.PI * 2)
// rotationFolder.add(actor1.rotation, 'z', 0, Math.PI * 2)
// rotationFolder.open()
// actor1Folder.open()

// ---------------------- ThreeJS animate loop----------------------

function render() {
    renderer.render(scene, camera);
    axisRenderer.render(axisScene, axisCamera);
}

(function animate() {
    requestAnimationFrame(animate);

    controls.update();

    axisCamera.position.copy(camera.position);
    axisCamera.position.sub(controls.target);
    axisCamera.position.setLength(300);

    axisCamera.lookAt(axisScene.position);
    render();
})();


// ---------------------------- Three JS actors

var actor1 = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor1-color"));
var actor2 = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor2-color"));
var actor3 = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor3-color"));
var actor4 = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor4-color"));
scene.add(actor1);
scene.add(actor2);
scene.add(actor3);
scene.add(actor4);


// ---------------------- Set actors from form data
document.actor1form.addEventListener('input', () => {
    const formData1 = new FormData(document.actor1form)
    actor1.position.x = formData1.get("position1.x");
    actor1.position.y = formData1.get("position1.y");
    actor1.position.z = formData1.get("position1.z");
    actor1.rotation.x = formData1.get("rotation1.x") * Math.PI / 180;
    actor1.rotation.y = formData1.get("rotation1.y") * Math.PI / 180;
    actor1.rotation.z = formData1.get("rotation1.z") * Math.PI / 180;
})

document.actor2form.addEventListener('change', () => {
    const formData2 = new FormData(document.actor2form)
    actor2.position.x = formData2.get("position2.x");
    actor2.position.y = formData2.get("position2.y");
    actor2.position.z = formData2.get("position2.z");
    actor2.rotation.x = formData2.get("rotation2.x") * Math.PI / 180;
    actor2.rotation.y = formData2.get("rotation2.y") * Math.PI / 180;
    actor2.rotation.z = formData2.get("rotation2.z") * Math.PI / 180;
})

document.actor3form.addEventListener('change', () => {
    const formData3 = new FormData(document.actor3form)
    actor3.position.x = formData3.get("position3.x");
    actor3.position.y = formData3.get("position3.y");
    actor3.position.z = formData3.get("position3.z");
    actor3.rotation.x = formData3.get("rotation3.x") * Math.PI / 180;
    actor3.rotation.y = formData3.get("rotation3.y") * Math.PI / 180;
    actor3.rotation.z = formData3.get("rotation3.z") * Math.PI / 180;
})

document.actor4form.addEventListener('change', () => {
    const formData4 = new FormData(document.actor4form)
    actor4.position.x = formData4.get("position4.x");
    actor4.position.y = formData4.get("position4.y");
    actor4.position.z = formData4.get("position4.z");
    actor4.rotation.x = formData4.get("rotation4.x") * Math.PI / 180;
    actor4.rotation.y = formData4.get("rotation4.y") * Math.PI / 180;
    actor4.rotation.z = formData4.get("rotation4.z") * Math.PI / 180;
})

// --------------- Get calculate commands from form data --------------
const calculate1Btn = document.getElementById('calculate-p'); // from frame 1 to 2
calculate1Btn.addEventListener('click', () => {

    // get the transorm that brings from 1 to 2
    // T_2f1 = T_1fw.inverse() * T_2fw
    var T_2f1 = new THREE.Matrix4();
    T_2f1 = actor1.matrixWorld.invert().multiply(actor2.matrixWorld);
    //right multiply anything by T_2f1 to get that thing go from 1 to 2

    var position = new THREE.Vector3();
    var rotation = new THREE.Quaternion();
    var scale = new THREE.Vector3();
    T_2f1.decompose(position, rotation, scale);
    console.log(position);

    //example calc
    var t_1 = new THREE.Vector3(10, -4, 2);
    var t_2 = t_1.add(position);
    document.getElementsByName('output')[0].value =
        "t_2 = t_1 + [" + position.x + "," + position.y + "," + position.z + "]"
        + "\ne.g: [" + t_2.x + "," + t_2.y + "," + t_2.z + "] = ["
        + t_1.x + "," + t_1.y + "," + t_1.z + "] + ["
        + position.x + "," + position.y + "," + position.z + "]";

    //console.log(T_2f1.elements);



    // console.log(-actor1.position.x + actor2.position.x);
    // console.log(-actor1.position.y + actor2.position.z);
    // console.log(-actor1.position.z + actor2.position.z);
    // console.log("VecIn2 = VecIn1 * (2Pos - 1Pos)");


})

// const calculate2Btn = document.getElementById('calculate-1');
// calculate1Btn.addEventListener('click', () => {
//     console.log(-actor1.position.x + actor2.position.x);
//     console.log(-actor1.position.y + actor2.position.z);
//     console.log(-actor1.position.z + actor2.position.z);
// })