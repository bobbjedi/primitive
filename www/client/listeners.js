import config from '../../config';
import Store from '../core/Store';
import * as _ from 'underscore';
import $u from './logic/utills';

let currentBodyInFocus = null; // глобально
let focus = null;
// Необходимо в случае фокуса рассчитывать дистанцию
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.isFocuse = false;
        // this.el.targetId = this.el.getAttribute('target-id') || this.el.targetId || this.el._creator || this.el.id; // аватар или шар башни или моб
        focus = document.getElementById('cursor');
        this.el.addEventListener('mouseenter', e => {
            if (!this.el.targetId) {
                const attributeId = this.el.getAttribute('target-id').id;
                this.el.targetId = attributeId;
                // Чтобы можно было найти по id и лепим ему цвет
                const avatar = this.el.closest('.avatar');
                if (avatar) {
                    avatar.id = this.el.targetId;
                    this.el.realColor = this.el.getAttribute('material').color;
                }
            }
            console.log('TARGET>', this.el.targetId);
            this.isFocuse = true;
            currentBodyInFocus = this.el;
            const distance = e.detail.intersection.distance;
            if (distance < config.distanceOfFire) {
                this.throwTarget();
            }
        });

        this.el.addEventListener('mouseleave', e => {
            this.leaveTarget();
            this.isFocuse = false;
        });
    },
    leaveTarget(){
        Store.currentTargetSid = null;
        focus.setAttribute('material', 'color: black; shader: flat');
    },
    throwTarget(){
        Store.currentTargetSid = this.el.targetId;
        focus.setAttribute('material', 'color: green; shader: flat');
    },
    tick(){
        if (this.isFocuse){
            const distance = mathDistance() || cashDistance;
            if (distance > config.distanceOfFire){
                this.leaveTarget();
            } else {
                this.throwTarget();
            }
        }
    }
});


// D=sqrt((X2-X1)^2 + (Y2-Y1)^2 + (Z2 - Z1)^2)
let cashDistance = 1000;
const mathDistance = _.throttle(() => {
    const playerPosition = $u.getElPosition(document.getElementById('player'));
    const targetPosition = $u.getElPosition(currentBodyInFocus);
    cashDistance = Math.sqrt(
        Math.pow(playerPosition.x - targetPosition.x, 2) +
        Math.pow(playerPosition.y - targetPosition.y, 2) +
        Math.pow(playerPosition.z - targetPosition.z, 2)
    );
    return cashDistance;
}, 500);

