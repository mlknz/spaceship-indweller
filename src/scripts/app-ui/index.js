import config from '../config.js';

import StatsUi from './stats-ui.js';

class AppUi {
    constructor(renderer) {
        if (config.isDebug) this.statsUi = new StatsUi(renderer);
    }

    update() {
        if (this.statsUi) this.statsUi.update();
    }
}

export default AppUi;
