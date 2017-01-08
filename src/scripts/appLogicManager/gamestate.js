const gamestate = {
    paused: false,
    win: false,
    lose: false,

    pickups: {
        suit: false,
        repairKit: false
    },

    gravity: true,
    doors: {}
};

export default gamestate;
