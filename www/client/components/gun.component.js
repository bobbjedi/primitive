import copy from 'deep-copy';
import Store from '../../core/Store';
import $u from '../logic/utills';

AFRAME.registerComponent('gun', {
    schema: {
        bulletTemplate: { default: '#bullet-template' },
        triggerKeyCode: { default: 32 } // spacebar
    },

    init: function () {
        document.body.onkeyup = e => {
            if (e.keyCode === this.data.triggerKeyCode) {
                this.shoot();
            }
        };
        window.fire = () => this.shoot(); // кнопка огня
    },
    shoot: function () {
        if (Store.isDead) {
            return console.warn('Isdead cant shoot');
        }
        const tip = document.querySelector('#player');
        const position = $u.getElPosition(tip);
        const rotation = $u.getElRotation(tip);
        renderBullet({ position, rotation, target: Store.currentTargetId });

        globalSocket.emit('use-skill', { // отправляем на сервер
            type: 'player-bullet',
            creator: Store.user.login,
            target: Store.currentTargetId,
            rotation,
            position
        });
    }
});


let templateHtmlBullet;
// Рисуем локально пулю
const renderBullet = (data) => {
    const {position, rotation, target} = data;
    const el = document.createElement('a-entity');
    // el.innerHTML = templateHtmlBullet;
    el.setAttribute('template', 'bullet-template');
    el.setAttribute('remove-in-seconds', .2);
    el.setAttribute('forward', 'speed:100');
    el.setAttribute('position', position);
    el.setAttribute('rotation', rotation);
    document.querySelector('a-scene').appendChild(el);
    setTimeout(() => renderInTarget(data), 200);
};
// Рисуем попадание скилом
const renderInTarget = (data) => {
    if (!data.target){
        return;
    }
    if (Store.user.login !== data.target) { // не в меня попали
        const el = document.getElementById(data.target);
        if (!el) {
            return;
        }
        const colorizedEl = document.getElementById(data.target).querySelector('.colorized-pain');
        colorizedEl.setAttribute('material', 'color', colorizedEl.realColor);
        requestAnimationFrame(()=>{
            colorizedEl.setAttribute('material', 'color', 'grey');
            setTimeout(() => colorizedEl.setAttribute('material', 'color', colorizedEl.realColor), 150);
        });
    } else {
        const pain = document.getElementById('mask-pain').style;
        pain.display = 'block';
        setTimeout(() => { pain.display = 'none'; }, 300);
    }
};

document.addEventListener('socketOnRedy', () => {
    // templateHtmlBullet = document.getElementById('bullet-template').innerHTML;

    globalSocket.on('render-bullet', data => {
        try {
            if (!data.rotation) { // серверный выстрел
                const id = data.target === Store.user.login ? 'player' : data.target;
                let positionTargert = document.getElementById(id).getAttribute('position');
                if (id.includes('tower')) {
                    positionTargert = copy(positionTargert);
                    positionTargert.y = 8;
                }
                data.rotation = $u.mathRotationToTarget(data.position, positionTargert);
            }
            renderBullet(data);
        } catch (e) {
            console.log('Error: render-bullet', e);
        }
    });
});
