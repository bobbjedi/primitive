// import html2canvas from 'html2canvas';
// import 'aframe-html-shader';
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
    // document.getElementById('player').setAttribute(isMobile ? 'touch-controls' : 'look-controls', '');
    document.getElementById('player').setAttribute('look-controls', '');
    document.getElementById('player').setAttribute('touch-controls', '');
};


// <a-curvedimage src="#html2canvas" height="3.0" radius="8" theta-length="72" rotation="0 90 0" scale="0.8 0.8 0.8"></a-curvedimage>

// setTimeout(()=>{

//     html2canvas(document.getElementById('test-canvas')).then(canvas => {
//         console.log('CANVAS', canvas);
//         canvas.id = "tst-conva";
//         const el = document.createElement('a-curvedimage');
//         el.setAttribute('src', canvas.toDataURL());

//         el.setAttribute('height', 1);
//         el.setAttribute('opacity', 0.7);
//         el.setAttribute('theta-length', 90);
//         el.setAttribute('rotation', '0 90 0');
//         el.setAttribute('position', 'y', '2');
//         document.querySelector('a-scene').appendChild(el);
//     });
// }, 1000);

// <div id="test-canvas" style="height:812px; width: 1824px; background-color: black; margin: 5px; border: 3px solid red;">
//     <h1 class="txt-red">TEST CANVAS</h1>
//     <div class="row">
//     <table class="txt-green">
//         <tr class="bg-grey">
//             <th>#</th>
//             <th>name</th>
//             <th>res</th>
//         </tr>
//         <tr>
//             <th>1</th>
//             <th>DIk</th>
//             <th>123</th>
//         </tr>
//         <tr>
//             <th>1</th>
//             <th>DIk</th>
//             <th>123</th>
//         </tr>
//         <tr>
//             <th>1</th>
//             <th>DIk</th>
//             <th>123</th>
//         </tr>
//     </table>
//     <div class="txt-yellow">
//         <h5>Second block</h5>
//         <ul>
//             <li>XX</li>
//             <li>XX</li>
//             <li>XX</li>
//             <li>XX</li>
//         </ul>
//     </div>
//     <div class="txt-yellow">
//         <h5>Therd block</h5>
//         <img width="300" height="300px" src="assets/img/texture-wine.jpg">
//     </div>
// </div>
