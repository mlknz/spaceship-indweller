window.THREE = THREE;

require('three/examples/js/controls/OrbitControls.js');

import config from '../config.js';

class Controls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.orbitControls = new THREE.OrbitControls(camera, domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.minDistance = config.controls.minDistance;
        this.orbitControls.maxDistance = config.controls.maxDistance;
        this.orbitControls.rotateSpeed = config.controls.rotateSpeed;

        this.resetCameraOrbit();
    }

    resetCameraOrbit() {
        this.camera.position.fromArray(config.camera.cameraPos);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.near = config.camera.near;
        this.camera.far = config.camera.far;
        this.camera.updateProjectionMatrix();
    }

    update() {
        this.orbitControls.update();
    }

    dispose() {
        this.orbitControls.dispose();
    }
}

export default Controls;
