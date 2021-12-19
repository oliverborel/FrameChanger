import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { createRefFrame } from './referenceFrame'


// -------------- Setup ThreeJS main canvas ---------------
THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1); // make z up in all three objects

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
axisCanvas.style.background = "rgba(0, 0, 0, 0)";
var axisScene = new THREE.Scene();

var axisCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);

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
const numActors = 4;
const actors = [];
const actorNames = [];
for (var i = 0; i < numActors; i++) {
    actors[i] = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor" + (i + 1) + "-color"));
    actorNames[i] = "Actor" + (i + 1);
    scene.add(actors[i]);
}


// ---------------------- Set actors from form data
function setActor(actor, formData) {
    actor.position.x = formData.get("position.x");
    actor.position.y = formData.get("position.y");
    actor.position.z = formData.get("position.z");
    //need to add selection for euler order!
    actor.rotation.x = formData.get("rotation.x") * Math.PI / 180;
    actor.rotation.y = formData.get("rotation.y") * Math.PI / 180;
    actor.rotation.z = formData.get("rotation.z") * Math.PI / 180;
    //console.log("setActor");
}

document.actor1form.addEventListener('input', () => {
    setActor(actors[0], new FormData(document.actor1form));
    setActor(actors[1], new FormData(document.actor2form));
    setActor(actors[2], new FormData(document.actor3form));
    setActor(actors[3], new FormData(document.actor4form));
});

document.actor2form.addEventListener('input', () => {
    setActor(actors[0], new FormData(document.actor1form));
    setActor(actors[1], new FormData(document.actor2form));
    setActor(actors[2], new FormData(document.actor3form));
    setActor(actors[3], new FormData(document.actor4form));
});

document.actor3form.addEventListener('input', () => {
    setActor(actors[0], new FormData(document.actor1form));
    setActor(actors[1], new FormData(document.actor2form));
    setActor(actors[2], new FormData(document.actor3form));
    setActor(actors[3], new FormData(document.actor4form));
});

document.actor4form.addEventListener('input', () => {
    setActor(actors[0], new FormData(document.actor1form));
    setActor(actors[1], new FormData(document.actor2form));
    setActor(actors[2], new FormData(document.actor3form));
    setActor(actors[3], new FormData(document.actor4form));
});

// below broken for some reason
// for (var i = 0; i < numActors; i++) {
//     //document.getElementsByName('output')[0].value = document.getElementsByName('actor1form')[0];
//     document.getElementsByName("actor" + (i + 1) + "form")[0].addEventListener('change', () => {
//         const formData = new FormData(document.getElementsByName("actor" + (i + 1) + "form")[0]);
//         actors[i].position.x = formData.get("position.x");
//         actors[i].position.y = formData.get("position.y");
//         actors[i].position.z = formData.get("position.z");
//         actors[i].rotation.x = formData.get("rotation.x") * Math.PI / 180;
//         actors[i].rotation.y = formData.get("rotation.y") * Math.PI / 180;
//         actors[i].rotation.z = formData.get("rotation.z") * Math.PI / 180;
//     })
// }

// --------------- Get selected input type for calculate command ----

document.inputObjectForm.addEventListener('input', () => {
    displayObjectInput();
});
function displayObjectInput() {
    document.getElementById('inputPosMenu').style.display = "none";
    document.getElementById('inputEulerMenu').style.display = "none";
    document.getElementById('inputQuaternionMenu').style.display = "none";
    document.getElementById('inputRotationMenu').style.display = "none";
    document.getElementById('inputLinVelMenu').style.display = "none";
    document.getElementById('inputAngVelMenu').style.display = "none";
    var form = new FormData(document.inputObjectForm);
    var selectedType = form.get("inputObjectType");
    if (selectedType == "Position") document.getElementById('inputPosMenu').style.display = "";
    if (selectedType == "Euler") document.getElementById('inputEulerMenu').style.display = "";
    if (selectedType == "Quaternion") document.getElementById('inputQuaternionMenu').style.display = "";
    if (selectedType == "RotationMatrix") document.getElementById('inputRotationMenu').style.display = "";
    if (selectedType == "LinearVelocity") document.getElementById('inputLinVelMenu').style.display = "";
    if (selectedType == "AngularVelocity") document.getElementById('inputAngVelMenu').style.display = "";
}
displayObjectInput(); // display for starting selection

