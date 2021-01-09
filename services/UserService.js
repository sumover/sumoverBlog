const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const UserModel = require("../models/user")(Sequelize, DataTypes);
const InviteCodeModel = require("../models/invitecode")(Sequelize, DataTypes);
const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');

function md5WithSalt(str1, str2) {
    var sum = crypto.createHash('md5');
    sum.update(str1);
    return sum.digest(str2);
}

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
    },
    fetchInviteCode: async (userId) => {
        const today = moment().format("YYYY-MM-DD");
        var inviteCodeList = await InviteCodeModel.findAll({
            where: {
                createDate: today,
                inviteBy: userId
            }
        });
        if (inviteCodeList.length !== 0) return inviteCodeList;
        inviteCodeList = [];
        var user = await UserModel.findAll({
            where: {
                id: userId
            }
        });
        for (var i = 0; i < appConfig.inviteCodeNumber; ++i) {
            var inviteCodeGenerate = InviteCodeModel.create({
                code: md5WithSalt(md5WithSalt(today, user.username), (Math.random() * 10000).toString()),
                inviteBy: userId,
                createDate: today
            });
        }
    }
}