import Vue from 'vue';

export default new Vue({
    data: {
        currentTargetSid: null,
        mySid: null
    },
    created(){
        this.players = window._aPlayers;
        document.addEventListener('socketOnRedy', () => {
            this.mySid = window.globalSocket.id;
            document.querySelector('#player .head').setAttribute('target-id', 'id:' + this.mySid);
        });
    }
});
