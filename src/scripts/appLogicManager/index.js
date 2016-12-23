import config from '../config.js';

import Door from './prefabs/door.js';

class AppLogicManager {
    constructor(scene) {
        this.scene = scene;

        this.movementBlockers = [];

        this.doorMeshes = this.findDoorMeshes(this.scene);

        this.doors = this.createDoors(this.doorMeshes);

        this.doors.forEach(door => {
            this.movementBlockers.push(door.navBlocker);
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
            door = new Door(doorMesh);
            doors.push(door);
        });
        return doors;
    }

    update(dt, time) { // eslint-disable-line

    }

}

export default AppLogicManager;
