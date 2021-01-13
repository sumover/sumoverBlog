//
//  article.js
//  http://localhost:3000/article/
//

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});
const AppConfig = require("../app-config");
const moment = require('moment');

//  service import
const articleService = require('../services/ArticleService');
const commentService = require('../services/CommentService');
const userService = require("../services/UserService");

/**
 * 文章列表
 */
router.get('/',
    async (req, res, next) => {
        var option = {
            title: "猫猫的博客~",
            isArticleList: true
        };
        res.render('articleList', option);
    });

/**
 * RESTUrl=>文章内容的GET方法
 * 返回一个html
 */
router.get('/:id/detail', urlEncodeParser,
    async (req, res, next) => {
        var articleId = req.params.id;
        console.log(`browser query article ${articleId} detail`);
        var articleDetail = await articleService.fetchArticleDetail(articleId);

        var article = await articleService.fetchArticle(articleId);


        if (article === "null" ||
            article.showStatus !== "show") {
            res.render('articleDetail', {
                title: "article missing"
            });
            return
        }
        await articleService.articleReadPlus(articleId);
        var resOption = {
            title: article.title,
            articleHTML: articleDetail,
            articleId: articleId,
            loginStatus: typeof (req.session.loginUser) !== "undefined",
            articleCreateTime: moment(Number(article.createTime)).format("YYYY-MM-DD")
        };
        res.render('articleDetail', resOption);
    });

/**
 * 文章标签
 */
router.get('/articleLabelList', urlEncodeParser, async (req, res, next) => {
    var articleId = req.query.articleId;

    if ((await articleService.fetchArticle(articleId)) === "no article") {
        res.json({
            message: "article not exist"
        });
        return
    }

    let articleLabels = await articleService.queryArticleLabelList(articleId);

    if (articleLabels.length === 0) {
        res.json({
            message: "article no label"
        });
        return
    }
    res.json({
        message: "article label list query success",
        articleLabelList: articleLabels
    }).end();
});

/**
 * 文章列表
 */
router.get('/articleList', urlEncodeParser,
    async (req, res, next) => {
        var page = req.query.page;
        console.log(`browser query article list page=${page}`);
        var articleList = await articleService.queryArticleLists(page, AppConfig.pageLength);
        for (var index in articleList) {
            articleList[index].articleDetail = "预览页面暂时不予显示";
            articleList[index].createTime = moment(Number(articleList[index].createTime)).format("YYYY-MM-DD");

        }
        res.json({
            message: "query success",
            articleList: articleList
        }).end();
    });

/**
 * 查询一共有多少页
 */
router.get('/pageCount', urlEncodeParser,
    async (req, res, next) => {
        var articleListLength = await articleService.getArticleLength();

        res.json(Math.ceil(articleListLength / AppConfig.pageLength));
    });

/**
 * 查询本文章的评论列表
 */
router.get('/articleComments', urlEncodeParser,
    async (req, res, next) => {
        var articleId = req.query.aid;
        if ((await articleService.fetchArticle(articleId)) === "no article") {
            res.json({
                message: "article not exist"
            }).end();
            return
        }
        var commentList = await commentService.getArticleCommentList(articleId);
        if (commentList.length === 0) {
            res.json({
                message: "no comment"
            }).end();
        } else {
            res.json({
                message: "query comment success",
                commentList: commentList
            })
        }
    });

/**
 * 添加评论
 */
router.post('/publishComment', urlEncodeParser,
    async (req, res, next) => {
        var commentContent = req.body.commentContent;
        var articleId = req.body.articleId;
        if (typeof (req.session.loginUser) === "undefined") {
            res.json({message: "user not login"});
            return
        }
        var userId = req.session.loginUser.id;
        var commentCreated = await commentService.publishComment(articleId, userId, commentContent);

        res.json({
            message: "comment published success",
            commentCreated: commentCreated
        });
    });


module.exports = router;