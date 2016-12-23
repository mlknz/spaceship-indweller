import config from '../config.js';

import StatsUi from './stats-ui.js';

const startQuestEvent = new Event('startQuest');

const toogleDoorsEvent = new Event('toogleDoors');

class AppUi {
    constructor(renderer) {
        if (config.isDebug) this.statsUi = new StatsUi(renderer);

        const startQuestButton = document.createElement('button');
        startQuestButton.style.position = 'absolute';
        startQuestButton.style.width = '200px';
        startQuestButton.style.height = '60px';
        startQuestButton.innerHTML = 'Start Quest';

        startQuestButton.addEventListener('click', () => {
            document.dispatchEvent(startQuestEvent);
        });
        document.body.appendChild(startQuestButton);

        const toogleDoorsButton = document.createElement('button');
        toogleDoorsButton.style.position = 'absolute';
        toogleDoorsButton.style.left = '200px';
        toogleDoorsButton.style.width = '200px';
        toogleDoorsButton.style.height = '60px';
        toogleDoorsButton.innerHTML = 'Toogle Doors';

        toogleDoorsButton.addEventListener('click', () => {
            document.dispatchEvent(toogleDoorsEvent);
        });
        document.body.appendChild(toogleDoorsButton);

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 49) {
                document.dispatchEvent(toogleDoorsEvent);
            }
        });

        const toogleDoorsInfo = document.createElement('div');
        toogleDoorsInfo.style.position = 'absolute';
        toogleDoorsInfo.style.top = '60px';
        toogleDoorsInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        toogleDoorsInfo.style.width = '400px';
        toogleDoorsInfo.style.height = '50px';
        toogleDoorsInfo.innerHTML = 'Press 1 on keyboard to toogle doors';
        document.body.appendChild(toogleDoorsInfo);

    }

    update() {
        if (this.statsUi) this.statsUi.update();
    }
}

export default AppUi;
