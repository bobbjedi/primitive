<template>
<span>
    ROOMS:
    <table>
        <tr v-for="(r, i) in rooms" :key="r._id">
            <td><div class="smallsmall">&nbsp;</div>#{{i + 1}}</td>
            <td><div class="smallsmall txt-grey">Room name:</div>{{r.roomName}}</td>
            <td><div class="smallsmall txt-grey">Joined:</div>{{r.joined.length}}/{{r.playersCount}}</td>
            <td><div class="smallsmall txt-grey">Creator:</div>{{r.creatorName}}</td>
            <td v-if="myRoomId === r._id" @click="leaveRoom" class="big txt-red hovered"><div class="smallsmall">&nbsp;</div>Leave</td>
            <td v-else :class="'big txt-' + (myRoomId || r.joined.length === r.playersCount ? 'grey ': 'green hovered')" @click="joinToRoom(r._id)"><div class="smallsmall">&nbsp;</div>Join</td>
        </tr>
    </table>

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
            rooms: []
        }
    },
    created() {
        this.updateRooms();
        globalSocket.on('updateRoomsInfo', rooms => this.rooms = rooms);
    },
    computed: {
        myRoomId() {
            const r = this.rooms.find(r=>r.joined.includes(Store.user.login));
            return r && r._id;
        }
    },
    methods: {
        updateRooms() {
            globalSocket.emit('getRoomsList', rooms => this.rooms = rooms);
        },
        createRoom() {
            api('createRoom', {
                roomName: 'Room ' + Store.user.login
            });
        },
        joinToRoom(_id) {
            api('joinRoom', {_id});
        },
        leaveRoom() {
            api('leaveRoom', {});
        }
    }
}
</script>
