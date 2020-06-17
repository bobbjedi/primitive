import Store from './Store';
// Component to change to a sequential color on click.
AFRAME.registerComponent('cursor-listener', {
	init: function () {
		const sid = this.el._creator;
		this.el.addEventListener('mouseenter', e => {
            Store.currentTargetSid = sid;
		});

		this.el.addEventListener('mouseleave', e => {
            Store.currentTargetSid = null;
		});

		this.el.addEventListener('click', e => {
			console.log('I was clicked at: ', e.detail.intersection.point);
		});
	}
});
