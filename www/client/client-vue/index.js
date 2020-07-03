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
            mySide: ''
        },
        created(){
            // просим данные
            api('getMatchInfo', {}, ({ success, result }) => {
                if (success) {
                    const playerEl = document.getElementById('player');
                    Vue.nextTick(() => {
                        renderTowers(result);
                        this.mySide = Store.mySide = result.redTeam.playersName.includes(this.user.login) ? 'red' : 'blue';
                        // const myTeam = result[this.mySide + 'Team'];
                        // Vue.set(this, 'myTeam', myTeam);
                        this.updateData(result);
                        const I = this.myTeam.players[this.user.login];
                        playerEl.setAttribute('position', I.position || this.myTeam.spawnPosition);
                        playerEl.setAttribute('rotation', I.rotation || '0 0 0');

                        globalSocket.on('warrior-info', renderWarrior); // обновляем криптов
                        globalSocket.on('current-match-info', r =>this.updateData(r)); // обновляем криптов
                        globalSocket.on('destroy', data => {
                            // console.log('DESTROY on', data);
                            if (data.type === 'tower') {
                                destroyTower(data);
                            } else if (data.type === 'cript') {
                                destroyWarrior(data);
                            }
                        });
                    });
                };
            });
            broadcaster();
            // globalSocket.on('info-match', renderWarriors); // обновляем криптов
        },
        computed: {
            user: () => Store.user,
            me() {
                return this.myTeam.players && this.myTeam.players[Store.user.login];
            }
        },
        methods: {
            updateData(result) {
                this.myTeam = result[this.mySide + 'Team'];
            }
        }
    });
    console.log('VUE INIT APP');
};



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
