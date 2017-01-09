const _ = require('lodash');
const THREE = require('three');

function _createBBox(point, width, height, depth) {
    const min = new THREE.Vector3(-width / 2.0, 0.0, -depth / 2.0);
    const max = new THREE.Vector3(width / 2.0, height, depth / 2.0);

    min.add(point);
    max.add(point);
    return new THREE.Box3(min, max);
}

function _createInstancedGeometryFromMesh(mesh) {
    const instancedGeometry = new THREE.InstancedBufferGeometry();

    instancedGeometry.setIndex(mesh.geometry.index);

    _.each(mesh.geometry.attributes, (attribute, attrName) => instancedGeometry.addAttribute(attrName, attribute));
    instancedGeometry.groups = [];
    mesh.geometry.groups.forEach(group => instancedGeometry.addGroup(group.start, group.count, group.materialIndex));

    return instancedGeometry;
}

function _getTransformsFromInstances(instances, bbox, restInstances) {
    const transforms = [];
    const wPos = new THREE.Vector3();
    for (let i = 0, len = instances.length; i < len; i++) {
        instances[i].updateMatrixWorld(true);
        instances[i].getWorldPosition(wPos);

        if (!bbox.containsPoint(wPos)) {
            restInstances.push(instances[i].matrixWorld.elements);

            continue;
        }
        transforms.push(instances[i].matrixWorld.elements);
    }
    return transforms;
}

// function _processRestInstances(instances, restInstances) {
//     for (let i = 0, len = restInstances.length; i < len; i++) {
//         instances[i] = restInstances[i];
//     }
//
//     instances.splice(restInstances.length, instances.length - restInstances.length);
// }

function _buildInstancedMesh(instancedGeometry, instancedMaterial, transforms, bbox, name) {
    // pass transform as vec4x3 instanced attributes
    // then build row-major matrix from them  on vertex shader side
    const transformArray1 = [];
    const transformArray2 = [];
    const transformArray3 = [];

    for (let i = 0; i < transforms.length; i++) {
        transformArray1.push(transforms[i][0]);
        transformArray2.push(transforms[i][1]);
        transformArray3.push(transforms[i][2]);
        // skip element3, it allways has value = 0.0

        transformArray1.push(transforms[i][4]);
        transformArray2.push(transforms[i][5]);
        transformArray3.push(transforms[i][6]);
        // skip element7, it allways has value = 0.0

        transformArray1.push(transforms[i][8]);
        transformArray2.push(transforms[i][9]);
        transformArray3.push(transforms[i][10]);
        // skip element11, it allways has value = 0.0

        transformArray1.push(transforms[i][12]);
        transformArray2.push(transforms[i][13]);
        transformArray3.push(transforms[i][14]);
        // skip element15, it allways has value = 1.0
    }

    const transform1 = new THREE.InstancedBufferAttribute(new Float32Array(transformArray1), 4, 1, false);
    instancedGeometry.addAttribute('transform1', transform1);

    const transform2 = new THREE.InstancedBufferAttribute(new Float32Array(transformArray2), 4, 1, false);
    instancedGeometry.addAttribute('transform2', transform2);

    const transform3 = new THREE.InstancedBufferAttribute(new Float32Array(transformArray3), 4, 1, false);
    instancedGeometry.addAttribute('transform3', transform3);

    instancedGeometry.boundingBox = bbox;
    instancedGeometry.boundingSphere = bbox.getBoundingSphere();

    const instancedMesh = new THREE.Mesh(instancedGeometry, instancedMaterial);
    instancedMesh.name = name;

    return instancedMesh;
}

exports.buildInBox = function(instances, mesh, name, point, width, height, depth) {
    const restInstances = [];

    const bbox = _createBBox(point, width, height, depth);
    const instancedGeometry = _createInstancedGeometryFromMesh(mesh);

    const transforms = _getTransformsFromInstances(instances, bbox, restInstances);
    // _processRestInstances(instances, restInstances);

    const instancedMesh = _buildInstancedMesh(instancedGeometry, mesh.material, transforms, bbox, name);
    return instancedMesh;
};

exports.buildFromTransforms = function(transforms, mesh, name, point, width, height, depth) {
    const bbox = _createBBox(point, width, height, depth);
    const instancedGeometry = _createInstancedGeometryFromMesh(mesh);

    const transform1 = new THREE.InstancedBufferAttribute(new Float32Array(transforms.transformArray1), 4, 1, false);
    instancedGeometry.addAttribute('transform1', transform1);
    const transform2 = new THREE.InstancedBufferAttribute(new Float32Array(transforms.transformArray2), 4, 1, false);
    instancedGeometry.addAttribute('transform2', transform2);
    const transform3 = new THREE.InstancedBufferAttribute(new Float32Array(transforms.transformArray3), 4, 1, false);
    instancedGeometry.addAttribute('transform3', transform3);

    instancedGeometry.boundingBox = bbox;
    instancedGeometry.boundingSphere = bbox.getBoundingSphere();

    const instancedMesh = new THREE.Mesh(instancedGeometry, mesh.material);
    instancedMesh.name = name;
    return instancedMesh;
};

exports.addCustomInstanceAttribute = function(name, mesh, size, divisor, attributeArray, needRandomize) {
    const instancedGeometry = mesh.geometry;
    const countInstances = instancedGeometry.attributes.transform1.count;
    const countAttributeVariants = attributeArray.length / size;

    const customAttributeArray = [];

    for (let i = 0, j = 0; i < countInstances; i += divisor) {
        if (needRandomize) {
            j = _.random(countAttributeVariants - 1);
        } else {
            j = (j < countAttributeVariants) ? j : 0;
        }

        for (let offset = 0; offset < size; offset++) {
            customAttributeArray.push(attributeArray[j * size + offset]);
        }

        j++;
    }

    const customAttribute = new THREE.InstancedBufferAttribute(new Float32Array(customAttributeArray), size, divisor, false);
    instancedGeometry.addAttribute(name, customAttribute);
};
