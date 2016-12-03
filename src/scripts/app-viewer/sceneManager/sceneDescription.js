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
            path: ['assets/textures/uv_grid.dds', 'assets/textures/uv_grid.pvr', 'assets/textures/uv_grid.jpg']
        },
        {
            name: 'carousel_base_diffuse',
            type: 'texture',
            path: 'assets/textures/carousel/carousel_base_diffuse_2k.png'
        },
        {
            name: 'carousel_base_normal',
            type: 'texture',
            path: 'assets/textures/carousel/carousel_base_normal_1k.png'
        },
        {
            name: 'carousel_body_diffuse',
            type: 'texture',
            path: 'assets/textures/carousel/carousel_body_diffuse_2k.png'
        },
        {
            name: 'carousel_body_normal',
            type: 'texture',
            path: 'assets/textures/carousel/carousel_body_normal_1k.png'
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
                                name: 'planeTex'
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
                        x: -Math.PI / 2
                    },
                    castShadow: false,
                    receiveShadow: true
                }
            },
            {
                object: {
                    type: 'DirectionalLight',
                    args: 0xaaaaaa
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
