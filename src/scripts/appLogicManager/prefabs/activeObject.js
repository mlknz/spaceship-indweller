import config from '../../config.js';
import gamestate from '../gamestate.js';

import defaultVert from '../../app-viewer/materialDecorator/shaders/default.vert';
import activeObjectSelectionFrag from '../../app-viewer/materialDecorator/shaders/activeObjectSelection.frag';

class ActiveObject {
    constructor({type, controllerMesh, object, activeObjectsColliders, outline, highlight} = {}) {
        this.type = type;
        this.disposeMessage = null;

        switch (this.type) {
        case 'suit':
            this.disposeMessage = 'You have equipped Space Suit';
            break;
        case 'repairKit':
            this.disposeMessage = 'You picked up Repair Kit';
            break;
        default:
            this.disposeMessage = 'Default activeObject disposeMessage';
        }

        this.controller = controllerMesh;
        this.controllableObject = object;

        this.outlineMesh = null;
        this.highlightMesh = null;

        this.selected = false;

        this.selectedColor = new THREE.Color(0x55aaaa);
        this.deselectedColor = new THREE.Color(0xff7777);

        this.controllerCollider = this.controller;
        for (let i = 0; i < this.controller.children.length; i++) {
            if (this.controller.children[i].name.includes('collider')) {
                this.controllerCollider = this.controller.children[i];
                break;
            }
        }
        this.controllerCollider.userData.activeObject = this;

        this.activeObjectsColliders = activeObjectsColliders;
        this.activeObjectsColliders.push(this.controllerCollider);

        if (outline) this.addOutlineMesh();
        if (highlight) this.addHighlightMesh();
    }

    addOutlineMesh() {
        const geom = this.controller.geometry;
        const mat = new THREE.MeshBasicMaterial({side: THREE.BackSide, transparent: true});

        mat.color = this.deselectedColor;
        mat.opacity = 0.2;
        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = this.controller.name + '_outlineMesh';

        this.controller.parent.add(mesh);

        mesh.matrix.compose(this.controller.position, this.controller.quaternion, this.controller.scale);
        mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.scale.multiplyScalar(1.05);

        this.outlineMesh = mesh;
    }

    addHighlightMesh() {
        const geom = this.controller.geometry;
        const uniforms = THREE.UniformsUtils.clone(THREE.ShaderLib.basic.uniforms);
        const mat = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: defaultVert,
            fragmentShader: activeObjectSelectionFrag,
            transparent: true
        });

        mat.uniforms.diffuse.value = this.deselectedColor;
        mat.uniforms.opacity.value = 0.2;

        mat.uniforms.time = {value: 0};

        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = this.controller.name + '_highlightMesh';

        this.controller.parent.add(mesh);

        mesh.matrix.compose(this.controller.position, this.controller.quaternion, this.controller.scale);
        mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.scale.multiplyScalar(1.03);

        this.highlightMesh = mesh;
    }

    updateSelectionBrightness(val) {
        if (this.highlightMesh) this.highlightMesh.material.uniforms.opacity.value = val * 0.2;
        if (this.outlineMesh) this.outlineMesh.material.opacity = val * 0.2;
    }

    update(time) {
        if (this.highlightMesh) this.highlightMesh.material.uniforms.time.value = time;
    }

    selectObject() {
        if (!this.selected) {
            this.selected = true;
            if (this.highlightMesh) this.highlightMesh.material.uniforms.diffuse.value = this.selectedColor;
            if (this.outlineMesh) this.outlineMesh.material.color = this.selectedColor;
        }
    }

    deselectObject() {
        if (this.selected) {
            this.selected = false;
            if (this.highlightMesh) this.highlightMesh.material.uniforms.diffuse.value = this.deselectedColor;
            if (this.outlineMesh) this.outlineMesh.material.color = this.deselectedColor;
        }
    }

    makeAction() {
        switch (this.type) {
        case 'door':
            if (this.controllableObject.state === this.controllableObject.states.CLOSED) {
                gamestate.doors[this.controllableObject.mesh.name] = true;
                this.controllableObject.open();

                this.openDoorGatewayLogic();
            } else if (this.controllableObject.state === this.controllableObject.states.OPEN) {
                gamestate.doors[this.controllableObject.mesh.name] = false;
                this.controllableObject.close();
            }
            break;
        case 'suit':
        case 'repairKit':
            this.dispose();
            break;
        default:
            console.log('unhandled activeObject action');
        }
    }

    openDoorGatewayLogic() {
        if (this.controllableObject.mesh.name === 'door_root_7') {

            const toogleDoorEvent = new CustomEvent('toogleDoor', {
                detail: {
                    name: 'door_root_6',
                    action: 'close'
                }
            });
            document.dispatchEvent(toogleDoorEvent);

            setTimeout(() => {
                gamestate.inSpace = true;
            }, config.appLogic.gatewayControlsChangeDecay);

        } else if (this.controllableObject.mesh.name === 'door_root_6') {

            const toogleDoorEvent = new CustomEvent('toogleDoor', {
                detail: {
                    name: 'door_root_7',
                    action: 'close'
                }
            });
            document.dispatchEvent(toogleDoorEvent);

            gamestate.inSpace = false;

        }
    }

    dispose() {
        if (this.type === 'suit') gamestate.pickups.suit = true;
        else if (this.type === 'repairKit') gamestate.pickups.repairKit = true;

        for (let i = 0; i < this.activeObjectsColliders.length; i++) {
            if (this.activeObjectsColliders[i].name === this.controllerCollider.name) {
                this.activeObjectsColliders.splice(i, 1);
            }
        }

        this.controller.parent.remove(this.controller);
        if (this.highlightMesh) this.highlightMesh.parent.remove(this.highlightMesh);
        if (this.outlineMesh) this.outlineMesh.parent.remove(this.outlineMesh);
        this.controller = null;
        this.highlightMesh = null;
        this.outlineMesh = null;

        this.activeObjectsColliders = null;
        this.controller = null;
        this.controllableObject = null;

        const disposeInfo = document.createElement('div');
        disposeInfo.className = 'disposeInfo';
        disposeInfo.innerHTML = this.disposeMessage;
        disposeInfo.style.display = 'block';
        document.body.appendChild(disposeInfo);
        setTimeout(() => {
            disposeInfo.className = 'disposeInfoHidden';
        }, 1000);
    }
}

export default ActiveObject;
