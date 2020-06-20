AFRAME.registerComponent('tower', {
    schema: {},

    init: function () {
        const sphere = this.el.querySelector('.tower-sphere');
        sphere.setAttribute('color', this.data);
        sphere.setAttribute('cursor-listener', '');// TODO: если не моя сторона то он в прицеле
        sphere.id = this.el.id;
    },

    tick: function () {

    }
});
