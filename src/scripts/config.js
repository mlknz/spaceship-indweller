const device = require('device.js')();

const config = {
    repoUrl: 'https://github.com/mlknz/spaceship-indweller',
    isDesktop: device.desktop(),
    isDebug: window.location.hash.substr(1) === 'debug',
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    useDDSTextures: true,
    usePVRTextures: true,

    time: 0,
    introDuration: 2,
    lightsInDuration: 0.8,

    renderer: {
        clearColor: 0x141424,
        clearAlpha: true,
        devicePixelRatio: window.devicePixelRatio || 1
    },

    camera: {
        cameraPos: [-146, 86, 150],
        cameraIntroTargetPos: [-81, 30, -0],
        near: 1,
        far: 1400,
        walkerNear: 0.1,
        walkerFar: 840
    },

    walker: {
        startPos: [-47, 8, -29],
        startYaw: -1.8,
        startPitch: 0
    },

    spaceWalker: {
        blockingRayMin: 2,
        blockingRayMax: 3,
        blockingRayLength: 10,
        pullOutDuration: 0.7
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
        },
        gatewayControlsChangeDecay: 1400
    }
};

export default config;
