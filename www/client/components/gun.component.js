import Store from '../Store';

AFRAME.registerComponent('gun', {
    schema: {
        bulletTemplate: { default: '#bullet-template' },
        triggerKeyCode: { default: 32 } // spacebar
    },

    init: function () {
        this.templateHtml = document.querySelector(this.data.bulletTemplate).innerHTML;
        document.body.onkeyup = e => {
            if (e.keyCode === this.data.triggerKeyCode) {
                this.shoot();
            }
        };

        document.addEventListener('socketOnRedy', () => {
            globalSocket.on('render-player-skill', data => {
                this.renderBullet(data);
            });
        });
    },
    shoot: function () {
        const tip = document.querySelector('#player');
        const position = this.getInitialBulletPosition(tip);
        const rotation = this.getInitialBulletRotation(tip);
        this.renderBullet({ position, rotation, target: Store.currentTargetSid });

        globalSocket.emit('use-skill', { // отправляем на сервер
            type: 'bullet',
            creator: globalSocket.id,
            target: Store.currentTargetSid,
            rotation,
            position
        });
    },
    // Рисуем локально пулю
    renderBullet(data) {
        const {position, rotation, target} = data;
        const el = document.createElement('a-entity');
        el.innerHTML = this.templateHtml;
        el.setAttribute('remove-in-seconds', (target ? 3 : 1));
        el.setAttribute('forward', 'speed:0.3');
        el.setAttribute('position', position);
        el.setAttribute('rotation', rotation);
        document.querySelector('a-scene').appendChild(el);
        setTimeout(() => this.renderInTarget(data), 200);
    },
    // Рисуем попадание скилом
    renderInTarget(data){
        console.log(data.target);
        if (!data.target){
            return;
        }
        if (Store.mySid !== data.target) { // не в меня попали
            console.log(Store.players);
            const el = Store.players[data.target].querySelector('.head');
            const color = el.getAttribute('color');
            el.setAttribute('color', 'red');
            setTimeout(() => el.setAttribute('color', 'green'), 200);
        } else {
            console.log('В меня!');
            const pain = document.getElementById('mask-pain').style;
            pain.display = 'block';
            setTimeout(() => { pain.display = 'none'; }, 300);
        }
    },
    getInitialBulletPosition: function (spawnerEl) {
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);
        return worldPos;
    },

    getInitialBulletRotation: function (spawnerEl) {
        var worldDirection = new THREE.Vector3();

        spawnerEl.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);
        this.vec3RadToDeg(worldDirection);

        return worldDirection;
    },

    vec3RadToDeg: function (rad) {
        rad.set(rad.y * 90, -90 + (-THREE.Math.radToDeg(Math.atan2(rad.z, rad.x))), 0);
    }
});
