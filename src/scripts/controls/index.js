window.THREE = window.THREE || THREE;

require('three/examples/js/controls/OrbitControls.js');
require('./PointerLockControls.js'); // with touchmove and mac trackpad support

import config from '../config.js';
import gamestate from '../appLogicManager/gamestate.js';
import WalkerTouchControls from './walkerTouchControls.js';

const pauseEvent = new Event('pause');
let self;

const v = {
    height: 10,
    moveForward: false,
    moveLeft: false,
    moveBackward: false,
    moveRight: false,
    speedModifier: 1,
    shiftSpeedModifier: 2,
    jump: false,
    isJumping: false,
    moveForwardBackMultiplier: 1,
    moveLeftRightMultiplier: 0.9,
    mobileRotateHorizontalMult: 0.35,
    mobileRotateVerticalMult: 0.5,
    mobileLookLeftRight: 0,
    mobileLookUpDown: 0,
    velocity: new THREE.Vector3(0, 0, 0),
    raycaster: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 20),
    walkingSpeed: 200,
    spaceSpeed: 70,
    jumpStrength: 17,
    gravity: 50
};

// walker controls local vars
const tA = new THREE.Vector3();
const tB = new THREE.Vector3();
const tC = new THREE.Vector3();

let isOnObject, prevPos, couldMoveThere;
let raycastedObj;
let intersections = [];

// space controls local vars
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

const onKeyDown = function(e) {
    switch (e.keyCode) {
    case 38: // up
    case 87: // w
        v.moveForward = true;
        break;
    case 37: // left
    case 65: // a
        v.moveLeft = true;
        break;
    case 40: // down
    case 83: // s
        v.moveBackward = true;
        break;
    case 39: // right
    case 68: // d
        v.moveRight = true;
        break;
    case 16: // shift
        v.speedModifier = v.shiftSpeedModifier;
        break;
    case 32: // space
        v.jump = true;
        break;
    case 27: // escape
        // this.disableWalker();
        break;
    default:
    }
};

const onKeyUp = function(e) {
    switch (e.keyCode) {
    case 38: // up
    case 87: // w
        v.moveForward = false;
        break;
    case 37: // left
    case 65: // a
        v.moveLeft = false;
        break;
    case 40: // down
    case 83: // s
        v.moveBackward = false;
        break;
    case 39: // right
    case 68: // d
        v.moveRight = false;
        break;
    case 16: // shift
        v.speedModifier = 1;
        break;
    case 32: // space
        v.jump = false;
        break;
    default:
    }
};

