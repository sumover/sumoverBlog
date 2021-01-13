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
            articleTimeList: articleListGroupByTime
        });
    });

router.get('/tag', urlEncodeParser,
    /**
     * 以标签为分类的静态索引页面
     * url举例: {{baseURL}}/tag?t=sql
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

        res.render('classifyByTag', {title: `archives|${tag}`});
    });

router.get('/date', urlEncodeParser,
    /**
     * 以日期为分类的静态索引页面
     * 共有三个参数: year, mouth, day
     * url举例:
     *  1.  查询某天(标准url):    {{baseURL}}/date?year=2020&mouth=1&day=1
     *  2.  根据format的字符串查询: {{baseURL}}/date?date=2020-1-1
     *  2.  查询某年:            {{baseURL}}/date?year=2020
     *  3.  查询某月:            {{baseURL}}/date?year=2020&mouth=1
     *  4.  无参数查询:跳转至list页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async (req, res, next) => {
        var year = req.query.year, mouth = req.query.mouth, day = req.query.day;

        res.render('classifyByDate',);
    });


module.exports = router;
