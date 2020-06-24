const modelDb = require('../helpers/modelNedb');
console.log('DBB');
module.exports = {
    usersDb: modelDb({
        filename: 'db/users',
        compact: 10
    })
};
