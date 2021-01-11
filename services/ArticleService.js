const marked = require('marked');
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


module.exports = {
    fetchArticleDetail: async (aid) => {
        var articleRes = await ArticleModel.findAll({
            where: {
                id: aid
            }
        });
        if (articleRes.length === 0) return null;
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
        return marked(articleRes[0].articleDetail);
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
    getArticleLength: async () => {
        var res = await ArticleModel.count();
        return res;
    },
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
    }

}