const THREE = require('three');

const defaultVertexShader = require('./shaders/rawCustomStandard.vert');
const defaultFragmentShader = require('./shaders/rawCustomStandard.frag');

const instancedVertexShader = require('./shaders/rawInstancedCustomStandard.vert');

class MaterialDecorator {
    constructor(materialsDescription) {
        this.materialsDescription = materialsDescription || {};
        this.materialsCache = [];
    }

    rewriteSingleMaterials(model) {
        model.traverse(obj => {
            if (obj instanceof THREE.Mesh && !obj.name.includes('_instanced')) {
                if (obj.material instanceof THREE.MultiMaterial) {
                    for (let i = 0; i < obj.material.materials.length; i++) {
                        obj.material.materials[i] = this.rewriteSingleMaterial(obj.material.materials[i],
                        defaultVertexShader, defaultFragmentShader);
                    }
                } else {
                    obj.material = this.rewriteSingleMaterial(obj.material,
                    defaultVertexShader, defaultFragmentShader);
                }
            }
        });
    }

    rewriteInstancedMaterial(mat) {
        let newMat = null;
        if (mat instanceof THREE.MultiMaterial) {
            for (let i = 0; i < mat.materials.length; i++) {
                mat.materials[i] = this.rewriteSingleMaterial(mat.materials[i],
                instancedVertexShader, defaultFragmentShader, true);
            }
            newMat = mat;
        } else {
            newMat = this.rewriteSingleMaterial(mat, instancedVertexShader, defaultFragmentShader, true);
        }
        return newMat;
    }

    rewriteCustomMaterial(mat, vertexShaderIn, fragmentShaderIn) {
        let newMat = null;
        if (mat instanceof THREE.MultiMaterial) {
            for (let i = 0; i < mat.materials.length; i++) {
                mat.materials[i] = this.rewriteSingleMaterial(mat.materials[i],
                vertexShaderIn, fragmentShaderIn, true);
            }
            newMat = mat;
        } else {
            newMat = this.rewriteSingleMaterial(mat, vertexShaderIn, fragmentShaderIn, true);
        }
        return newMat;
    }

    _getMaterialDefines(originalMaterial, extProps) {
        let defines = '';
        // defines += '#define ALPHATEST 0.9\n';
        // defines += '#define USE_SHADOWMAP 1\n';
        // if (this.config.renderer.useSSAO) defines += '#define USE_SSAOMAP 1\n';
        if (originalMaterial.map instanceof THREE.Texture ||
            (originalMaterial.uniforms && originalMaterial.uniforms.map.value instanceof THREE.Texture)) {
            defines += '#define USE_MAP 1\n';
        }

        if (originalMaterial.lightMap instanceof THREE.Texture) {
            defines += '#define USE_LIGHTMAP 1\n';
        }

        if (originalMaterial.bumpMap instanceof THREE.Texture) {
            defines += '#define USE_BUMPMAP 1\n';
        }

        if (originalMaterial.normalMap instanceof THREE.Texture) {
            defines += '#define USE_NORMALMAP 1\n';
        }

        if (extProps) {
            if (extProps.useRoughnessMap) {
                defines += '#define USE_ROUGHNESSMAP 1\n';
            }
        }

        return defines;
    }

    rewriteSingleMaterial(originalMaterial, vertexShaderIn, fragmentShaderIn, isInstanced, forceFlag) {
        const newMaterialName = originalMaterial.name +
        ((isInstanced && !originalMaterial.name.includes('_instanced')) ? '_instanced' : '');
        for (let i = 0; i < this.materialsCache.length; i++) {
            if (!forceFlag && newMaterialName === this.materialsCache[i].name) {
                return this.materialsCache[i];
            }
        }
        console.log(originalMaterial.name);
        const uniforms = THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms);

        const extProps = this.materialsDescription[newMaterialName];

        const defines = this._getMaterialDefines(originalMaterial, extProps);
        const vertexShader = defines + vertexShaderIn;
        const fragmentShader = defines + fragmentShaderIn;

        uniforms.map.value = originalMaterial.map;
        uniforms.lightMap.value = originalMaterial.lightMap;
        uniforms.bumpMap.value = (originalMaterial.bumpMap instanceof THREE.Texture) ? originalMaterial.bumpMap : null;
        uniforms.normalMap.value = (originalMaterial.normalMap instanceof THREE.Texture) ? originalMaterial.normalMap : null;
        uniforms.diffuse.value = originalMaterial.color ? originalMaterial.color : new THREE.Color(0xaaaaaa);
        uniforms.roughnessMap.value = null;
        uniforms.roughness.value = originalMaterial.roughness || 0.6;
        uniforms.metalness.value = originalMaterial.metalness || 0.1;

        uniforms.ssaoMap = {type: 't', value: null};
        uniforms.ssaoMapIntensity = {type: 'f', value: 1.01};
        uniforms.screenResolution = {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

        const newMaterial = new THREE.RawShaderMaterial({
            uniforms,
            lights: true,
            transparent: originalMaterial.transparent,
            side: originalMaterial.side,
            vertexShader,
            fragmentShader
        });
        newMaterial.name = newMaterialName;
        this.materialsCache.push(newMaterial);
        return newMaterial;
    }
}

export default MaterialDecorator;