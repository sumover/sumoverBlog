//  一些初步配置
const path = require('path');
module.exports = {
    viewPath: path.join(__dirname, "views/"),
    staticPath: path.join(__dirname, "public"),
    routerPath: path.join(__dirname, "routes"),
    urlMapping: [
        {url: "/", router: "index"},
        {url: "/users", router: "users"}
    ]
};