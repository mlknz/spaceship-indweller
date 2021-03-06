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

        this.lights = [];
        this.scene.children.forEach(obj => {
            if (obj instanceof THREE.Light) this.lights.push({ light: obj, originalIntensity: obj.intensity });
        });

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
            highlight: true,
            highlightMeshScale: 1.02,
            highlightWaveHeight: 4,
            highlightWaveSpeed: 2,
            highlightWavePause: 6
        });
        this.activeObjects.push(this.spaceSuit);

        this.repairKit = new ActiveObject({
            type: 'repairKit',
            controllerMesh: this.repairKitMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            highlight: true,
            highlightMeshScale: 1.05,
            highlightWaveHeight: 2.7,
            highlightWaveSpeed: 1.7,
            highlightWavePause: 1
        });
        this.activeObjects.push(this.repairKit);

        this.controlPanel = new ActiveObject({
            type: 'controlPanel',
            controllerMesh: this.controlPanelMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            highlight: true,
            highlightWavePause: 0.7
        });
        this.activeObjects.push(this.controlPanel);

        this.outerPipeBroken = new ActiveObject({
            type: 'outerPipeBroken',
            controllerMesh: this.outerPipeBrokenMesh,
            object: this.outerPipeRepairedMesh,
            activeObjectsColliders: this.activeObjectsColliders,
            outline: true, highlight: true,
            highlightWaveHeight: 2.9,
            highlightWaveSpeed: 1.7,
            highlightWavePause: 2
        });
        this.activeObjects.push(this.outerPipeBroken);

        this.outerPipeRepairedMesh.visible = false;

        document.addEventListener('interact', () => {
            this.interactCommand = true;
        });

        document.addEventListener('toogleDoor', (e) => {
            if (e.detail && e.detail.name && e.detail.action) {
                this.doors.forEach(door => {
                    if (door.mesh.name === e.detail.name) {
                        if (e.detail.action === 'close') {
                            door.close();
                        }
                    }
                });
            }
        });

        this.camIntroStartPos = (new THREE.Vector3()).fromArray(config.camera.cameraPos);
        this.camIntroEndPos = (new THREE.Vector3()).fromArray(config.camera.cameraIntroTargetPos);
        document.addEventListener('startIntro', () => { this.startIntro(); });
        this.playingIntro = false;
        document.addEventListener('pause', () => { this.pause(); });
        document.addEventListener('unpause', () => { this.unpause(); });

        this.interactInfo = document.getElementById('interactInfo');
        if (!config.isDesktop) {
            this.interactInfo.addEventListener('click', () => {
                this.interactCommand = true;
            });
        }
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

    startIntro() {
        gamestate.introStartTime = config.time;
        this.playingIntro = true;
    }

    finishIntro() {
        this.playingIntro = false;
        setTimeout(() => {
            gamestate.started = true;
            gamestate.gameStartTime = config.time;
            document.dispatchEvent(startQuestEvent);
        }, 100);
    }

    startGameFadeIn() {
        i = (config.time - gamestate.gameStartTime) / config.lightsInDuration;
        if (i <= config.lightsInDuration * 1.5) {
            i = Math.min(i, 1);
            this.lights.forEach(l => {
                l.light.intensity = i * i * l.originalIntensity;
            });
            this.starfield.updateBrightness(i);

            this.activeObjects.forEach(activeObj => {
                activeObj.updateSelectionBrightness(i * i);
            });
        }
    }

    updateIntro() {
        i = (config.time - gamestate.introStartTime) / config.introDuration;
        i = Math.min(i, 1);
        this.lights.forEach(l => {
            l.light.intensity = (1 - i * i) * l.originalIntensity;
        });
        this.starfield.updateBrightness(1 - i * i);

        i = i < 0.5 ? 2 * i * i : -1 + (4 - 2 * i) * i;
        this.camera.position.lerpVectors(this.camIntroStartPos, this.camIntroEndPos, i);
        this.camera.lookAt(this.v0);
        this.camera.updateProjectionMatrix();
        if (i >= 1) this.finishIntro();
    }

    update(dt) {
        if (this.playingIntro) this.updateIntro();
        else {
            this.checkWinLose();
            this.startGameFadeIn();

            this.doors.forEach(door => {
                door.update(dt);
            });

            this.activeObjects.forEach(activeObj => {
                activeObj.update(config.time);
            });

            for (i = 0; i < this.activeObjects.length; i++) {
                this.activeObjects[i].deselectObject();
            }

            if (gamestate.inSpace || (this.controls.currentFloorMesh && !this.controls.currentFloorMesh.name.includes('door_nav_blocker'))) {

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

    checkWinLose() {
        if (gamestate.inSpace && !gamestate.pickups.suit) {
            setTimeout(() => {
                gamestate.lose = true;
                gamestate.gameoverMessage = 'You die in space as oxygen leaves the cell!';
                this.gameover();
            }, 1000);
        }

        if (gamestate.engineEnabled && gamestate.pipeRepaired) {
            setTimeout(() => {
                gamestate.win = true;
                gamestate.gameoverMessage = 'Engine works as expected!' + '<br />' + ' Good job!';
                this.gameover();
            }, 1500);
        }
    }

    gameover() {
        const controlPanelRoot = document.getElementById('controlPanelRoot');
        controlPanelRoot.style.display = 'none';

        document.dispatchEvent(pauseEvent);

        this.interactInfo.style.zIndex = '-10';
        const gameoverDiv = document.getElementById('gameoverRoot');

        const gameoverTextDiv = document.getElementById('gameoverText');
        const gameoverText = gamestate.gameoverMessage;

        gameoverTextDiv.innerHTML = gameoverText;

        gameoverDiv.style.display = 'block';
    }

}

export default AppLogicManager;
