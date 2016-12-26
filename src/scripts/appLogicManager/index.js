import config from '../config.js';

import Door from './prefabs/door.js';
import ActiveObject from './prefabs/activeObject.js';

let i = 0;

class AppLogicManager {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.fromEyeRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, 5);

        this.navMeshes = [];

        this.activeObjects = [];
        this.activeObjectsColliders = [];

        this.interactCommand = false;

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

        document.addEventListener('interact', () => {
            this.interactCommand = true;
        });

        const interactInfo = document.createElement('div');
        interactInfo.style.position = 'absolute';
        interactInfo.style.bottom = '60px';
        interactInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        interactInfo.style.width = '20%';
        interactInfo.style.height = '50px';
        interactInfo.style.left = '40%';
        interactInfo.innerHTML = 'Press E on keyboard interact with objects';
        interactInfo.style.display = 'none';
        document.body.appendChild(interactInfo);
        this.interactInfo = interactInfo;
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

        for (i = 0; i < this.activeObjects.length; i++) {
            this.activeObjects[i].deselectObject(); // todo: refactor
        }

        if (this.controls.currentFloorMesh && !this.controls.currentFloorMesh.name.includes('door_nav_blocker')) {
            // if click to use - set this._tV2 to mouse pos in NDC [-1, 1]
            this.fromEyeRaycaster.setFromCamera(this._tV2, this.camera);
            this._tArr = this.fromEyeRaycaster.intersectObjects(this.activeObjectsColliders);

            for (i = 0; i < this._tArr.length; i++) {
                if (this._tArr[i].object.userData.activeObject) this._tArr[i].object.userData.activeObject.selectObject();
            }
        }

        this.interactInfo.style.display = this._tArr.length ? 'block' : 'none';

        for (i = 0; i < this.activeObjects.length; i++) {
            if (this.activeObjects[i].selected && this.interactCommand) this.activeObjects[i].makeAction();
        }

        this.interactCommand = false;

    }

}

export default AppLogicManager;
