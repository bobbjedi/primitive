const _ = require('underscore');
const Store = require('./Store');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');
const Tower = require('./Tower');

module.exports = class {
    constructor(lobbyRoom){
        lobbyRoom.matchId = this.matchId = _.uniqueId('match_');
        this.lobbyRoom = lobbyRoom;
        this.Towers = {};

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
        this.divisionPlayers();
        Store.matches[this.matchId] = this;
        setInterval(()=>{
            // console.log('>>', this.blueTeam.players['Dev']);
        }, 2000);
        this.reportPlayersAboutStart();
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
     * Получаем команду по нику
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
            this.redTeam.players[players[0]] = {
                id: players[0],
                health: 100,
                def: 10,
                damage: 100
            };
            this.blueTeam.players[players[1]] = {
                id: players[1],
                health: 100,
                def: 10,
                damage: 100
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
            // console.log(player);
            if (d.template === '#avatar-template'){ // игрок
                position && (player.position = position);
                rotation && (player.rotation = rotation);
                // console.log(player);
            } else if (d.template === '#cript-template') {
                // position && (team.players[userName].position = position);
                // rotation && (team.players[userName].rotation = rotation);
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
    * Выстрел моба или башни - негерация на сервере
    */
    shotInTargetFromServer(data){
        Store.io.to(this.matchId).emit('render-bullet', data);
        this.damageShot(data); // серверные только в цель
    }

    syncInfoToClients(data){
        Store.io.to(this.matchId).emit('info-match', data);
    }
    /**
     * Выстрел с дамагом
     * рендер уже сам отработает, надо посчитать и отправить данные про ХР и тд
     */
    damageShot(data){
        try {
            const damager = this.gePlayerByName(data.creator) || this.Towers[data.creator];
            const target = this.gePlayerByName(data.target) || this.Towers[data.target];
            target.health = Math.round((target.def * target.health - damager.damage) / target.def);
            console.log(target.id, '>', target.health);
            if (target.health < 0) {
                console.log(target.id, 'УБИТ');
            }
        } catch (e) {
            console.log('damageShot:' + e, e);
        }
        console.log('DMG:', data);

    }

    emitAllPlayers(obj){

    }
};
