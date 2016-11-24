const assetsLoadedEvent = new Event('assetsLoaded');

class AssetsLoader {
    constructor(scene) {
        this.scene = scene;

        this.assets = {};
        this.objectLoader = new THREE.ObjectLoader();
        this.textureLoader = new THREE.TextureLoader();
    }

    loadAssets(assetsArr) {
        const loadPromises = [];

        let loadPromise;
        assetsArr.forEach(entry => {
            loadPromise = this.loadModel(entry);
            loadPromises.push(loadPromise);
        });

        Promise.all(loadPromises).then(() => {
            document.dispatchEvent(assetsLoadedEvent);
        });
    }

    loadModel(entry) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 200, 'foo');
        });
    }

    loadTexture(entry) {
        // return new Promise(function (resolve, reject) {
        //     xhr.onload = function () {
        //       if (this.status >= 200 && this.status < 300) {
        //         resolve(xhr.response);
        //       } else {
        //         reject({
        //           status: this.status,
        //           statusText: xhr.statusText
        //         });
        //       }
        //     };
        //     xhr.onerror = function () {
        //       reject({
        //         status: this.status,
        //         statusText: xhr.statusText
        //       });
        //     };
        //   });
    }

    loadModelTMP() {
        this.objectLoader.load('assets/model.json', (model) => {
            model.name = 'Model Root';
            this.scene.add(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (e) => {
            console.log('error while loading model', e);
        });

        this.textureLoader.load('assets/textures/uv_grid.jpg', (texture) => {
            this.scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh && obj.material.name === 'planeMaterial') {
                    obj.material.map = texture;
                    obj.material.needsUpdate = true;
                }
            });
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (e) => {
            console.log('error while loading model', e);
        });
    }
}

export default AssetsLoader;
