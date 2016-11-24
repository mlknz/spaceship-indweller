const config = {
    isDebug: window.location.hash.substr(1) === 'debug',
    time: 0,

    renderer: {
        clearColor: 0x550000,
        clearAlpha: true,
        devicePixelRatio: window.devicePixelRatio || 1
    },

    camera: {
        cameraPos: [10, 7, 12],
        near: 1,
        far: 1400
    },

    controls: {
        minDistance: 1,
        maxDistance: 1000,
        rotateSpeed: 0.25
    }
};

export default config;
