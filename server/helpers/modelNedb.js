const nedb = require('nedb');

module.exports = dbParams => {
    const {filename, compact} = dbParams;

    const db = new syncNeDb({
        filename,
        autoload: true
    });

    if (compact) {
        db.persistence.setAutocompactionInterval(compact * 1000 * 60);
    }

    return class NedbModel{
        constructor (data = {}, isSave = false) {
            Object.assign(this, data);
            if (isSave){
                this.save();
            }
        }
        get db () {
            return db;
        }
        /**
         * @returns {Array<NedbModel>}
         */
        static async find(q) { // return Array
            const res = await db.syncFind(q);
            if (res) {
                return res.map((d) => new this(d));
            }
        }

        static async findOne(q) {
            const res = await db.syncFindOne(q);
            if (res) {
                return new this(res);
            } else {
                return null;
            }
        }
        async update (obj, isSave = false) {
            Object.assign(this, obj);
            if (isSave) {
                await this.save();
            }
        }
        async save() {
            if (!this._id) {
                const doc = await db.syncInsert(this._data());
                doc && (this._id = doc._id);
            } else {
                await db.syncUpdate({ _id: this._id }, { $set: this._data() }, { upsert: true });
            }
        }
        _data () {
            const data = {};
            for (const field in this) {
                if (!['db', '_id'].includes(field)) {
                    data[field] = this[field];
                }
            }
            return data;
        }
    };
};

class syncNeDb extends nedb {
    async syncInsert (q) {
        return new Promise(resolve => {
            this.insert(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async syncFind (q) {
        return new Promise(resolve => {
            this.find(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async syncFindOne (q) {
        return new Promise(resolve => {
            this.findOne(q, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }
    async syncUpdate (a, b, c = {}) {
        return new Promise(resolve => {
            this.update(a, b, c, (err, res) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(res);
                }
            });
        });
    }
};
