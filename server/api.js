const $u = require('./helpers/utils');
const {usersDb} = require('./modules/Db_');
const Store = require('./modules/Store');

module.exports = socket =>{
    socket.on('api', async (data, cb) => {
        const _user = await $u.getUserFromQ({token: data.token});
        if (!_user) {
            return cb(error('No user find'));
        };
        switch (data.action) {
        case ('getUser'):
            cb(_user ? success(_user) : error('Notoken find'));
            break;

        case ('login'):
            const checkUser = await usersDb.findOne({ $and: [{ $or: [{ login: data.login }] }, { password: $u.createPswd(data.password.toString()) }] });
            if (!checkUser) {
                cb(error('This login and password not found'));
                return;
            }
            cb(success(await assignUser(checkUser)));
            break;

        case ('registration'):
            const resCreate = await $u.createUser(data);
            if (resCreate.error) {
                return cb(error(resCreate.error));
            }

            cb(success(await assignUser(resCreate.result)));
            break;

        case ('createRoom'):
            data.creatorName = _user.login;
            Store.createLobbyRoom(data);
            cb(success());
            break;

        case ('joinRoom'):
            Store.playerJoinToLobbyRoom(_user.login, data._id);
            cb(success());
            break;

        case ('leaveRoom'):
            Store.playerLeaveLobbyRoom(_user.login);
            cb(success());
            break;

        case ('getMatchInfo'):
            cb(success(Store.matches[socket.roomName].matchInfo));
            break;

        default:
            cb(error('Error endpoint ' + data.action, socket));
            break;
        }
    });
};



function error(msg) {
    try {
        console.error(msg);
        return ({
            success: false,
            msg,
        });
    } catch (e) {
        console.log(e);
    }
}
function success(data) {
    try {
        return ({
            success: true,
            result: data
        });
    } catch (e) {
        console.log('success>', e);
    }
}

async function assignUser (user){
    try {
        const token = $u.createPswd(new Date().toString());
        user.token = token;
        await user.save();
        delete user._id;
        delete user.password;
        return user;
    } catch (e){
        console.log('assignUser: ' + e);
    }
}


