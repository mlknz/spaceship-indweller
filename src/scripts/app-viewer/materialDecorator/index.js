const defaultVertexShader = require('./shaders/rawCustomStandard.vert');
const defaultFragmentShader = require('./shaders/rawCustomStandard.frag');

const instancedVertexShader = require('./shaders/rawInstancedCustomStandard.vert');

class MaterialDecorator {
    constructor(materialsDescription) {
        this.materialsDescription = materialsDescription || {};
        this.materialsCache = [];
    }

    rewriteSingleMaterials(model, textures) {
        this.textures = textures;
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

    rewriteSingleMaterial(originalMaterial, vertexShaderIn, fragmentShaderIn, isInstanced, forceFlag) {
        const newMaterialName = originalMaterial.name +
        ((isInstanced && !originalMaterial.name.includes('_instanced')) ? '_instanced' : '');
        for (let i = 0; i < this.materialsCache.length; i++) {
            if (!forceFlag && newMaterialName === this.materialsCache[i].name) {
                return this.materialsCache[i];
            }
        }

        const uniforms = THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms);

        uniforms.map.value = originalMaterial.map;
        uniforms.lightMap.value = originalMaterial.lightMap;
        uniforms.bumpMap.value = (originalMaterial.bumpMap instanceof THREE.Texture) ? originalMaterial.bumpMap : null;
        uniforms.normalMap.value = (originalMaterial.normalMap instanceof THREE.Texture) ? originalMaterial.normalMap : null;
        uniforms.diffuse.value = originalMaterial.color ? originalMaterial.color : new THREE.Color(0xffffff);
        uniforms.roughnessMap.value = null;
        uniforms.roughness.value = originalMaterial.roughness || 0.6;
        uniforms.metalness.value = originalMaterial.metalness || 0.1;

        uniforms.ssaoMap = {type: 't', value: null};
        uniforms.ssaoMapIntensity = {type: 'f', value: 1.01};
        uniforms.screenResolution = {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

        const materialDescription = this.materialsDescription[newMaterialName];

        if (materialDescription) this._writeUniformsFromMaterialDescription(uniforms, materialDescription);

        const defines = this._getMaterialDefines(uniforms);
        const vertexShader = defines + vertexShaderIn;
        const fragmentShader = defines + fragmentShaderIn;

        const newMaterial = new THREE.RawShaderMaterial({
            uniforms,
            lights: true,
            transparent: uniforms.opacity.value < 1 ? true : originalMaterial.transparent,
            side: originalMaterial.side,
            vertexShader,
            fragmentShader
        });

        newMaterial.name = newMaterialName;
        // newMaterial.castShadow = originalMaterial.castShadow;
        // newMaterial.receiveShadow = originalMaterial.receiveShadow;
        this.materialsCache.push(newMaterial);
        return newMaterial;
    }

    _writeUniformsFromMaterialDescription(uniforms, materialDescription) {
        uniforms.map.value = this.textures[materialDescription.map] || uniforms.map.value;
        uniforms.normalMap.value = this.textures[materialDescription.normalMap] || uniforms.normalMap.value;
        uniforms.bumpMap.value = this.textures[materialDescription.bumpMap] || uniforms.bumpMap.value;
        uniforms.roughnessMap.value = this.textures[materialDescription.roughnessMap] || uniforms.roughnessMap.value;
        uniforms.diffuse.value = materialDescription.color ? new THREE.Color(materialDescription.color) : uniforms.diffuse.value;
        uniforms.roughness.value = materialDescription.roughness || uniforms.roughness.value;
        uniforms.metalness.value = materialDescription.metalness || uniforms.metalness.value;
        uniforms.opacity.value = materialDescription.opacity || 1;

        if (materialDescription.repeat) {
            uniforms.offsetRepeat.value.set(0, 0, materialDescription.repeat[0], materialDescription.repeat[1]);

            uniforms.map.value.wrapS = uniforms.map.value.wrapT = THREE.RepeatWrapping;
            uniforms.map.value.repeat.set(materialDescription.repeat[0], materialDescription.repeat[1]);

            if (uniforms.normalMap && uniforms.normalMap.value) {
                uniforms.normalMap.value.wrapS = uniforms.normalMap.value.wrapT = THREE.RepeatWrapping;
                uniforms.normalMap.value.repeat.set(materialDescription.repeat[0], materialDescription.repeat[1]);
            }
            if (uniforms.bumpMap && uniforms.bumpMap.value) {
                uniforms.bumpMap.value.wrapS = uniforms.bumpMap.value.wrapT = THREE.RepeatWrapping;
                uniforms.bumpMap.value.repeat.set(materialDescription.repeat[0], materialDescription.repeat[1]);
            }
            if (uniforms.roughnessMap && uniforms.roughnessMap.value) {
                uniforms.roughnessMap.value.wrapS = uniforms.roughnessMap.value.wrapT = THREE.RepeatWrapping;
                uniforms.roughnessMap.value.repeat.set(materialDescription.repeat[0], materialDescription.repeat[1]);
            }
        }
        if (materialDescription.offset) {
            uniforms.offsetRepeat.value.x = materialDescription.offset[0];
            uniforms.offsetRepeat.value.y = materialDescription.offset[1];
        }
    }

    _getMaterialDefines(uniforms) {
        let defines = '';
        // defines += '#define USE_SHADOWMAP 1\n';
        // if (this.config.renderer.useSSAO) defines += '#define USE_SSAOMAP 1\n';

        if (uniforms.map.value) defines += '#define USE_MAP 1\n';

        if (uniforms.lightMap.value) defines += '#define USE_LIGHTMAP 1\n';

        if (uniforms.bumpMap.value) defines += '#define USE_BUMPMAP 1\n';

        if (uniforms.normalMap.value) defines += '#define USE_NORMALMAP 1\n';

        if (uniforms.roughnessMap.value) defines += '#define USE_ROUGHNESSMAP 1\n';

        return defines;
    }
}

export default MaterialDecorator;
