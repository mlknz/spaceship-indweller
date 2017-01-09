const THREE = require('three');

const instancedGeometry = require('./instancedGeometry.js');

class Batcher {
    constructor(model, materialDecorator) {
        this.materialDecorator = materialDecorator;
        this.model = model;
    }

    batchSameGeomIdUndecoratedMeshes({batchMeshesWithChildren, excludeIfNameContains} = {}) {
        const sameGeomObjects = this._formSameGeomObjectsArray(this.model, batchMeshesWithChildren, excludeIfNameContains);

        sameGeomObjects.forEach(objects => {
            if (objects.length > 1) {
                this._prepBatchFromObjectList(this.model, objects, batchMeshesWithChildren);
            }
        });
    }

    _formSameGeomObjectsArray(root, batchMeshesWithChildren, excludeIfNameContains) {
        const sameGeomObjects = [];
        let excludeElement;
        let i = 0;

        root.traverse(obj => {
            excludeElement = false;
            for (i = 0; i < excludeIfNameContains.length; i++) {
                if (obj.name.includes(excludeIfNameContains[i])) excludeElement = true;
            }
            if (obj instanceof THREE.Mesh
                && (!excludeIfNameContains || !excludeElement)
                && (batchMeshesWithChildren || !obj.children || obj.children.length === 0)) {
                let found = false;
                for (i = 0; i < sameGeomObjects.length; i++) {
                    if (sameGeomObjects[i][0].geometry.uuid === obj.geometry.uuid) {
                        sameGeomObjects[i].push(obj);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sameGeomObjects.push([obj]);
                }
            }
        });
        return sameGeomObjects;
    }

    formBatchFromMeshAndTransforms(baseMesh, transforms) {
        const instancedStandardMaterial = this.materialDecorator.rewriteInstancedMaterial(baseMesh.material);

        const tmpMat = baseMesh.material;
        baseMesh.material = instancedStandardMaterial;

        const batch = instancedGeometry.buildFromTransforms(
            transforms,
            baseMesh,
            baseMesh.name + '_instancedMesh',
            new THREE.Vector3(0, 0, 0),
            10000, 10000, 10000
        );

        baseMesh.material = tmpMat;
        return batch;
    }

    _prepBatchFromObjectList(model, instances, batchMeshesWithChildren) {
        const trashObjects = instances.slice();
        const baseMesh = instances[0];

        const instancedStandardMaterial = this.materialDecorator.rewriteInstancedMaterial(baseMesh.material);
        baseMesh.material = instancedStandardMaterial;

        const batch = instancedGeometry.buildInBox(
            instances,
            baseMesh,
            baseMesh.name + '_instancedMesh',
            new THREE.Vector3(0, 0, 0),
            10000, 10000, 10000
        );
        model.add(batch);

        if (batchMeshesWithChildren) {
            for (let i = trashObjects.length - 1; i >= 0; i--) {
                const trashMesh = trashObjects[i];
                if (trashMesh.children || trashMesh.children.length > 0) {
                    for (let j = trashMesh.children.length - 1; j >= 0; j--) {
                        const child = trashMesh.children[j];

                        trashMesh.remove(child);

                        child.matrix.premultiply(trashMesh.matrix);
                        child.matrix.decompose(child.position, child.quaternion, child.scale); // three.js uses these components

                        trashMesh.parent.add(child);

                        child.matrixWorldNeedsUpdate = true;
                    }
                }
                trashMesh.parent.remove(trashMesh);
                trashObjects[i] = null;
            }
        } else {
            for (let i = trashObjects.length - 1; i >= 0; i--) {
                trashObjects[i].parent.remove(trashObjects[i]);
                trashObjects[i] = null;
            }
        }
    }

    propagateTransforms(objArr, transforms) {
        const result = {transformArray1: [], transformArray2: [], transformArray3: []};
        const m = new THREE.Matrix4();
        const t = new THREE.Matrix4();
        const t1 = transforms.transformArray1;
        const t2 = transforms.transformArray2;
        const t3 = transforms.transformArray3;

        for (let i = 0; i < t1.length; i += 4) {
            m.set(
                t1[i], t1[i + 1], t1[i + 2], t1[i + 3],
                t2[i], t2[i + 1], t2[i + 2], t2[i + 3],
                t3[i], t3[i + 1], t3[i + 2], t3[i + 3],
                0, 0, 0, 1
            );

            for (let j = 0; j < objArr.length; j++) {
                t.multiplyMatrices(m, objArr[j].matrixWorld);
                result.transformArray1.push(t.elements[0], t.elements[4], t.elements[8], t.elements[12]);
                result.transformArray2.push(t.elements[1], t.elements[5], t.elements[9], t.elements[13]);
                result.transformArray3.push(t.elements[2], t.elements[6], t.elements[10], t.elements[14]);
            }
        }

        return result;
    }

    removeEmptyObjectsFromScene() {
        const trashObjects = [];
        this.model.traverse(obj => {
            if (obj.type === 'Object3D' && (!obj.children || obj.children.length === 0)) {
                trashObjects.push(obj);
            }
        });

        for (let i = trashObjects.length - 1; i >= 0; i--) {
            trashObjects[i].parent.remove(trashObjects[i]);
            trashObjects[i] = null;
        }
    }
}

export default Batcher;
