const Store = require('./modules/Store');

module.exports = (socket, curRoom) => {
    socket.on('use-skill', data => {
        try {
            socket.to(curRoom).broadcast.emit('render-bullet', data);
            if (data.target) {
                Store.matches[curRoom].damageShot(data);
            }
        } catch (e) {
            console.log('use-skill: ', e);
        }

    });
};
