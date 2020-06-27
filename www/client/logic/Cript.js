import $u from '../logic/utills';
import Store from '../../core/Store';
import * as _ from 'underscore';

const criptsEls = {}; // кеш
export const renderCripts = _.throttle(teamsInfo => {
    ['red', 'blue'].forEach(s => {
        const { cripts } = teamsInfo[s + 'Team'];
        for (const c in cripts) {
            renderCript(cripts[c]);
        }
    });
    requestAnimationFrame(() => document.dispatchEvent(new Event('updateCollideElements')));
}, 500);


export const destroyCript = data=>{
    console.log('Destroy cript', data.id);
    const criptEl = criptsEls[data.id];
    delete criptsEls[data.id];
    criptsEls.realColor = 'black';
    criptEl.querySelector('.colorized-pain').setAttribute('material', 'color:', 'black');
    criptEl.setAttribute('material', 'opacity', 0.3);
    const rmPosition = JSON.parse(JSON.stringify(data.position));
    rmPosition.y = -10;
    criptEl.setAttribute('rotation', $u.mathRotationToTarget(data.position, rmPosition));
    criptEl.setAttribute('forward', 'speed:0.0001');
    setTimeout(() => criptEl.parentNode.removeChild(criptEl), 5000);
};


export const renderCript = data => {
    try {
        const criptEl = criptsEls[data.id] || createCript(data);
        criptEl.setAttribute('position', data.position);

        let rotationEl = data.nextPoint, speed = 0.016;
        if (data.inTargetId){
            const target = data.inTargetId === Store.user.login ? 'player' : data.inTargetId;
            speed = 0;
            rotationEl = document.getElementById(target).getAttribute('position');
        }
        criptEl.setAttribute('rotation', $u.mathRotationToTarget(data.position, rotationEl));
        criptEl.setAttribute('forward', 'speed:' + speed);
    } catch (e) {
        console.log('FOR cript', e);
    }
};


const createCript = data => {
    const el = document.createElement('a-entity');
    el.id = data.id;
    el.setAttribute('position', $u.positionObjectToString(data.position));
    el.setAttribute('template', 'cript-template');
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
