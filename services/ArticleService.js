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
const marked = require('marked-katex');
const katex = require('katex');

module.exports = {
    /**
     * 获取文章内容的HTML文本
     * @param aid : 文章id
     * @returns {Promise<string|null>} : 文章的HTML文本
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
            gfm: false,
            tables: true,
            breaks: false,
            mangle: true,
            pedantic: false,
            sanitize: false,
            smartLists: false,
            smartypants: false,
            kaTex: katex
        });
        if (typeof (articleRes.articleDetail) === "undefined" || articleRes.articleDetail === null) return null;
        else return marked(articleRes.articleDetail);
    },

    /**
     * 获取单个文章实体
     * 文章不存在时返回"no article"
     * @param aid : 文章id
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
     * @returns {Promise<[article]>}
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
     * @returns {Promise<Number>}
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
     * @returns {Promise<[label]>}
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
        return articleSearchRes.sort((a, b) => {
            if (a.readCount > b.readCount) return -1;
            else if (a.readCount < b.readCount) return 1;
            else return 0;
        });
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
            group: 'labelInfo'
        }).catch(err => {
            console.log(err);
        });

        return labelList.sort((l1, l2) => {
            if (l1.labelTimes > l2.labelTimes) return -1;
            else if (l1.labelTimes < l2.labelTimes) return 1;
            else return 0;
        });
    },
    /**
     * 生成文章的时间轴数据结构
     * @returns {Promise<[{
     *     time: string,
     *     articleList:[{
     *         articleId:Number,
     *         title:string
     *     }]
     * }]>}
     */
    articleTimeline: async () => {
        var articleListOrigin = await ArticleModel.findAll({
            order: [
                ['createTime', 'DESC'],
            ]
        });
        if (articleListOrigin.length === 0) return [];
        var resArticleList = [];
        resArticleList.push({
            time: moment(Number(articleListOrigin[0].createTime)).format("YYYY-MM-DD"),
            articleList: []
        });
        for (var article of articleListOrigin) {
            if (article.showStatus !== "show") continue;
            //  get cur iter `article` createTime format to YYYY-MM-DD
            var curTime = moment(Number(article.createTime)).format("YYYY-MM-DD");
            //  if cur time is different to the last time of resArticleList
            if (resArticleList[resArticleList.length - 1].time !== curTime) {
                //  add new articleList
                resArticleList.push({
                    time: curTime,
                    articleList: []
                });
            }
            // add the Entry into the last List of resArticleList
            resArticleList[resArticleList.length - 1].articleList.push({
                articleId: article.id,
                title: article.title
            });
        }
        return resArticleList;
    },
    /**
     * 根据标签查询文章列表.
     * @returns {Promise<[{
     *     articleId: number,
     *     title:string,
     *     createTime:string
     * }]>}
     */
    queryArticleByLabel: async (tag) => {
        var articleIdListByTag = await LabelModel.findAll({
            where: {
                labelInfo: tag
            }
        });
        var articleList = [];
        for (var articleLabelMap of articleIdListByTag) {
            var aid = articleLabelMap.articleId;
            var article = await ArticleModel.findOne({where: {id: aid}});
            if (article === null) continue;
            if (article.showStatus !== "show") continue;
            articleList.push({
                articleId: aid,
                title: article.title,
                createTime: article.createTime
            });
        }
        return articleList.sort((a, b) => {
            if (a.createTime > b.createTime) return 1;
            else if (a.createTime < b.createTime) return -1;
            else return 0;
        }).map(value => {
            return {
                articleId: value.articleId,
                title: value.title,
                createTime: moment(Number(value.createTime)).format("YYYY-MM-DD")
            };
        });
    },
    /**
     * 根据日期查询文章列表
     * @param _date 日期
     * @returns {Promise<[]>} 文章列表
     */
    queryArticleByDate: async (_date) => {
        var articleList = await ArticleModel.findAll();
        var articleRes = [];
        for (var article of articleList) {
            if (article.showStatus !== "show") continue;
            var createTime = moment(Number(article.createTime)).format("YYYY-MM-DD");
            if (createTime !== _date) continue;
            articleRes.push({
                articleId: article.id,
                title: article.title,
                createTime: createTime
            })
        }
        return articleRes;
    }
}