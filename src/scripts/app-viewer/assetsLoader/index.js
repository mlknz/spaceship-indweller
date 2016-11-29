const assetsLoadedEvent = new Event('assetsLoaded');

window.THREE = THREE;
require('three/examples/js/loaders/DDSLoader');
require('three/examples/js/loaders/PVRLoader');

import config from '../../config.js';

class AssetsLoader {
    constructor(scene) {
        this.scene = scene;

        this.assets = {
            objects: {},
            textures: {}
        };
        this.objectLoader = new THREE.ObjectLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.DDSLoader = new THREE.DDSLoader();
        this.PVRLoader = new THREE.PVRLoader();
    }

    loadAssets(assetsArr) {
        const loadPromises = [];

        let loadPromise;
        let loader;
        let entryList;
        assetsArr.forEach(entry => {
            switch (entry.type) {

            case 'json':
                loader = this.objectLoader;
                entryList = this.assets.objects;
                break;

            case 'texture':
                loader = this.textureLoader;
                entryList = this.assets.textures;
                break;

            default:
                throw new Error('unknow asset type in sceneDescription: ' + entry.type);
            }

            loadPromise = this.loadEntry(entry, entryList, loader);
            loadPromises.push(loadPromise);
        });

        Promise.all(loadPromises).then(() => {
            document.dispatchEvent(assetsLoadedEvent);
        });
    }

    loadEntry(entry, entryList, loaderIn) {
        return new Promise((resolve, reject) => {
            loaderIn.load(entry.path, (model) => {
                entryList[entry.name] = model;
                resolve();
            },
            (xhr) => { // progress
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (e) => { // error
                console.log('error while loading model', e);
                reject(e);
            });
        });
    }

}

export default AssetsLoader;
