import config from '../config.js';

import StatsUi from './stats-ui.js';

const startQuestEvent = new Event('startQuest');

class AppUi {
    constructor(renderer) {
        if (config.isDebug) this.statsUi = new StatsUi(renderer);
        const startQuestButton = document.createElement('button');
        startQuestButton.style.position = 'absolute';
        startQuestButton.style.width = '200px';
        startQuestButton.style.height = '100px';
        startQuestButton.innerHTML = 'Start Quest';

        startQuestButton.addEventListener('click', () => {
            document.dispatchEvent(startQuestEvent);
        });
        document.body.appendChild(startQuestButton);
    }

    update() {
        if (this.statsUi) this.statsUi.update();
    }
}

export default AppUi;
