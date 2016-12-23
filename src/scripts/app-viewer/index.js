import config from '../config.js';

import SceneManager from './sceneManager';
import AppLogicManager from '../appLogicManager';
import Controls from '../controls';

class AppViewer {
    constructor(renderer) {
        this.renderer = renderer;
        this.renderer.setClearColor(config.renderer.clearColor, config.renderer.clearAlpha);
        this.renderer.setPixelRatio(config.renderer.devicePixelRatio);

        const gl = this.renderer.getContext();
        const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;

        this.sceneManager = new SceneManager();

        this.camera = new THREE.PerspectiveCamera(60, aspectRatio, config.camera.near, config.camera.far);

        this.sceneReady = false;
        document.addEventListener('sceneReady', this.onSceneReady.bind(this));
    }

    onSceneReady() {
        this.sceneReady = true;
        this.controls = new Controls(this.camera, this.renderer.domElement, this.sceneManager.scene);
        this.controls.resetCameraOrbit();

        this.appLogicManager = new AppLogicManager(this.sceneManager.scene);

        const mainNavMesh = this.sceneManager.scene.getObjectByName('navmesh');
        this.controls.addNavMeshes([mainNavMesh]);
        this.controls.addNavMeshes(this.appLogicManager.navMeshes);
    }

    update(dt) {
        if (!this.sceneReady) return;

        config.time += dt;

        this.controls.update(dt);
        this.appLogicManager.update(dt, config.time);
        this.renderer.render(this.sceneManager.scene, this.camera);
    }

    resize(width, height) {
        const aspectRatio = width / height;

        if (this.camera.aspect !== aspectRatio) {
            this.camera.aspect = aspectRatio;
            this.camera.updateProjectionMatrix();
        }
    }

    dispose() {
        this.controls.dispose();
        // this.clearScene();
    }

}

export default AppViewer;
