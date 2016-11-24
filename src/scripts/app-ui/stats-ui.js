const Stats = require('stats.js');

const renderInfoTable = [
    ['drawcalls', 'render', 'calls', 0],
    ['programs', 'programs', 'length', 0],
    ['geometries', 'memory', 'geometries', 0],
    ['textures', 'memory', 'textures', 0],
    ['faces', 'render', 'faces', 0]
];

let i = null;
let tmp = null;

class StatsUi {
    constructor(renderer) {
        this.rInfo = renderer.info;
        this.stats = new Stats();

        const renderInfo = this.createRenderInfoDiv();
        const table = this.createRenderInfoTableDiv();

        renderInfo.appendChild(table);
        this.stats.domElement.appendChild(renderInfo);
        document.body.appendChild(this.stats.domElement);
    }

    update() {
        this.updateRenderInfo();
        this.stats.update();
    }

    updateRenderInfo() {
        for (i = 0; i < renderInfoTable.length; i++) {
            tmp = this.rInfo[renderInfoTable[i][1]][renderInfoTable[i][2]];
            if (tmp !== renderInfoTable[i][3]) {
                renderInfoTable[i][3] = tmp;
                renderInfoTable[i][4].nodeValue = tmp;
            }
        }
    }

    createRenderInfoDiv() {
        const renderInfo = document.createElement('div');

        renderInfo.id = 'render-info';
        renderInfo.style.width = '80px';
        renderInfo.style.backgroundColor = 'rgb(0, 0, 34)';
        renderInfo.style.color = 'rgb(0, 255, 255)';
        renderInfo.style.fontSize = '11px';
        renderInfo.style.fontFamily = 'Helvetica, Arial, sans-serif';

        return renderInfo;
    }

    createRenderInfoTableDiv() {
        const table = document.createElement('TABLE');

        const tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        let tr;
        let td;
        let val;
        for (i = 0; i < renderInfoTable.length; i++) {
            tr = document.createElement('TR');
            tableBody.appendChild(tr);

            td = document.createElement('TD');
            td.width = 35;
            td.style.maxWidth = '35px';
            td.appendChild(document.createTextNode(renderInfoTable[i][0]));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.width = 35;
            td.style.textAlign = 'right';
            td.style.float = 'right';
            val = document.createTextNode(renderInfoTable[i][3]);

            renderInfoTable[i].push(val);

            td.appendChild(val);
            tr.appendChild(td);
        }
        return table;
    }
}

export default StatsUi;
