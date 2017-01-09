import config from '../config.js';
import gamestate from './gamestate.js';

import Door from './prefabs/door.js';
import Starfield from './prefabs/starfield.js';
import ActiveObject from './prefabs/activeObject.js';

const startQuestEvent = new Event('startQuest');
const pauseEvent = new Event('pause');

let i = 0;

class AppLogicManager {
    constructor(renderer, scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.fromEyeRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, 5);

        this.navMeshes = [];

        this.activeObjects = [];
        this.activeObjectsColliders = [];

        this.interactCommand = false;

        this._tV2 = new THREE.Vector2(0);
        this.v0 = new THREE.Vector3(0, 0, 0);
        this._tArr = [];

        this.starfield = new Starfield(renderer, this.scene);

        this.doorMeshes = [];
        this.findUsableMeshes(this.scene);

        this.doors = this.createDoors(this.doorMeshes);

        this.doors.forEach(door => {
            this.navMeshes.push(door.underDoorNavMesh);

            door.doorControls.forEach(controllerMesh => {
                const activeObj = new ActiveObject({
                    type: 'door',
                    controllerMesh,
                    object: door,
                    activeObjectsColliders: this.activeObjectsColliders,
                    outline: true,
                    highlight: true
                });
                this.activeObjects.push(activeObj);
            });
        });

        this.spaceSuit = new ActiveObject({
            type: 'suit',
            controllerMesh: this.spaceSuitMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            highlight: true
        });
        this.activeObjects.push(this.spaceSuit);

        this.repairKit = new ActiveObject({
            type: 'repairKit',
            controllerMesh: this.repairKitMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            highlight: true
        });
        this.activeObjects.push(this.repairKit);

        this.controlPanel = new ActiveObject({
            type: 'controlPanel',
            controllerMesh: this.controlPanelMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            highlight: true
        });
        this.activeObjects.push(this.controlPanel);

        this.outerPipeBroken = new ActiveObject({
            type: 'outerPipeBroken',
            controllerMesh: this.outerPipeBrokenMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            outline: true, highlight: true
        });
        this.activeObjects.push(this.outerPipeBroken);

        this.outerPipeRepairedMesh.visible = false;

        const tV = new THREE.Vector2();
        let tA = [];

        document.addEventListener('interact', (e) => {
            if (e.detail && e.detail.x && e.detail.y) {
                tV.x = (e.detail.x - 0.5) * 2;
                tV.y = (e.detail.y - 0.5) * 2;
                this.fromEyeRaycaster.setFromCamera(tV, this.camera);
                tA = this.fromEyeRaycaster.intersectObjects(this.activeObjectsColliders);
                if (tA.length > 0) this.interactCommand = true;

            } else {
                this.interactCommand = true;
            }
        });

        this.camIntroStartPos = (new THREE.Vector3()).fromArray(config.camera.cameraPos);
        this.camIntroEndPos = (new THREE.Vector3()).fromArray(config.camera.cameraIntroTargetPos);
        document.addEventListener('startIntro', () => { this.startIntro(); });
        this.playingIntro = false;
        document.addEventListener('pause', () => { this.pause(); });
        document.addEventListener('unpause', () => { this.unpause(); });

        const interactInfo = document.createElement('div');
        interactInfo.className = 'interactInfo';
        interactInfo.innerHTML = this.controls.isDesktop ? 'Press E to interact' : 'Touch to interact';
        document.body.appendChild(interactInfo);
        this.interactInfo = interactInfo;
    }

    findUsableMeshes(scene) {
        scene.traverse(obj => {
            if (obj.name.includes('door_root')) {
                this.doorMeshes.push(obj);
            } else if (obj.name === 'space_suit') {
                this.spaceSuitMesh = obj;
            } else if (obj.name === 'repair_kit') {
                this.repairKitMesh = obj;
            } else if (obj.name === 'control_panel') {
                this.controlPanelMesh = obj;
            } else if (obj.name === 'outer_pipe_broken') {
                this.outerPipeBrokenMesh = obj;
            } else if (obj.name === 'outer_pipe_repaired') {
                this.outerPipeRepairedMesh = obj;
            }
        });
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

    pause() {
        if (!gamestate.paused) {
            gamestate.paused = true;
        }
    }

    unpause() {
        if (gamestate.paused) {
            gamestate.paused = false;
        }
    }

    gameover() {
        document.dispatchEvent(pauseEvent);

        const gameoverDiv = document.getElementById('gameoverRoot');

        const gameoverTextDiv = document.getElementById('gameoverText');
        const gameoverText = gamestate.win ? 'YOU WIN!' : 'YOU LOSE!';

        gameoverTextDiv.innerHTML = gameoverText;

        gameoverDiv.style.display = 'block';
    }

    startIntro() {
        this.introStartTime = config.time;
        this.playingIntro = true;
    }

    finishIntro() {
        this.playingIntro = false;
        setTimeout(() => {
            gamestate.started = true;
            document.dispatchEvent(startQuestEvent);
        }, 100);
    }

    update(dt) {
        if (this.playingIntro) {
            i = (config.time - this.introStartTime) / config.introDuration;
            i = Math.min(i, 1);
            i = i < 0.5 ? 2 * i * i : -1 + (4 - 2 * i) * i;
            this.camera.position.lerpVectors(this.camIntroStartPos, this.camIntroEndPos, i);
            this.camera.lookAt(this.v0);
            this.camera.updateProjectionMatrix();
            if (i >= 1) this.finishIntro();
        } else {
            if (gamestate.doors.door_root_7 && !gamestate.pickups.suit) {
                gamestate.lose = true;
                this.gameover();
            }
            if (gamestate.doors.door_root_7 && gamestate.pickups.suit) {
                gamestate.win = true;
                this.gameover(true);
            }

            this.doors.forEach(door => {
                door.update(dt);
            });

            this.activeObjects.forEach(activeObj => {
                activeObj.update(config.time);
            });

            for (i = 0; i < this.activeObjects.length; i++) {
                this.activeObjects[i].deselectObject();
            }

            if (this.controls.currentFloorMesh && !this.controls.currentFloorMesh.name.includes('door_nav_blocker')) {

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

}

export default AppLogicManager;
