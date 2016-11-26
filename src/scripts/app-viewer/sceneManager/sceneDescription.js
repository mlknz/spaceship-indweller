const sceneDescription = {
    assets: [
        {
            name: 'model',
            type: 'json',
            path: 'assets/model.json'
        },
        {
            name: 'planeTex',
            type: 'texture',
            path: 'assets/textures/uv_grid.jpg'
        }
    ],
    model: {
        children: [
            {
                type: 'asset/json',
                name: 'model',
                properties: {
                    name: 'JSON Model'
                }
            },
            {
                object: {
                    geometry: {
                        type: 'PlaneBufferGeometry',
                        args: [20, 20, 80, 90]
                    },
                    material: {
                        type: 'MeshStandardMaterial',
                        args: {
                            color: '#ffffff',
                            map: {
                                type: 'asset/texture',
                                srcName: 'planeTex'
                            },
                            side: 2,
                            metalness: 0.2,
                            roughness: 0.7
                        },
                        properties: {
                            name: 'planeMaterial'
                        }
                    }
                },
                properties: {
                    name: 'Plane',
                    rotation: {
                        x: Math.PI / 2
                    },
                    castShadow: false,
                    receiveShadow: true
                }
            },
            {
                object: {
                    geometry: {
                        type: 'BoxBufferGeometry',
                        args: [3, 3, 5]
                    },
                    material: {
                        type: 'MeshStandardMaterial',
                        args: {color: '#88cc55', metalness: 0.2}
                    }
                },
                properties: {
                    name: 'Cube',
                    position: {
                        y: 3
                    },
                    castShadow: true,
                    receiveShadow: false
                }
            },
            {
                object: {
                    type: 'DirectionalLight',
                    args: 0x707070
                },
                properties: {
                    name: 'directLight',
                    position: {
                        x: -30,
                        y: 20,
                        z: 10
                    }
                }
            },
            {
                object: {
                    type: 'SpotLight',
                    args: 0xffffff
                },
                properties: {
                    name: 'spotLight',
                    position: {
                        x: 5,
                        y: 20,
                        z: 10
                    },
                    castShadow: true
                }
            }
        ]
    }
};

export default sceneDescription;
