class AssetsLoader {
    constructor(scene) {
        this.scene = scene;
        this.objectLoader = new THREE.ObjectLoader();
        this.textureLoader = new THREE.TextureLoader();
    }

    loadModel() {
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
                    obj.material.color = new THREE.Color('#ffffff');
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
