class Door {
    constructor(doorMesh) {
        this.mesh = doorMesh;

        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].name.includes('door_nav_blocker')) {
                this.underDoorNavMesh = this.mesh.children[i];
                break;
            }
        }

        this.originalNavMeshZ = this.underDoorNavMesh.position.z;
        this.underDoorNavMesh.position.z = -10000;
    }
}

export default Door;
