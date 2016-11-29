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

        this.useDDS = !config.isIOS && config.useDDSTextures;
        this.usePVR = config.isIOS && config.usePVRTextures;
        this.DDSLoader = new THREE.DDSLoader();
        this.PVRLoader = new THREE.PVRLoader();
    }

    loadAssets(assetsArr) {
        const loadPromises = [];

        let loadPromise;
        let path;
        let entryName;
        let loader;
        let entryList;
        assetsArr.forEach(entry => {
            switch (entry.type) {

            case 'json':
                path = entry.path;
                loader = this.objectLoader;
                entryList = this.assets.objects;
                entryName = entry.name;
                break;

            case 'texture':
                path = entry.path;
                loader = this.textureLoader;
                entryList = this.assets.textures;
                entryName = entry.name;

                if (entry.path instanceof Array) {
                    for (let i = 0; i < entry.path.length; i++) {
                        path = entry.path[i];
                        if (this.useDDS && entry.path[i].includes('.dds')) {
                            loader = this.DDSLoader;
                            break;
                        }
                        if (this.usePVR && entry.path[i].includes('.pvr')) {
                            loader = this.PVRLoader;
                            break;
                        }
                    }
                }

                break;

            default:
                throw new Error('unknow asset type in sceneDescription: ' + entry.type);
            }

            loadPromise = this.loadEntry(path, entryList, entryName, loader);
            loadPromises.push(loadPromise);
        });

        Promise.all(loadPromises).then(() => {
            document.dispatchEvent(assetsLoadedEvent);
        });
    }

    loadEntry(path, entryList, entryName, loaderIn) {
        return new Promise((resolve, reject) => {
            loaderIn.load(path, (model) => {
                entryList[entryName] = model;
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
