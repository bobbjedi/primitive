const Tower = require('./Tower');
const math = require('../helpers/math');
const config = require('../../config_');
const Store = require('./Store');
const _ = require('underscore');
const copy = require('deep-copy');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');

module.exports = class extends Tower {
    init(){
        this.distanceOfFire = config.distanceOfFire - 2.5;
        this.reaLY = 1.2;
        this._data.speedPerSecond = 1;
        this._data.delayReportClient = .3;
        this.points = this._data.points;

        this._data.type = 'cript';
        this._data.health = 100;
        this.positionInit();
        this.setIntervalTimer = setInterval(() => {
            this.checkShot();
            this.reBullet();
            this.checkGo();
            Store.io.to(this.matchId).emit('cript-info', this._data);
        }, this._data.delayReportClient * 1000);
        this.startCriptLife();
    }
    positionInit(){
        this._data.health = 100;
        const points = copy(MATCH_CONSTANTS.cripts[this._data.side].points);
        points.forEach(p => p.x = p.x * (this._data.pos || 1) + _.random(-1, 1));
        this.position = points.shift();
        this.points = points;
    }
    startCriptLife(){

    }
    // Проверка идти дальше
    checkGo(){
        if (this.inTargetId) { // в бою, не идем
            return;
        }
        this.step();
    }
    step() {
        try {
            // шаг раз в 0.3с пускай проходит 0.3 метра
            const METR_PER_ITER = this._data.speedPerSecond * this._data.delayReportClient;
            // считаем расстояние до нужной точки
            const nextPoint = this._data.nextPoint = this.returnPosition || this.points[0]; // returnPosition для CPU - точка сваливания
            // const nextPoint = this._data.nextPoint = this.points[0]; // returnPosition для CPU - точка сваливания
            const dist = math.mathDist2D(nextPoint, this.position);

            // console.log(this.returnPosition, this.points[0]);
            if (dist < METR_PER_ITER) {
                if (this.returnPosition) { // если CPU занял точку - ждет
                    this.position = this.returnPosition;
                    return;
                }
                return this.position = this.points.shift(); // пересчелкиваем следующую
            }
            const next = math.nextPosition({ from: this.position, to: nextPoint, dist: METR_PER_ITER });
            this.position = next;
        } catch (e) {
            console.log('step', e);
        }
    }
    set position(v){
        this._data.position = v;
    }
    get position(){
        return this._data.position;
    }
};
