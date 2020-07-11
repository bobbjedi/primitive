const _ = require('underscore');
const Store = require('./Store');
const $u = require('../helpers/utils');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');
const Tower = require('./Tower');
const Rb = require('./Rb');
const Cript = require('./Cript');
const CpuPlayer = require('./CpuPlayer');
const config_ = require('../../config_');
const copy = require('deep-copy');

module.exports = class {
    constructor(lobbyRoom){
        lobbyRoom.matchId = this.matchId = _.uniqueId('match_');
        this.lobbyRoom = lobbyRoom;
        this.Towers = {};
        this.RBs = {};
        this.rbs = {}; // чистые обьекты
        this.Cripts = {};
        this.Heroes = {};

        this.currentTimeLvl = 1;

        this.redTeam = {
            towers: {},
            cripts: {},
            players: {},
            spawnPosition: MATCH_CONSTANTS.redPalyersSpawn,
            get playersName(){
                return Object.keys(this.players);
            }
        };

        this.blueTeam = {
            towers: {},
            cripts: {},
            players: {},
            spawnPosition: MATCH_CONSTANTS.bluePalyersSpawn,
            get playersName(){
                return Object.keys(this.players);
            }
        };
        this.createTowers();
        this.createCripts();
        setTimeout(() => this.createRbs(), 8000);
        this.divisionPlayers();
        Store.matches[this.matchId] = this;
        this.cripCreateTimeout = setInterval(() => this.createCripts(), 60000);
        this.updateMatchLvlTimeout = setInterval(() => this.updateMatchLvl(), config_.matchLvlUpdateDelay * 60000);
        this.reportPlayersAboutStart();
        this.syncDataIntervalId = setInterval(() => this.syncInfoToClients(), 500); // синхронизация в обычном режиме
        this.updateHealthHealTimeout = setInterval(() => this.updateHealthHeal(), config_.selfHeal * 1000); // самохил небольшой
    }

    get matchInfo(){
        return {
            serverTime: $u.unix(),
            redTeam: this.redTeam,
            blueTeam: this.blueTeam,
            rbs: this.rbs
        };
    }
    /**
     * Получаем команду по нику
     * @param {String} name
     */
    getTeamByPlayerName(name){
        return this.blueTeam.players[name] ? this.blueTeam : this.redTeam;
    }
    /**
     * Получаем player по нику
     * @param {String} name
     */
    gePlayerByName(name){
        try {
            return this.getTeamByPlayerName(name).players[name];
        } catch (e) {
            console.log('gePlayerByName:', e);
        }
    }
    /**
    * Делим на команды
    */
    divisionPlayers() {
        try {
            const players = _.shuffle(this.lobbyRoom.joined);
            console.log('players>', players);
            const createPlayer = (id, side, isCPU) => {
                id = id || 'cpu_' + _.uniqueId();

                const player = this[side + 'Team'].players[id] = {
                    id,
                    isCPU,
                    side,
                    type: 'player',
                    position: MATCH_CONSTANTS[side + 'PalyersSpawn'],
                    matchId: this.matchId,
                    delayReportClient: !isCPU ? config_.playersSync : 0
                };

                this[side + 'Team'].players[id] = player;

                this.Heroes[id] = new CpuPlayer(player);
            };
            const createTeamPlayers = (side, count, isCPU) => {
                let countCreate = 0;
                while (count > countCreate++) {
                    createPlayer(players.shift(), side, isCPU);
                }
            };
            const {playersCount} = this.lobbyRoom;

            // createPlayer(players.shift(), 'red');
            // createPlayer(players.shift(), 'blue');
            // createPlayer('zzxc', 'blue', 1);
            // return;

            if (playersCount === 1) {
                createPlayer(players.shift(), 'red');
            }
            else if (playersCount === 2) {
                createPlayer(players.shift(), 'red');
                createPlayer(players.shift(), 'blue');
            } else if (playersCount === 3) {
                createTeamPlayers('red', 3);
            } else {
                createTeamPlayers('red', 3);
                createTeamPlayers('blue', 3);
            }
            createTeamPlayers('red', 3 - Object.keys(this.redTeam.players).length, true);
            createTeamPlayers('blue', 3 - Object.keys(this.blueTeam.players).length, true);
        } catch (e) {
            console.log('divisionPlayers:' + e, e);
        }
    }
    /**
    * Сказать игрокам куда переходить
    */
    reportPlayersAboutStart(){
        this.lobbyRoom.joined.forEach(p => Store.socketsByName[p].emit('go-match', '/' + this.lobbyRoom.format + '.html?match-id=' + this.matchId));
    }
    /**
     * Данные синхронизации от юзера
     * @param {String} userName
     * @param {Object} data
     */
    updateFromUser(userName, data){
        try {
            const player = this.gePlayerByName(userName);
            if (player.isDead) {
                return console.log('isDead and move', player.id); // перемещение убитого
            }
            console.log(data.position);
            player.position = data.position;
            player.rotation = data.rotation;
            Store.io.to(this.matchId).emit('warrior-info', player);
        } catch (e) {
            console.log('updateFromUser: ' + e, e);
        }
    }

    createTowers(){
        ['red', 'blue'].forEach(s => {
            MATCH_CONSTANTS.towers[s].forEach(t => {
                const tower = {
                    id: t.id,
                    position: t.position,
                    side: s,
                    matchId: this.matchId,
                    isBase: t.isBase,
                    type: 'tower'
                };
                this[s + 'Team'].towers[t.id] = tower;
                this.Towers[t.id] = new Tower(tower);
            });
        });
    }
    /**
     * @param {String} сторона red|blue
     * @param {Number} pos 1 или -1 - с какой стороны базы рендерится и по какой полосе идет
     */
    createCript(s, pos){
        const cript = {
            id: 'cript_' + _.uniqueId(),
            pos,
            side: s,
            matchId: this.matchId,
            type: 'cript'
        };
        this[s + 'Team'].cripts[cript.id] = cript;
        this.Cripts[cript.id] = new Cript(cript);
    }
    createCripts() {
        const create = () => {
            this.createCript('red', 1);
            this.createCript('blue', 1);
            this.createCript('red', -1);
            this.createCript('blue', -1);
        };
        create();
        setTimeout(create, 2000);
    }

    createRbs() {
        const create = params => {
            const rb = {
                id: 'rb_' + _.uniqueId(),
                position: params.position,
                matchId: this.matchId,
                side: params.color,
                zone: params.zone,
                type: 'rb',
                nextPoint: params.nextPoint
            };
            this.rbs[rb.id] = rb;
            this.RBs[rb.id] = new Rb(rb);
        };
        MATCH_CONSTANTS.RBs.forEach(create);
    }

    /**
    * Выстрел моба или башни - генерация на сервере
    */
    shotInTargetFromServer(data){
        Store.io.to(this.matchId).emit('render-bullet', data);
        this.damageShot(data); // серверные только в цель
    }

    syncInfoToClients(){
        Store.io.to(this.matchId).emit('current-match-info', this.matchInfo); // преимущественно для перемещения мобов
    }
    /**
     * Выстрел с дамагом
     * рендер уже сам отработает, надо посчитать и отправить данные про ХР и тд
     */
    damageShot(data){
        try {
            const damager = this.Heroes[data.creator] || this.Towers[data.creator] || this.Cripts[data.creator] || this.RBs[data.creator];
            const target = this.Heroes[data.target] || this.Towers[data.target] || this.Cripts[data.target] || this.RBs[data.target];
            if (!target || target.public.isDead) {
                return console.log(data.target, 'не найден или мертв!');
            }
            target.health = Math.round((target.def * target.health - damager.damage) / target.def);
            target.isCPU && target.uGetDamage(damager); // говорим CPU от кого получил дамаг и надо на него переключиться
            console.log(damager.id, target.id, target.health);
            if (target.health <= 0) {
                target.health = 0;
                console.log(target.id, target.side, 'УБИТ, prize:', target.public.lvl, target.prizeExpForKillMe);
                if (target.type !== 'rb') {
                    const team = this[target.side + 'Team'];
                    delete this.Towers[target.id];
                    delete this.Cripts[target.id];
                    delete team.cripts[target.id]; // криптов сносим окончательно
                }

                Store.io.to(this.matchId).emit('destroy', target.public);
                target.destroy(damager.id);
                this.isLose(target.side) && this.finalMatch(target.side); // проверяем снос всех башен и окончагие матча
            }
        } catch (e) {
            console.log('damageShot:' + e, e);
        }
    }
    /**
     * Проверяем пориграла-ли команда
     * @param {String} s
     */
    isLose(s) {
        const towers = this[s + 'Team'].towers;
        return Object.keys(towers).find(id => towers[id].isBase && towers[id].health <= 0);
    }
    /**
     * Апдейтим лвл и апаем башни в ручную
     */
    updateMatchLvl(){
        this.currentTimeLvl++;
        Object.keys(this.Towers).forEach(id => {
            const tower = this.Towers[id];
            tower.def *= 1.05;
            tower.damage *= 1.05;
            tower.stat.basePrizeExp *= 1.1;
            // console.log('TOWER LVL UP', tower.public);
        });
    }

    updateHealthHeal(){
        Object.keys(this.Heroes).forEach(id => {
            this.Heroes[id].health = this.Heroes[id].health + this.Heroes[id].stat.health * 0.008;
            this.Heroes[id].health = Math.min(this.Heroes[id].health, this.Heroes[id].stat.health);
        });
    }
    finalMatch(loseTeam) {
        console.log('LoseTeam!', loseTeam);
        clearInterval(this.syncDataIntervalId);
        clearInterval(this.cripCreateTimeout);
        clearInterval(this.updateMatchLvlTimeout);
        clearInterval(this.updateHealthHealTimeout);
        Object.keys(this.Towers).forEach(id => this.Towers[id].destroy());
        Object.keys(this.Cripts).forEach(id => this.Cripts[id].destroy());
        Object.keys(this.Heroes).forEach(id => this.Heroes[id].destroy());
        // Object.keys(this.redTeam.players).forEach(id => this.redTeam.players[id].destroy());
        // Object.keys(this.blueTeam.players).forEach(id => this.blue.players[id].destroy());
    }
};
