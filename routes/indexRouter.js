var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});

//  service import
const articleService = require('../services/ArticleService');

/* GET home page. */
router.get('/',
    async (req, res, next) => {
        res.render('index', {
            title: '猫窝大门',
            isIndex: true
        });
    });

router.get('/about',
    async (req, res, next) => {
        res.render('about', {
            title: "猫窝说明",
            isAbout: true
        });
    });

router.get('/archives', urlEncodeParser,
    /**
     * 档案馆页面(archive)
     * 从hexo那抄来的.
     * 按理说这个页面应该算是静态的, 以后成动态的再说 = =
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var tagCloud = await articleService.tagCloudGenerator();
        var articleListGroupByTime = await articleService.articleTimeline();

        res.render('archives', {
            title: "archives",
            tagCloud: tagCloud,
            articleTimeList: articleListGroupByTime,
            isArchives: true
        });
    });

router.get('/tag', urlEncodeParser,
    /**
     * 以标签为分类的静态索引页面
     *
     * url举例: {{baseURL}}/tag?t=sql
     *
     * 无参查询时, 跳转至list页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var tag = req.query.tag;
        if (tag === "" || tag === undefined) {
            res.redirect('/article');
            return
        }

        res.render('classifyByTag', {
            title: `archives|${tag}`,
            tag: tag,
            articleList: await articleService.queryArticleByLabel(tag),
            isArchives: true
        });
    });

router.get('/date', urlEncodeParser,
    /**
     * 以日期为分类的静态索引页面
     *
     * url举例
     * > {{baseURL}}/date?date=2020-1-1
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var _date = req.query.date;

        res.render('classifyByDate', {
            title: `archives|${_date}`,
            date: _date,
            articleList: await articleService.queryArticleByDate(_date),
            isArchives: true
        });
    });


module.exports = router;
