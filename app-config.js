//  一些初步配置
const path = require('path');
module.exports = {
    viewPath: path.join(__dirname, "views/"),
    staticPath: path.join(__dirname, "public"),
    routerPath: path.join(__dirname, "routes"),
    inviteCodeNumber: 5,
    urlMapping: [
        {url: "/", router: "index"},
        {url: "/users", router: "users"},
        {url: "/search", router: "search"},
        {url: "/article", router: "article"}
    ],
    baseURL: "http://localhost:3000",
    pageLength: 10
};