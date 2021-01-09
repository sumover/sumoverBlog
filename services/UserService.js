const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const UserModel = require("../models/user")(Sequelize, DataTypes);

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
    userAdd: async () => {

    }
}