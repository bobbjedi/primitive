import Store from '../../core/Store';
import $u from '../logic/utills';

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
        window.fire = () => this.shoot(); // кнопка огня
        document.addEventListener('socketOnRedy', () => {
            globalSocket.on('render-player-skill', data => {
                this.renderBullet(data);
            });
        });
    },
    shoot: function () {
        const tip = document.querySelector('#player');
        const position = $u.getElPosition(tip);
        const rotation = $u.getElRotation(tip);
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
        el.setAttribute('remove-in-seconds', (!target ? .5 : .5));
        el.setAttribute('forward', 'speed:2');
        el.setAttribute('position', position);
        el.setAttribute('rotation', rotation);
        document.querySelector('a-scene').appendChild(el);
        setTimeout(() => this.renderInTarget(data), 200);
    },
    // Рисуем попадание скилом
    renderInTarget(data){
        if (!data.target){
            return;
        }
        if (Store.user.login !== data.target) { // не в меня попали
            console.log(data.target);
            const el = document.getElementById(data.target).querySelector('.colorized-pain');
            el.setAttribute('material', 'color', 'grey');
            setTimeout(() => el.setAttribute('material', 'color', el.realColor), 200);
        } else {
            console.log('В меня!');
            const pain = document.getElementById('mask-pain').style;
            pain.display = 'block';
            setTimeout(() => { pain.display = 'none'; }, 300);
        }
    }
});
