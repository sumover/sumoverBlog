//  一些初步配置
const path = require('path');
module.exports = {
    host: "localhost",
    port: "3000",
    viewPath: path.join(__dirname, "views/"),
    staticPath: path.join(__dirname, "public"),
    routerPath: path.join(__dirname, "routes"),
    inviteCodeNumber: 5,
    urlMapping: [
        {url: "/", router: "indexRouter"},
        {url: "/users", router: "usersRouter"},
        {url: "/search", router: "searchRouter"},
        {url: "/article", router: "articleRouter"},
        {url: "/administrator", router: "administratorRouter"}
    ],
    baseURL: `http://${this.host}:${this.port}`,
    pageLength: 10,
};
