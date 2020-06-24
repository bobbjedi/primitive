const Store = require('./Store');

module.exports = class {
    constructor(name, side){
        this.name = name;
        this.side = side;
    }
    get socket(){
        Store.socketsByName[this.name];
    }
};
