import AssetsLoader from '../assetsLoader';

import sceneDescription from './sceneDescription.js';

class SceneManager {
    constructor() {
        this.createSceneFromDescription();

        this.cube = this.scene.getObjectByName('Cube');

        const spotLight = this.scene.getObjectByName('spotLight');
        spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 2500));
        spotLight.shadow.bias = 0.0001;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        this.assetsLoader = new AssetsLoader(this.scene);
        this.assetsLoader.loadModel();
    }

    createSceneFromDescription() {
        this.scene = new THREE.Scene();
        this.addChildrenFromDescription(this.scene, sceneDescription.model.children);
    }

    addChildrenFromDescription(cur, curChildrenDescription) {
        let obj;
        curChildrenDescription.forEach(child => {
            obj = this.createObjectFromDescription(child);
            cur.add(obj);

            if (child.children && child.children.length > 0) {
                this.addChildrenFromDescription(obj, child.children);
            }
        });
    }

    createObjectFromDescription(d) {
        let objType = 'Object3D';
        if (d.object && d.object.type) objType = d.object.type;
        else if (d.type) objType = d.type;

        let args = null;
        if (d.object && d.object.args) args = d.object.args;
        else if (d.args) args = d.args;

        let obj;
        if (objType === 'Mesh' || d.object && d.object.geometry) {
            const geom = this.createObjectFromDescription(d.object.geometry);
            let mat = null;
            if (d.object.material) mat = this.createObjectFromDescription(d.object.material);
            obj = new THREE.Mesh(geom, mat);
        } else {
            if (args instanceof Array) obj = new THREE[objType](...args);
            else obj = new THREE[objType](args);
        }

        if (d.properties) this.addObjectProperties(obj, d.properties);

        return obj;
    }

    addObjectProperties(obj, props) {
        let p;
        let q;
        for (p in props) {
            if (props.hasOwnProperty(p)) {
                if (props[p] instanceof Object) { // need only 1 property depth level now
                    if (!obj[p]) obj[p] = {};
                    for (q in props[p]) {
                        if (props[p].hasOwnProperty(q)) {
                            obj[p][q] = props[p][q];
                        }
                    }
                } else {
                    obj[p] = props[p];
                }
            }
        }
    }

    update(dt, time) {
        this.cube.position.x = Math.cos(time) * 3;
        this.cube.position.z = Math.sin(time) * 3;
        this.cube.rotation.y += dt;
        this.cube.rotation.z += dt / 3;
    }
}

export default SceneManager;
