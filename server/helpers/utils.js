const sha256 = require('sha256');
const {usersDb} = require('../modules/Db_');
module.exports = {
    unix() {
        return new Date().getTime();
    },
    async getUserFromQ(q) {
        return await usersDb.findOne(q);
    },

    /**
     * @param params параметры GET
     */
    async createUser({ login, password }){
        try {
            console.log({login, password});
            if (!login.length || !password.length) {
                return {error: 'Неполные данные.'};
            }
            if (/[A-Za-z]/.test(login) && /[А-яф-я]/.test(login)){
                return { error: 'Запрещено мешать кириллицу и латиницу.' };
            }
            if (/^.*[^A-zА-яЁё].*$/.test(login)){
                return {error: 'Запрещено использовать знаки.'};
            }

            const checkUser = Boolean(await usersDb.findOne({
                $or: [{login}, {loginLowCase: login.toLowerCase()}]
            }));
            if (checkUser){
                return {error: 'Логин или адрес уже занят.'};
            }
            const user = new usersDb({
                login,
                timestamp: this.unix(),
                loginLowCase: login.toLowerCase(),
                password: this.createPswd(password),
            });

            return { success: true, result: user };
        } catch (e) {
            console.error('User create', e);
        }
    },
    createPswd(password) {
        return sha256(password.toString());
    }
};
