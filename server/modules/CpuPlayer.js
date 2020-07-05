const Cript = require('./Cript');
const _ = require('underscore');
const config = require('../../config_');
const copy = require('deep-copy');

module.exports = class extends Cript {
    startCriptLife(){
        this.distanceOfFire = config.distanceOfFire;
        this.reaLY = 1.6;

        this.public.isCpu = true;

        this.public.lvl = 1;
        this.public.exp = 0;
        this.predExpLvl = this.stat.exp_1lvl; // прошлый уровень экспы
    }
    checkGo(){
        try {
            // if (!this.firstPointIsGet) {
            //     return this.step();
            // }
            // считаем точку ныкания
            const {myDefenders, side} = this;
            const isRed = side === 'red';
            if (!myDefenders.length){
                return;
            }
            myDefenders.sort((d1, d2) => d1.position.z - d2.position.z);
            const defender = isRed ? _.last(myDefenders) : myDefenders[0];
            const returnPosition = copy(this.position);
            returnPosition.z = defender.position.z;
            returnPosition.x = defender.position.x + _.random(-.5, .5);
            if (defender.type === 'tower') {
                returnPosition.z += isRed ? 3 : -3; // перед башней
            } else {
                returnPosition.z += isRed ? -1.5 : +1.5; // за криптом
            }
            // console.log(this.public.position, returnPosition);
            this.returnPosition = returnPosition;
            if (this.inTargetId && !this.returnPosition) { // в бою, не идем
                return;
            }
            this.step();
        } catch (e) {
            console.log('checkGo CPU: ' + e);
        }
    }

    get nextLvlExp() {
        return this.predExpLvl * this.stat.expCoef * this.public.lvl;
    }
    get myDefenders(){
        const defenders = [];
        const {myTeam} = this;
        Object.keys(myTeam.towers).forEach(p => myTeam.towers[p].health > 0 && defenders.push(myTeam.towers[p]));
        Object.keys(myTeam.cripts).forEach(p => p !== this.id && myTeam.cripts[p].position && myTeam.cripts[p].health > 0 && defenders.push(myTeam.cripts[p]));
        return defenders;
    }
    destroy() {
        console.log('DESTROY CPU', this.public.id);
        this.positionInit();
    }
};
