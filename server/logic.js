
module.exports = (socket, curRoom) => {
    socket.on('i-to-target', ({ target }) => {
        console.log(socket.id, '->', target, curRoom);
        socket.to(curRoom).broadcast.emit('in-target', { target, damage: 10 });
        socket.emit('in-target', { target, damage: 10 });
    });
};
