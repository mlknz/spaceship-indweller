import config from '../config.js';

import Door from './prefabs/door.js';
import ActiveObject from './prefabs/activeObject.js';

class AppLogicManager {
    constructor(scene) {
        this.scene = scene;

        this.navMeshes = [];
        this.actionBlockers = [];
        this.activeObjects = [];

        this.doorMeshes = this.findDoorMeshes(this.scene);

        this.doors = this.createDoors(this.doorMeshes);

        this.doors.forEach(door => {
            this.navMeshes.push(door.underDoorNavMesh);
            this.actionBlockers.push(door.underDoorNavMesh);

            door.doorControls.forEach(controllerMesh => {
                const activeObj = new ActiveObject({type: 'door', controllerMesh, object: door});
                this.activeObjects.push(activeObj);
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
    }

}

export default AppLogicManager;