class Controls {
    constructor(camera, domElement, scene) {
        self = this;
        this.camera = camera;
        this.domElement = domElement;

        this.walkerEnabled = false;
        this.isDesktop = config.isDesktop;
        this.rotateOnMouseDown = false;

        this.currentFloorMesh = null;

        this.walkerTouchControls = null;

        this.orbitControls = new THREE.OrbitControls(camera, domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.minDistance = config.controls.minDistance;
        this.orbitControls.maxDistance = config.controls.maxDistance;
        this.orbitControls.rotateSpeed = config.controls.rotateSpeed;

        this.orbitControls.enabled = config.isDebug;

        this.infoEl = document.createElement('div');
        this.infoEl.className = 'controlsInfo';
        if (!this.isDesktop) {
            this.infoEl.style.width = '60%';
            this.infoEl.style.height = '20%';
            this.infoEl.style.right = '0';
            this.infoEl.innerHTML = 'Touch controller to move, touch out of controller to look around.';
        } else {
            this.infoEl.innerHTML = 'Movement: WASD / Space / Shift + mouse. Interact: E. Press Escape to pause.';
        }

        this.walkerControls = new THREE.PointerLockControls(camera, domElement);
        this.cObj = this.walkerControls.getObject();
        this.cObj.name = 'pointerLockObject';
        scene.add(this.cObj);

        this.navMeshes = [];

        this.onKeyDown = onKeyDown.bind(this);
        this.onKeyUp = onKeyUp.bind(this);

        this.resetCameraOrbit();

        document.addEventListener('startIntro', () => {
            this.enableWalker(); // workaround: Pointerlock couldn't be used in setTimeout, only immediate response
            this.walkerControls.enabled = false;
        });
        document.addEventListener('startQuest', () => {
            this.resetWalkerPosition();
            this.walkerControls.enabled = !this.rotateOnMouseDown;
        });
        document.addEventListener('pause', () => { this.disableWalker(); });
        document.addEventListener('unpause', () => { this.enableWalker(); });
    }

    enableWalker() {
        if (this.walkerEnabled) return;

        this.rotateOnMouseDown = false;
        if (this.isDesktop) {
            this._addKeyboardListeners();
            if (!this._preparePointerLock()) { // safari couldn't lock the pointer
                this.rotateOnMouseDown = true;
                this._rotateOnMouseDownEnable();
            }
        } else {
            if (!this.walkerTouchControls) {
                this.walkerTouchControls = new WalkerTouchControls(v, config);
            }
            this.walkerTouchControls.enable();
            this.walkerTouchControls.resetJoystickDiv();
        }

        document.body.appendChild(this.infoEl);

        this.orbitControls.enabled = false;
        this.walkerControls.enabled = !this.rotateOnMouseDown;

        this.walkerEnabled = true;
    }

    disableWalker() {
        // this.resetCameraOrbit();
        if (this.walkerEnabled) {
            if (this.isDesktop) {
                this._removeKeyboardListeners();
                this._removePointerLock();
                if (this.rotateOnMouseDown) {
                    this._rotateOnMouseDownDisable();
                }
            } else {
                this.walkerTouchControls.disable();
            }

            document.body.removeChild(this.infoEl);
            document.exitPointerLock();
            // this.orbitControls.enabled = true;
            this.walkerControls.enabled = false;

            this.walkerEnabled = false;
            document.dispatchEvent(pauseEvent);
        }
    }

    addNavMeshes(navMeshesArr) {
        if (navMeshesArr instanceof Array) Array.prototype.push.apply(this.navMeshes, navMeshesArr);
        else throw new Error('controls.addBlockers method expects Array as argument');
    }

    resetCameraOrbit() {
        this.camera.position.fromArray(config.camera.cameraPos);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.near = config.camera.near;
        this.camera.far = config.camera.far;
        this.camera.updateProjectionMatrix();

        this.cObj.position.set(0, 0, 0); // Resets Binding Point offset
        this.cObj.rotation.y = 0; // Resets Yaw Object
        this.cObj.children[0].rotation.x = 0; // Resets Pitch Object
    }

    resetWalkerPosition() {
        this.resetCameraWalker();

        this.cObj.position.fromArray(config.walker.startPos); // Binding Point
        this.cObj.rotation.y = config.walker.startYaw; // Rotates Yaw Object
        this.cObj.children[0].rotation.x = config.walker.startPitch; // Rotates Pitch Object
    }

    resetCameraWalker() {
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
        this.camera.near = config.camera.walkerNear;
        this.camera.far = config.camera.walkerFar;
        this.camera.updateProjectionMatrix();
    }

    update(delta) {
        if (this.orbitControls.enabled && !this.walkerEnabled) {
            // this.orbitControls.update();
        } else if (gamestate.started) {

            if (!this.isDesktop) {
                this.cObj.rotation.y -= v.mobileLookLeftRight * v.mobileRotateHorizontalMult * delta;
                this.cObj.children[0].rotation.x += v.mobileLookUpDown * v.mobileRotateVerticalMult * delta;
                this.cObj.children[0].rotation.x = Math.min(Math.max(
                    this.cObj.children[0].rotation.x, -Math.PI / 2
                ), Math.PI / 2);

                this.walkerTouchControls.applyInertia();
            }

            if (!gamestate.inSpace) this.walkerControlsUpdate(delta);
            else this.spaceControlsUpdate(delta);
        }
    }

    walkerControlsUpdate(delta) {
        v.raycaster.ray.origin.copy(this.cObj.position);

        intersections = v.raycaster.intersectObjects(this.navMeshes, false);

        isOnObject = intersections.length > 0;

        if (isOnObject) this.currentFloorMesh = intersections[0].object;

        v.velocity.x -= v.velocity.x * 10.0 * delta;
        v.velocity.z -= v.velocity.z * 10.0 * delta;
        v.velocity.y -= v.gravity * delta;

        if (v.moveForward) v.velocity.z -= v.walkingSpeed * v.speedModifier * v.moveForwardBackMultiplier * delta;
        if (v.moveBackward) v.velocity.z += v.walkingSpeed * v.speedModifier * v.moveForwardBackMultiplier * delta;
        if (v.moveLeft) v.velocity.x -= v.walkingSpeed * v.speedModifier * v.moveLeftRightMultiplier * delta;
        if (v.moveRight) v.velocity.x += v.walkingSpeed * v.speedModifier * v.moveLeftRightMultiplier * delta;
        if (v.jump && !v.isJumping && !gamestate.inSpace) {
            v.velocity.y = v.jumpStrength;
            v.isJumping = true;
        }

        if (isOnObject) {
            raycastedObj = intersections[0];
            if (raycastedObj.distance + v.velocity.y * delta <= v.height) {
                this.cObj.position.y = intersections[0].point.y + v.height;
                v.velocity.y = 0;
                v.isJumping = false;
            }
        }

        this.cObj.translateY(v.velocity.y * delta);

        prevPos = this.cObj.position.clone();
        this.cObj.translateX(v.velocity.x * delta);
        this.cObj.translateZ(v.velocity.z * delta);

        v.raycaster.ray.origin.copy(this.cObj.position);
        intersections = [];
        intersections = v.raycaster.intersectObjects(this.navMeshes, false);

        couldMoveThere = intersections.length > 0;

        if (isOnObject && couldMoveThere) this.currentFloorMesh = intersections[0].object;

        if (isOnObject && !couldMoveThere) {
            const newP = this.cObj.position.clone();

            const posArr = raycastedObj.object.geometry.attributes.position.array;
            tA.fromArray(posArr, raycastedObj.face.a * 3).applyMatrix4(raycastedObj.object.matrixWorld);
            tB.fromArray(posArr, raycastedObj.face.b * 3).applyMatrix4(raycastedObj.object.matrixWorld);
            tC.fromArray(posArr, raycastedObj.face.c * 3).applyMatrix4(raycastedObj.object.matrixWorld);

            const triCenter = new THREE.Vector3(0).add(tA).add(tB).add(tC).divideScalar(3);
            let intersection = this._linesIntersectsXZ(tA, tB, prevPos, newP);
            if (!intersection.intersect) {
                intersection = this._linesIntersectsXZ(tB, tC, prevPos, newP);
                if (!intersection.intersect) {
                    intersection = this._linesIntersectsXZ(tA, tC, prevPos, newP);
                }
            }

            if (intersection.intersect) {
                const A = intersection.A;
                const B = intersection.B;

                const a = new THREE.Vector3().subVectors(B, A);

                const proj = new THREE.Vector3().subVectors(this.cObj.position, A).projectOnVector(a);

                proj.add(A);

                proj.add(new THREE.Vector3().subVectors(triCenter, proj).divideScalar(1000));

                proj.y = prevPos.y;

                this.cObj.position.copy(proj);
            } else {
                this.cObj.position.copy(prevPos);
            }

            // TODO: should work without it (but it doesn't)
            v.raycaster.ray.origin.copy(this.cObj.position);
            intersections = [];
            intersections = v.raycaster.intersectObjects(this.navMeshes, false);
            if (intersections.length < 1) this.cObj.position.copy(prevPos);
        }
    }

    spaceControlsUpdate(delta) {
        v.velocity.x -= v.velocity.x * 1.5 * delta;
        v.velocity.y -= v.velocity.y * 1.5 * delta;
        v.velocity.z -= v.velocity.z * 1.5 * delta;

        this.walkerControls.getDirection(forward);

        forward.set(0, 0, -1);
        right.set(1, 0, 0);
        rotation.set(this.cObj.children[0].rotation.x, this.cObj.rotation.y, 0);

        forward.applyEuler(rotation);
        right.applyEuler(rotation);

        if (v.moveForward) {
            v.velocity.x += forward.x * v.spaceSpeed * delta;
            v.velocity.y += forward.y * v.spaceSpeed * delta;
            v.velocity.z += forward.z * v.spaceSpeed * delta;
        } else if (v.moveBackward) {
            v.velocity.x -= forward.x * v.spaceSpeed * delta;
            v.velocity.y -= forward.y * v.spaceSpeed * delta;
            v.velocity.z -= forward.z * v.spaceSpeed * delta;
        }

        if (v.moveRight) {
            v.velocity.x += right.x * v.spaceSpeed * delta;
            v.velocity.y += right.y * v.spaceSpeed * delta;
            v.velocity.z += right.z * v.spaceSpeed * delta;
        } else if (v.moveLeft) {
            v.velocity.x -= right.x * v.spaceSpeed * delta;
            v.velocity.y -= right.y * v.spaceSpeed * delta;
            v.velocity.z -= right.z * v.spaceSpeed * delta;
        }

        // this.cObj.translateX(v.velocity.x * delta); // why this approach works incorrect?
        // this.cObj.translateY(v.velocity.y * delta);
        // this.cObj.translateZ(v.velocity.z * delta);
        this.cObj.position.x += v.velocity.x * delta;
        this.cObj.position.y += v.velocity.y * delta;
        this.cObj.position.z += v.velocity.z * delta;
    }

    _linesIntersectsXZ(A, B, C, D) {
        const s1 = new THREE.Vector2(B.x - A.x, B.z - A.z);
        const s2 = new THREE.Vector2(D.x - C.x, D.z - C.z);

        const s = (-s1.y * (A.x - C.x) + s1.x * (A.z - C.z)) / (-s2.x * s1.y + s1.x * s2.y);
        const t = (s2.x * (A.z - C.z) - s2.y * (A.x - C.x)) / (-s2.x * s1.y + s1.x * s2.y);

        const doIntersect = s >= 0 && s <= 1 && t >= 0 && t <= 1;
        return {intersect: doIntersect, A, B};
    }

    _rotateOnMouseDownEnable() {
        this.domElement.addEventListener('mousedown', this._onMousePressTouchStart, false);
        this.domElement.addEventListener('mouseup', this._onMouseReleaseTouchEnd, false);
        this.domElement.addEventListener('mouseout', this._onMouseReleaseTouchEnd, false);
    }

    _rotateOnMouseDownDisable() {
        this.domElement.removeEventListener('mousedown', this._onMousePressTouchStart, false);
        this.domElement.removeEventListener('mouseup', this._onMouseReleaseTouchEnd, false);
        this.domElement.removeEventListener('mouseout', this._onMouseReleaseTouchEnd, false);
    }

    _onMousePressTouchStart(e) {
        e.preventDefault();
        if (e.changedTouches && e.changedTouches.length && !self.walkerControls.enabled) {
            // disabled path for touch devices
            // self.walkerControls.touchId = e.changedTouches[0].identifier;
            // self.walkerControls.touchLastPos.x = e.changedTouches[0].clientX;
            // self.walkerControls.touchLastPos.y = e.changedTouches[0].clientY;
        } else {
            self.walkerControls.mouseLastPos.x = e.clientX;
            self.walkerControls.mouseLastPos.y = e.clientY;
        }
        self.walkerControls.enabled = true;
    }
    _onMouseReleaseTouchEnd() {
        self.walkerControls.enabled = false;
    }

    _pointerlockchange() {
        const element = document.body;
        if (document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element) {
            // self.walkerControls.enabled = true;
        } else {
            if (!self.orbitControls.enabled) self.disableWalker();
        }
    }

    _pointerlockerror(e) {
        console.log(e);
        const element = document.body;
        element.innerHTML = 'PointerLock Error';
    }

    _preparePointerLock() {
        const element = document.body;
        let success = false;
        if ('pointerLockElement' in document || 'mozPointerLockElement' in document ||
             'webkitPointerLockElement' in document) {
            document.addEventListener('pointerlockchange', this._pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', this._pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', this._pointerlockchange, false);

            document.addEventListener('pointerlockerror', this._pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', this._pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', this._pointerlockerror, false);

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock
            || element.webkitRequestPointerLock;
            element.requestPointerLock();
            success = true;
        }
        return success;
    }

    _removePointerLock() {
        document.removeEventListener('pointerlockchange', this._pointerlockchange, false);
        document.removeEventListener('mozpointerlockchange', this._pointerlockchange, false);
        document.removeEventListener('webkitpointerlockchange', this._pointerlockchange, false);

        document.removeEventListener('pointerlockerror', this._pointerlockerror, false);
        document.removeEventListener('mozpointerlockerror', this._pointerlockerror, false);
        document.removeEventListener('webkitpointerlockerror', this._pointerlockerror, false);
    }

    _addKeyboardListeners() {
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    }

    _removeKeyboardListeners() {
        document.removeEventListener('keydown', this.onKeyDown, false);
        document.removeEventListener('keyup', this.onKeyUp, false);
    }

    dispose() {
        this.orbitControls.dispose();
        this.walkerControls.dispose();
    }
}

export default Controls;
