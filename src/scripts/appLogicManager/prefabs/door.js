const states = {
    OPEN: 0,
    CLOSED: 1,
    OPENING: 2,
    CLOSING: 3
};

class Door {
    constructor(doorMesh) {
        this.mesh = doorMesh;
        this.underDoorNavMesh = null;
        this.doorLeft = null;
        this.doorRight = null;

        this.state = undefined;

        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].name.includes('door_nav_blocker')) {
                this.underDoorNavMesh = this.mesh.children[i];
            } else if (this.mesh.children[i].name.includes('door_left')) {
                this.doorLeft = this.mesh.children[i];
            } else if (this.mesh.children[i].name.includes('door_right')) {
                this.doorRight = this.mesh.children[i];
            }
        }

        this.originalNavMeshZ = this.underDoorNavMesh.position.z;

        this.originalLeftY = this.doorLeft.position.y;
        this.originalRightY = this.doorRight.position.y;

        this.openLeftY = this.originalLeftY + 4.3;
        this.openRightY = this.originalRightY + -4.3;

        this.resetClosed();
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
}

export default Door;
