const gamestate = {
    started: false, // for initial controls enabling
    paused: false, // freezes whole loop
    win: false,
    lose: false,

    introStartTime: -1,
    gameStartTime: -1,

    pickups: {
        suit: false,
        repairKit: false
    },

    inSpace: false,
    doors: {}
};

export default gamestate;
