!function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={exports:{},id:o,loaded:!1};return e[o].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=n(2),i=o(r),s=n(9),c=o(s),l=n(12),u=function d(){function e(){var e=Math.floor(n.clientWidth*r),t=Math.floor(n.clientHeight*r);n.width===e&&n.height===t||(n.width=e,n.height=t,o.setSize(n.clientWidth,n.clientHeight,!1),s.resize(e,t))}function t(){e(),s.update(h.getDelta()),u.update(),requestAnimationFrame(t)}if(a(this,d),!l())return void(document.body.innerHTML="Unable to initialize WebGL. Your browser may not support it.");var n=document.getElementById("canvas"),o=new THREE.WebGLRenderer({antialias:!0,alpha:!1,canvas:n}),r=window.devicePixelRatio||1;o.setPixelRatio(r);var s=new i["default"](o),u=new c["default"](o),h=new THREE.Clock;t()};window.app=new u},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(3),s=o(i),c=n(4),l=o(c),u=n(7),d=o(u),h=function(){function e(t){a(this,e),this.renderer=t,this.renderer.setClearColor(s["default"].renderer.clearColor,s["default"].renderer.clearAlpha),this.renderer.setPixelRatio(s["default"].renderer.devicePixelRatio);var n=this.renderer.getContext(),o=n.canvas.clientWidth/n.canvas.clientHeight;this.sceneManager=new l["default"],this.camera=new THREE.PerspectiveCamera(60,o,s["default"].camera.near,s["default"].camera.far),this.controls=new d["default"](this.camera,this.renderer.domElement,this.scene),this.controls.resetCameraOrbit(),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=THREE.PCFShadowMap}return r(e,[{key:"onSceneReady",value:function(){console.log("scene loaded")}},{key:"update",value:function(e){s["default"].time+=e,this.sceneManager.update(e,s["default"].time),this.controls.update(e),this.renderer.render(this.sceneManager.scene,this.camera)}},{key:"resize",value:function(e,t){var n=e/t;this.camera.aspect!==n&&(this.camera.aspect=n,this.camera.updateProjectionMatrix())}},{key:"dispose",value:function(){this.controls.dispose()}}]),e}();t["default"]=h},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={isDebug:"debug"===window.location.hash.substr(1),time:0,renderer:{clearColor:5570560,clearAlpha:!0,devicePixelRatio:window.devicePixelRatio||1},camera:{cameraPos:[10,7,12],near:1,far:1400},controls:{minDistance:1,maxDistance:1e3,rotateSpeed:.25}};t["default"]=n},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function a(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(5),c=o(s),l=n(6),u=o(l),d=function(){function e(){r(this,e),this.createSceneFromDescription(),this.cube=this.scene.getObjectByName("Cube");var t=this.scene.getObjectByName("spotLight");t.shadow=new THREE.LightShadow(new THREE.PerspectiveCamera(60,1,1,2500)),t.shadow.bias=1e-4,t.shadow.mapSize.width=1024,t.shadow.mapSize.height=1024,this.assetsLoader=new c["default"](this.scene),this.assetsLoader.loadModel()}return i(e,[{key:"createSceneFromDescription",value:function(){this.scene=new THREE.Scene,this.addChildrenFromDescription(this.scene,u["default"].model.children)}},{key:"addChildrenFromDescription",value:function(e,t){var n=this,o=void 0;t.forEach(function(t){o=n.createObjectFromDescription(t),e.add(o),t.children&&t.children.length>0&&n.addChildrenFromDescription(o,t.children)})}},{key:"createObjectFromDescription",value:function(e){var t="Object3D";e.object&&e.object.type?t=e.object.type:e.type&&(t=e.type);var n=null;e.object&&e.object.args?n=e.object.args:e.args&&(n=e.args);var o=void 0;if("Mesh"===t||e.object&&e.object.geometry){var r=this.createObjectFromDescription(e.object.geometry),i=null;e.object.material&&(i=this.createObjectFromDescription(e.object.material)),o=new THREE.Mesh(r,i)}else o=n instanceof Array?new(Function.prototype.bind.apply(THREE[t],[null].concat(a(n)))):new THREE[t](n);return e.properties&&this.addObjectProperties(o,e.properties),o}},{key:"addObjectProperties",value:function(e,t){var n=void 0,o=void 0;for(n in t)if(t.hasOwnProperty(n))if(t[n]instanceof Object){e[n]||(e[n]={});for(o in t[n])t[n].hasOwnProperty(o)&&(e[n][o]=t[n][o])}else e[n]=t[n]}},{key:"update",value:function(e,t){this.cube.position.x=3*Math.cos(t),this.cube.position.z=3*Math.sin(t),this.cube.rotation.y+=e,this.cube.rotation.z+=e/3}}]),e}();t["default"]=d},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t){n(this,e),this.scene=t,this.objectLoader=new THREE.ObjectLoader,this.textureLoader=new THREE.TextureLoader}return o(e,[{key:"loadModel",value:function(){var e=this;this.objectLoader.load("assets/model.json",function(t){t.name="Model Root",e.scene.add(t)},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("error while loading model",e)}),this.textureLoader.load("assets/textures/uv_grid.jpg",function(t){e.scene.traverse(function(e){e instanceof THREE.Mesh&&"planeMaterial"===e.material.name&&(e.material.map=t,e.material.color=new THREE.Color("#ffffff"),e.material.needsUpdate=!0)})},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("error while loading model",e)})}}]),e}();t["default"]=a},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={model:{children:[{object:{geometry:{type:"PlaneBufferGeometry",args:[20,20,80,90]},material:{type:"MeshStandardMaterial",args:{color:"#bb3355",side:2,metalness:.2,roughness:.7},properties:{name:"planeMaterial"}}},properties:{name:"Plane",rotation:{x:Math.PI/2},castShadow:!1,recieveShadow:!0}},{object:{geometry:{type:"BoxBufferGeometry",args:[3,3,5]},material:{type:"MeshStandardMaterial",args:{color:"#88cc55",metalness:.2}}},properties:{name:"Cube",position:{y:3},castShadow:!1,recieveShadow:!0}},{object:{type:"DirectionalLight",args:7368816},properties:{name:"directLight",position:{x:-30,y:20,z:10}}},{object:{type:"SpotLight",args:16777215},properties:{name:"spotLight",position:{x:5,y:20,z:10},castShadow:!0}}]}};t["default"]=n},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(3),s=o(i);window.THREE=THREE,n(8);var c=function(){function e(t,n){a(this,e),this.camera=t,this.domElement=n,this.orbitControls=new THREE.OrbitControls(t,n),this.orbitControls.enableDamping=!0,this.orbitControls.minDistance=s["default"].controls.minDistance,this.orbitControls.maxDistance=s["default"].controls.maxDistance,this.orbitControls.rotateSpeed=s["default"].controls.rotateSpeed,this.resetCameraOrbit()}return r(e,[{key:"resetCameraOrbit",value:function(){this.camera.position.fromArray(s["default"].camera.cameraPos),this.camera.lookAt(new THREE.Vector3(0,0,0)),this.camera.near=s["default"].camera.near,this.camera.far=s["default"].camera.far,this.camera.updateProjectionMatrix()}},{key:"update",value:function(){this.orbitControls.update()}},{key:"dispose",value:function(){this.orbitControls.dispose()}}]),e}();t["default"]=c},function(e,t){THREE.OrbitControls=function(e,t){function n(){return 2*Math.PI/60/60*L.autoRotateSpeed}function o(){return Math.pow(.95,L.zoomSpeed)}function a(e){I.theta-=e}function r(e){I.phi-=e}function i(e){L.object instanceof THREE.PerspectiveCamera?V/=e:L.object instanceof THREE.OrthographicCamera?(L.object.zoom=Math.max(L.minZoom,Math.min(L.maxZoom,L.object.zoom*e)),L.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),L.enableZoom=!1)}function s(e){L.object instanceof THREE.PerspectiveCamera?V*=e:L.object instanceof THREE.OrthographicCamera?(L.object.zoom=Math.max(L.minZoom,Math.min(L.maxZoom,L.object.zoom/e)),L.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),L.enableZoom=!1)}function c(e){B.set(e.clientX,e.clientY)}function l(e){Q.set(e.clientX,e.clientY)}function u(e){X.set(e.clientX,e.clientY)}function d(e){G.set(e.clientX,e.clientY),W.subVectors(G,B);var t=L.domElement===document?L.domElement.body:L.domElement;a(2*Math.PI*W.x/t.clientWidth*L.rotateSpeed),r(2*Math.PI*W.y/t.clientHeight*L.rotateSpeed),B.copy(G),L.update()}function h(e){J.set(e.clientX,e.clientY),$.subVectors(J,Q),$.y>0?i(o()):$.y<0&&s(o()),Q.copy(J),L.update()}function p(e){K.set(e.clientX,e.clientY),q.subVectors(K,X),ne(q.x,q.y),X.copy(K),L.update()}function m(e){}function f(e){e.deltaY<0?s(o()):e.deltaY>0&&i(o()),L.update()}function b(e){switch(e.keyCode){case L.keys.UP:ne(0,L.keyPanSpeed),L.update();break;case L.keys.BOTTOM:ne(0,-L.keyPanSpeed),L.update();break;case L.keys.LEFT:ne(L.keyPanSpeed,0),L.update();break;case L.keys.RIGHT:ne(-L.keyPanSpeed,0),L.update()}}function E(e){B.set(e.touches[0].pageX,e.touches[0].pageY)}function v(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);Q.set(0,o)}function y(e){X.set(e.touches[0].pageX,e.touches[0].pageY)}function g(e){G.set(e.touches[0].pageX,e.touches[0].pageY),W.subVectors(G,B);var t=L.domElement===document?L.domElement.body:L.domElement;a(2*Math.PI*W.x/t.clientWidth*L.rotateSpeed),r(2*Math.PI*W.y/t.clientHeight*L.rotateSpeed),B.copy(G),L.update()}function w(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);J.set(0,a),$.subVectors(J,Q),$.y>0?s(o()):$.y<0&&i(o()),Q.copy(J),L.update()}function T(e){K.set(e.touches[0].pageX,e.touches[0].pageY),q.subVectors(K,X),ne(q.x,q.y),X.copy(K),L.update()}function R(e){}function x(e){if(L.enabled!==!1){if(e.preventDefault(),e.button===L.mouseButtons.ORBIT){if(L.enableRotate===!1)return;c(e),z=_.ROTATE}else if(e.button===L.mouseButtons.ZOOM){if(L.enableZoom===!1)return;l(e),z=_.DOLLY}else if(e.button===L.mouseButtons.PAN){if(L.enablePan===!1)return;u(e),z=_.PAN}z!==_.NONE&&(document.addEventListener("mousemove",O,!1),document.addEventListener("mouseup",C,!1),L.dispatchEvent(A))}}function O(e){if(L.enabled!==!1)if(e.preventDefault(),z===_.ROTATE){if(L.enableRotate===!1)return;d(e)}else if(z===_.DOLLY){if(L.enableZoom===!1)return;h(e)}else if(z===_.PAN){if(L.enablePan===!1)return;p(e)}}function C(e){L.enabled!==!1&&(m(e),document.removeEventListener("mousemove",O,!1),document.removeEventListener("mouseup",C,!1),L.dispatchEvent(N),z=_.NONE)}function H(e){L.enabled===!1||L.enableZoom===!1||z!==_.NONE&&z!==_.ROTATE||(e.preventDefault(),e.stopPropagation(),f(e),L.dispatchEvent(A),L.dispatchEvent(N))}function j(e){L.enabled!==!1&&L.enableKeys!==!1&&L.enablePan!==!1&&b(e)}function M(e){if(L.enabled!==!1){switch(e.touches.length){case 1:if(L.enableRotate===!1)return;E(e),z=_.TOUCH_ROTATE;break;case 2:if(L.enableZoom===!1)return;v(e),z=_.TOUCH_DOLLY;break;case 3:if(L.enablePan===!1)return;y(e),z=_.TOUCH_PAN;break;default:z=_.NONE}z!==_.NONE&&L.dispatchEvent(A)}}function P(e){if(L.enabled!==!1)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(L.enableRotate===!1)return;if(z!==_.TOUCH_ROTATE)return;g(e);break;case 2:if(L.enableZoom===!1)return;if(z!==_.TOUCH_DOLLY)return;w(e);break;case 3:if(L.enablePan===!1)return;if(z!==_.TOUCH_PAN)return;T(e);break;default:z=_.NONE}}function k(e){L.enabled!==!1&&(R(e),L.dispatchEvent(N),z=_.NONE)}function D(e){e.preventDefault()}this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target=new THREE.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-(1/0),this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return U.phi},this.getAzimuthalAngle=function(){return U.theta},this.reset=function(){L.target.copy(L.target0),L.object.position.copy(L.position0),L.object.zoom=L.zoom0,L.object.updateProjectionMatrix(),L.dispatchEvent(S),L.update(),z=_.NONE},this.update=function(){var t=new THREE.Vector3,o=(new THREE.Quaternion).setFromUnitVectors(e.up,new THREE.Vector3(0,1,0)),r=o.clone().inverse(),i=new THREE.Vector3,s=new THREE.Quaternion;return function(){var e=L.object.position;return t.copy(e).sub(L.target),t.applyQuaternion(o),U.setFromVector3(t),L.autoRotate&&z===_.NONE&&a(n()),U.theta+=I.theta,U.phi+=I.phi,U.theta=Math.max(L.minAzimuthAngle,Math.min(L.maxAzimuthAngle,U.theta)),U.phi=Math.max(L.minPolarAngle,Math.min(L.maxPolarAngle,U.phi)),U.makeSafe(),U.radius*=V,U.radius=Math.max(L.minDistance,Math.min(L.maxDistance,U.radius)),L.target.add(Y),t.setFromSpherical(U),t.applyQuaternion(r),e.copy(L.target).add(t),L.object.lookAt(L.target),L.enableDamping===!0?(I.theta*=1-L.dampingFactor,I.phi*=1-L.dampingFactor):I.set(0,0,0),V=1,Y.set(0,0,0),!!(Z||i.distanceToSquared(L.object.position)>F||8*(1-s.dot(L.object.quaternion))>F)&&(L.dispatchEvent(S),i.copy(L.object.position),s.copy(L.object.quaternion),Z=!1,!0)}}(),this.dispose=function(){L.domElement.removeEventListener("contextmenu",D,!1),L.domElement.removeEventListener("mousedown",x,!1),L.domElement.removeEventListener("wheel",H,!1),L.domElement.removeEventListener("touchstart",M,!1),L.domElement.removeEventListener("touchend",k,!1),L.domElement.removeEventListener("touchmove",P,!1),document.removeEventListener("mousemove",O,!1),document.removeEventListener("mouseup",C,!1),window.removeEventListener("keydown",j,!1)};var L=this,S={type:"change"},A={type:"start"},N={type:"end"},_={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},z=_.NONE,F=1e-6,U=new THREE.Spherical,I=new THREE.Spherical,V=1,Y=new THREE.Vector3,Z=!1,B=new THREE.Vector2,G=new THREE.Vector2,W=new THREE.Vector2,X=new THREE.Vector2,K=new THREE.Vector2,q=new THREE.Vector2,Q=new THREE.Vector2,J=new THREE.Vector2,$=new THREE.Vector2,ee=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),Y.add(e)}}(),te=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,1),e.multiplyScalar(t),Y.add(e)}}(),ne=function(){var e=new THREE.Vector3;return function(t,n){var o=L.domElement===document?L.domElement.body:L.domElement;if(L.object instanceof THREE.PerspectiveCamera){var a=L.object.position;e.copy(a).sub(L.target);var r=e.length();r*=Math.tan(L.object.fov/2*Math.PI/180),ee(2*t*r/o.clientHeight,L.object.matrix),te(2*n*r/o.clientHeight,L.object.matrix)}else L.object instanceof THREE.OrthographicCamera?(ee(t*(L.object.right-L.object.left)/L.object.zoom/o.clientWidth,L.object.matrix),te(n*(L.object.top-L.object.bottom)/L.object.zoom/o.clientHeight,L.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),L.enablePan=!1)}}();L.domElement.addEventListener("contextmenu",D,!1),L.domElement.addEventListener("mousedown",x,!1),L.domElement.addEventListener("wheel",H,!1),L.domElement.addEventListener("touchstart",M,!1),L.domElement.addEventListener("touchend",k,!1),L.domElement.addEventListener("touchmove",P,!1),window.addEventListener("keydown",j,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}})},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(3),s=o(i),c=n(10),l=o(c),u=function(){function e(t){a(this,e),s["default"].isDebug&&(this.statsUi=new l["default"](t))}return r(e,[{key:"update",value:function(){this.statsUi&&this.statsUi.update()}}]),e}();t["default"]=u},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=n(11),i=[["drawcalls","render","calls",0],["programs","programs","length",0],["geometries","memory","geometries",0],["textures","memory","textures",0],["faces","render","faces",0]],s=null,c=null,l=function(){function e(t){o(this,e),this.rInfo=t.info,this.stats=new r;var n=this.createRenderInfoDiv(),a=this.createRenderInfoTableDiv();n.appendChild(a),this.stats.domElement.appendChild(n),document.body.appendChild(this.stats.domElement)}return a(e,[{key:"update",value:function(){this.updateRenderInfo(),this.stats.update()}},{key:"updateRenderInfo",value:function(){for(s=0;s<i.length;s++)c=this.rInfo[i[s][1]][i[s][2]],c!==i[s][3]&&(i[s][3]=c,i[s][4].nodeValue=c)}},{key:"createRenderInfoDiv",value:function(){var e=document.createElement("div");return e.id="render-info",e.style.width="80px",e.style.backgroundColor="rgb(0, 0, 34)",e.style.color="rgb(0, 255, 255)",e.style.fontSize="11px",e.style.fontFamily="Helvetica, Arial, sans-serif",e}},{key:"createRenderInfoTableDiv",value:function(){var e=document.createElement("TABLE"),t=document.createElement("TBODY");e.appendChild(t);var n=void 0,o=void 0,a=void 0;for(s=0;s<i.length;s++)n=document.createElement("TR"),t.appendChild(n),o=document.createElement("TD"),o.width=35,o.style.maxWidth="35px",o.appendChild(document.createTextNode(i[s][0])),n.appendChild(o),o=document.createElement("TD"),o.width=35,o.style.textAlign="right",o.style["float"]="right",a=document.createTextNode(i[s][3]),i[s].push(a),o.appendChild(a),n.appendChild(o);return e}}]),e}();t["default"]=l},function(e,t,n){var o=function(){var e=Date.now(),t=e,n=0,o=1/0,a=0,r=0,i=1/0,s=0,c=0,l=0,u=document.createElement("div");u.id="stats",u.addEventListener("mousedown",function(e){e.preventDefault(),v(++l%2)},!1),u.style.cssText="width:80px;opacity:0.9;cursor:pointer";var d=document.createElement("div");d.id="fps",d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002",u.appendChild(d);var h=document.createElement("div");h.id="fpsText",h.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px",h.innerHTML="FPS",d.appendChild(h);var p=document.createElement("div");for(p.id="fpsGraph",p.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff",d.appendChild(p);p.children.length<74;){var m=document.createElement("span");m.style.cssText="width:1px;height:30px;float:left;background-color:#113",p.appendChild(m)}var f=document.createElement("div");f.id="ms",f.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none",u.appendChild(f);var b=document.createElement("div");b.id="msText",b.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px",b.innerHTML="MS",f.appendChild(b);var E=document.createElement("div");for(E.id="msGraph",E.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0",f.appendChild(E);E.children.length<74;){var m=document.createElement("span");m.style.cssText="width:1px;height:30px;float:left;background-color:#131",E.appendChild(m)}var v=function(e){switch(l=e){case 0:d.style.display="block",f.style.display="none";break;case 1:d.style.display="none",f.style.display="block"}},y=function(e,t){var n=e.appendChild(e.firstChild);n.style.height=t+"px"};return{REVISION:12,domElement:u,setMode:v,begin:function(){e=Date.now()},end:function(){var l=Date.now();return n=l-e,o=Math.min(o,n),a=Math.max(a,n),b.textContent=n+" MS ("+o+"-"+a+")",y(E,Math.min(30,30-n/200*30)),c++,l>t+1e3&&(r=Math.round(1e3*c/(l-t)),i=Math.min(i,r),s=Math.max(s,r),h.textContent=r+" FPS ("+i+"-"+s+")",y(p,Math.min(30,30-r/100*30)),t=l,c=0),l},update:function(){e=this.end()}}};e.exports=o},function(e,t){"use strict";e.exports=function(){if(window.WebGLRenderingContext){for(var e=document.createElement("canvas"),t=["webgl","experimental-webgl","moz-webgl"],n=!1,o=0;o<t.length;o++)try{if(n=e.getContext(t[o]),n&&"function"==typeof n.getParameter)return!0}catch(a){console.log("Unable to initialize WebGL. Your browser may not support it.")}return!1}return!1}}]);