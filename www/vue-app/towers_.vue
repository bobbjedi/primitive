<template>
<span>
    <a-entity class="tower" id="tower-red-1" position="0 1 -30" template="tower" tower="red"></a-entity>
    <a-entity class="tower" id="tower-red-2" position="-12 1 -73" template="tower" tower="red"></a-entity>
    <a-entity class="tower" id="tower-red-3" position="12 1 -73" template="tower" tower="red"></a-entity>

    <a-entity id="tower-blue-1" position="0 1 30" template="tower" tower="blue"></a-entity>
    <a-entity id="tower-blue-2" position="-12 1 73" template="tower" tower="blue"></a-entity>
    <a-entity id="tower-blue-3" position="12 1 73" template="tower" tower="blue"></a-entity>
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
            api(this.status.toLowerCase(), user, ({
                success,
                result
            }) => {
                if (success) {
                    Vue.set(Store, 'user', Object.assign(Store.user, result));
                    Store.$notify({
                        type: 'success',
                        title: 'Успешно ' + this.status,
                        message: 'Вход совершен'
                    });
                }
            });
        }
    }
});
</script>
