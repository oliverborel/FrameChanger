import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { createRefFrame } from './referenceFrame'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

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
axisCanvas.setAttribute('axisCanvasID', 'axisCanvas');
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

// ---------------------------- world frame
const world = createRefFrame(0,0,0);
scene.add(world);

// ---------------------------- Three JS actors
const numActors = 4;
const actors = [];
const actorNames = [];
for (var i = 0; i < numActors; i++) {
    actors[i] = createRefFrame(0, 0, 0, getComputedStyle(document.querySelector(":root")).getPropertyValue("--actor" + (i + 1) + "-color"));
    actorNames[i] = "Actor" + (i + 1);
    scene.add(actors[i]);
}
//On start actor 3 and 4 hidden
actors[2].visible = false;
actors[3].visible = false;
document.getElementById('sel13').style.display = 'none';
document.getElementById('sel13Name').style.display = 'none';
document.getElementById('sel23').style.display = 'none';
document.getElementById('sel23Name').style.display = 'none';
document.getElementById('sel14').style.display = 'none';
document.getElementById('sel14Name').style.display = 'none';
document.getElementById('sel24').style.display = 'none';
document.getElementById('sel24Name').style.display = 'none';
var numActorsVisible = 2;

// Show or hide them based on checkbox
const actor1HideBtn = document.getElementById("actor1Hide");
const actor2HideBtn = document.getElementById("actor2Hide");
const actor3HideBtn = document.getElementById("actor3Hide");
const actor4HideBtn = document.getElementById("actor4Hide");
actor1HideBtn.checked = false;
actor2HideBtn.checked = false;
actor3HideBtn.checked = false;
actor4HideBtn.checked = false;

actor1HideBtn.addEventListener('input', () => {
    if (actor1HideBtn.checked) {
        actors[0].visible = false;
        document.getElementById('sel11').style.display = 'none';
        document.getElementById('sel11Name').style.display = 'none';
        document.getElementById('sel21').style.display = 'none';
        document.getElementById('sel21Name').style.display = 'none';
    }
    else {
        actors[0].visible = true;
        document.getElementById('sel11').style.display = '';
        document.getElementById('sel11Name').style.display = '';
        document.getElementById('sel21').style.display = '';
        document.getElementById('sel21Name').style.display = '';
    }
})
actor2HideBtn.addEventListener('input', () => {
    if (actor2HideBtn.checked) {
        actors[1].visible = false;
        document.getElementById('sel12').style.display = 'none';
        document.getElementById('sel12Name').style.display = 'none';
        document.getElementById('sel22').style.display = 'none';
        document.getElementById('sel22Name').style.display = 'none';
    }
    else {
        actors[1].visible = true;
        document.getElementById('sel12').style.display = '';
        document.getElementById('sel12Name').style.display = '';
        document.getElementById('sel22').style.display = '';
        document.getElementById('sel22Name').style.display = '';
    }
})
actor3HideBtn.addEventListener('input', () => {
    if (actor3HideBtn.checked) {
        actors[2].visible = false;
        document.getElementById('sel13').style.display = 'none';
        document.getElementById('sel13Name').style.display = 'none';
        document.getElementById('sel23').style.display = 'none';
        document.getElementById('sel23Name').style.display = 'none';
    }
    else {
        actors[2].visible = true;
        document.getElementById('sel13').style.display = '';
        document.getElementById('sel13Name').style.display = '';
        document.getElementById('sel23').style.display = '';
        document.getElementById('sel23Name').style.display = '';
    }
})
actor4HideBtn.addEventListener('input', () => {
    if (actor4HideBtn.checked) {
        actors[3].visible = false;
        document.getElementById('sel14').style.display = 'none';
        document.getElementById('sel14Name').style.display = 'none';
        document.getElementById('sel24').style.display = 'none';
        document.getElementById('sel24Name').style.display = 'none';
    }
    else {
        actors[3].visible = true;
        document.getElementById('sel14').style.display = '';
        document.getElementById('sel14Name').style.display = '';
        document.getElementById('sel24').style.display = '';
        document.getElementById('sel24Name').style.display = '';
    }
})

