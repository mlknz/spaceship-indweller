import config from '../config.js';

import StatsUi from './stats-ui.js';

const startIntroEvent = new Event('startIntro');

const interactEvent = new Event('interact');

class AppUi {
    constructor(renderer) {
        if (config.isDebug) this.statsUi = new StatsUi(renderer);

        const newGameDiv = document.getElementById('newGameRoot');
        newGameDiv.style.display = 'block';

        const startQuestButton = document.getElementById('startQuestButton');

        startQuestButton.addEventListener('click', () => {
            newGameDiv.style.display = 'none';
            document.dispatchEvent(startIntroEvent);
        });

        const startAgainButton = document.getElementById('startAgainButton');
        startAgainButton.addEventListener('click', () => {
            location.reload();
        });

        const goToSourceButtons = document.getElementsByClassName('goToSourceButton');
        for (let i = 0; i < goToSourceButtons.length; i++) {
            goToSourceButtons[i].addEventListener('click', this.gotoSource);
        }

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 69) {
                document.dispatchEvent(interactEvent);
            }
        });

    }

    gotoSource() {
        window.open(config.repoUrl, '_blank');
    }

    update() {
        if (this.statsUi) this.statsUi.update();
    }
}

export default AppUi;
