const ProgressBar = require('progressbar.js');

const assetsLoadedEvent = new Event('assetsLoaded');

window.THREE = window.THREE || THREE;
require('three/examples/js/loaders/DDSLoader');
require('three/examples/js/loaders/PVRLoader');

import config from '../../config.js';

let totalLoaded = 0;
let totalSize = 0;

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

        this.initProgressBar();

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
            this.loadingFinished();
        });
    }

    loadEntry(path, entryList, entryName, loaderIn) {
        return new Promise((resolve, reject) => {
            loaderIn.load(path, (model) => {
                entryList[entryName] = model;
                resolve();
            },
            (xhr) => { // progress
                if (config.isDebug) console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                this.updateProgressBar(xhr.loaded, xhr.total, entryName);
            },
            (e) => { // error
                console.log('error while loading model', e);
                reject(e);
            });
        });
    }

    initProgressBar() {
        this.progress = -1;
        this.assetsSizes = {};

        const progressRoot = document.getElementById('progressBar');
        this.progressbar = new ProgressBar.Line(progressRoot, {
            // strokeWidth: 18,
            // color: '#9c2121',
            from: {color: '#557788'},
            to: {color: '#224455'},
            easing: 'easeInOut',
            duration: 1400,
            svgStyle: {
                display: 'block',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: '37px'
            },
            text: {
                value: 'loading',
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#000',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    padding: 0,
                    margin: 0,
                    fontWeight: 'bold',
                    fontSize: '6vh',
                    // You can specify styles which will be browser prefixed
                    transform: {
                        prefix: true,
                        value: 'translate(-50%, -50%)'
                    }
                }
            },
            step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
            }
        });
    }

    loadingFinished() {
        const loadingScreenDiv = document.getElementById('loadingScreen');
        loadingScreenDiv.className = 'loadingScreen-hidden';
        setTimeout(() => {
            loadingScreenDiv.style.display = 'none';
        }, 700);

        document.dispatchEvent(assetsLoadedEvent);
    }

    updateProgressBar(cur, total, entryName) {
        if (!this.assetsSizes[entryName] && !isNaN(total) && total > 0) {
            this.assetsSizes[entryName] = {};
            this.assetsSizes[entryName].loaded = cur;
            this.assetsSizes[entryName].size = total;
        }
        if (this.assetsSizes[entryName] && !isNaN(total) && !isNaN(cur)) {
            totalLoaded = 0;
            totalSize = 0;
            this.assetsSizes[entryName].loaded = cur;
            for (const key in this.assetsSizes) {
                if (this.assetsSizes.hasOwnProperty(key)) {
                    totalLoaded += this.assetsSizes[key].loaded;
                    totalSize += this.assetsSizes[key].size;
                }
            }
            this.progress = Math.max(totalLoaded / totalSize, this.progress);
            this.progressbar.set(this.progress);
        }
    }

}

export default AssetsLoader;
