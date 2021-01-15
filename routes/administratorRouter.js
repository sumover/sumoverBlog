//
//  article.js
//  http://localhost:3000/administrator/
//

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});
const AppConfig = require("../app-config");
const moment = require('moment');

//  service import
const userService = require('../services/UserService');
const adminService = require('../services/AdministratorService');

// util import

const marked = require('marked-katex');
const katex = require('katex');

/**
 * 使用闭包构造的一个装饰器
 * @param handler url handler
 * @returns async function(req, res, next): Promise<undefined>
 * @constructor
 */
function ForcedJump(handler) {
    return async (req, res, next) => {
        var loginUser = req.session.loginUser;
        if (loginUser === undefined || loginUser === null) {
            res.redirect('/');
            return
        }
        const userRole = await userService.userRole(loginUser);
        if (userRole !== "admin") {
            res.redirect('/');
        } else handler(req, res, next);
    }
}

router.get('/', urlEncodeParser, ForcedJump(
    /**
     * 管理员主页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        //todo
        var userList = await adminService.getAllUser();
        var articleList = await adminService.getAllArticle();
        res.render('administrator', {
            title: 'admin management'
        });
    })
);

router.get('/uploadArticle', urlEncodeParser, ForcedJump(
    /**
     * 博客上传页面的跳转url
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        res.render('uploadArticle', {
            title: "博客上传",
        });
    })
);

router.post('/preRender', urlEncodeParser, ForcedJump(
    /**
     * 文章预览
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var markdownText = req.body.markdown_text;
        marked.setOptions({
            renderer: new marked.Renderer(),
            headerIds: true,
            gfm: true,
            tables: true,
            breaks: true,
            mangle: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            kaTex: katex
        });
        if (markdownText !== "") res.json({
            message: "render success",
            renderRes: marked(markdownText),
            curTime: moment().format("YYYY-MM-DD")
        });
        else res.json({
            message: "render error"
        });
    })
);

router.post('/publish', urlEncodeParser, ForcedJump(
    /**
     * 文章发布
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var title = req.body.title, content = req.body.content, labels = req.body.labels;
        var articleCreate = await adminService.uploadArticle(title, content, labels);
        res.json({
            message: "publish success",
            id: articleCreate.id
        })
    })
);
module.exports = router;