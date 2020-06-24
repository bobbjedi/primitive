const _ = require('underscore');
const Store = require('./Store');
const MATCH_CONSTANTS = require('./MATCH_CONSTANTS');

module.exports = class {
    constructor(lobbyRoom){
        lobbyRoom.matchId = this.matchId = _.uniqueId('match_');
        this.lobbyRoom = lobbyRoom;
        this.redTeam = {
            towers: {},
            cripts: {},
            players: {},
            get playersName(){
                return Object.keys(this.players);
            }
        };

        this.blueTeam = {
            towers: {},
            cripts: {},
            players: {},
            get playersName(){
                return Object.keys(this.players);
            }
        };
        this.createTowers();
        this.divisionPlayers();
        Store.matches[this.matchId] = this;
        setInterval(()=>{
            // console.log('>>', this);
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
    * Делим на команды
    */
    divisionPlayers() {
        try {
            const players = _.shuffle(this.lobbyRoom.joined);
            // if (this.lobbyRoom.format === '3x3') {
            this.redTeam.players[players[0]] = {};
            this.blueTeam.players[players[1]] = {};
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
            const team = this.getTeamByPlayerName(userName);
            if (d.template === '#avatar-template'){ // игрок
                position && (team.players[userName].position = position);
                rotation && (team.players[userName].rotation = rotation);
            } else if (d.template === '#cript-template') {
                // position && (team.players[userName].position = position);
                // rotation && (team.players[userName].rotation = rotation);
            }
        });
    }

    createTowers(){
        ['red', 'blue'].forEach(s=>{
            MATCH_CONSTANTS.towers[s].forEach(t => {
                this[s + 'Team'].towers[t.id] = {
                    id: t.id,
                    position: t.position,
                    health: 1000,
                    def: 100
                };
            });
        });
    }

    emitAllPlayers(obj){

    }
};
