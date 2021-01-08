const Sequelize = require("sequelize");
const config = require("./db-config");
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: config.dialect,
    define: {
        timestamps: false
    }
});

module.exports = {
    sequelize
}