class ActiveObject {
    constructor({type, controllerMesh, object} = {}) {
        this.type = type;
        this.controller = controllerMesh;
        this.controllableObject = object;

        this.controllerCollider = this.controller;
        for (let i = 0; i < this.controller.children.length; i++) {
            if (this.controller.children[i].name.includes('collider')) {
                this.controllerCollider = this.controller.children[i];
                break;
            }
        }

        this.addHighlightMesh();
    }

    addHighlightMesh() {
        const geom = this.controller.geometry;
        const mat = new THREE.MeshBasicMaterial({color: 'red', side: THREE.BackSide, transparent: true});
        mat.opacity = 0.4;
        const highlightMesh = new THREE.Mesh(geom, mat);
        highlightMesh.name = this.controller.name + '_highlightMesh';

        this.controller.parent.add(highlightMesh);

        highlightMesh.matrix.compose(this.controller.position, this.controller.quaternion, this.controller.scale);
        highlightMesh.matrix.decompose(highlightMesh.position, highlightMesh.quaternion, highlightMesh.scale);
        highlightMesh.scale.multiplyScalar(1.05);
    }
}

export default ActiveObject;
