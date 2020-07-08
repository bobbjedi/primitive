const Cript = require('./Cript');
const _ = require('underscore');
const config = require('../../config_');
const copy = require('deep-copy');
const Store = require('./Store');
const $u = require('../helpers/utils');
const math = require('../helpers/math');

module.exports = class extends Cript {
    startCriptLife(){
        this.distanceOfFire = config.distanceOfFire;
        this.reaLY = 1.6;

        // this.public.isCpu = true;

        this.public.lvl = 1;
        this.public.exp = 0;
        this.predExpLvl = this.stat.exp_1lvl; // прошлый уровень экспы
        this.public.nextLvlExp = this.nextLvlExp;

        this.public.isCPU && super.startCriptLife(); // для ботов сратуем криптовый таймаут
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
                if (this.inTargetId && this.health > this.stat.health / 6) {
                    // shot if is target
                    return;
                }
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

    destroy(kilerId) {
        this.sendPrizeForMyDead(kilerId);
        const timeOut = this.stat.respawnTime + this.public.lvl * 5;
        this.public.nextRespawnTime = $u.unix() + timeOut;
        setTimeout(() => this.respawn(), timeOut * 1000);
        if (!this.public.isCPU) {
            this.public.position = this.myTeam.spawnPosition;
            Store.socketsByName[this.public.id].emit('u-was-killed', { position: this.myTeam.spawnPosition});
        } else {
            this.positionInit();
        }
    }

    respawn(){
        this.public.isDead = false;
        this.health = this.stat.health;
        !this.public.isCPU && Store.socketsByName[this.public.id].emit('u-was-respawn', { position: this.myTeam.spawnPosition});
    }

    // Получил экспу
    setExp(exp){
        console.log('EXP', this.id, exp);
        this.public.exp += exp;
        if (this.public.exp > this.nextLvlExp) {
            this.public.exp = this.public.exp - this.nextLvlExp;
            this.lvlUp();
        }
        this.public.exp = Math.round(this.public.exp);
    }

    lvlUp(){
        this.public.lvl++;
        this.predExpLvl = this.public.nextLvlExp;
        this.public.nextLvlExp = this.nextLvlExp;

        // TODO: стату вырастить автоматически для мобов и для игнроков в ручную
        this.stat.health = Math.round(this.stat.health * 1.1);
        this.def = Math.round(this.def * 1.1);
        this.damage = Math.round(this.damage * 1.2);
        this.speedPerSecond = Math.round(this.speedPerSecond * 1.1);
        this.health = this.stat.health;
        // console.log('LVL UP', this.public);
    }


    get nextLvlExp() {
        return Math.round(this.predExpLvl * this.public.lvl * 0.4);
    }

    get myDefenders(){
        const defenders = [];
        const {myTeam} = this;
        Object.keys(myTeam.towers).forEach(p => myTeam.towers[p].health > 0 && defenders.push(myTeam.towers[p]));
        Object.keys(myTeam.cripts).forEach(p => p !== this.id && myTeam.cripts[p].position && myTeam.cripts[p].health > 0 && defenders.push(myTeam.cripts[p]));
        return defenders;
    }
};
