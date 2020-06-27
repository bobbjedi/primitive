AFRAME.registerComponent('forward', {
    schema: {
        speed: { default: 0.1 },
    },

    init: function () {
        var worldDirection = new THREE.Vector3();

        this.el.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);

        this.worldDirection = worldDirection;
        // console.error(this.worldDirection);
        this.lastRotation = this.getSignRotation();
    },

    tick: function () {
        const rotation = this.getSignRotation();
        if (rotation !== this.lastRotation) {
            return this.init();
        }
        var el = this.el;
        var currentPosition = el.getAttribute('position');
        var newPosition = this.worldDirection
            .clone()
            .multiplyScalar(this.data.speed)
            .add(currentPosition);
        el.setAttribute('position', newPosition);
    },
    getSignRotation(){
        const rotation = this.el.getAttribute('rotation');
        return (rotation.x + rotation.y).toFixed(1);
    }
});
