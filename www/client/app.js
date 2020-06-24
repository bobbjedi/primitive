import '../vue-app';
import "./libs/randomiser.component";
import "./components/spawn-in-circle.component";
import "./components/gun.component";
import "./components/forward.component";
import "./components/remove-in-seconds.component";
import "./components/collider.component";
import "./components/hard-body-sensitive";
import "./components/touch-control";
import "./components/touch-wasd-control";
import "./components/target-id.component";
import "./logic/tower";
import "./logic/Cript";
import "./listeners";
import "./sockets";


// On mobile remove elements that are resource heavy
window.onload = () => {
    var isMobile = AFRAME.utils.device.isMobile();
    document.getElementById('player').setAttribute(isMobile ? 'touch-controls' : 'look-controls', '');
};
