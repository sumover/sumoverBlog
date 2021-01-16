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
 *
 * 在用户未登录或者用户并不是admin的时候, 强制跳转到主页面
 *
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

/**
 * 使用闭包构造的一个装饰器
 *
 * 在用户未登录或者用户并不是admin时, 阻止ajax行为
 * @param handler
 * @returns {function(*=, *=, *=): Promise<undefined>}
 * @constructor
 */
function ForcedJumpAJAX(handler) {
    return async (req, res, next) => {
        var loginUser = req.session.loginUser;
        if (loginUser === undefined || loginUser === null) {
            res.redirect('/');
            return
        }
        const userRole = await userService.userRole(loginUser);
        if (userRole !== "admin") {
            res.json({
                message: "role error"
            });
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
        res.render('administrator', {
            title: 'admin management'
        });
    })
);

router.get('/allUser', urlEncodeParser, ForcedJumpAJAX(
    /**
     * TODO 把所有的用户索引到页面
     *
     * |id|name|lastLoginTime|InvitedBy|
     *
     * @AJAX
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var allUserList = await adminService.getAllUser();
        res.json({
            message: "fetch all user success",
            allUserList: allUserList
        })
    })
);

router.get('/allArticle', urlEncodeParser, ForcedJumpAJAX(
    /**
     * TODO 把所有的文章整到页面内
     *
     * |id|title|publishedTime|status|readCount|
     *
     * @AJAX
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var allArticleList = await adminService.getAllArticle();
        res.json({
            message: "fetch all article success",
            articleList: allArticleList
        })
    }
));

router.get('/allComment', urlEncodeParser, ForcedJumpAJAX(
    /**
     * TODO 把所有的评论都整过去
     *
     * |id|articleId|articleTitle|publicUser|detail|publishedTime|
     *
     * @AJAX
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var allComment = await adminService.getAllComment();

        res.json({
            message: "fetch all comment success",
            commentList: allComment
        });
    }
));

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
router.post('/articleStatusSwitch', urlEncodeParser, ForcedJumpAJAX(
    async (req, res, next) => {
        var aid = req.body.aid;
        var articleUpdated = await adminService.changeStatus(aid);

        res.json({
            message: "article show status change",
            article: articleUpdated
        })
    }
));

module.exports = router;