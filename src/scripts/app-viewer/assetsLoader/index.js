const assetsLoadedEvent = new Event('assetsLoaded');

class AssetsLoader {
    constructor(scene) {
        this.scene = scene;

        this.assets = {
            objects: {},
            textures: {}
        };
        this.objectLoader = new THREE.ObjectLoader();
        this.textureLoader = new THREE.TextureLoader();
    }

    loadAssets(assetsArr) {
        const loadPromises = [];

        let loadPromise;
        assetsArr.forEach(entry => {
            switch (entry.type) {

            case 'json':
                loadPromise = this.loadJsonModel(entry);
                loadPromises.push(loadPromise);
                break;

            case 'texture':
                loadPromise = this.loadTexture(entry);
                loadPromises.push(loadPromise);
                break;

            default:
                console.warning('unhandled', entry);
            }
        });

        Promise.all(loadPromises).then(() => {
            document.dispatchEvent(assetsLoadedEvent);
        });
    }

    loadJsonModel(entry) {
        return new Promise((resolve, reject) => {
            this.objectLoader.load(entry.path, (model) => {
                this.assets.objects[entry.name] = model;
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

    loadTexture(entry) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(entry.path, (texture) => {
                this.assets.textures[entry.name] = texture;
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
