<template>
<span id="form" class="center">

    <h4 class="mt10">{{status}}</h4>

    <input placeholder="Логин" maxlength="20" v-model="user.login" clearable class="mt10"><br>
    <input placeholder="Пароль" v-model="user.password" clearable show-password class="mt10"><br>
    <button type="info" @click="logreg" icon="icon-s-promotion" plain class="mt15">Отправить</button>

    <div class="mt10" @click="isLoginned =!isLoginned">
        <a v-if="isLoginned">Зарегистрироваться?</a>
        <a v-else>Уже есть аккаунт?</a>
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
            isLoginned: false,
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

            if (!user.login || !user.password) {
                error = 'Заполните все поля пожалуйста!';
            }

            if (error) {
                return Store.$notify({
                    title: 'Ошибка ' + this.status.toLowerCase(),
                    message: error,
                    type: 'error'
                });
            }
            api(this.status.toLowerCase(), user, ({success, result}) => {
                if (success) {
                    Vue.set(Store, 'user', Object.assign(Store.user, result));
                    Store.$notify({
                        type: 'success',
                        title: 'Успешно ' + this.status,
                        message: 'Вход совершен'
                    });
                     globalSocket.emit('my-token', Store.user.token);
                }
            });
        }
    }
});
</script>
