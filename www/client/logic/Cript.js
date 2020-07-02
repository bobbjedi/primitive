import $u from '../logic/utills';
import Store from '../../core/Store';
import * as _ from 'underscore';
import * as copy from 'deep-copy';

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
        criptEl.setAttribute('position', data.position);

        let rotationTargetEl = data.nextPoint, speed = data.speedPerSecond;
        if (data.inTargetId){
            const target = data.inTargetId === Store.user.login ? 'player' : data.inTargetId;
            speed = 0;
            const targetEl = document.getElementById(target);
            rotationTargetEl = targetEl ? targetEl.getAttribute('position') : rotationTargetEl;
            if (data.inTargetId.includes('tower')) {
                rotationTargetEl = copy(rotationTargetEl);
                rotationTargetEl.y = 8;
            }
        }
        const rotation = $u.mathRotationToTarget(data.position, rotationTargetEl);
        // data.isCPU && console.log('rotationTargetEl>', data.position, rotationTargetEl, rotation);
        if (_.isNaN(rotation.x)) {
            console.log('NANAN');
            rotation.x = criptEl.lastValidX;
        } else {
            criptEl.lastValidX = rotation.x;
        }
        //     criptEl.lastValitRotation = rotation;
        // } else {
        //     rotation = criptEl.lastValitRotation;
        // }
        // console.log(rotation);
        criptEl.setAttribute('rotation', rotation);
        criptEl.setAttribute('forward', 'speed:' + speed);
    } catch (e) {
        console.log('FOR cript', data.inTargetId, e);
    }
};


const createCript = data => {
    const el = document.createElement('a-entity');
    el.id = data.id;
    el.setAttribute('position', $u.positionObjectToString(data.position));
    el.setAttribute('template', (data.isCPU ? 'avatar-template' : 'cript-template'));
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
