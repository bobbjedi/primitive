const Tower = require('./Tower');
const math = require('../helpers/math');
const config = require('../../config_');
const Store = require('./Store');

module.exports = class extends Tower {
    init(){
        this._data.health = 100;

        this.reaLY = 1.2;
        this.points = this._data.points;
        this.distanceOfFire = config.distanceOfFire;
        this._data.type = 'cript';

        this.setIntervalTimer = setInterval(() => {
            this.checkShot();
            this.reBullet();
            this.checkGo();
            Store.io.to(this.matchId).emit('cript-info', this._data);
        }, 300);
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
            const METR_PER_ITER = .3;
            // считаем расстояние до нужной точки
            const nextPoint = this._data.nextPoint = this.points[0];
            const dist = math.mathDist2D(nextPoint, this.position);
            if (dist < METR_PER_ITER) {
                console.log('---------------------------------');
                return this.position = this.points.shift();
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
