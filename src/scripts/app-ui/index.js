import config from '../config.js';
import gamestate from '../appLogicManager/gamestate.js';

import StatsUi from './stats-ui.js';

const startIntroEvent = new Event('startIntro');
const unpauseEvent = new Event('unpause');

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

        const continueButton = document.getElementById('continueButton');
        const pauseRoot = document.getElementById('pauseMenuRoot');
        continueButton.addEventListener('click', () => {
            pauseRoot.style.display = 'none';
            document.dispatchEvent(unpauseEvent);
        });

        document.addEventListener('pause', () => {
            if (!gamestate.win && !gamestate.lose) {
                pauseRoot.style.display = 'block';
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
