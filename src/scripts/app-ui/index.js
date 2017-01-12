import config from '../config.js';
import gamestate from '../appLogicManager/gamestate.js';

import StatsUi from './stats-ui.js';

const startIntroEvent = new Event('startIntro');
const pauseEvent = new Event('pause');
const unpauseEvent = new Event('unpause');

const interactEvent = new Event('interact');

class AppUi {
    constructor(renderer) {
        if (config.isDebug) this.statsUi = new StatsUi(renderer);

        const newGameDiv = document.getElementById('newGameRoot');
        newGameDiv.style.display = 'block';

        const startQuestButton = document.getElementById('startQuestButton');

        const pauseMobileRoot = document.getElementById('pauseMobile');
        const pauseMobileButton = document.getElementById('pauseMobileButton');

        pauseMobileButton.addEventListener('click', () => {
            pauseMobileRoot.style.display = 'none';
            document.dispatchEvent(pauseEvent);
        });

        startQuestButton.addEventListener('click', () => {
            newGameDiv.style.display = 'none';

            if (!config.isDesktop) pauseMobileRoot.style.display = 'table';

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

        this.initControlPanelUI();

        const continueButton = document.getElementById('continueButton');
        const pauseRoot = document.getElementById('pauseMenuRoot');
        continueButton.addEventListener('click', () => {
            pauseRoot.style.display = 'none';
            document.dispatchEvent(unpauseEvent);
        });

        const interactInfo = document.getElementById('interactInfo');
        document.addEventListener('pause', () => {
            interactInfo.style.display = 'none';
            if (!gamestate.win && !gamestate.lose && !gamestate.controlPanelActive) {
                pauseRoot.style.display = 'block';
            }
        });

        document.addEventListener('unpause', () => {
            if (!config.isDesktop) pauseMobileRoot.style.display = 'table';
        });

    }

    initControlPanelUI() {
        const controlPanelRoot = document.getElementById('controlPanelRoot');

        const controlPanelUnpause = function() {
            controlPanelRoot.style.display = 'none';
            gamestate.controlPanelActive = false;
            document.dispatchEvent(unpauseEvent);
        };

        document.addEventListener('activateControlPanel', () => {
            controlPanelRoot.style.display = 'block';
        });

        const turnOnEngineButton = document.getElementById('controlPanelButton1');
        turnOnEngineButton.addEventListener('click', () => {
            if (!gamestate.engineEnabled) {
                gamestate.engineEnabled = true;
                controlPanelUnpause();
                this.popupMessage('Engine power on!');
            }
        });

        const turnOffEngineButton = document.getElementById('controlPanelButton2');
        turnOffEngineButton.addEventListener('click', () => {
            gamestate.engineEnabled = false;
            controlPanelUnpause();
            this.popupMessage('Engine is now de-energized!');
        });

        const leavePanelButton = document.getElementById('controlPanelButton3');
        leavePanelButton.addEventListener('click', () => {
            controlPanelUnpause();
        });
    }

    gotoSource() {
        window.open(config.repoUrl, '_blank');
    }

    popupMessage(msg) {
        const disposeInfo = document.createElement('div');
        disposeInfo.className = 'disposeInfo';
        disposeInfo.innerHTML = msg;
        disposeInfo.style.display = 'block';
        document.body.appendChild(disposeInfo);

        setTimeout(() => {
            disposeInfo.className = 'disposeInfoHidden';
        }, 1000);
    }

    update() {
        if (this.statsUi) this.statsUi.update();
    }
}

export default AppUi;