// --------------- Get selected actors for calculate command ---------
function getSelectedActors() {
    const formData1 = new FormData(document.selectedActor1);
    const selectedActor1Name = formData1.get("selectOptions1");
    const formData2 = new FormData(document.selectedActor2);
    const selectedActor2Name = formData2.get("selectOptions2");
    var out = [];
    for (var i = 0; i < numActors; i++)
        if (selectedActor1Name == actorNames[i]) out[0] = actors[i];
    for (var i = 0; i < numActors; i++)
        if (selectedActor2Name == actorNames[i]) out[1] = actors[i];

    return out;
}
function getSelectedActorNames() {
    const formData1 = new FormData(document.selectedActor1);
    const formData2 = new FormData(document.selectedActor2);
    var out = [];
    out[0] = formData1.get("selectOptions1");
    out[1] = formData2.get("selectOptions2");
    return out;
}

// --------------- Functions for printing threejs objects -------------
// THREE matrices are stored column major
function printTMat(T) {
    return "[" +
        T.elements[0] + "," + T.elements[4] + "," + T.elements[8] + "," + T.elements[12] + "\n " +
        T.elements[1] + "," + T.elements[5] + "," + T.elements[9] + "," + T.elements[13] + "\n " +
        T.elements[2] + "," + T.elements[6] + "," + T.elements[10] + "," + T.elements[14] + "\n " +
        T.elements[3] + "," + T.elements[7] + "," + T.elements[11] + "," + T.elements[15] + "]\n";
}

function printRMat(R) {
    return "[" +
        R.elements[0] + "," + R.elements[3] + "," + R.elements[6] + "," + "\n " +
        R.elements[1] + "," + R.elements[4] + "," + R.elements[7] + "," + "\n " +
        R.elements[2] + "," + R.elements[5] + "," + R.elements[8] + "]\n";
}

function printQuat(quat) {
    return "[" + quat.x + ", " + quat.y + ", " + quat.z + ", " + quat.w + "]^T\n";
}
function printVec(vec) {
    return "[" + vec.x + ", " + vec.y + ", " + vec.z + "]^T\n";
}
function printEulerDegrees(euler) {
    return "[" + euler.x * 180 / Math.PI + ", " + euler.y * 180 / Math.PI + ", " + euler.z * 180 / Math.PI + "]^T\n";
}

