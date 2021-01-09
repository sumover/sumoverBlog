//
//  article.js
//  http://localhost:3000/article/

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});

/**
 * 文章内容的GET方法
 * 返回一个html
 */
router.get('/:id/detail', urlEncodeParser, async (req, res, next) => {
    var articleId = req.params.id;
    console.log(`browser query article ${articleId} detail`);
    var resOption = {title: "article title"};
    res.render('articleDetail', resOption);
});

router.get('/articleList', urlEncodeParser, async (req, res, next) => {
    var page = req.query.page;
    console.log(`browser query article list page=${page}`);
    res.json({
        message: "query success",
        articleList: []
    }).end();
});

module.exports = router;