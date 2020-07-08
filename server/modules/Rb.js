const Tower = require('./Tower');
const math = require('../helpers/math');
const config = require('../../config_');
const Store = require('./Store');
const _ = require('underscore');
const copy = require('deep-copy');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');

module.exports = class extends Tower {
    init(){
        this.reaLY = 1.2;
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
        this.targets.forEach(t => {
            if (
                t.position.x < this.data.zone.maxX
                && t.position.x > this.data.zone.minX
                && t.position.z < this.data.zone.maxZ
                && t.position.z > this.data.zone.minZ
            ) {
                enemies.push(t);
            }
        });
        return enemies;
    }
};
