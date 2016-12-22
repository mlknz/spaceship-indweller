const materialsDescription = {
    floor: {
        map: 'floor_tile_diffuse',
        normalMap: 'floor_tile_normal',
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.8,
        repeat: [30, 30]
    },
    wall: {
        map: 'wall_tile_diffuse',
        normalMap: 'wall_tile_normal',
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.8,
        repeat: [12.8, 12.8]
    },
    roof: {
        map: 'floor_tile_diffuse',
        normalMap: 'floor_tile_normal',
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.8,
        repeat: [30, 30]
    },
    door: {
        map: 'door_diffuse',
        color: 0xffffff
    }
};

export default materialsDescription;
