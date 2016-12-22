if (module.hot) {
    module.hot.accept();
}

const webgldetection = require('./webgldetection');

import AppViewer from './app-viewer';
import AppUi from './app-ui';

class App {
    constructor() {
        if (!webgldetection()) {
            document.body.innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
            return;
        }

        const canvas = document.getElementById('canvas');

        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, canvas});

        const devicePixelRatio = window.devicePixelRatio || 1;
        renderer.setPixelRatio(devicePixelRatio);

        const appViewer = new AppViewer(renderer);
        this.appViewer = appViewer;
        const appUi = new AppUi(renderer);

        function resize() {
            const width = Math.floor(canvas.clientWidth * devicePixelRatio);
            const height = Math.floor(canvas.clientHeight * devicePixelRatio);

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;

                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); // 3rd parameter for disabling canvas.style override
                appViewer.resize(width, height);
            }
        }

        const clock = new THREE.Clock();
        function animate() {
            resize();
            appViewer.update(clock.getDelta());
            appUi.update();
            requestAnimationFrame(animate);
        }

        animate();
    }

}

window.app = new App();
