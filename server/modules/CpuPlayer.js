const Cript = require('./Cript');
const _ = require('underscore');
const config = require('../../config_');
const copy = require('deep-copy');
module.exports = class extends Cript {
    startCriptLife(){
        this.distanceOfFire = config.distanceOfFire;
        this.reaLY = 1.6;
        this._data.speedPerSecond = 5;
        this._data.delayReportClient = .3;
        this._data.type = 'cpu';
        this._data.isCpu = true;
        console.log('CREATE CPU');
    }
    checkGo(){
        try {
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
            if (defender.type === 'tower') {
                returnPosition.z += isRed ? 3 : -3; // перед башней
            } else {
                returnPosition.z += isRed ? -1.5 : +1.5; // за криптом
            }
            // console.log(this._data.position, returnPosition);
            this.returnPosition = returnPosition;

            if (this.inTargetId && !this.returnPosition) { // в бою, не идем
                return;
            }
            this.step();
        } catch (e) {
            console.log('checkGo CPU: ' + e);
        }
    }
    get myDefenders(){
        const defenders = [];
        const {myTeam} = this;
        Object.keys(myTeam.towers).forEach(p => myTeam.towers[p].health > 0 && defenders.push(myTeam.towers[p]));
        Object.keys(myTeam.cripts).forEach(p => p !== this.id && myTeam.cripts[p].position && myTeam.cripts[p].health > 0 && defenders.push(myTeam.cripts[p]));
        return defenders;
    }
    destroy() {
        console.log('DESTROY CPU', this._data.id);
        this.positionInit();
    }
};
