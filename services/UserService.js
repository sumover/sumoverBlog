const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const UserModel = require("../models/user")(Sequelize, DataTypes);
const InviteCodeModel = require("../models/invitecode")(Sequelize, DataTypes);
const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');

function md5WithSalt(str1, str2) {
    var hash = crypto.createHash('md5');
    hash.update(str1 + str2);
    var hashRes = hash.digest('hex');
    return hashRes;
}

module.exports = {
    /**
     * 检测用户是否输入正确
     * @param username  用户名
     * @param password  密码
     * @returns {Promise<string|*>} 若密码错误, 则返回"password error", 否则返回用户实体
     */
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
    /**
     * 检测用户名是否存在
     * @param username  用户名
     * @returns {Promise<boolean>} 已存在or not
     */
    userExist: async (username) => {
        let queryRes = await UserModel.findAll({
            where: {
                username: username
            }
        });
        return (queryRes.length !== 0);
    },
    /**
     * 添加一个新用户
     * @param username          用户名
     * @param password          密码
     * @param inviteCode        邀请码
     * @returns {Promise<*>}    刚刚添加的用户实体
     */
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
    /**
     *  检测邀请码是否正确
     * @param inviteCode    检测的邀请码
     * @returns {Promise<boolean>}  correct or not
     */
    inviteCodeCheck: async (inviteCode) => {
        let inviteCodeList = await InviteCodeModel.findAll({
            where: {
                code: inviteCode
            }
        });
        return inviteCodeList.length !== 0;
    },
    /**
     * 获取邀请码
     * @param userId    用户id
     * @returns {Promise<*|*[]>}    邀请码列表
     */
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
        var userRes = await UserModel.findAll({
            where: {
                id: userId
            }
        });
        var user = userRes[0];
        var firstMD5 = md5WithSalt(today, user.username);
        for (var i = 0; i < appConfig.inviteCodeNumber; ++i) {
            inviteCodeList.push({
                code: md5WithSalt(firstMD5, (Math.random() * Date.now()).toString()),
                inviteBy: userId,
                createDate: today
            });
        }
        for (var _inviteCode of inviteCodeList) {
            var createRes = await InviteCodeModel.create(_inviteCode);
        }
        return inviteCodeList;
    },
    /**
     *更新用户最后一次更新时间
     * @param loginUser         用户实体
     * @param lastLoginTime     时间
     * @returns {Promise<*>}    更新后的用户实体
     */
    updateLastLogin: async (loginUser, lastLoginTime) => {
        loginUser.last_login_time = lastLoginTime;
        await loginUser.save();
        return loginUser;
    }
}