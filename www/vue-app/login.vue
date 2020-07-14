<template>
<span class="center form">

    <div class="mt15 big logo"><i class="fa fa-cube" aria-hidden="true"></i> PRIMITIVE WORLD</div>
    <div class="mt15">{{status}}</div>
    <div class="input-block mt10"><i class="fa fa-user" aria-hidden="true"></i><input placeholder="Nikname" v-model="user.login"></div>
    <div class="input-block mt10"><i class="fa fa-unlock-alt" aria-hidden="true"></i><input placeholder="Password" v-model="user.password"></div>
    <div class="mt15 but bg-green" @click="logreg"><i class="fa fa-sign-in" aria-hidden="true"></i> Send</div>

    <div class="mt10" @click="isLoginned =!isLoginned">
        <a v-if="isLoginned">Sign up?</a>
        <a v-else>Sign in?</a>
    </div>
</span>
</template>

<script>
import Vue from 'vue';
import Store from '../core/Store';
import api from '../core/api';

export default Vue.component('login', {
    data() {
        return {
            isLoginned: true,
            repeatPassword: '',
            user: Store.user,
            checked: false
        };
    },
    computed: {
        status() {
            return this.isLoginned ? 'Login' : 'Registration';
        }
    },
    methods: {
        logreg() {
            const user = this.user;
            let error = null;

            if (!user.login.length || !user.password.length) {
                error = 'Fill in all the fields, please!';
            }

            console.log(error);
            if (error) {
                return Store.$notify({
                    title: 'Error ' + this.status.toLowerCase(),
                    text: error,
                    type: 'error'
                });
            }
            api(this.status.toLowerCase(), user, ({success, result}) => {
                if (success) {
                    Vue.set(Store, 'user', Object.assign(Store.user, result));
                    this.$notify({
                        type: 'success',
                        title: 'Success ' + this.status,
                        text: 'Successfully enter'
                    });
                     globalSocket.emit('my-token', Store.user.token);
                }
            });
        }
    }
});
</script>
