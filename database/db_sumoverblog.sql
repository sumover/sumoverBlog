﻿# Host: localhost  (Version 8.0.22)
# Date: 2021-01-14 13:56:22
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "article"
#

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `articleDetail` text,
  `showStatus` varchar(255) DEFAULT 'show',
  `readCount` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

#
# Data for table "article"
#

INSERT INTO `article` VALUES (1,'nodejs+Express学习总结','1610297156192','也算看了好几天了, 总结一下.\n\n## 概述\n\n前端使用vue作为js框架, axios作为AJAX来动态访问服务器, 使用bootstrap来作为CSS框架.\n\n后端使用nodejs作为服务器, express作为后端框架, Sequelize用于与Mysql进行ORM, 使用EJS模板渲染.\n\n![结构](http://121.36.76.250/images/%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84.png)\n\n# 后端框架概述\n\n项目结构描述\n\n```textmate\n\\root\n|-\\bin\n|   |-www.js\n|-\\models\n|-\\public\n|   |-\\images\n|   |-\\javascripts\n|   |-\\stylesheets\n|-\\routes\n|-\\services\n|-\\test\n|-\\views\n|- app.js\n|- app-config.js\n|- db.js\n|- db-config.js\n|- packages.json\n|- router-autodetect.js\n|- sequelized-automated.config.json\n```\n\n## ExpressMVC配置\n\n需要的一些package:\n\n```json5\n{\n  //  dependencies\n  \"cookie-parser\": \"~1.4.4\",\n  \"debug\": \"~2.6.9\",\n  \"ejs\": \"~2.6.1\",\n  \"express\": \"~4.16.1\",\n  \"http-errors\": \"~1.6.3\",\n  \"morgan\": \"~1.9.1\",\n  \"moment\": \"^2.29.1\",\n  \"body-parser\": \"^1.19.0\",\n  \"express-session\": \"^1.17.1\",\n}\n```\n\nwww与app.js使用WebStorm自动生成.\n\n```javascript\n// app.js\nconst createError = require(\'http-errors\');\nconst express = require(\'express\');\nconst path = require(\'path\');\nconst cookieParser = require(\'cookie-parser\');\nconst logger = require(\'morgan\');\nconst session = require(\"express-session\");\n\nconst AppConfig = require(\"./app-config\");\n\nconst app = express();\n\n// view engine setup\napp.set(\'views\', AppConfig.viewPath);\napp.set(\'view engine\', \'ejs\');\n\napp.use(logger(\'dev\'));\napp.use(express.json());\napp.use(express.urlencoded({extended: false}));\napp.use(cookieParser());\napp.use(express.static(AppConfig.staticPath));\napp.use(session({\n    secret: \"12345\",\n    resave: false,\n    cookie: {maxAge: 6000}\n}));\n\n//  router register.\nrequire(\'./router-autodetect\')(app);\n\n//  **\n// catch 404 and forward to error handler\napp.use(function (req, res, next) {\n    next(createError(404));\n});\n\n// error handler\napp.use(function (err, req, res, next) {\n    // set locals, only providing error in development\n    res.locals.message = err.message;\n    res.locals.error = req.app.get(\'env\') === \'development\' ? err : {};\n\n    // render the error page\n    res.status(err.status || 500);\n    res.render(\'error\', {title: \'error\'});\n});\n\nmodule.exports = app;\n\n```\n\n说明: 路由的router-autodetect委托注册.\n\n```javascript\n//\n//  router-autodetect.js\n//\n//  自动检测app-config.js中的router\nconst AppConfig = require(\"./app-config\");\nconst path = require(\"path\");\nmodule.exports = (app) => {\n    for (let map of AppConfig.urlMapping) {\n        console.log(`process router: ${map.url}=>${map.router}.js...`);\n        const router = require(path.join(AppConfig.routerPath, map.router + \".js\"));\n        app.use(map.url, router);\n    }\n}\n```\n\napp-config.js, 用于存放一些数据. (对应的路径之类的)\n\n```javascript\n//  一些初步配置\nconst path = require(\'path\');\nmodule.exports = {\n    viewPath: path.join(__dirname, \"views/\"),\n    staticPath: path.join(__dirname, \"public\"),\n    routerPath: path.join(__dirname, \"routes\"),\n    urlMapping: [\n        {url: \"/\", router: \"index\"},\n        {url: \"/users\", router: \"users\"},\n        {url: \"/neko\", router: \"neko\"},\n    ]\n};\n```\n\n## Sequelize ORM 配置\n\n依赖package:\n\n```json5\n{\n  //dependencies\n  \"sequelize\": \"^6.3.5\",\n  \"mysql\": \"^2.18.1\",\n  \"sequelize-automate\": \"^1.2.2\",\n  \"mysql2\": \"^2.2.5\"\n}\n```\n\n### Sequelized-automated自动生成Model\n\n在package.json的script中添加 `\"sequelized-automated\": \"sequelize-automate -c sequelized-automated.config.json\"`\n\nsequelized-automated.config.json配置\n\n```json5\n{\n  // 配置仅供参考\n  \"dbOptions\": {\n    \"database\": \"db_nekoneko\",\n    \"username\": \"username\",\n    \"password\": \"password\",\n    \"dialect\": \"mysql\",\n    \"host\": \"localhost\",\n    \"port\": 3306,\n    \"logging\": false\n  },\n  \"options\": {\n    \"type\": \"js\",\n    \"dir\": \"models\"\n  }\n}\n```\n\n### sequelize ORM配置\n\nsequelize配置\n\n```javascript\n// db.json\nconst Sequelize = require(\"sequelize\");\nconst config = require(\"./db-config\");\nconst sequelize = new Sequelize(config.database, config.username, config.password, {\n    host: config.host,\n    pool: {\n        max: 5,\n        min: 0,\n        acquire: 30000,\n        idle: 10000\n    },\n    dialect: \"mysql\",\n    define: {\n        timestamps: false\n    }\n});\n\nmodule.exports = {\n    sequelize\n}\n```\n\n```javascript\n// db-config.js\nvar dbConfig = {\n    database: \"db_nekoneko\",\n    username: \"root\",\n    password: \"2323180\",\n    host: \"localhost\",\n    port: 3306\n}\n\nmodule.exports = dbConfig;\n```\n\n## sequelize+ExpressMVC整合\n\n将数据逻辑处理层单独封装为service. 在routes中调用services. 在service层中初始化Model与封装数据库操作.\n\n```javascript\n//\n//  service层举例\n//  catService.js\n// \nconst {QueryTypes, DataTypes} = require(\'sequelize\');\nconst db = require(\"../db\");\nconst Sequelize = db.sequelize;\nconst cat = require(\"../models/cat\")(Sequelize, DataTypes);\n\ncat.sync(); //  如果没有cat表, 则创建这个表\n\nclass CatService {  //  使用async/await风格代码来访问数据库\n\n    /**\n     * 查询代码举例(1)\n     * @returns {Promise<*>}\n     */\n    static async getAllCat() {\n        var cats = await cat.findAll();\n        return cats;\n    }\n\n    /**\n     *  查询代码举例(2)\n     * @param id\n     * @returns {Promise<null|*>}\n     */\n    static async getCat(id) {\n        var res = await cat.findAll({\n            where: {Id: id}\n        });\n        if (res.length === 1)\n            return res[0];\n        else return null;\n    }\n\n    /**\n     * 插入数据举例\n     * @param nekoname\n     * @param nekoage\n     * @returns {Promise<*>}\n     */\n    static async addCat(nekoname, nekoage) {\n        var res = await cat.create({\n            name: nekoname,\n            age: nekoage\n        });\n        console.log(JSON.stringify(res));\n        return res;\n    }\n\n    /**\n     * 删除数据举例\n     * @param cat_id\n     * @returns {Promise<void>}\n     */\n    static async deleteCat(cat_id) {\n        var res = await cat.destroy({\n            where: {\n                Id: cat_id\n            }\n        });\n    }\n}\n\nmodule.exports = CatService;\n```\n\n通常来讲, 自动生成的model代码是这样的\n\n```javascript\n//\n//cat.js, 还挺严谨的...\n//\nconst {\n    DataTypes\n} = require(\'sequelize\');\n\nmodule.exports = sequelize => {\n    const attributes = {\n        Id: {\n            type: DataTypes.INTEGER,\n            allowNull: false,\n            defaultValue: null,\n            primaryKey: true,\n            autoIncrement: true,\n            comment: null,\n            field: \"Id\"\n        },\n        name: {\n            type: DataTypes.STRING(50),\n            allowNull: false,\n            defaultValue: \"\",\n            primaryKey: false,\n            autoIncrement: false,\n            comment: null,\n            field: \"name\"\n        },\n        age: {\n            type: DataTypes.INTEGER,\n            allowNull: false,\n            defaultValue: \"0\",\n            primaryKey: false,\n            autoIncrement: false,\n            comment: null,\n            field: \"age\"\n        }\n    };\n    const options = {\n        tableName: \"cat\",\n        comment: \"\",\n        indexes: []\n    };\n    const CatModel = sequelize.define(\"cat_model\", attributes, options);\n    return CatModel;\n};\n```\n\n## Express前端数据交互\n\n如何正确响应前端请求?\n\n一个举例\n\n```javascript\n//\n//  neko.js\n//   http://localhost:8000/neko\n//\nconst express = require(\'express\');\nconst router = express.Router();\nconst bodyParser = require(\"body-parser\");\nconst catService = require(\"../services/catService\");\n\nconst urlEncodeParser = bodyParser.urlencoded({extend: false});\n\nrouter.get(\'/\', async (req, res, enext) => {\n    let cats = await catService.getAllCat();\n    res.json(cats);\n});\n\nrouter.get(\'/cat\', urlEncodeParser, async (req, res, next) => {\n    var id = req.query.id;\n    let cat = await catService.getCat(id);\n    res.json(cat);\n});\n\nrouter.post(\'/addCat\', urlEncodeParser, async (req, res, next) => {\n    var nekoname = req.body.nekoname;\n    var nekoage = req.body.nekoage;\n    var nekoAdded = await catService.addCat(nekoname, nekoage);\n    res.json(nekoAdded);\n});\n\nrouter.get(\'/deleteCat\', urlEncodeParser, async (req, res, next) => {\n    var id = req.query.id;\n    let deleteRes = await catService.deleteCat(id);\n    res.json({message: \"success\"}).end();\n});\n\nmodule.exports = router;\n```\n\n### 响应get请求, 并响应一个HTML页面\n\n```javascript\n//\n//  index.js\n//  http://localhost:3000/\n//\nconst express = require(\'express\');\nconst router = express.Router();\n\nrouter.get(\"/\", (req, res, next) => {\n    //  记得要把模板参数传进去\n    var option = {title: \'PotatoSystem\'};\n    if (req.session.loginUser) {\n        option.loginUser = req.session.loginUser;\n    }\n    res.render(\'index\', option);\n});\n```\n\n### 响应AJAX的GET请求, 响应一个JSON\n\n```javascript\nrouter.get(\'/\', async (req, res, next) => {\n    let cats = await catService.getAllCat();\n    res.json(cats).end();\n});\n```\n\n### 带参AJAX的GET请求, 响应一个JSON\n\n参数是放置在req.query中的.\n\n```javascript\nrouter.get(\'/cat\', urlEncodeParser, async (req, res, next) => {\n    //  参数放在req.query中\n    var id = req.query.id;\n    let cat = await catService.getCat(id);\n    res.json(cat);\n});\n```\n\n### 带参POST\n\n使用urlEncoderParser解析后, 参数放在req.body中.\n\n```javascript\nrouter.post(\'/addCat\', urlEncodeParser, async (req, res, next) => {\n    var nekoname = req.body.nekoname;\n    var nekoage = req.body.nekoage;\n    var nekoAdded = await catService.addCat(nekoname, nekoage);\n    res.json(nekoAdded);\n});\n```\n\n## session\n\n在app.js中使用\n\n```javascript\napp.use(session({\n    secret: \"12345\",\n    resave: false,\n    cookie: {maxAge: 6000}\n}));\n```\n\n在解析url请求中通过 `req.session` 来使用session\n\n# 前端(其实没啥结构...)开发小结.\n\n*尤雨溪牛逼!!!!!!!(破音)*\n\n使用EJS模板(其实就是用了一下include和title的渲染...)可以极大的降低开发的复杂度.\n\n将header封装为一个单独的ejs(header.ejs), 用于导入vue, axios, bootstrap和jquery\n\n```html\n<!DOCTYPE html>\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->\n    <title><%= \"undefined\" === typeof (title) ? \"noTitle\" : title %></title>\n\n    <!-- Bootstrap -->\n    <!--    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css\" rel=\"stylesheet\">-->\n    <%/* 导入bootstrap*/%>\n    <link href=\"stylesheets/bootstrap.min.css\" rel=\"stylesheet\">\n\n    <%/* 导入乱七八糟的JS*/%>\n    <script src=\"javascripts/jquery-3.5.1.js\"></script>\n    <script src=\"/javascripts/bootstrap.min.js\"></script>\n    <script src=\"javascripts/vue.js\"></script>\n    <script src=\"javascripts/axios.min.js\"></script>\n\n</head>\n```\n\nejs模板中,可以使用 `<%/* */%>`来注释, 这样注释可以保证渲染的HTML是没有你的憨憨注释的.\n','show',95),(2,'sequelize ORM框架实现MVC总结 ','1610331772200','\n## 项目结构 & 图\n\n项目结构\n\n```text\nroot\n|-models\n|   |\n|   |-cats.js\n|-node_modules\n|-services\n|   |\n|   |-cats.js\n|-app.js\n|-config.js\n|-db.js\n|-package.json\n|-sequelize-automate.config.json\n```\n\n其中, `models` 用于存放友sequelize-automate自动生成的model, `node_modules` 为node的module存放目录, `services` 则用于存放与数据库的操作.\n\n`db.js` 用于生成一个 `sequelize` 的实例, `config.js` 则用于存放一些配置.\n\n![与cat有关的类图](http://121.36.76.250/images/21_1_2_Selected.jpg)\n\n数据库字段\n\n```mysql\ncreate table cat\n(\n    Id   int auto_increment\n        primary key,\n    name varchar(50) default \'\' not null,\n    age  int         default 0  not null\n);\n```\n\n## 起步配置\n\n### 需要的包\n\n```text\n\"sequelize\": \"^6.3.5\",\n\"mysql\": \"^2.18.1\",\n\"sequelize-automate\": \"^1.2.2\",\n\"mysql2\": \"^2.2.5\",\n\"moment\": \"^2.29.1\"\n```\n\n### 脚本配置(主要是自动生成model)\n\n在 `script` 中添加一个 `\"sequelize-automate\": \"sequelize-automate -c sequelize-automate.config.json\"`\n\n然后添加一个 `sequelize-automate.config.json` (配置内容仅供参考)\n\n```json\n{\n  \"dbOptions\": {\n    \"database\": \"db_test\",\n    \"username\": \"root\",\n    \"password\": \"password\",\n    \"dialect\": \"mysql\",\n    \"host\": \"localhost\",\n    \"port\": 3306,\n    \"logging\": false\n  },\n  \"options\": {\n    \"type\": \"js\",\n    //  由于我们使用了node.js, 所以我们设置type为js\n    \"dir\": \"models\"\n  }\n}\n```\n\n`config.js` 配置内容(同样仅供参考)\n\n```js\nvar config = {\n    database: \"db_test\",\n    username: \"root\",\n    password: \"password\",\n    host: \"localhost\",\n    port: 3306\n}\n\nmodule.exports = config;\n```\n\n\n\n##  配置sequelize链接\n\ndb.js中会创建一个sequelize的实例. 具体代码如下.\n\n```js\nconst Sequelize = require(\"sequelize\");\nconst config = require(\"./config\");\nconst sequelize = new Sequelize(config.database, config.username, config.password, {\n    host: config.host,\n    pool: {\n        max: 5,\n        min: 0,\n        acquire: 30000,\n        idle: 10000\n    },\n    dialect: \"mysql\",\n    define: {\n        timestamps: false\n    }\n});\n\nmodule.exports = {\n    sequelize\n}\n```\n\n### 重点说明!\n\n请务必将timestamps设置为false, 否则巨tm恶心. 此处贴一个廖雪峰老师的名言\n\n>   用sequelize.define()定义Model时，传入名称pet，默认的表名就是pets。第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。第三个参数是额外的配置，我们传入{ timestamps: false }是为了关闭Sequelize的自动添加timestamp的功能。所有的ORM框架都有一种很不好的风气，总是自作聪明地加上所谓“自动化”的功能，但是会让人感到完全摸不着头脑。\n\n\n\n##  sequelize-automate 自动化配置\n\n创建好 `sequelize-automate.config.json` 文件.\n\n在命令行中运行 `sequelize-automate -c sequelize-automate.config.json`\n\n##  正确食用model & service\n\n一个正确输出的model应该是这个样子的:\n\n```js\n//  cat.js, 也不知道为啥自动生成的代码是俩空格的...\nconst {\n    DataTypes\n} = require(\'sequelize\');\n\nmodule.exports = sequelize => {\n    const attributes = {\n        Id: {\n            type: DataTypes.INTEGER,\n            allowNull: false,\n            defaultValue: null,\n            primaryKey: true,\n            autoIncrement: true,\n            comment: null,\n            field: \"Id\"\n        },\n        name: {\n            type: DataTypes.STRING(50),\n            allowNull: false,\n            defaultValue: \"\",\n            primaryKey: false,\n            autoIncrement: false,\n            comment: null,\n            field: \"name\"\n        },\n        age: {\n            type: DataTypes.INTEGER,\n            allowNull: false,\n            defaultValue: \"0\",\n            primaryKey: false,\n            autoIncrement: false,\n            comment: null,\n            field: \"age\"\n        }\n    };\n    const options = {\n        tableName: \"cat\",\n        comment: \"\",\n        indexes: []\n    };\n    const CatModel = sequelize.define(\"cat_model\", attributes, options);\n    return CatModel;\n};\n```\n\n一个正常运行的service头.\n\n```js\nconst {QueryTypes, DataTypes} = require(\'sequelize\');\nconst db = require(\"../db\");\nconst Sequelize = db.sequelize;\n//  老版本中, 需要使用Sequelize.import(\'../model/cat\")来导入模型, 而新版本则直接通过闭包来完成. \nconst cat = require(\"../models/cat\")(Sequelize, DataTypes);\n\ncat.sync();     //  如果没有这个表的话, 那么直接创建一个.\n```\n\napp.js中, 直接调用service中暴露出的方法即可.\n\n```js\n//  app.js\nconst catService = require(\"./services/cat\");\n\n(async () => {\n    let cats = await catService.getAllCat();\n    console.log(\"****************************\");\n    console.log(`find ${cats.length} cats!`);\n    for (var cat of cats) {\n        console.log(JSON.stringify(cat));\n    }\n    console.log(\"****************************\");\n})();\n```\n\n注意, 这里Sequelize查询数据库后会返回一个Array. Array的元素为Model.\n\n上述代码中的cats就是查询到的Array, 而cat则为Model类.\n如果需要获得cat的某个字段(如name), 直接`cat.name`调用即可.\n\n##  Sequelize ORM 过程解析.\n\n下图比较清楚的说明了调用过程.\n\n![与cat有关的类图](http://121.36.76.250/images/21_1_2_Selected.jpg)\n\n与数据库初始化有关的操作(链接, 配置等)主要放在db.js中, 暴露出来一个 `sequelize` 对象给 `service`调用.\n\n而服务与数据库之间的操作则交给service层完成, service层暴露一些接口供外部(如controller或这里的app.js)调用.\n\n\n\n(未完待续)','show',39),(3,'Markdown样式测试','1610337612981','\n```javascript\n\n/**\n * 文章内容的GET方法\n * 返回一个html\n */\nrouter.get(\'/:id/detail\', urlEncodeParser, async (req, res, next) => {\n    var articleId = req.params.id;\n    console.log(`browser query article ${articleId} detail`);\n    var articleDetail = await articleService.fetchArticleDetail(articleId);\n\n    var article = await articleService.fetchArticle(articleId);\n\n\n    if (article === \"null\" ||\n        article.showStatus !== \"show\") {\n        res.render(\'articleDetail\', {\n            title: \"article missing\"\n        });\n        return\n    }\n    await articleService.articleReadPlus(articleId);\n    var resOption = {\n        title: article.title,\n        articleHTML: articleDetail,\n        articleId: articleId\n\n    };\n    res.render(\'articleDetail\', resOption);\n});\n```\n\n### 大顶堆\n\n```cpp\n#include <bits/stdc++.h>\n\nusing namespace std;\n\nstruct Stack {\n    int len, arr[10004];\n\n    void push_down(int root = 0) {\n        if (root >= len) return;\n        if ((root * 2 + 1) >= len) return;\n        if ((root * 2 + 2) >= len) {\n            if (arr[root * 2 + 1] > arr[root])std::swap(arr[root * 2 + 1], arr[root]);\n            return;\n        }\n        if (arr[root * 2 + 1] > arr[root * 2 + 2]) {\n            if (arr[root] < arr[root * 2 + 1]) {\n                std::swap(arr[root], arr[root * 2 + 1]);\n                push_down(root * 2 + 1);\n            }\n        } else {\n            if (arr[root] < arr[root * 2 + 2]) {\n                std::swap(arr[root], arr[root * 2 + 2]);\n                push_down(root * 2 + 2);\n            }\n        }\n    }\n\n    void push_up(int root) {\n        if (!root)return;\n        else {\n            if (arr[root / 2] < arr[root]) std::swap(arr[root / 2], arr[root]);\n            push_up(root / 2);\n        }\n    }\n\n    void insert(int value) {\n        arr[len] = value;\n        push_up(len++);\n    }\n\n    void erase() {\n        std::swap(arr[0], arr[--len]);\n        push_down();\n    }\n\n    size_t size() const { return len; }\n\n    int top() const { return arr[0]; }\n\n    void print() { for (int i = 0; i < len; ++i) std::cout << arr[i] << \' \'; }\n};\n\n\nint main(int argc, char *argv[], char *env[]) {\n    std::vector<int> arr = {123, 12, 312, 3, 123, 55, 44, 2, 354, 4};\n    Stack s;\n    for (int a:arr) s.insert(a);\n    while (s.size()) {\n        std::cout << s.top() << \"\\t|\\t\";\n        s.print();\n        std::cout << std::endl;\n        s.erase();\n    }\n}\n\n```\n\n![彩加真可爱!](http://121.36.76.250/images/caijia.jpg)\n\n\n### 表格样式测试\n\n\n| 单词                                                | 意义                                                                       |\n| --------------------------------------------------- | --------------------------------------------------------------------------|\n| appealing                                           | 吸引人的                                                                   |\n| stunning                                            | 惊人的                                                                     |\n| gorgeous                                            | 华丽的                                                                     |\n| blond                                               | 金发碧眼的                                                                 |\n| breathtaking                                        | (其实就是漂亮)                                                             |\n\n廖雪峰名言\n\n> 用sequelize.define()定义Model时，传入名称pet，默认的表名就是pets。第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。第三个参数是额外的配置，我们传入{ timestamps: false }是为了关闭Sequelize的自动添加timestamp的功能。所有的ORM框架都有一种很不好的风气，总是自作聪明地加上所谓“自动化”的功能，但是会让人感到完全摸不着头脑。\n\n\n![Webstorm自动生成的类图](http://121.36.76.250/images/21_1_2_Selected.jpg)\n\n\nLatex公式渲染:\n\n内联Latex\n\n这个 $ \\int_{0}^{100}f(x)dx $ 积分.\n\n外联latex渲染\n\n$$\n\\frac{1}{12312}\n$$\n','show',162),(4,'评论区样式测试','1610354298569','评论样式测试\n__2333__\n![](https://tse1-mm.cn.bing.net/th/id/OIP.ZjymAxc_9H7VuNai-8ekzwAAAA?pid=Api&rs=1)','show',95),(5,'空文章测试','1610364553351',NULL,'show',36),(6,'Markdown+Latex渲染样式测试','1610531239541','## 内联测试\n\nasdasdas `$\\int_1^100 f(x)dx $` asdasdas\n\n## 外联测试\n\n### 样式1\n`$$\n\\frac{1}{123123}\n$$`\n\n### 样式2\n\n```\n$$\n\\frac{1}{123123} = \\frac{sinx}{cosx}\n$$\n```\n\n\n非Latex渲染测试\n\n```java\n$12312312\\thi$\n```\n\n','show',39),(22,'灌水文章测试1','1610373311337','灌水文章测试1','show',6);

