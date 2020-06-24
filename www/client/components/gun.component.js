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
    console.log(rotation);
    const el = document.createElement('a-entity');
    el.innerHTML = templateHtmlBullet;
    el.setAttribute('remove-in-seconds', (!target ? .5 : .5));
    el.setAttribute('forward', 'speed:5');
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
        const el = document.getElementById(data.target).querySelector('.colorized-pain');
        el.setAttribute('material', 'color', el.realColor);
        requestAnimationFrame(()=>{
            el.setAttribute('material', 'color', 'grey');
            setTimeout(() => el.setAttribute('material', 'color', el.realColor), 150);
        });
    } else {
        console.log('В меня!');
        const pain = document.getElementById('mask-pain').style;
        pain.display = 'block';
        setTimeout(() => { pain.display = 'none'; }, 300);
    }
};

document.addEventListener('socketOnRedy', () => {
    templateHtmlBullet = document.getElementById('bullet-template').innerHTML;

    globalSocket.on('render-bullet', data => {
        try {
            if (!data.rotation) { // серверный выстрел
                const id = data.target === Store.user.login ? 'player' : data.target;
                data.rotation = $u.mathRotationToTarget(data.position, document.getElementById(id).getAttribute('position'));
            }
            renderBullet(data);
        } catch (e) {
            console.log('Error: render-bullet', e);
        }
    });
});
