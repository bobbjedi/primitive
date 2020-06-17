import Store from './Store';

document.addEventListener('socketOnRedy', () => {
    const mySid = Store.mySid = window.globalSocket.id;
    window.globalSocket.on('in-target', ({ target, damage }) => { // сигнал о попадании в цель
        console.log({ mySid, target, damage }, Store.players[target]);
        if (mySid !== target) { // не в меня поп
            const el = Store.players[target].querySelector('.head');
            const {color} = el.getAttribute('color');
            el.setAttribute('color', 'red');
            setTimeout(() => el.setAttribute('color', 'green'), 200);
        } else {
            console.log('В меня!');
            const pain = document.getElementById('mask-pain').style
            pain.display = 'block';
            setTimeout(() => { pain.display = 'none' }, 300);
        }
        // el.setAttribute('color', 'yellow');
    });
});
