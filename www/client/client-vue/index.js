import template from './tpl.html';
import Vue from 'vue';
import Store from '../../core/Store';
import api from '../../core/api';
import config from '../../../config';
import { renderTowers, destroyTower } from '../logic/tower';
import { renderWarrior, destroyWarrior } from '../logic/warrior';

// Инитим для страниц матча
export default ()=>{
    new Vue({
        el: '#player-panel',
        template,
        data: {
            myTeam: {},
            oppositeTeam: {},
            mySide: '',
            oppositeSide: ''
        },
        created(){
            // просим данные
            api('getMatchInfo', {}, ({ success, result }) => {
                if (success) {
                    const playerEl = document.getElementById('player');
                    Vue.nextTick(() => {
                        renderTowers(result);
                        this.mySide = Store.mySide = result.redTeam.playersName.includes(this.user.login) ? 'red' : 'blue';
                        this.oppositeSide = Store.oppositeSide = result.redTeam.playersName.includes(this.user.login) ? 'blue' : 'red';
                        // const myTeam = result[this.mySide + 'Team'];
                        // Vue.set(this, 'myTeam', myTeam);
                        this.updateData(result);
                        const I = this.myTeam.players[this.user.login];
                        console.log('I', I.position);
                        playerEl.setAttribute('position', I.position || this.myTeam.spawnPosition);
                        playerEl.setAttribute('rotation', I.rotation || '0 0 0');

                        globalSocket.on('warrior-info', renderWarrior); // обновляем криптов
                        globalSocket.on('current-match-info', r =>this.updateData(r)); // обновляем криптов
                        globalSocket.on('u-was-killed', d => this.killed(d));
                        globalSocket.on('u-was-respawn', d => this.respawn(d));

                        globalSocket.on('destroy', data => {
                            // console.log('DESTROY on', data);
                            if (data.type === 'tower') {
                                destroyTower(data);
                            } else {
                                destroyWarrior(data);
                            }
                        });
                    });
                };
            });
            broadcaster();
            // globalSocket.on('info-match', renderWarriors); // обновляем криптов
        },
        watch: {
            'me.isDead'(v){
                console.log('ME IS DEAD WW', v);
                Store.isDead = v;
            }
        },
        computed: {
            user: () => Store.user,
            me() {
                return this.myTeam.players && this.myTeam.players[Store.user.login];
            }
        },
        methods: {
            // меня убили
            killed(data){
                console.log('KILL');
                document.getElementById('player').setAttribute('position', data.position);
            },
            // я возродился
            respawn(data){
                console.log('RESPAWN');
                document.getElementById('player').setAttribute('position', data.position);
            },
            updateData(result) {
                this.myTeam = result[this.mySide + 'Team'];
                this.oppositeTeam = result[this.oppositeSide + 'Team'];
                this.serverTime = result.serverTime;
            },
            progressBarStyle(current, max, color) {
                const persent = current / max * 100;


                return {
                    background: `linear-gradient(to right, #444 0, ${color} ${persent}%, rgba(0,0,0,-0) ${persent}%)`
                };
            }
        }
    });
    console.log('VUE INIT APP');
};



const broadcaster = () => {
    const player = document.getElementById('player');
    let predSign = 0;
    setInterval(()=>{
        if (Store.isDead) {
            return;
        }
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
