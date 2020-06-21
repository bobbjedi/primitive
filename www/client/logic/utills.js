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
    vec3RadToDeg: function (rad) {
        rad.set(rad.y * 62, -90 + (-THREE.Math.radToDeg(Math.atan2(rad.z, rad.x))), 0);
    }
};
