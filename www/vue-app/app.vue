<template>
<div>
    <div v-if="!Store.isLoad">Preloader</div>
    <div v-else class="login-block">
        <login v-if="!Store.isLogged"></login>
        <div v-else class="w100p mt15 center">
            <div class="bigbig logo"><i class="fa fa-cube" aria-hidden="true"></i> PRIMITIVE WORLD</div>
            <div class="center user-nik-block big mt10">Hello {{Store.user.login}}!
                <i @click="Store.logOut" class="fa fa-sign-out txt-red" aria-hidden="true"></i>
            </div>
            <rooms-list></rooms-list>
        </div>
    </div>
    <notifications />
</div>
</template>

<script>
import Notifications from 'vue-notification';
Vue.use(Notifications);
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
    computed: {
        Store: () => Store
    }
}
</script>
