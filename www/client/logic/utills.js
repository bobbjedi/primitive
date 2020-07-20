export default {
    offsetPosition(el, metr) {
        var worldDirection = new THREE.Vector3();
        el.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);

        return worldDirection
            .clone()
            .multiplyScalar(metr)
            .add(el.getAttribute('position'));
    },
    /**
    * @param {HTMLelement} el
    */
    getElPosition: function (el) {
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(el.object3D.matrixWorld);
        return worldPos;
    },

    getElRotation: function (el) {
        var worldDirection = new THREE.Vector3();

        el.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);
        this.vec3RadToDeg(worldDirection);

        return worldDirection;
    },

    positionObjectToString(position){
        return position.x + ' ' + position.y + ' ' + position.z;
    },

    mathRotation(point, target){
        const sin = (target.x - point.x) / (target.y - point.y);
    },

    mathRotationToTarget(position, targetPos){
        const dX = position.x - targetPos.x;
        const dZ = position.z - targetPos.z;
        const dY = position.y - targetPos.y;
        const l = Math.sqrt(dX * dX + dZ * dZ);
        const tan = dY / l;
        const y = Math.atan2(position.x - targetPos.x, position.z - targetPos.z) * 57.29;
        const x = -tan * 57.29;
        return { x, y, z: 0 };
    },
    vec3RadToDeg: function (rad) {
        rad.set(rad.y * 62, -90 + (-THREE.Math.radToDeg(Math.atan2(rad.z, rad.x))), 0);
    }
};
