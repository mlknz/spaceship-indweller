class Door {
    constructor(doorMesh) {
        this.mesh = doorMesh;

        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].name.includes('door_nav_blocker')) {
                this.navBlocker = this.mesh.children[i];
                break;
            }
        }
    }
}

export default Door;
