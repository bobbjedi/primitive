const _ = require('underscore');
const Store = require('./Store');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');
const Tower = require('./Tower');
const Cript = require('./Cript');

module.exports = class {
    constructor(lobbyRoom){
        lobbyRoom.matchId = this.matchId = _.uniqueId('match_');
        this.lobbyRoom = lobbyRoom;
        this.Towers = {};
        this.Cripts = {};

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
        this.divisionPlayers();
        Store.matches[this.matchId] = this;
        setInterval(()=> this.createCripts(), 30000);
        this.reportPlayersAboutStart();
        // this.syncDataIntervalId = setInterval(() => this.syncInfoToClients(), 500); // синхронизация в обычном режиме
    }

    get matchInfo(){
        return {
            redTeam: this.redTeam,
            blueTeam: this.blueTeam,
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
            const {stat} = MATCH_CONSTANTS;
            const players = _.shuffle(this.lobbyRoom.joined);
            this.redTeam.players[players[0]] = {
                type: 'player',
                id: players[0],
                health: stat.health,
                def: stat.health,
                damage: stat.damage,
                side: 'red'
            };
            this.blueTeam.players[players[1]] = {
                type: 'player',
                id: players[1],
                health: stat.health,
                def: stat.health,
                damage: stat.damage,
                side: 'blue'
            };
            // }
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
        data.forEach(d => {
            const position = d.components['0'];
            const rotation = d.components['1'];
            const player = this.gePlayerByName(userName);
            if (player && d.template === '#avatar-template'){ // игрок
                position && (player.position = position);
                rotation && (player.rotation = rotation);
            }
        });
    }

    createTowers(){
        ['red', 'blue'].forEach(s => {
            MATCH_CONSTANTS.towers[s].forEach(t => {
                const tower = {
                    id: t.id,
                    position: t.position,
                    side: s,
                    matchId: this.matchId
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
        const points = JSON.parse(JSON.stringify(MATCH_CONSTANTS.cripts[s].points));
        points.forEach(p => p.x = p.x * pos + _.random(-1, 1));
        const cript = {
            id: 'cript_' + _.uniqueId(),
            position: points.shift(),
            side: s,
            matchId: this.matchId,
            points
        };
        this[s + 'Team'].cripts[cript.id] = cript;
        this.Cripts[cript.id] = new Cript(cript);
    }
    createCripts() {
        console.log('CRIPTS CREATE');
        this.createCript('red', 1);
        this.createCript('blue', 1);
        this.createCript('red', -1);
        this.createCript('blue', -1);
    }

    /**
    * Выстрел моба или башни - генерация на сервере
    */
    shotInTargetFromServer(data){
        Store.io.to(this.matchId).emit('render-bullet', data);
        this.damageShot(data); // серверные только в цель
    }

    syncInfoToClients(){
        Store.io.to(this.matchId).emit('info-match', this.matchInfo); // преимущественно для перемещения мобов
    }
    /**
     * Выстрел с дамагом
     * рендер уже сам отработает, надо посчитать и отправить данные про ХР и тд
     */
    damageShot(data){
        try {
            const damager = this.gePlayerByName(data.creator) || this.Towers[data.creator] || this.Cripts[data.creator];
            const target = this.gePlayerByName(data.target) || this.Towers[data.target] || this.Cripts[data.target];
            if (!target) {
                return console.log(data.target, 'не найден!');
            }
            target.health = Math.round((target.def * target.health - damager.damage) / target.def);
            if (target.health < 0) {
                console.log(target.id, target.side, 'УБИТ');

                const team = this[target.side + 'Team'];

                delete this.Towers[target.id];
                delete team.cripts[target.id];
                // delete team.towers[target.id];
                delete this.Cripts[target.id];

                target._data && Store.io.to(this.matchId).emit('destroy', target._data);
                target.destroy && target.destroy();
            }
        } catch (e) {
            console.log('damageShot:' + e, e);
        }
    }

    finalMatch() {
        clearInterval(this.this.syncDataIntervalId);
    }
};
