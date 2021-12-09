import * as THREE from 'three'

function createRefFrame(x, y, z, color) {
    var position = new THREE.Vector3(x, y, z);
    const group = new THREE.Group();
    group.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), position, 60, 0x7F2020, 20, 10));
    group.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), position, 60, 0x207F20, 20, 10));
    group.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), position, 60, 0x20207F, 20, 10));

    if (color != undefined) { 
        const geometry = new THREE.SphereGeometry(10, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;
        group.add(sphere);
    }
    return group;
}
export { createRefFrame }