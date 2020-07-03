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
        this.public.speedPerSecond = this.stat.speedPerSecond;
        this.public.delayReportClient = 300;
        this.points = this.public.points;
        this.positionInit();
        this.startCriptLife();

        this.setIntervalTimer = setInterval(() => {
            this.checkShot();
            this.reBullet();
            this.checkGo();
            Store.io.to(this.matchId).emit('warrior-info', this.public);
        }, this.public.delayReportClient);
    }
    positionInit(){
        this.updateStat();
        const points = copy(MATCH_CONSTANTS.cripts[this.public.side].points);
        points.forEach(p => p.x = p.x * (this.public.pos || 1) + _.random(-1, 1));
        this.position = points.shift();
        this.points = points;
        this.firstPointIsGet = false;
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
            const METR_PER_ITER = this.public.speedPerSecond * this.public.delayReportClient / 1000;
            // считаем расстояние до нужной точки
            const nextPoint = this.public.nextPoint = this.returnPosition || this.points[0]; // returnPosition для CPU - точка сваливания
            // const nextPoint = this.public.nextPoint = this.points[0]; // returnPosition для CPU - точка сваливания
            const dist = math.mathDist2D(nextPoint, this.position);

            // console.log(this.returnPosition, this.points[0]);
            const cpuError = this.public.isCPU ? .2 : 0;
            if (dist < METR_PER_ITER + cpuError) {
                if (this.returnPosition) { // если CPU занял точку - ждет
                    this.position = this.returnPosition;
                    return;
                }
                this.firstPointIsGet = true; // определяем что первая точка достигнута
                return this.position = this.points.shift(); // пересчелкиваем следующую
            }
            const next = math.nextPosition({ from: this.position, to: nextPoint, dist: METR_PER_ITER });
            this.position = next;
        } catch (e) {
            console.log('step', e);
        }
    }
    set position(v){
        this.public.position = v;
    }
    get position(){
        return this.public.position;
    }
    // set speedPerSecond(v){
    //     this.public.speedPerSecond = v;
    // }
    // get speedPerSecond(){
    //     return this.public.speedPerSecond;
    // }
};
