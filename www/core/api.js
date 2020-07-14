import Store from './Store';

export default (action, obj, cb = () => { }, silent) => {
    obj.token = obj.token || Store.user.token;
    obj.action = action;
    console.log('REQ:', obj);
    globalSocket.emit('api', obj, data => {
        // console.log('Resp:', obj.action + ' -> ', data.result);
        cb(data);
        if (!data.success && !silent) {
            Store.$notify({
                type: 'error',
                title: 'Error ' + obj.action,
                text: data.msg
            });
        }
        // if (!silent) {
        //     Store.$notify({
        //         type: 'error',
        //         title: 'Error ' + obj.action,
        //         message: data.msg
        //     });
        // }
    });
};
