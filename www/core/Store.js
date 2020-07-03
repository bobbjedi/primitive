import Vue from 'vue';
import config from '../../config';
import api from './api';
import { renderTowers, destroyTower } from '../client/logic/tower';
import { renderWarrior, destroyWarrior } from '../client/logic/warrior';
import clientVue from '../client/client-vue';

export default new Vue({
    data: {
        currentTargetId: null,
        mySid: null,
        isLoad: false,
        isMatch: false,
        user: {},
        matchInfo: {},
        config,
        myTeam: {}
    },
    created(){
        this.isMatch = location.href.includes('html?match-id=');
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
                globalSocket.on('go-match', link => {
                    if (location.href.includes('index')) { // .apk
                        return location.href = location.href.replace('/index.html', link);
                    }
                    location.assign(link);
                });
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
                if (success) {
                    Vue.set(this, 'user', Object.assign(this.user, result));
                } else {
                    this.user.token = null;
                }
                document.querySelector('#player .head').setAttribute('target-id', 'id:' + this.user.login);
            });
        },
        matchInit() {
            clientVue();
            // просим данные
            api('getMatchInfo', {}, ({ success, result }) => {
                if (success) {
                    const playerEl = document.getElementById('player');
                    Vue.set(this, 'matchInfo', result);
                    Vue.nextTick(() => {
                        renderTowers(result);
                        const head = playerEl.querySelector('.head');
                        head.setAttribute('material', 'color:' + this.mySide);
                        const myTeam = result[this.mySide + 'Team'];
                        Vue.set(this, 'myTeam', myTeam);
                        const I = myTeam.players[this.user.login];
                        playerEl.setAttribute('position', I.position || myTeam.spawnPosition);
                        playerEl.setAttribute('rotation', I.rotation || '0 0 0');
                    });
                };
            });
            broadcaster();
            // globalSocket.on('info-match', renderWarriors); // обновляем криптов
            globalSocket.on('warrior-info', renderWarrior); // обновляем криптов
            globalSocket.on('destroy', data => {
                // console.log('DESTROY on', data);
                if (data.type === 'tower') {
                    destroyTower(data);
                } else if (data.type === 'cript') {
                    destroyWarrior(data);
                }
            }); // переход на матч


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

//КОСТЫЛЬ
setInterval(()=>{
    document.querySelectorAll('.avatar .head').forEach(el => {
        const el_ = el.getAttribute('target-id');
        if (el_) {
            el.parentElement.id = el_.id;
            el.realColor = el.realColor || el.getAttribute('material').color;
        }

    });
}, 3000);


const broadcaster = () => {
    const player = document.getElementById('player');
    let predSign = 0;
    setInterval(()=>{
        const position = player.getAttribute('position');
        const rotation = player.getAttribute('rotation');
        const sign = (position.x + position.z + rotation.x + rotation.z).toFixed(1);
        if (sign === predSign) {
            return;
        }
        predSign = sign;
        globalSocket.emit('my-data', {position, rotation});
    }, config.playersSync);
};