#
# Structure for table "comment"
#

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `articleId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `content` text,
  `publishedTime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

#
# Data for table "comment"
#

INSERT INTO `comment` VALUES (1,4,1,'好耶!','1610356549698'),(2,4,6,'整挺好','1610356917739'),(12,4,1,'评论测试111','1610363490674'),(13,4,1,'serena!!!','1610364095331'),(14,4,1,'!!!!!','1610364119641'),(15,3,1,'用sequelize.define()定义Model时，传入名称pet，默认的表名就是pets。第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。第三个参数是额外的配置，我们传入{ timestamps: false }是为了关闭Sequelize的自动添加timestamp的功能。所有的ORM框架都有一种很不好的风气，总是自作聪明地加上所谓“自动化”的功能，但是会让人感到完全摸不着头脑。','1610364345193'),(16,5,1,'牛逼牛逼','1610364976925'),(17,5,6,'厉害厉害','1610364991700'),(18,1,6,'好耶~!','1610366136168'),(19,4,6,'asdasd','1610372134625'),(20,4,6,'asdas','1610372153494'),(21,1,1,'2333333','1610552981698');

#
# Structure for table "invitecode"
#

DROP TABLE IF EXISTS `invitecode`;
CREATE TABLE `invitecode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL DEFAULT '',
  `inviteBy` int NOT NULL DEFAULT '0',
  `createDate` date DEFAULT '0000-00-00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

#
# Data for table "invitecode"
#

INSERT INTO `invitecode` VALUES (1,'1',1,'2021-01-09'),(9,'c4be1f62a66e7af4af705697240b98a2',6,'2021-01-10'),(10,'1075e821a809b043ef396e16bc489f10',6,'2021-01-10'),(11,'7643b7084e1e1fdb3a1495b6ff9eef51',6,'2021-01-10'),(12,'f814f4a91f18f1e57525141087575f98',6,'2021-01-10'),(13,'c74baa2f062359f4f49f2b4d90f743e2',6,'2021-01-10'),(14,'a259e22dbbaa791494c619dbd3c9c592',9,'2021-01-10'),(15,'6fbcfcb3f6a0a2ff441d494c6c0bc6b1',9,'2021-01-10'),(16,'23cf6a2eda90c692f10d80f3df4d71e4',9,'2021-01-10'),(17,'1acb9000d54c7460061eb34c0bb90740',9,'2021-01-10'),(18,'506c919b48e712e68a5973ea59da677e',9,'2021-01-10'),(19,'0f8716d40e2780194f25dfdfc54f2e3c',10,'2021-01-10'),(20,'30d767a0d3ae0b93d75d8385f6831e68',10,'2021-01-10'),(21,'1b4905cd2bcb849dc34ff015d3557075',10,'2021-01-10'),(22,'a0442a2d4015e0167bb0784c840833d0',10,'2021-01-10'),(23,'783d9b17bcc170eed804b9951c2d962b',10,'2021-01-10'),(24,'ba5db24c668a34594ddbaa0f01ef8aaf',1,'2021-01-10'),(25,'ce6e6f4324739224fb8c8fa1cc309f72',1,'2021-01-10'),(26,'8ffb1fff688e537e8f3813c21d666177',1,'2021-01-10'),(27,'0a1ca846d31b95a65b6fcfba746cfebe',1,'2021-01-10'),(28,'a5c7804314110250ee5cee0157019ee4',1,'2021-01-10'),(29,'1f8ee79f34024ed362d8c1d6e932e451',6,'2021-01-11'),(30,'8f82e3b8861a8ff75468f295d5795066',6,'2021-01-11'),(31,'54e477f5ef763fcffbf1866bddf0fac4',6,'2021-01-11'),(32,'57447db226b33075716399e752e1268d',6,'2021-01-11'),(33,'b9dacb0466124056b37db8090c7aebc0',6,'2021-01-11'),(34,'7f7f4b214cd034e9f17ef9767a50b8f6',1,'2021-01-11'),(35,'fc07235522c2112f9a55f8dbcb3e3c1a',1,'2021-01-11'),(36,'ac354c2515dd9f9d8237d14904f2d863',1,'2021-01-11'),(37,'c94fe0764dc130e6408655fd658f5418',1,'2021-01-11'),(38,'b17833b1d454b52e200188a75bd87de3',1,'2021-01-11'),(39,'430e36340bc69967e9b8041553c44ea2',1,'2021-01-12'),(40,'d81af7a99d6c08ff4b868aa96ed8edc1',1,'2021-01-12'),(41,'0b9f1f4ef5141e5fa0079d4ead0f1434',1,'2021-01-12'),(42,'0ea8c26ba473dbe8d37dfbcfb124c246',1,'2021-01-12'),(43,'1c5be52fd86b8bd18704acaa9d1ec7c5',1,'2021-01-12'),(44,'e02e4b59b3124a8e5314fdd734f642fd',1,'2021-01-13'),(45,'520f55ac7aad4a1ecbea2a785e22287e',1,'2021-01-13'),(46,'43044daaa7cbff48d36030abcf7c889e',1,'2021-01-13'),(47,'254211152b1be76f346489ecfd2fb330',1,'2021-01-13'),(48,'b9e03306a09972a40da8f4b258e4af37',1,'2021-01-13'),(49,'48edb28ec2778ca42ca745c4552e4bfa',11,'2021-01-13'),(50,'7786ff95a075d11165838e73403edfc9',11,'2021-01-13'),(51,'497e59a5398bb3419dac0003ddee72ac',11,'2021-01-13'),(52,'41ba2ad7627e4e35478a044be58000b5',11,'2021-01-13'),(53,'252a42d8203d898a85636fed0b72dc07',11,'2021-01-13'),(54,'20ab9c7a9d5e1c7601485342e5fa8f3f',1,'2021-01-14'),(55,'233204af85e5af722a248f04e11a88e6',1,'2021-01-14'),(56,'7df437b3abde0ad82fcb466907e8d58d',1,'2021-01-14'),(57,'94535eae992f853cb7a051894a33254e',1,'2021-01-14'),(58,'0d70df7b6f3096d662d16394b487c0bb',1,'2021-01-14');

#
# Structure for table "label"
#

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `articleId` int NOT NULL DEFAULT '0',
  `labelInfo` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`articleId`,`labelInfo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "label"
#

INSERT INTO `label` VALUES (1,'express'),(1,'node'),(1,'sequelize'),(1,'vue'),(3,'测试'),(4,'测试'),(5,'测试'),(6,'Latex'),(6,'Markdown'),(6,'测试'),(6,'渲染'),(7,'测试');

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `register_time` varchar(20) NOT NULL DEFAULT '0',
  `last_login_time` varchar(20) NOT NULL DEFAULT '0',
  `invitecode` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

#
# Data for table "user"
#

INSERT INTO `user` VALUES (1,'sumover','6dce86fe1d67cc2d35dec6f4d5eca321','1610175301344','1610602595950',''),(6,'testuser','690451f76fc3e5af7a71385efda8fb6c','1610204727963','1610371024885','1'),(11,'testuser3','690451f76fc3e5af7a71385efda8fb6c','1610553048093','1610553058888','e02e4b59b3124a8e5314fdd734f642fd');

#
# Structure for table "userrole"
#

DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `userid` int NOT NULL DEFAULT '0',
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "userrole"
#

INSERT INTO `userrole` VALUES (1,'admin');
