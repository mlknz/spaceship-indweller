window.THREE = window.THREE || THREE;

require('three/examples/js/controls/OrbitControls.js');
require('./PointerLockControls.js'); // with touchmove and mac trackpad support

import config from '../config.js';
import WalkerTouchControls from './walkerTouchControls.js';

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
    jumpStrength: 17,
    gravity: 50
};

const tA = new THREE.Vector3();
const tB = new THREE.Vector3();
const tC = new THREE.Vector3();

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
        if (!this.orbitControls.enabled) this.disableWalker();
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

        this.infoEl = document.createElement('div');
        this.infoEl.className = 'buttonsRoot';
        this.infoEl.style.background = 'rgba(255,255,255,0.4)';
        if (!this.isDesktop) {
            this.infoEl.style.width = '60%';
            this.infoEl.style.height = '20%';
            this.infoEl.style.right = '0';
            this.infoEl.innerHTML = 'Controls: touch joystick to move, touch out of joystick to look around.';
        } else {
            this.infoEl.innerHTML = 'Controls: WASD / Space / Shift + mouse. Press Escape to exit.';
        }

        this.walkerControls = new THREE.PointerLockControls(camera, domElement);
        this._controlsObject = this.walkerControls.getObject();
        this._controlsObject.name = 'pointerLockObject';
        scene.add(this._controlsObject);

        this.resetCameraOrbit();

        this.navMeshes = [];

        this.onKeyDown = onKeyDown.bind(this);
        this.onKeyUp = onKeyUp.bind(this);

        this.resetCameraOrbit();

        document.addEventListener('startQuest', this.enableWalker.bind(this));
    }

    enableWalker() {
        if (!this.orbitControls.enabled) return;
        this.resetCameraWalker();

        this._controlsObject.position.fromArray([-47, 8, -29]); // Binding Point
        this._controlsObject.rotation.y = -1; // Rotates Yaw Object
        this._controlsObject.children[0].rotation.x = 0; // Rotates Pitch Object

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
    }

    disableWalker() {
        this.resetCameraOrbit();

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

        this.orbitControls.enabled = true;
        this.walkerControls.enabled = false;

        // document.dispatchEvent(disableWalkerEvent);
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

        this._controlsObject.position.set(0, 0, 0); // Resets Binding Point offset
        this._controlsObject.rotation.y = 0; // Resets Yaw Object
        this._controlsObject.children[0].rotation.x = 0; // Resets Pitch Object
    }

    resetCameraWalker() {
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
        this.camera.near = config.camera.walkerNear;
        this.camera.far = config.camera.walkerFar;
        this.camera.updateProjectionMatrix();
    }

    update(delta) {
        if (this.orbitControls.enabled) {
            this.orbitControls.update();
        } else {
            const cObj = this._controlsObject;

            if (!this.isDesktop) {
                cObj.rotation.y -= v.mobileLookLeftRight * v.mobileRotateHorizontalMult * delta;
                cObj.children[0].rotation.x += v.mobileLookUpDown * v.mobileRotateVerticalMult * delta;
                cObj.children[0].rotation.x = Math.min(Math.max(
                    cObj.children[0].rotation.x, -Math.PI / 2
                ), Math.PI / 2);

                this.walkerTouchControls.applyInertia();
            }

            let raycastedObj;

            v.raycaster.ray.origin.copy(cObj.position);

            let intersections = [];
            intersections = v.raycaster.intersectObjects(this.navMeshes, false);

            const isOnObject = intersections.length > 0;

            if (isOnObject) this.currentFloorMesh = intersections[0].object;

            v.velocity.x -= v.velocity.x * 10.0 * delta;
            v.velocity.z -= v.velocity.z * 10.0 * delta;
            v.velocity.y -= v.gravity * delta;

            if (v.moveForward) v.velocity.z -= v.walkingSpeed * v.speedModifier * v.moveForwardBackMultiplier * delta;
            if (v.moveBackward) v.velocity.z += v.walkingSpeed * v.speedModifier * v.moveForwardBackMultiplier * delta;
            if (v.moveLeft) v.velocity.x -= v.walkingSpeed * v.speedModifier * v.moveLeftRightMultiplier * delta;
            if (v.moveRight) v.velocity.x += v.walkingSpeed * v.speedModifier * v.moveLeftRightMultiplier * delta;
            if (v.jump && !v.isJumping) {
                v.velocity.y = v.jumpStrength;
                v.isJumping = true;
            }

            if (isOnObject) {
                raycastedObj = intersections[0];
                if (raycastedObj.distance + v.velocity.y * delta <= v.height) {
                    cObj.position.y = intersections[0].point.y + v.height;
                    v.velocity.y = 0;
                    v.isJumping = false;
                }
            }

            cObj.translateY(v.velocity.y * delta);

            const prevPos = cObj.position.clone();
            cObj.translateX(v.velocity.x * delta);
            cObj.translateZ(v.velocity.z * delta);

            v.raycaster.ray.origin.copy(cObj.position);
            intersections = [];
            intersections = v.raycaster.intersectObjects(this.navMeshes, false);

            const couldMoveThere = intersections.length > 0;

            if (isOnObject && couldMoveThere) this.currentFloorMesh = intersections[0].object;

            if (isOnObject && !couldMoveThere) {
                const newP = cObj.position.clone();

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

                    const proj = new THREE.Vector3().subVectors(cObj.position, A).projectOnVector(a);

                    proj.add(A);

                    proj.add(new THREE.Vector3().subVectors(triCenter, proj).divideScalar(1000));

                    proj.y = prevPos.y;

                    cObj.position.copy(proj);
                } else {
                    cObj.position.copy(prevPos);
                }

                // TODO: should work without it (but it doesn't)
                v.raycaster.ray.origin.copy(cObj.position);
                intersections = [];
                intersections = v.raycaster.intersectObjects(this.navMeshes, false);
                if (intersections.length < 1) cObj.position.copy(prevPos);
            }
        }
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

    _pointerlockerror() {
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
