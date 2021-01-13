const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
//  import model
const ArticleModel = require("../models/article")(Sequelize, DataTypes);
const LabelModel = require('../models/label')(Sequelize, DataTypes);
// util import
const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');
const marked = require('marked');

module.exports = {
    /**
     * 获取文章内容的HTML文本
     * @param aid : 文章id
     * @returns {Promise<*|null>} : 文章的HTML文本
     */
    fetchArticleDetail: async (aid) => {
        var articleRes = await ArticleModel.findOne({
            where: {
                id: aid
            }
        });
        if (articleRes === null) return null;
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
        });
        if (typeof (articleRes.articleDetail) === "undefined" || articleRes.articleDetail === null) return null;
        else return marked(articleRes.articleDetail);
    },

    /**
     * 获取单个文章实体
     * 文章不存在时返回"no article"
     * @param aid
     * @returns {Promise<string|*>}
     */
    fetchArticle: async (aid) => {
        var articleRes = await ArticleModel.findAll({
            where: {
                id: aid
            }
        });

        if (articleRes.length === 0) return "no article";
        else return articleRes[0];
    },

    /**
     * 获取文章列表, 范围为[(index-1)*page, index*page]
     * @param index
     * @param step
     * @returns {Promise<[]>}
     */
    queryArticleLists: async (index, step) => {
        var beginIndex = step * (index - 1);
        var endIndex = step * index;
        var articleListRes = await ArticleModel.findAll({
            order: ['createTime']
        });

        var articleList = [];
        for (let i = beginIndex; i < Math.min(endIndex, articleListRes.length); ++i) {
            if (articleListRes[i].showStatus !== 'show') continue;
            articleList.push(articleListRes[i]);
        }
        return articleList;
    },

    /**
     * 获取文章数量
     * @returns {Promise<*>}
     */
    getArticleLength: async () => {
        var res = await ArticleModel.count();
        return res;
    },

    /**
     * 增加文章阅读数
     * @param articleId
     * @returns {Promise<void>}
     */
    articleReadPlus: async (articleId) => {
        var article = await ArticleModel.findOne({
            where: {
                id: articleId
            }
        });
        console.log(`article have read ${article.readCount + 1} times`);
        await ArticleModel.update({readCount: article.readCount + 1}, {
            where: {
                id: articleId
            }
        });
    },
    /**
     * 获取某文章的标签列表
     * @param articleId
     * @returns {Promise<[]>}
     */
    queryArticleLabelList: async (articleId) => {
        var labels = await LabelModel.findAll({
            where: {
                articleId: articleId
            }
        });
        var labelRes = [];
        for (var label of labels) {
            labelRes.push(label.labelInfo);
        }
        return labelRes;
    },
    /**
     * 搜索引擎.jpg
     * @param tokenWord
     * @returns {Promise<[Article]>}
     */
    queryArticleByToken: async (tokenWord) => {
        var articleSearchRes = [];
        for (var article of await ArticleModel.findAll()) {
            if (article.showStatus !== "show") continue;
            var articleTags = await LabelModel.findAll({
                where: {
                    articleId: article.id
                }
            });
            const _match = (_tokenWord) => {
                for (const label of articleTags) {
                    if (label.labelInfo === _tokenWord) return true;
                }
                return false;
            };
            if (article.title.includes(tokenWord) || _match(tokenWord)) {
                articleSearchRes.push({
                    id: article.id,
                    title: article.title,
                    createTime: moment(Number(article.createTime)).format("YYYY-MM-DD"),
                    readCount: article.readCount,
                    tags: articleTags
                });
            }
        }
        return articleSearchRes;
    },
    /**
     * 查询所有的标签
     * @returns {Promise<[{
     *     labelInfo:string
     *     labelTimes:Number
     * },]>}:
     */
    tagCloudGenerator: async () => {
        var labelList = await LabelModel.findAll({
            attributes: [
                'labelInfo',
                [Sequelize.fn('COUNT', Sequelize.col('labelInfo')), 'labelTimes']
            ],
            group: 'labelInfo',
            order: ['labelTimes',],
        });
        return labelList;
    },
    /**
     * 生成文章的时间轴数据结构
     * @returns {Promise<[{
     *     time: string,
     *     articleList:[{article}]
     * }]>}
     */
    articleTimeline: async () => {

    }
}