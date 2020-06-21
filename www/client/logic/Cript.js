class Cript {
    constructor(side, id) {
        const spawnPosition = side === 'red' ? '0 0 -90' : '0 0 90';
        const el = document.createElement('a-entity');
        el.id = 'cript-' + side + '-' + id;
        el.setAttribute('template', 'cript-template');
        el.setAttribute('forward', 'speed:.2');
        el.setAttribute('position', spawnPosition);
        // el.setAttribute('rotation', rotation);
        document.querySelector('a-scene').appendChild(el);
        el.querySelector('.cript-body').setAttribute('color', side);
        el.classList.add('cript cript-' + side);
    }
}



//SOCKET!

setTimeout(() => {
    // console.log(new Cript('red', new Date().getTime()));
}, 2000);
