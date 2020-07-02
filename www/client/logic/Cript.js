import $u from '../logic/utills';
import Store from '../../core/Store';
import * as _ from 'underscore';
import copy from 'deep-copy';

const criptsEls = {}; // кеш
export const renderCripts = _.throttle(teamsInfo => {
    ['red', 'blue'].forEach(s => {
        const { cripts } = teamsInfo[s + 'Team'];
        for (const c in cripts) {
            renderCript(cripts[c]);
        }
    });
}, 500);


export const destroyCript = data=>{
    console.log('Destroy cript', data.id);
    const criptEl = criptsEls[data.id];
    delete criptsEls[data.id];
    criptsEls.realColor = 'black';
    criptEl.querySelector('.colorized-pain').setAttribute('material', 'color:', 'black');
    criptEl.parentNode.removeChild(criptEl);
};


export const renderCript = data => {
    try {
        const criptEl = criptsEls[data.id] || createCript(data);
        const pos = data.position;
        criptEl.setAttribute('animation', `property: position; to: ${pos.x} ${pos.y} ${pos.z}; dur: ${data.delayReportClient * 1000}; easing: linear;`);
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
        const rotation = $u.mathRotationToTarget(data.position, rotationTargetEl);
        if (data.isCPU && _.isNaN(rotation.x)) { // для CPU актуально
            // rotation.x = criptEl.lastValidX;
            rotation.x = 0;
            if (data.side === 'red') {
                console.log('NAN', rotation);
                rotation.y = 180;
            }
        } else {
            // criptEl.lastValidX = rotation.x;
            // console.log(data.side, criptEl.lastValidX);
        }
        criptEl.setAttribute('rotation', rotation);
    } catch (e) {
        console.log('FOR cript', data.inTargetId, e);
    }
};


const createCript = data => {
    const el = document.createElement('a-entity');
    el.id = data.id;
    const pos = data.position;
    el.setAttribute('position', pos);
    el.setAttribute('template', (data.isCPU ? 'avatar-template' : 'cript-template'));
    el.setAttribute('animation', `property: position; to: ${pos.x} ${pos.y} ${pos.z}; dur: 300; easing: linear;`);
    document.querySelector('a-scene').appendChild(el);
    criptsEls[data.id] = el;

    requestAnimationFrame(() => {
        const colorized = el.querySelector('.colorized-pain');
        colorized.setAttribute('material', 'color:' + data.side);
        colorized.realColor = data.side;
        colorized.targetId = data.id;
        Store.mySide !== data.side && colorized.setAttribute('cursor-listener', ''); // определяем что противник и можно целиться
    });

    return el;
};
