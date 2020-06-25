class Cript {
    constructor(side, id) {
        const spawnPosition = side === 'red' ? '0 0 -90' : '0 0 90';
        const el = document.createElement('a-entity');
        el.id = 'cript-' + side + '-' + id;
        el.setAttribute('template', 'cript-template');
        el.setAttribute('networked', 'template:#cript-template;networkId:cript-' + side + '-' + id);
        el.setAttribute('cript', side);
        el.setAttribute('forward', 'speed:.01');
        el.setAttribute('position', spawnPosition);
        el.setAttribute('rotation', '0 180 0');
        document.querySelector('a-scene').appendChild(el);
    }
}

//SOCKET!

setTimeout(() => {
    // console.log(new Cript('red', new Date().getTime()));
}, 6000);



AFRAME.registerComponent('cript', {
    init: function () {
        const body = this.el.querySelector('.cript-body');
        body.setAttribute('color', this.data);
        // body.setAttribute('cursor-listener', '');// TODO: если не моя сторона то он в
        // body.setAttribute('hard-body-sensitive', 'elementPosition: #' + this.el.id);
        body.setAttribute('target-id', 'id:' + this.el.id);
        // body.targetId = this.el.id;
    },

    tick: function () {

    }
});

setTimeout(()=>{
    window.NAF.schemas.add({
        template: '#cript-template',
        components: [
            'position',
            'rotation',
            {
                selector: '.cript-body',
                component: 'target-id'
            },
            {
                selector: '.cript-body',
                component: 'color'
            }
        ]
    });
}, 1000);
