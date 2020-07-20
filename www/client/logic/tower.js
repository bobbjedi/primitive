import Store from '../../core/Store';

import $u from './utills';
AFRAME.registerComponent('tower', {
    schema: {},
    init: function () {
        const sphere = this.el.querySelector('.tower-sphere');
        sphere.setAttribute('material', 'opacity:.8; color:' + this.data);
        sphere.targetId = this.el.id;
        sphere.realColor = this.data;
        Store.mySide !== this.data && sphere.setAttribute('cursor-listener', ''); // определяем что противник и можно целиться
    }
});

//<a-entity class="tower" id="tower-red-1" position="0 1 -30" template="tower" tower="red"></a-entity>
window.towersEls = {};
export const renderTowers = teamsInfo => {
    ['red', 'blue'].forEach(s => {
        const { towers } = teamsInfo[s + 'Team'];
        for (const t in towers) {
            const tower = towers[t];
            const el = document.createElement('a-entity');
            el.id = tower.id;
            el.setAttribute('position', $u.positionObjectToString(tower.position));
            el.setAttribute('template', tower.isBase ? 'tower-base' : 'tower');
            el.setAttribute('tower', s);
            el.realColor = s;
            document.querySelector('a-scene').appendChild(el);
            towersEls[tower.id] = el;
            if (tower.health <= 0) {
                setTimeout(() => destroyTower(tower), 1000);
            }
            // requestAnimationFrame(() => el.getElementsByClassName('tooltip-warrior')[0].warriorId = tower.id); // пишем в статику для тултипа)
        }
    });
    // на всякий слуяай
    setTimeout(() => document.dispatchEvent(new Event('updateCollideElements')), 1000);
    setTimeout(() => document.dispatchEvent(new Event('updateCollideElements')), 3000);
    setTimeout(() => document.dispatchEvent(new Event('updateCollideElements')), 5000);
};

export const destroyTower = tower => {
    const sphere = towersEls[tower.id].querySelector('.tower-sphere');
    sphere.parentNode.removeChild(sphere);
    // console.log('sphere', sphere);
    // sphere.removeAttribute('cursor-listener');
    // sphere.realColor = 'black';
    // sphere.setAttribute('visible', 'color:', 'black');
};

