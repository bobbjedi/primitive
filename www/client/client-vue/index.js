import template from './tpl.html';
import Vue from 'vue';
import Store from '../../core/Store';

// Инитим для страниц матча
export default ()=>{
    new Vue({
        el: '#player-panel',
        template,
        data: {

        },
        computed: {
            user: () => Store.user,
            myTeam: () => Store.myTeam,
            me() {
                console.log('MY TEAM', this.myTeam);
                return this.myTeam.players && this.myTeam.players[Store.user.login];
            }
        }
    });
    console.log('VUE INIT APP');
};
