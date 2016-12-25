import config from '../config.js';

import Door from './prefabs/door.js';
import ActiveObject from './prefabs/activeObject.js';

class AppLogicManager {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.fromEyeRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, 5);

        this.navMeshes = [];

        this.activeObjects = [];
        this.activeObjectsColliders = [];

        this._tV2 = new THREE.Vector2(0);
        this._tArr = [];

        this.doorMeshes = this.findDoorMeshes(this.scene);

        this.doors = this.createDoors(this.doorMeshes);

        this.doors.forEach(door => {
            this.navMeshes.push(door.underDoorNavMesh);

            door.doorControls.forEach(controllerMesh => {
                const activeObj = new ActiveObject({type: 'door', controllerMesh, object: door});
                this.activeObjects.push(activeObj);
                this.activeObjectsColliders.push(activeObj.controllerCollider);
            });
        });
    }

    findDoorMeshes(scene) {
        const doorMeshes = [];
        scene.traverse(obj => {
            if (obj.name.includes('door_root')) {
                doorMeshes.push(obj);
            }
        });
        return doorMeshes;
    }

    createDoors(doorMeshes) {
        const doors = [];

        let door;
        doorMeshes.forEach(doorMesh => {
            door = new Door(doorMesh, config.appLogic.doors);
            doors.push(door);
        });
        return doors;
    }

    update(dt, time) { // eslint-disable-line
        this.doors.forEach(door => {
            door.update(dt);
        });

        if (this.controls.currentFloorMesh && !this.controls.currentFloorMesh.name.includes('door_nav_blocker')) {
            // if click to use - set this._tV2 to mouse pos in NDC [-1, 1]
            this.fromEyeRaycaster.setFromCamera(this._tV2, this.camera);
            this._tArr = this.fromEyeRaycaster.intersectObjects(this.activeObjectsColliders);

        }
    }

}

export default AppLogicManager;
