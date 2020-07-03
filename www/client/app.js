import '../vue-app';
import "./components/randomiser.component";
import "./components/spawn-in-circle.component";
import "./components/gun.component";
import "./components/forward.component";
import "./components/remove-in-seconds.component";
import "./components/collider.component";
import "./components/hard-body-sensitive";
import "./components/touch-control";
import "./components/touch-wasd-control";
import "./components/target-id.component";
import "./components/envroinment.component.js";
import "./logic/tower";
import "./listeners";
import "./sockets";


// On mobile remove elements that are resource heavy
window.onload = () => {
    const matchId = location.search.split('match-id=')[1];
    document.getElementsByTagName('a-scene')[0].setAttribute('networked-scene', `room: ${matchId}; debug: true;`);
    const isMobile = AFRAME.utils.device.isMobile();
    document.getElementById('player').setAttribute(isMobile ? 'touch-controls' : 'look-controls', '');
};
