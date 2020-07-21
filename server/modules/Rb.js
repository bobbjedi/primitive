const Tower = require('./Tower');
const $u = require('../helpers/utils');
const math = require('../helpers/math');
const config = require('../../config_');
const Store = require('./Store');
const _ = require('underscore');
const copy = require('deep-copy');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');

module.exports = class extends Tower {
    init(){
        this.public.isDead = false;
        this.health = this.stat.health;
        this.nextRespawnTime = false; // время сл респавна
        this.reaLY = 1.2;
        super.init();
    }

    get targets(){
        const targets = [];
        const {Heroes} = this.match;
        Object.keys(Heroes).forEach(p => Heroes[p].health > 0 && targets.push(Heroes[p]));
        return targets;
    }
    // Имеет определенную зону обстрела опциональную
    getEnemyInTargetZone(){
        const enemies = [];
        const {zone} = this.public;
        this.targets.forEach(t => {
            if (
                t.position.x < zone.maxX
                && t.position.x > zone.minX
                && t.position.z < zone.maxZ
                && t.position.z > zone.minZ
            ) {
                enemies.push(t);
            }
        });

        return enemies;
    }
    destroy(killerId) {
        super.destroy(killerId);
        console.log('>>>>', this.public.respTime);
        this.nextRespawnTime = $u.unix() + this.public.respTime * 60 * 1000;
    }
};
