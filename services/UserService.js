const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const UserModel = require("../models/user")(Sequelize, DataTypes);

module.exports = {
    userCheck: async () => {

    },
    userExist: async () => {

    },
    userAdd: async () => {

    }
}