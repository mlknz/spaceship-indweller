const sceneDescription = {
    assets: [
        {
            name: 'carousel',
            type: 'json',
            path: 'assets/carousel.json'
        },
        {
            name: 'spaceship_interior',
            type: 'json',
            path: 'assets/spaceship_interior.json'
        },
        {
            name: 'planeTex',
            type: 'texture',
            path: ['assets/textures/uv_grid.dds', 'assets/textures/uv_grid.pvr', 'assets/textures/uv_grid.jpg']
        },
        {
            name: 'floorTile',
            type: 'texture',
            path: 'assets/textures/tile2.jpg'
        },
        {
            name: 'wallTile',
            type: 'texture',
            path: 'assets/textures/tile3.jpg'
        }
    ],
    model: {
        children: [
            {
                type: 'asset/json',
                name: 'spaceship_interior',
                properties: {
                    name: 'Spaceship Interior'
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
