<template>
<div style="position:fixed;top:0;">
    <div v-if="!Store.isLoad">Preloader</div>
    <span v-else class="lobby">
        <login v-if="!Store.isLogged"></login>
        <span v-else>
            Hello {{Store.user.login}}! <span class="txt-red" @click="Store.logOut">Exit</span><br>
            <rooms-list></rooms-list>
        </span>
    </span>
</div>
</template>

<script>
import Vue from 'vue';
import Store from '../core/Store';
import roomsList from './rooms-list.vue';
import login from './login.vue';

export default {
    components: {
        roomsList
    },
    data() {
        return {
            rooms: []
        }
    },
    computed:{
        Store:()=> Store
    }
}
</script>