// ---------------------- Get curren Euler order -------------------
function getEulerOrder() {
    return (new FormData(document.selectUnits)).get("eulerOrder");
}
// ---------------------- Set actors from form data
function setActor(actor, formData) {
    actor.position.x = formData.get("position.x");
    actor.position.y = formData.get("position.y");
    actor.position.z = formData.get("position.z");
    //need to add selection for euler order!
    const unitType = new FormData(document.selectUnits).get("units");
    if (unitType == "degrees") {
        actor.rotation.order = getEulerOrder();
        actor.rotation.x = formData.get("rotation.x") * Math.PI / 180;
        actor.rotation.y = formData.get("rotation.y") * Math.PI / 180;
        actor.rotation.z = formData.get("rotation.z") * Math.PI / 180;
    }
    else {
        actor.rotation.order = getEulerOrder();
        actor.rotation.x = formData.get("rotation.x");
        actor.rotation.y = formData.get("rotation.y");
        actor.rotation.z = formData.get("rotation.z");
    }
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

setActor(actors[0], new FormData(document.actor1form));
setActor(actors[1], new FormData(document.actor2form));
setActor(actors[2], new FormData(document.actor3form));
setActor(actors[3], new FormData(document.actor4form));

// below broken for some reason
// for (var i = 0; i < numActorsVisible; i++) {
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

// ---------------------------- Delete / add actors in input menu
const deleteActorBtn = document.getElementById('actorDel')
deleteActorBtn.style.display = "none";
const addActorBtn = document.getElementById('actorAdd')

// Delete last actor
deleteActorBtn.addEventListener('click', () => {
    // minimum 2 actors visible
    if (numActorsVisible > 2) {
        // get current number of actors
        switch (numActorsVisible) {
            case 4:
                // make actor buttons and actor invisible
                document.getElementById('sel14').style.display = 'none';
                document.getElementById('sel14Name').style.display = 'none';
                document.getElementById('sel24').style.display = 'none';
                document.getElementById('sel24Name').style.display = 'none';
                actors[3].visible = false;
                //remove the form
                document.querySelector('.actor4').style.display = "none";
                break;
            case 3:
                // make actor buttons and actor invisible
                document.getElementById('sel13').style.display = 'none';
                document.getElementById('sel13Name').style.display = 'none';
                document.getElementById('sel23').style.display = 'none';
                document.getElementById('sel23Name').style.display = 'none';
                actors[2].visible = false;
                //remove the form
                document.querySelector('.actor3').style.display = "none";
                //Hide this button: cant del more if we deleted 3rd
                document.getElementById('actorDel').style.display = "none";
                break;
        }
        numActorsVisible -= 1;
    }

    document.getElementById('actorAdd').style.display = "block"; // add must be visible if we just deleted one
})

// Add new actor
addActorBtn.addEventListener('click', () => {

    // maximum 4 actors
    if (numActorsVisible < 4) {
        // get current number of actors
        switch (numActorsVisible) {
            case 2:
                // set the actor and actor buttons to visible
                document.getElementById('sel13').style.display = '';
                document.getElementById('sel13Name').style.display = '';
                document.getElementById('sel23').style.display = '';
                document.getElementById('sel23Name').style.display = '';
                actor3HideBtn.checked = false;
                actors[2].visible = true;
                // add the form
                document.querySelector('.actor3').style.display = "block";
                break;
            case 3:
                // set the actor and actor buttons to visible
                document.getElementById('sel14').style.display = '';
                document.getElementById('sel14Name').style.display = '';
                document.getElementById('sel24').style.display = '';
                document.getElementById('sel24Name').style.display = '';
                actor4HideBtn.checked = false;
                actors[3].visible = true;
                // Hide this button: cant add more if we added 4th
                document.getElementById('actorAdd').style.display = "none";
                // add the form
                document.querySelector('.actor4').style.display = "block";
                break;
        }
        numActorsVisible += 1;
    }

    document.getElementById('actorDel').style.display = ""; // del must be visible if we just added one

})

// --------------- Get selected input type for calculate command ----

document.inputObjectForm.addEventListener('input', () => {
    displayObjectInput();
});
function displayObjectInput() {
    document.getElementById('inputPosMenu').style.display = "none";
    document.getElementById('inputEulerMenu').style.display = "none";
    document.getElementById('inputQuaternionMenu').style.display = "none";
    document.getElementById('inputRotationMenu').style.display = "none";
    document.getElementById('inputTwistMenu').style.display = "none";
    var form = new FormData(document.inputObjectForm);
    var selectedType = form.get("inputObjectType");
    if (selectedType == "Position") document.getElementById('inputPosMenu').style.display = "";
    if (selectedType == "Euler") document.getElementById('inputEulerMenu').style.display = "";
    if (selectedType == "Quaternion") document.getElementById('inputQuaternionMenu').style.display = "";
    if (selectedType == "RotationMatrix") document.getElementById('inputRotationMenu').style.display = "";
    if (selectedType == "Twist") document.getElementById('inputTwistMenu').style.display = "";
}
displayObjectInput(); // display for starting selection

// --------------- Get selected actors for calculate command ---------
function getSelectedActors() {
    const formData1 = new FormData(document.selectedActor1);
    const selectedActor1Name = formData1.get("selectOptions1");
    const formData2 = new FormData(document.selectedActor2);
    const selectedActor2Name = formData2.get("selectOptions2");
    var out = [];
    for (var i = 0; i < numActorsVisible; i++)
        if (selectedActor1Name == actorNames[i]) out[0] = actors[i];
    for (var i = 0; i < numActorsVisible; i++)
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
    // need deep copies since if the selected actor is the same then T_1 and T_2 are refs to the same
    var T_1 = new THREE.Matrix4();
    T_1.copy(selectedActor1.matrixWorld);
    var T_2 = new THREE.Matrix4();
    T_2.copy(selectedActor2.matrixWorld);

    // outputString += "Calculations to go from\n" +
    //     printTMat(T_1) + "\nto\n" + printTMat(T_2) + "\n";

    // get the transorm that brings from 1 to 2
    // T_1f2 = T_2fw.inverse() * T_1fw
    var T_1f2 = new THREE.Matrix4();
    T_1f2 = T_2.invert().multiply(T_1);
    var t = new THREE.Vector3();
    var q_1f2 = new THREE.Quaternion();
    var scale_1f2 = new THREE.Vector3();
    T_1f2.decompose(t, q_1f2, scale_1f2);
    var t_1f2 = new THREE.Vector4();
    t_1f2.x = t.x;
    t_1f2.y = t.y;
    t_1f2.z = t.z;
    t_1f2.w = 1; // homogeneous
    var R_1f2 = new THREE.Matrix3();
    R_1f2.setFromMatrix4(T_1f2);
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

        // t_2 = T_1f2 * t_1
        outputString += printVec(position.applyMatrix4(T_1f2));

        // maths used output
        outputString += "t_2 = T_1f2 * t_1\n";
    }

    // Euler angles
    if (selectedType == "Euler") {
        const formData = new FormData(document.inputEulerMenu);

        // need to add xyz select order!
        const unitType = new FormData(document.selectUnits).get("units");
        var euler = new THREE.Euler()
        if (unitType == "degrees") {
            euler.order = getEulerOrder();
            euler.x = formData.get("R") * Math.PI / 180;
            euler.y = formData.get("P") * Math.PI / 180;
            euler.z = formData.get("Y") * Math.PI / 180;
        }
        else {
            euler.order = getEulerOrder();
            euler.x = formData.get("R");
            euler.y = formData.get("P");
            euler.z = formData.get("Y");
        }

        // Print input
        outputString += printEulerDegrees(euler);

        // Go via quaternion for maths
        var quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(euler);
        var quaternion_2 = quaternion;
        quaternion_2.multiply(q_1f2);

        // Print output
        var euler_2 = new THREE.Euler();
        euler_2.setFromQuaternion(quaternion_2);
        outputString += printEulerDegrees(euler_2);

        // maths used output
        outputString += "Convert to and from quaternion for mathematics\n";
    }

    //Quaternion
    if (selectedType == "Quaternion") {
        const formData = new FormData(document.inputQuaternionMenu);

        var quaternion = new THREE.Quaternion();
        quaternion.x = formData.get("Qx");
        quaternion.y = formData.get("Qy");
        quaternion.z = formData.get("Qz");
        quaternion.w = formData.get("Qw");

        // Print input
        outputString += printQuat(quaternion);

        // q_2 = q_1 * q_1f2
        var quaternion_2 = quaternion;
        quaternion_2.multiply(q_1f2);

        //Print output
        outputString += printQuat(quaternion_2);

        // maths used output
        outputString += "q_2 = q_1 * q_1f2\n";
    }

    // Rotation Matrix
    if (selectedType == "RotationMatrix") {
        const formData = new FormData(document.inputRotationMenu);

        var R = new THREE.Matrix3()
        R.set(
            formData.get("Rot11"), formData.get("Rot12"), formData.get("Rot13"),
            formData.get("Rot21"), formData.get("Rot22"), formData.get("Rot23"),
            formData.get("Rot31"), formData.get("Rot32"), formData.get("Rot33")
        );

        // Print input
        outputString += printRMat(R);

        // R_2 = R_1 * R_1f2
        var R_2 = R.multiply(R_1f2);

        // Print ouput
        outputString += printRMat(R_2);

        // maths used output
        outputString += "R_2 = R_1 * R_1f2\n";
    }



    // Twist
    if (selectedType == "Twist") {
        const formData = new FormData(document.inputTwistMenu);

        var angVel = new THREE.Vector3();
        angVel.x = formData.get("Wx");
        angVel.y = formData.get("Wy");
        angVel.z = formData.get("Wz");

        var linVel = new THREE.Vector3();
        linVel.x = formData.get("Vx");
        linVel.y = formData.get("Vy");
        linVel.z = formData.get("Vz");

        // print input
        outputString += printVec(angVel);
        outputString += printVec(linVel);

        // Maths breakdown
        // twist = [Wx;Wy;Wz;Vx;Vy;Vz]
        // adjointT = [R, 0; [t]R, R]
        // twist_2 = adjointT_2f1 * twist_1
        // angVel_2 = R_1f2 * angVel_1
        // linVel_2 = [t_1f2]*R_1f2*angVel_1 + R_1f2 * linVel_1

        // calc lin velocity
        linVel.applyMatrix3(R_1f2);
        var t_1f2_skew = new THREE.Matrix3();
        t_1f2_skew.set(
            0, -t_1f2.z, t_1f2.y,
            t_1f2.z, 0, -t_1f2.x,
            -t_1f2.y, t_1f2.x, 0
        );
        linVel.add(angVel.applyMatrix3(t_1f2_skew.multiply(R_1f2)));

        // get the angular velocity again since javascript doesnt allow shallow copying easily
        angVel.x = formData.get("Wx");
        angVel.y = formData.get("Wy");
        angVel.z = formData.get("Wz");

        // calc ang velocity
        angVel.applyMatrix3(R_1f2);

        // print output
        outputString += printVec(linVel);
        outputString += printVec(angVel);

        // maths used output
        outputString += "twist_2 = [R, 0; [tx]R, R] * twist_1"

    }

    document.getElementsByName('output')[0].value = outputString;
})

// To-Do list:
// 1. Pretty print output
// 5. changeable actor names DIFFICULT
// 8. symbolic maths
// 9. visualise the inputs
// 10. Import CAD models for visualising DOESNT SEEM POSSIBLE TO LOAD FILE AT RUNTIME WITH WEBPACK
// 13. Maths page
// 14. VALIDATE VALIDATE VALIDATE: check all against calcs using eigen?

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