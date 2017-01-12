import gamestate from '../gamestate.js';

const states = {
    OPEN: 0,
    CLOSED: 1,
    OPENING: 2,
    CLOSING: 3
};

class Door {
    constructor(doorMesh, doorConfig) {
        this.openingTime = doorConfig.openingTime;

        this.mesh = doorMesh;
        this.underDoorNavMesh = null;
        this.doorLeft = null;
        this.doorRight = null;
        this.doorControls = [];

        this.state = undefined;
        this.states = states;

        this._tPos = null;

        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].name.includes('door_nav_blocker')) {
                this.underDoorNavMesh = this.mesh.children[i];
            } else if (this.mesh.children[i].name.includes('door_left')) {
                this.doorLeft = this.mesh.children[i];
            } else if (this.mesh.children[i].name.includes('door_right')) {
                this.doorRight = this.mesh.children[i];
            } else if (this.mesh.children[i].name.includes('door_controls')) {
                this.doorControls.push(this.mesh.children[i]);
            }
        }

        this.originalNavMeshZ = this.underDoorNavMesh.position.z;

        this.originalLeftY = this.doorLeft.position.y;
        this.originalRightY = this.doorRight.position.y;

        this.openLeftY = this.originalLeftY + 4.3;
        this.openRightY = this.originalRightY - 4.3;

        this.resetClosed();

        document.addEventListener('toogleDoors', () => {
            if (this.state === states.CLOSED) this.open();
            if (this.state === states.OPEN) this.close();
        });
    }

    resetClosed() {
        this.underDoorNavMesh.position.z = -10000;
        this.doorLeft.position.y = this.originalLeftY;
        this.doorRight.position.y = this.originalRightY;
        this.state = states.CLOSED;
    }

    resetOpen() {
        this.underDoorNavMesh.position.z = this.originalNavMeshZ;
        this.doorLeft.position.y = this.openLeftY;
        this.doorRight.position.y = this.openRightY;
        this.state = states.OPEN;
    }

    open() {
        if (this.state !== states.CLOSED) return;

        this.state = states.OPENING;
        this.progress = 0;
    }

    close() {
        if (this.state !== states.OPEN) return;

        gamestate.doorsOpen[this.mesh.name] = false;

        this.state = states.CLOSING;
        this.progress = 1;

        this.underDoorNavMesh.position.z = -10000;
    }

    update(dt) {
        if (this.state === states.OPEN || this.state === states.CLOSED) return;
        if (this.state === states.OPENING) {
            if (this.progress === 1) {
                this.state = states.OPEN;
                gamestate.doorsOpen[this.mesh.name] = true;
                this.underDoorNavMesh.position.z = this.originalNavMeshZ;
            } else {
                this.progress += dt / this.openingTime;
                this.progress = Math.min(this.progress, 1);
                this.updateDoorPosition();
            }
        } else if (this.state === states.CLOSING) {
            if (this.progress === 0) {
                this.state = states.CLOSED;
            } else {
                this.progress -= dt / this.openingTime;
                this.progress = Math.max(this.progress, 0);
                this.updateDoorPosition();
            }
        }
    }

    updateDoorPosition() {
        this._tPos = this.ease(this.progress);
        this.doorLeft.position.y = (1 - this._tPos) * this.originalLeftY + this._tPos * this.openLeftY;
        this.doorRight.position.y = (1 - this._tPos) * this.originalRightY + this._tPos * this.openRightY;
    }

    ease(t) {
        return t * t;
    }
}

export default Door;
