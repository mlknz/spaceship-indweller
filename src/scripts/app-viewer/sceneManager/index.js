import AssetsLoader from '../assetsLoader';

import sceneDescription from './sceneDescription.js';
import materialsDescription from './materialsDescription';

import MaterialDecorator from '../materialDecorator';

const sceneReadyEvent = new Event('sceneReady');

class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();

        this.assetsLoader = new AssetsLoader(this.scene);

        this.materialDecorator = new MaterialDecorator(materialsDescription);

        document.addEventListener('assetsLoaded', this.onAssetsLoaded.bind(this));

        this.assetsLoader.loadAssets(sceneDescription.assets);
    }

    onAssetsLoaded() {
        this.createSceneFromDescription(this.scene);

        this.materialDecorator.rewriteSingleMaterials(this.scene, this.assetsLoader.assets.textures);

        this.hideNavigationMeshes();

        document.dispatchEvent(sceneReadyEvent);
    }

    hideNavigationMeshes() {
        this.scene.traverse(obj => {
            if (obj.material && obj.material.name.includes('navmesh')) obj.material.visible = false;
        });
    }

    createSceneFromDescription(scene) {
        this.addChildrenFromDescription(scene, sceneDescription.model.children);
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
        let obj = null;
        let args = null;
        let objType = 'Object3D';

        if (d.object && d.object.type) objType = d.object.type;
        else if (d.type) objType = d.type;

        if (d.object && d.object.args) args = d.object.args;
        else if (d.args) args = d.args;
        for (const prop in args) {
            if (args.hasOwnProperty(prop)) {
                if (args[prop].type && args[prop].type === 'asset/texture') {
                    args[prop] = this.assetsLoader.assets.textures[args[prop].name];
                }
            }
        }

        if (objType === 'asset/json') {

            obj = this.assetsLoader.assets.objects[d.name];

        } else if (objType === 'Mesh' || d.object && d.object.geometry) {

            const geom = this.createObjectFromDescription(d.object.geometry);
            let mat = null;
            if (d.object.material) mat = this.createObjectFromDescription(d.object.material);
            obj = new THREE.Mesh(geom, mat);

        } else {

            if (args instanceof Array) obj = new THREE[objType](...args);
            else obj = new THREE[objType](args);

        }

        if (!obj) obj = new THREE.Object3D();
        if (d.properties) this.addObjectProperties(obj, d.properties);

        return obj;
    }

    addObjectProperties(obj, props) {
        let p;
        let q;
        for (p in props) {
            if (props.hasOwnProperty(p)) {

                if (props[p] instanceof Object) { // only 1 property depth level now

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
}

export default SceneManager;
