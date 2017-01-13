const gamestate = {
    started: false, // for initial controls enabling
    paused: false, // freezes whole loop
    win: false,
    lose: false,
    gameoverMessage: 'Game Over',

    introStartTime: -1,
    gameStartTime: -1,

    controlPanelActive: false,

    pickups: {
        suit: false,
        repairKit: false
    },

    engineEnabled: true,
    pipeRepaired: false,

    inSpace: false,
    doorsOpen: {}
};

export default gamestate;
