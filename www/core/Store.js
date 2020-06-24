import Vue from 'vue';
import config from '../../config';
import api from './api';
import renderTowers from '../client/logic/tower';

export default new Vue({
    data: {
        currentTargetSid: null,
        mySid: null,
        isLoad: false,
        isMatch: false,
        user: {},
        matchInfo: {},
        config
    },
    created(){
        this.isMatch = location.href.includes('x');
        this.logOut();
        this.user.token = localStorage.getItem('token') || false;
        this.players = window._aPlayers;

        document.addEventListener('socketOnRedy', () => {
            if (this.isMatch && config.isDev) {
                location.href = '/';
            }
            this.mySid = globalSocket.id;

            if (this.user.token) {
                this.updateUser();
                globalSocket.emit('my-token', this.user.token);
            } else {
                this.isLoad = true;
            }
            if (this.isMatch) {
                this.matchInit();
            } else {
                globalSocket.on('go-match', link => location.assign(link)); // переход на матч
            }
        });
    },
    computed: {
        isLogged(){
            return this.user.token && this.user.token !== 'false';
        },
        mySide(){
            return this.matchInfo.redTeam && (this.matchInfo.redTeam.playersName.includes(this.user.login) ? 'red' : 'blue');
        }
    },
    methods: {
        logOut() {
            this.user = {
                password: '',
                login: '',
                token: false
            };
        },
        updateUser() {
            api('getUser', {token: this.user.token }, ({success, result}) => {
                this.isLoad = true;
                success && Vue.set(this, 'user', Object.assign(this.user, result));
                document.querySelector('#player .head').setAttribute('target-id', 'id:' + this.user.login);
            });
        },
        matchInit() {
            // просим данные
            api('getMatchInfo', {}, ({ success, result }) => {
                if (success) {
                    Vue.set(this, 'matchInfo', result);
                    Vue.nextTick(() => {
                        renderTowers(result);
                        document.querySelector('#player .head').setAttribute('material', 'color:' + this.mySide);
                    });
                };
            });
        },
        $notify(o){
            console.log(o);
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('token', this.user.token);
        }
    }
});
