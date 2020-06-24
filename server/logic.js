const Store = require('./modules/Store');

module.exports = (socket, curRoom) => {
    socket.on('use-skill', data => {
        // TODO: проверки типа КД итд + проверка поподания и соттветсвенно логика наград и снятия хп
        socket.to(curRoom).broadcast.emit('render-bullet', data);
        if (data.target) {
            Store.matches[curRoom].damageShot(data);
        }
    });
};
