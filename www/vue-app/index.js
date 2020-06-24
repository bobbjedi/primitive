import Vue from 'vue';
import App from './app.vue';

window.addEventListener('load', () => {
    new Vue({
        el: '#lobby',
        render: (h) => h(App),
    });
});

(() => {
    let isFullScreen = false;

    document.fullscreenEnabled =
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.documentElement.webkitRequestFullScreen;
    //Запустить отображение в полноэкранном режиме
    window.launchFullScreen = () => {
        function requestFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        }

        if (document.fullscreenEnabled) {
            isFullScreen = true;
            requestFullscreen(document.documentElement);
        }
    };

    // Выход из полноэкранного режима

    window.cancelFullscreenCustom = () => {
        isFullScreen = false;
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };

    window.toggleFullScreen = () => {
        if (isFullScreen) {
            return window.cancelFullscreenCustom();
        }
        window.launchFullScreen();
    };
})();



Vue.prototype.copy = function (v, msg) {
    var copytext = document.createElement('input');
    copytext.value = v;
    document.body.appendChild(copytext);
    copytext.select();
    document.execCommand('copy');
    document.body.removeChild(copytext);
    window.notify({type: 'info', text: msg || 'Скопировано'}, 10000);
};
