const Store = require('./Store');
const config = require('../../config_');
const math = require('../helpers/math');
const _ = require('underscore');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');
const copy = require('deep-copy');

module.exports = class {
    constructor(data) {
        const { id, position, side, matchId} = data;
        this.public = data;
        this.id = id;
        this.position = position;
        this.side = side;
        this.matchId = matchId;
        this.reaLY = 8.5;
        this.distanceOfFire = config.distanceOfFire + 3;

        this.bullets = 3; // сейчас в обойме
        this.maxBullets = 3; // обьем обоймы
        this.lastShot = 0; // время последнего выстрела
        this.kd = 800; // время отката пули мс
        this.inTargetId = false; // кто сейчас в цели
        this.setIntervalTimer = null;

        this.stat = this.public.stat = copy(MATCH_CONSTANTS.stat[this.public.type]);
        setTimeout(() => { // делаем задержку чтоб добдаться запрлнения Store
            this.oppositTeam = Store.matches[this.matchId][(this.side === 'red' ? 'blue' : 'red') + 'Team'];
            this.myTeam = Store.matches[this.matchId][(this.side === 'blue' ? 'blue' : 'red') + 'Team'];
            this.init();
        }, 1000);
    }

    get match() {
        return Store.matches[this.matchId];
    }
    get targets(){
        const targets = [];
        const {oppositTeam} = this;
        Object.keys(oppositTeam.players).forEach(p => oppositTeam.players[p].health > 0 && targets.push(oppositTeam.players[p]));
        Object.keys(oppositTeam.towers).forEach(p => oppositTeam.towers[p].health > 0 && targets.push(oppositTeam.towers[p]));
        Object.keys(oppositTeam.cripts).forEach(p => oppositTeam.cripts[p].health > 0 && targets.push(oppositTeam.cripts[p]));
        return targets;
    }
    init() {
        this.updateStat();
        this.setIntervalTimer = setInterval(() => {
            this.checkShot();
            this.reBullet();
        }, 300);
    }
    // Попытка выстрелить
    checkShot() {
        if (this.bullets <= 0 || this.isBlockShot) { // пустая обойма
            return;
        }
        const enemys = this.getEnemyInTargetZone();
        if (!enemys.length){
            this.inTargetId = false;
            return;
        }
        let enemyId;
        if (this.inTargetId){ // проверяем кто в фокусе
            const stillFocusEnemy = enemys.find(e => e.id === this.inTargetId);
            if (stillFocusEnemy){ // все еще доступен
                // console.log('stillFocusEnemy', stillFocusEnemy.id);
                enemyId = stillFocusEnemy.id;
            }
        }
        // если сбежал или не было, то выбираем мишень
        if (!enemyId) {
            enemyId = _.shuffle(enemys)[0].id;
        }
        return this.makeShot(enemyId);

        // console.log(this.id, this.targets);
        // проверяем чужих игроков и криптов в округе
    }
    /**
     * Выстрел!
     * @param {String} enemyId
     */
    makeShot(enemyId){
        this.inTargetId = enemyId;
        const { x, z } = this.position;
        this.match.shotInTargetFromServer({ creator: this.id, target: enemyId, type: this.public.type, position: { x, y: this.reaLY, z } });
        this.bullets--;
        this.isBlockShot = true;
        setTimeout(() => this.isBlockShot = false, this.kd);
    }
    getEnemyInTargetZone(){
        const enemies = [];
        this.targets.forEach(t => {
            if (t.position && this.position && math.mathDist3D(t.position, this.position) <= this.distanceOfFire){
                enemies.push(t);
            };
        });
        return enemies;
    }
    reBullet() {
        if (this.bullets >= this.maxBullets || this.isBlockReBullet || this.isBlockShot) { // нельзя перезаряжать когда стреляет
            return;
        }
        this.bullets++;
        this.isBlockReBullet = true;
        setTimeout(() => this.isBlockReBullet = false, this.kd * 2.5);
    }
    destroy() {
        clearInterval(this.setIntervalTimer);
    }
    updateStat(){
        this.health = this.stat.health;
        this.def = this.stat.def;
        this.damage = this.stat.damage;
        // this.public.speedPerSecond = this.stat.speedPerSecond;
        // console.log(this.public.type, this.public.speedPerSecond);
    }

    set health(v){
        this.public.health = v;
    }
    get health(){
        return this.public.health;
    }
    set def(v){
        this.public.def = v;
    }
    get def(){
        return this.public.def;
    }
    set damage(v){
        this.public.damage = v;
    }
    get damage(){
        return this.public.damage;
    }
    set inTargetId(v){
        this.public.inTargetId = v;
    }
    get inTargetId(){
        return this.public.inTargetId;
    }
};
/**
 * Расстояние между точками
 * @param {Object} t1
 * @param {Object} t2
 */
