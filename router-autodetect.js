//  自动检测app-config.js中的router
const AppConfig = require("./app-config");
const path = require("path");
module.exports = (app) => {
    for (let map of AppConfig.urlMapping) {
        console.log(`process router: ${map.url}=>${map.router}.js...`);
        const router = require(path.join(AppConfig.routerPath, map.router + ".js"));
        app.use(map.url, router);
    }
}