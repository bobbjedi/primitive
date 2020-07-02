const _ = require('underscore');
let io, rooms, Match;

module.exports = {
    init(_io, _rooms){
        io = this.io = _io;
        rooms = this.rooms = _rooms;
        setTimeout(()=> Match = require('./Match'));
    },
    socketsByName: {},
    matches: {},
    lobbyRooms: [],
    /**
    * @param {Number} playersCount
    * @param {String} creatorName
    * @param {String} roomName
    */
    createLobbyRoom({playersCount, creatorName, roomName, format}){
        if (this.getPlayerLobbyRoomByName(creatorName)) { // уже в какой-то комнате или уже создал
            return;
        };
        console.log({playersCount, creatorName, roomName, format});
        playersCount = playersCount || 2;
        format = format || '3x3';
        const room = {
            _id: 'lobby_room_' + _.uniqueId(),
            creatorName,
            playersCount,
            roomName,
            format,
            joined: []
        };
        this.lobbyRooms.push(room);
        console.log('Room create', room._id);
        this.playerJoinToLobbyRoom(room.creatorName, room._id);
    },
    /**
     *  @param {String} name
     */
    getLobbyRoomById(_id){
        return this.lobbyRooms.find(r =>r._id === _id);
    },
    /**
     *  @param {String} name
     */
    getLobbyRoomByCreatorName(name){
        return this.lobbyRooms.find(r =>r.creatorName === name);
    },
    /**
     *  @param {String} name
     */
    getPlayerLobbyRoomByName(name){
        return this.lobbyRooms.find(r => r.joined.includes(name));
    },

    /**
     *  @param {String} name
     */
    getMatchByName(name){
        return this.matches.find(r => r.joined.includes(name));
    },
    /**
     * @param {String} name
     */
    playerJoinToLobbyRoom(name, _id){
        try {
            if (this.getPlayerLobbyRoomByName(name)) { // уже в какой-то комнате
                return;
            };
            console.log('playerJoinToLobbyRoom', name, _id);
            const lobbyRoom = this.getLobbyRoomById(_id);
            if (lobbyRoom && lobbyRoom.joined.length < lobbyRoom.playersCount) {
                lobbyRoom.joined.push(name);
                if (lobbyRoom.joined.length === lobbyRoom.playersCount){ // Стартуем Матч
                    new Match(lobbyRoom);
                }
                this.emitUpdateRooms();
            }
        } catch (e) {
            console.log('playerJoinToLobbyRoom: ' + e, e);
        }
    },
    /**
     * @param {String} name
     */
    rmLobbyRoom(_id){
        const i = this.lobbyRooms.findIndex(r => r._id === _id);
        this.lobbyRooms.splice(i, 1);
    },
    /**
     * @param {String} name
     */
    playerLeaveLobbyRoom(name){
        try {
            const lobbyRoom = this.getPlayerLobbyRoomByName(name);
            if (lobbyRoom) {
                lobbyRoom.joined.splice(lobbyRoom.joined.findIndex(t => t === name), 1);
                if (!lobbyRoom.joined.length) {
                    this.rmLobbyRoom(lobbyRoom._id);
                }
                this.emitUpdateRooms();
            }
        } catch (e) {
            console.log('playerLeaveLobbyRoom: ' + e, e);
        }
    },
    /**
     * Синхронизация с клиентом от сервера
     * @param {String} name
     * @param {Object} data
     */
    updatePlayerMatchData(name, matchId, {data}){
        try {
            // console.log(name, matchId, data);
            if (!data.d) {
                return;
            }
            // console.log(name, matchId, data.d);
            this.matches[matchId] && this.matches[matchId].updateFromUser(name, data.d);
        } catch (e) {
            console.log('updatePlayerMatchData', e);
        }
    },
    emitUpdateRooms(){
        // console.log('updateRoomsInfo', this.lobbyRooms);
        io.in('lobby').emit('updateRoomsInfo', this.lobbyRooms);
    }
};
