const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const UserModel = require("../models/user")(Sequelize, DataTypes);
const InviteCodeModel = require("../models/invitecode")(Sequelize, DataTypes);

module.exports = {
    userCheck: async (username, password) => {
        let queryRes = await UserModel.findAll({
            where: {
                username: username,
                password: password
            }
        });
        if (queryRes.length === 0) return "password error";
        else return queryRes[0];
    },
    userExist: async (username) => {
        let queryRes = await UserModel.findAll({
            where: {
                username: username
            }
        });
        return (queryRes.length !== 0);
    },
    userAdd: async (username, password, inviteCode) => {
        var res = await UserModel.create({
            username: username,
            password: password,
            register_time: Date.now(),
            last_login_time: -1,
            invitecode: inviteCode
        });
        return res;
    },
    inviteCodeCheck: async (inviteCode) => {
        let inviteCodeList = await InviteCodeModel.findAll({
            where: {
                code: inviteCode
            }
        });
        return inviteCodeList.length !== 0;

    }
}