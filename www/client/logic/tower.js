import Store from '../../core/Store';

import $u from './utills';
AFRAME.registerComponent('tower', {
    schema: {},
    init: function () {
        const sphere = this.el.querySelector('.tower-sphere');
        sphere.setAttribute('material', 'opacity:.5; color:' + this.data);
        sphere.targetId = this.el.id;
        sphere.realColor = this.data;
        Store.mySide !== this.data && sphere.setAttribute('cursor-listener', ''); // определяем что противник и можно целиться
    }
});

//<a-entity class="tower" id="tower-red-1" position="0 1 -30" template="tower" tower="red"></a-entity>
const towersEls = {};
export const renderTowers = teamsInfo => {
    ['red', 'blue'].forEach(s => {
        const { towers } = teamsInfo[s + 'Team'];
        for (const t in towers) {
            const tower = towers[t];
            const el = document.createElement('a-entity');
            el.id = tower.id;
            el.setAttribute('position', $u.positionObjectToString(tower.position));
            el.setAttribute('template', 'tower');
            el.setAttribute('tower', s);
            el.realColor = s;
            document.querySelector('a-scene').appendChild(el);
            towersEls[tower.id] = el;
            console.log('isAlive', tower.isAlive);
            if (tower.health <= 0) {
                setTimeout(() => destroyTower(tower), 1000);
            }
        }
    });
    requestAnimationFrame(()=> document.dispatchEvent(new Event('updateCollideElements')));
};

export const destroyTower = tower => {
    const sphere = towersEls[tower.id].querySelector('.tower-sphere');
    console.log('sphere', sphere);
    sphere.removeAttribute('cursor-listener');
    sphere.realColor = 'black';
    sphere.setAttribute('material', 'color:', 'black');
    console.log('sphere', sphere);
};