// --------------- Calculate command  --------------
const calculateBtn = document.getElementById('calculate');
calculateBtn.addEventListener('click', () => {
    var outputString = "";

    // outputString += "From " + getSelectedActorNames()[0] + " to " + getSelectedActorNames()[1] + "\n";
    var selectedActor1 = getSelectedActors()[0];
    var selectedActor2 = getSelectedActors()[1];
    var T_1 = selectedActor1.matrixWorld;
    var T_2 = selectedActor2.matrixWorld;
    // outputString += "Calculations to go from\n" +
    //     printTMat(T_1) + "\nto\n" + printTMat(T_2) + "\n";

    // get the transorm that brings from 1 to 2
    // T_1f2 = T_2fw.inverse() * T_1fw
    var T_1f2 = new THREE.Matrix4();
    T_1f2 = T_2.invert().multiply(T_1);
    var t_1f2 = new THREE.Vector3();
    var q_1f2 = new THREE.Quaternion();
    var scale_1f2 = new THREE.Vector3();
    T_1f2.decompose(t_1f2, q_1f2, scale_1f2);
    var R_1f2 = new THREE.Matrix4(); // matrix 4 but only has rot
    R_1f2.extractRotation(T_1f2);
    // outputString += "T_1f2 =\n" + printTMat(T_1f2) + "\n";

    //What input type are we handling
    var form = new FormData(document.inputObjectForm);
    var selectedType = form.get("inputObjectType");

    //Position
    if (selectedType == "Position") {
        const formData = new FormData(document.inputPosMenu);

        var position = new THREE.Vector4();
        position.x = formData.get("x");
        position.y = formData.get("y");
        position.z = formData.get("z");
        position.w = 1; // homogenous
        outputString += printVec(position);

        // t_2 = t_1 * T_1f2
        outputString += printVec(position.applyMatrix4(T_1f2.invert()));
    }

    // Euler angles
    if (selectedType == "Euler") {
        const formData = new FormData(document.inputEulerMenu);

        // need to add xyz select order!
        var euler = new THREE.Euler()
        euler.x = formData.get("R") * Math.PI / 180;
        euler.y = formData.get("P") * Math.PI / 180;
        euler.z = formData.get("Y") * Math.PI / 180;
        outputString += printEulerDegrees(euler);

        // Go via quaternion for maths
        var quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(euler);
        var quaternion_2 = quaternion;
        quaternion_2.multiply(q_1f2);

        // output
        var euler_2 = new THREE.Euler();
        euler_2.setFromQuaternion(quaternion_2);
        outputString += printEulerDegrees(euler_2);

    }

    //Quaternion
    if (selectedType == "Quaternion") {
        const formData = new FormData(document.inputQuaternionMenu);

        var quaternion = new THREE.Quaternion();
        quaternion.x = formData.get("Qx");
        quaternion.y = formData.get("Qy");
        quaternion.z = formData.get("Qz");
        quaternion.w = formData.get("Qw");
        outputString += printQuat(quaternion);

        // q_2 = q_1 * q_1f2
        var quaternion_2 = quaternion;
        quaternion_2.multiply(q_1f2);

        outputString += printQuat(quaternion_2);
    }

    // Rotation Matrix
    if (selectedType == "RotationMatrix") {
        const formData = new FormData(document.inputRotationMenu);

        var R = new THREE.Matrix4()
        R.set(
            formData.get("Rot11"), formData.get("Rot12"), formData.get("Rot13"), 0,
            formData.get("Rot21"), formData.get("Rot22"), formData.get("Rot23"), 0,
            formData.get("Rot31"), formData.get("Rot32"), formData.get("Rot33"), 0,
            0, 0, 0, 1
        );
        outputString += printRMat(R);

        // R_2 = R_1 * R_1f2
        var R_2 = R.multiply(R_1f2);

        outputString += printRMat(R_2);
    }

    // Quaternion in 1 becomes what in 2?
    //var testQuaternion = new THREE.Vector4();
    //testQuaternion.x = 2; testQuaternion.y = 3; testQuaternion.z = 4;
    //outputString += printQuat(testQuaternion);
    //var outputQuaternion = unitQuaternion.applyMatrix4(R_2f1);
    //var outputQuaternion = testQuaternion.applyMatrix4(R_2f1);
    //outputString += "Quaternion:\n";
    //outputString += "q_2 = q_1 * " + printQuat(outputQuaternion)

    //example calc
    // var t_1 = new THREE.Vector3(10, -4, 2);
    // var t_2 = t_1.add(position);
    // document.getElementsByName('output')[0].value =
    //     "t_2 = t_1 + [" + position.x + "," + position.y + "," + position.z + "]"
    //     + "\ne.g: [" + t_2.x + "," + t_2.y + "," + t_2.z + "] = ["
    //     + t_1.x + "," + t_1.y + "," + t_1.z + "] + ["
    //     + position.x + "," + position.y + "," + position.z + "]";



    // console.log(-actor1.position.x + actor2.position.x);
    // console.log(-actor1.position.y + actor2.position.z);
    // console.log(-actor1.position.z + actor2.position.z);
    // console.log("VecIn2 = VecIn1 * (2Pos - 1Pos)");


    document.getElementsByName('output')[0].value = outputString;
})

// To-Do list:
// 1. Finish all normal results for all input types
// 2. Remodel ouput box html/css
// 3. Print maths used with outputs
// 4. VALIDATE VALIDATE VALIDATE
// 2. make extra actors (2,4) optional, e.g click a box to add or delete them
// 3. visualise the inputs
// 4. changeable units: e,g mm or metre degrees or radians
// 5. changeable order for euler "x,y,z"
// 6. Import CAD models for visualising
// 7. VALIDATE VALIDATE VALIDATE


// NOTES: 

//3 outputs: 1. result
//           2. symbolic results
//           3. Maths used as text

//would also be good to visualise the input object. e,g visualise a vector, or rotation

// For symbolic results which are ueful for "tricks" like negating x,y when only change is yaw 180
// need to manually solve the matrix multiplicaiton:
// abcd  x     ax+by+
// efgh  y  =  ....
// ijkl  z
// mnop  q
// Could add wrappers around things so that when something is multplied by 0 just dont print the string

// Twist maths
// https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-3-2-twists-part-2-of-2/#department