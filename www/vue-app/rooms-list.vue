<template>
<div id="rooms-list">
    <div class="big mt10" v-if="rooms.length">Open rooms:</div>
    <table v-if="rooms.length">
        <tr v-for="(r, i) in rooms" :key="r._id">
            <td>
                <div class="smallsmall">&nbsp;</div>#{{i + 1}}
            </td>
            <td>
                <div class="smallsmall txt-grey">Room name:</div>{{r.roomName}}
            </td>
            <td>
                <div class="smallsmall txt-grey">Joined:</div>{{r.joined.length}}/{{r.playersCount}}
            </td>
            <td>
                <div class="smallsmall txt-grey">Creator:</div>{{r.creatorName}}
            </td>
            <td v-if="myRoomId === r._id" @click="leaveRoom" class="big txt-red hovered">
                <div class="smallsmall">&nbsp;</div><i class="fa fa-user-times" aria-hidden="true"></i> Leave
            </td>
            <td v-else :class="'big txt-' + (myRoomId || r.joined.length === r.playersCount ? 'grey ': 'green hovered')" @click="joinToRoom(r._id)">
                <div class="smallsmall">&nbsp;</div> <i class="fa fa-user-plus" aria-hidden="true"></i>Join
            </td>
        </tr>
    </table>
    <div v-else>
        <div class="txt-blue big m10">There are no open rooms. <br> Do you want to create your own?</div>
    </div>
    <div class="create-room-block" v-if="!myRoomId">
        <div class="input-block mt10"><i class="fa fa-cubes" aria-hidden="true"></i><input placeholder="Room name" v-model="newRoom.roomName"></div>
        <div class="input-block mt10">
            <select v-model.number="newRoom.playersCount">
                <option value="1">1 vs CPU</option>
                <option value="2">1 vs 1</option>
                <option value="3">3 vs CPU</option>
                <option value="6">3 vs 3</option>
            </select>
        </div>
        <div class="but bg-green mt5" @click="createRoom">Create</div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import Store from '../core/Store';
import api from '../core/api';

export default {
    components: {

    },
    data() {
        return {
            Store,
            rooms: [],
            newRoom: {
                roomName: 'room ' + Store.user.login,
                playersCount: 2
            }
        }
    },
    created() {
        this.updateRooms();
    },
    computed: {
        myRoomId() {
            const r = this.rooms.find(r => r.joined.includes(Store.user.login));
            return r && r._id;
        }
    },
    methods: {
        updateRooms() {
            globalSocket.on('updateRoomsInfo', rooms => this.rooms = rooms);
            globalSocket.emit('getRoomsList', rooms => this.rooms = rooms);
        },
        createRoom() {
            console.log(this.newRoom);
            api('createRoom', this.newRoom);
        },
        joinToRoom(_id) {
            api('joinRoom', {
                _id
            });
        },
        leaveRoom() {
            api('leaveRoom', {});
        }
    }
}
</script>
