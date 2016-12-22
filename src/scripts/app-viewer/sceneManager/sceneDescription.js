const sceneDescription = {
    assets: [
        {
            name: 'spaceship_interior',
            type: 'json',
            path: 'assets/spaceship_interior.json'
        },
        // {
        //     name: 'planeTex',
        //     type: 'texture',
        //     path: ['assets/textures/uv_grid.dds', 'assets/textures/uv_grid.pvr', 'assets/textures/uv_grid.jpg']
        // },
        {
            name: 'door_diffuse',
            type: 'texture',
            path: 'assets/textures/door_diffuse.jpg'
        },
        {
            name: 'floor_tile_diffuse',
            type: 'texture',
            path: 'assets/textures/floor_tile_diffuse.jpg'
        },
        {
            name: 'floor_tile_normal',
            type: 'texture',
            path: 'assets/textures/floor_tile_normal.jpg'
        },
        {
            name: 'wall_tile_diffuse',
            type: 'texture',
            path: 'assets/textures/wall_tile_diffuse.jpg'
        },
        {
            name: 'wall_tile_normal',
            type: 'texture',
            path: 'assets/textures/wall_tile_normal.jpg'
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
            // {
            //     object: {
            //         geometry: {
            //             type: 'PlaneBufferGeometry',
            //             args: [20, 20, 80, 90]
            //         },
            //         material: {
            //             type: 'MeshStandardMaterial',
            //             args: {
            //                 color: '#ffffff',
            //                 map: {
            //                     type: 'asset/texture',
            //                     name: 'planeTex'
            //                 },
            //                 side: 2,
            //                 metalness: 0.2,
            //                 roughness: 0.7
            //             },
            //             properties: {
            //                 name: 'planeMaterial'
            //             }
            //         }
            //     },
            //     properties: {
            //         name: 'Plane',
            //         rotation: {
            //             x: -Math.PI / 2
            //         },
            //         castShadow: false,
            //         receiveShadow: true
            //     }
            // },
            {
                object: {
                    type: 'AmbientLight',
                    args: 0x777777
                },
                properties: {
                    name: 'ambientLight'
                }
            },
            {
                object: {
                    type: 'DirectionalLight',
                    args: 0x888888
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
                    type: 'DirectionalLight',
                    args: 0x888888
                },
                properties: {
                    name: 'directLight2',
                    position: {
                        x: 30,
                        y: 30,
                        z: -5
                    }
                }
            }
        ]
    }
};

export default sceneDescription;
