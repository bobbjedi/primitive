<template>
<span>
    ROOMS:
    <table>
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
                <div class="smallsmall">&nbsp;</div>Leave
            </td>
            <td v-else :class="'big txt-' + (myRoomId || r.joined.length === r.playersCount ? 'grey ': 'green hovered')" @click="joinToRoom(r._id)">
                <div class="smallsmall">&nbsp;</div>Join
            </td>
        </tr>
    </table>
    <br>
    New Room
    <input v-model="newRoom.roomName">
    <select v-model.number="newRoom.playersCount">
        <option value="1">1 vs CPU</option>
        <option value="2">1 vs 1</option>
        <option value="3">3 vs CPU</option>
        <option value="6">3 vs 3</option>
    </select>
    <div v-if="!myRoomId" class="but bg-green" @click="createRoom">Create room</div>
</span>
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
            newRoom:{
                roomName: 'room ' + Store.user.login,
                playersCount: 1
            }
        }
    },
    created() {
        this.updateRooms();
        globalSocket.on('updateRoomsInfo', rooms => this.rooms = rooms);
    },
    computed: {
        myRoomId() {
            const r = this.rooms.find(r => r.joined.includes(Store.user.login));
            return r && r._id;
        }
    },
    methods: {
        updateRooms() {
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
