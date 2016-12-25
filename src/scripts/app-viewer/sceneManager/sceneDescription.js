const sceneDescription = {
    assets: [
        {
            name: 'spaceship_interior',
            type: 'json',
            path: 'assets/spaceship_interior.json'
        },
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
            {
                object: {
                    type: 'AmbientLight',
                    args: 0xaaaaaa
                },
                properties: {
                    name: 'ambientLight'
                }
            },
            {
                object: {
                    type: 'DirectionalLight',
                    args: 0xffffff
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
                        y: -30,
                        z: -5
                    }
                }
            }
        ]
    }
};

export default sceneDescription;
