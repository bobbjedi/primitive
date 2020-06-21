const KEYCODE_TO_CODE = {
    // Tiny KeyboardEvent.code polyfill.
    '38': 'ArrowUp',
    '37': 'ArrowLeft',
    '40': 'ArrowDown',
    '39': 'ArrowRight',
    '87': 'KeyW',
    '65': 'KeyA',
    '83': 'KeyS',
    '68': 'KeyD'
};
// var registerComponent = require('../core/component').registerComponent;
// var THREE = require('../lib/three');
var utils = AFRAME.utils;

var bind = utils.bind;
var shouldCaptureKeyEvent = utils.shouldCaptureKeyEvent;
let joysticEx;
var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;
var KEYS = [
    'KeyW', 'KeyA', 'KeyS', 'KeyD',
    'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
];

/**
 * WASD component to control entities using WASD keys.
 */
const joysticComponent = AFRAME.registerComponent('touch-wasd-controls', {
    schema: {
        acceleration: { default: 65 },
        adAxis: { default: 'x', oneOf: ['x', 'y', 'z'] },
        adEnabled: { default: true },
        adInverted: { default: false },
        enabled: { default: true },
        fly: { default: false },
        wsAxis: { default: 'z', oneOf: ['x', 'y', 'z'] },
        wsEnabled: { default: true },
        wsInverted: { default: false },
        touchEnabled: { default: true }
    },

    init: function () {
        // To keep track of the pressed keys.
        this.keys = {};
        this.easing = 1.1;

        this.velocity = new THREE.Vector3();

        // Bind methods and add event listeners.
        this.onBlur = bind(this.onBlur, this);
        this.onFocus = bind(this.onFocus, this);
        this.onKeyDown = bind(this.onKeyDown, this);
        this.onKeyUp = bind(this.onKeyUp, this);
        this.onVisibilityChange = bind(this.onVisibilityChange, this);
        this.attachVisibilityEventListeners();
        this.addEventListeners();
        joysticEx = this;
    },

    tick: function (time, delta) {
        var data = this.data;
        var el = this.el;
        var velocity = this.velocity;

        if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
            isEmptyObject(this.keys)) { return; }

        // Update velocity.
        delta = delta / 1000;
        this.updateVelocity(delta);

        if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

        // Get movement vector and translate position.
        el.object3D.position.add(this.getMovementVector(delta));
    },

    remove: function () {
        this.removeKeyEventListeners();
        this.removeVisibilityEventListeners();
    },

    play: function () {
        this.attachKeyEventListeners();
    },

    pause: function () {
        this.keys = {};
        this.removeKeyEventListeners();
    },

    updateVelocity: function (delta) {
        var acceleration;
        var adAxis;
        var adSign;
        var data = this.data;
        var keys = this.keys;
        var velocity = this.velocity;
        var wsAxis;
        var wsSign;

        adAxis = data.adAxis;
        wsAxis = data.wsAxis;

        // If FPS too low, reset velocity.
        if (delta > MAX_DELTA) {
            velocity[adAxis] = 0;
            velocity[wsAxis] = 0;
            return;
        }

        // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
        var scaledEasing = Math.pow(1 / this.easing, delta * 60);
        // Velocity Easing.
        if (velocity[adAxis] !== 0) {
            velocity[adAxis] = velocity[adAxis] * scaledEasing;
        }
        if (velocity[wsAxis] !== 0) {
            velocity[wsAxis] = velocity[wsAxis] * scaledEasing;
        }

        // Clamp velocity easing.
        if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
        if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

        if (!data.enabled) { return; }

        // Update velocity using keys pressed.
        acceleration = data.acceleration;
        if (data.adEnabled) {
            adSign = data.adInverted ? -1 : 1;
            if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
            if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
        }
        if (data.wsEnabled) {
            wsSign = data.wsInverted ? -1 : 1;
            if (keys.KeyW || keys.ArrowUp) { velocity[wsAxis] -= wsSign * acceleration * delta; }
            if (keys.KeyS || keys.ArrowDown) { velocity[wsAxis] += wsSign * acceleration * delta; }
        }
    },

    getMovementVector: (function () {
        var directionVector = new THREE.Vector3(0, 0, 0);
        var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

        return function (delta) {
            var rotation = this.el.getAttribute('rotation');
            var velocity = this.velocity;
            var xRotation;

            directionVector.copy(velocity);
            directionVector.multiplyScalar(delta);

            // Absolute.
            if (!rotation) { return directionVector; }

            xRotation = this.data.fly ? rotation.x : 0;

            // Transform direction relative to heading.
            rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
            directionVector.applyEuler(rotationEuler);
            return directionVector;
        };
    })(),

    attachVisibilityEventListeners: function () {
        window.addEventListener('blur', this.onBlur);
        window.addEventListener('focus', this.onFocus);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
    },

    removeVisibilityEventListeners: function () {
        window.removeEventListener('blur', this.onBlur);
        window.removeEventListener('focus', this.onFocus);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
    },

    attachKeyEventListeners: function () {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    },

    removeKeyEventListeners: function () {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    },

    onBlur: function () {
        this.pause();
    },

    onFocus: function () {
        this.play();
    },

    onVisibilityChange: function () {
        if (document.hidden) {
            this.onBlur();
        } else {
            this.onFocus();
        }
    },

    onKeyDown: function (event) {
        var code;
        if (!shouldCaptureKeyEvent(event)) { return; }
        code = event.code || KEYCODE_TO_CODE[event.keyCode];
        if (KEYS.indexOf(code) !== -1) { this.keys[code] = true; }
    },

    onKeyUp: function (event) {
        var code;
        code = event.code || KEYCODE_TO_CODE[event.keyCode];
        delete this.keys[code];
        console.log('onKeyUp', event.keyCode);
    },



    //TOUCH
    addEventListeners: function () {
        const joystic = document.getElementById('left-touch-joystic');

        // Touch events.
        joystic.addEventListener('touchstart', this.onTouchStart);
        joystic.addEventListener('touchmove', this.onTouchMove);
        joystic.addEventListener('touchend', this.onTouchEnd);
    },
    removeEventListeners: function () {
        const joystic = document.getElementById('left-touch-joystic');
        // Touch events.
        joystic.removeEventListener('touchstart', this.onTouchStart);
        joystic.removeEventListener('touchmove', this.onTouchMove);
        joystic.removeEventListener('touchend', this.onTouchEnd);
    },

    /**
     * Register touch down to detect touch drag.
     */
    onTouchStart: function (evt) {
        // if (evt.touches.length !== 1 || !this.data.touchEnabled) { return; }
        if (evt.touches.length !== 1 || joysticEx.touchStarted) {
            return;
        }
        this.touchId = evt.touches[evt.touches.length - 1].identifier;
        joysticEx.touchStart = {
            x: evt.touches[this.touchId].pageX,
            y: evt.touches[this.touchId].pageY
        };
        joysticEx.touchStarted = true;
        window.log.innerHTML += '<div> WSD start:' + this.touchId + ' </div>';
    },

    /**
     * Translate touch move to Y-axis rotation.
     */
    onTouchMove: function (evt) {
        // var canvas = this.el.sceneEl.canvas;
        var canvas = document.documentElement;
        var deltaY, deltaX;
        if (!joysticEx.touchStarted || !joysticEx.data.touchEnabled || evt.changedTouches[0].identifier !== this.touchId) {
        // if (!joysticEx.touchStarted) {
            return;
        }

        deltaX = 2 * Math.PI * (evt.touches[this.touchId].pageX - joysticEx.touchStart.x) / canvas.clientWidth;
        deltaY = 2 * Math.PI * (evt.touches[this.touchId].pageY - joysticEx.touchStart.y) / canvas.clientHeight;

        if (deltaX > 0) {
            joysticEx.onKeyDown({ code: 'ArrowRight' });
            joysticEx.onKeyUp({ code: 'ArrowLeft' });
        } else if (deltaX < 0) {
            joysticEx.onKeyDown({ code: 'ArrowLeft' });
            joysticEx.onKeyUp({ code: 'ArrowRight' });
        } else {
            joysticEx.onKeyUp({ code: 'ArrowLeft' });
            joysticEx.onKeyUp({ code: 'ArrowRight' });
        }

        if (deltaY > 0) {
            joysticEx.onKeyDown({ code: 'ArrowDown' });
            joysticEx.onKeyUp({ code: 'ArrowUp' });
        } else if (deltaY < 0) {
            joysticEx.onKeyDown({ code: 'ArrowUp' });
            joysticEx.onKeyUp({ code: 'ArrowDown' });
        } else {
            joysticEx.onKeyUp({ code: 'ArrowDown' });
            joysticEx.onKeyUp({ code: 'ArrowUp' });
        }
    },

    /**
     * Register touch end to detect release of touch drag.
     */
    onTouchEnd: function (e) {
        if (e.changedTouches[0].identifier === this.touchId) {
            window.log.innerHTML += '<div> WSD end:' + this.touchId + ' </div>';
            joysticEx.touchStarted = false;
            joysticEx.onKeyUp({ code: 'ArrowLeft' });
            joysticEx.onKeyUp({ code: 'ArrowRight' });
            joysticEx.onKeyUp({ code: 'ArrowUp' });
            joysticEx.onKeyUp({ code: 'ArrowDown' });
            this.touchId = -1;
        };
    },
});

function isEmptyObject(keys) {
    var key;
    for (key in keys) { return false; }
    return true;
}


