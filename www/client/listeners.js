// Component to change to a sequential color on click.
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.el.addEventListener('mouseenter', e => {
            console.log('I was clicked at: ', e.detail.intersection.point);
        });
    }
});