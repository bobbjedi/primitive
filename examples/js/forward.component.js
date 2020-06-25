AFRAME.registerComponent('forward', {
    schema: {
        speed: { default: 0.1 },
    },

    init: function () {
        console.log('INIT FORVARD');
        var worldDirection = new THREE.Vector3();

        this.el.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);

        this.worldDirection = worldDirection;
        // console.error(this.worldDirection);
        this.lastRotation = this.getSignRotation();
    },

    tick: function () {
        const rotation = this.getSignRotation();
        console.log('SIGN::::::', rotation);
        if (rotation !== this.lastRotation) {
            this.init();
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
        return rotation.x + rotation.y;
    }
});
