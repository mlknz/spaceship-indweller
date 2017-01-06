const device = require('device.js')();

const config = {
    isDesktop: device.desktop(),
    isDebug: window.location.hash.substr(1) === 'debug',
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    useDDSTextures: true,
    usePVRTextures: true,

    time: 0,

    renderer: {
        clearColor: 0x141424,
        clearAlpha: true,
        devicePixelRatio: window.devicePixelRatio || 1
    },

    camera: {
        cameraPos: [60, 30, 50],
        near: 1,
        far: 1400,
        walkerNear: 0.1,
        walkerFar: 840
    },

    controls: {
        minDistance: 1,
        maxDistance: 500,
        rotateSpeed: 0.25,
        joystickReturnSpeed: 15
    },

    appLogic: {
        doors: {
            openingTime: 1.2
        }
    }
};

export default config;
