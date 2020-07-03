import $u from './utills';
import Store from '../../core/Store';
import * as _ from 'underscore';
import copy from 'deep-copy';

const warriorsEls = {}; // кеш
export const renderWarriors = _.throttle(teamsInfo => {
    ['red', 'blue'].forEach(s => {
        const { warriors } = teamsInfo[s + 'Team'];
        for (const c in warriors) {
            renderWarrior(warriors[c]);
        }
    });
}, 500);


export const destroyWarrior = data=>{
    console.log('Destroy warrior', data.id);
    const warriorEl = warriorsEls[data.id];
    delete warriorsEls[data.id];
    warriorsEls.realColor = 'black';
    warriorEl.querySelector('.colorized-pain').setAttribute('material', 'color:', 'black');
    warriorEl.parentNode.removeChild(warriorEl);
};


export const renderWarrior = data => {
    try {
        if (data.id === Store.user.login) {
            return;
        }
        // console.log(data);
        const warriorEl = warriorsEls[data.id] || createWarrior(data);
        const pos = data.position;
        warriorEl.setAttribute('animation', `property: position; to: ${pos.x} ${pos.y} ${pos.z}; dur: ${data.delayReportClient}; easing: linear;`);
        let rotationTargetEl = data.nextPoint;
        if (data.inTargetId){
            const target = data.inTargetId === Store.user.login ? 'player' : data.inTargetId;
            const targetEl = document.getElementById(target);
            rotationTargetEl = targetEl ? targetEl.getAttribute('position') : rotationTargetEl;
            if (data.inTargetId.includes('tower')) {
                rotationTargetEl = copy(rotationTargetEl);
                rotationTargetEl.y = 8;
            }
        }

        const rotation = data.rotation || $u.mathRotationToTarget(data.position, rotationTargetEl); // data.rotation только у реальных игроков

        if (data.isCPU && _.isNaN(rotation.x)) { // для CPU актуально
            rotation.x = 0;
            data.side === 'red' && (rotation.y = 180);
        }

        warriorEl.setAttribute('rotation', rotation);
    } catch (e) {
        console.log('FOR warrior', data.inTargetId, e);
    }
};


const createWarrior = data => {
    const el = document.createElement('a-entity');
    el.id = data.id;
    const pos = data.position;
    el.setAttribute('position', pos);
    el.setAttribute('template', (data.type === 'player' ? 'avatar-template' : 'cript-template'));
    el.setAttribute('animation', `property: position; to: ${pos.x} ${pos.y} ${pos.z}; dur: 300; easing: linear;`);
    document.querySelector('a-scene').appendChild(el);
    warriorsEls[data.id] = el;

    requestAnimationFrame(() => {
        const colorized = el.querySelector('.colorized-pain');
        colorized.setAttribute('material', 'color:' + data.side);
        colorized.realColor = data.side;
        colorized.targetId = data.id;
        Store.mySide !== data.side && colorized.setAttribute('cursor-listener', ''); // определяем что противник и можно целиться
    });

    return el;
};
