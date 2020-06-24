module.exports = (socket, curRoom) => {
    socket.on('i-to-target', ({ target }) => {
        console.log(socket.id, '->', target, curRoom);
        socket.to(curRoom).broadcast.emit('in-target', { target, damage: 10 });
        socket.emit('in-target', { target, damage: 10 });
    });
    socket.on('use-skill', data => {
        console.log('Boolet', data);
        // TODO: проверки типа КД итд + проверка поподания и соттветсвенно логика наград и снятия хп
        socket.to(curRoom).broadcast.emit('render-player-skill', data);
    });
};
