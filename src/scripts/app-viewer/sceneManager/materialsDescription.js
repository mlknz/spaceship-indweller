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
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.8
    },
    space_suit: {
        map: 'space_suit_diffuse',
        color: 0xffffff
    },
    repair_kit: {
        map: 'kit-panel_diffuse',
        normalMap: 'kit-panel_normal',
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.8
    },
    control_panel: {
        map: 'kit-panel_diffuse',
        color: 0xffffff
    },
    outer_pipe: {
        map: 'outer_pipe_diffuse',
        color: 0xffffff
    },
    spaceship_outer: {
        map: 'spaceship_outer_diffuse',
        color: 0xaaffff,
        metalness: 0.2,
        roughness: 0.8
    },
    window: {
        map: 'window_diffuse',
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.8
    },
    window_glass_inner: {
        color: 0x665555,
        metalness: 0.6,
        roughness: 0.5,
        opacity: 0.5
    },
    window_glass_outer: {
        color: 0x22222a,
        metalness: 0.7,
        roughness: 0.5
    }
};

export default materialsDescription;
