import * as _ from 'underscore';
import $u from '../logic/utills';

AFRAME.registerComponent('hard-body-sensitive', {
    dependencies: ['position', 'rotation'],
    schema: {
        objects: { default: '.collide-body' },
        elementPosition: { default: 'none' }
    },
    validPositions: [],
    init(){
        let isBlockedSave = false;
        const element = this.data.elementPosition === 'none' ? this.el : document.querySelector(this.data.elementPosition);
        this.el.setAttribute('aabb-collider', '');
        this.el.addEventListener('collide', (e) => {
            if (e.detail.el.classList.contains('hard-body')) {
                isBlockedSave = true;
                // console.log('HARD!', this.validPositions[0]);
                this.validPositions.length && element.setAttribute('position', this.validPositions[0]);
            }
        });
        // const self = this;
        this.el.addEventListener('notcollide', _.throttle(e => {
            !isBlockedSave && this.registerValidPosition();
            isBlockedSave = false;
        }, 50));
    },
    // храним 3 последние валидные и откатываемся на первую
    registerValidPosition() {
        this.validPositions.push($u.getElPosition(this.el));
        if (this.validPositions.length > 3) {
            this.validPositions = this.validPositions.splice(-2);
        }
    }
});
