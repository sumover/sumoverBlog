const marked = require('marked');
const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const ArticleModel = require("../models/article")(Sequelize, DataTypes);

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
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
        });
        return marked(articleRes[0].articleDetail);
    },
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
        for (let i = beginIndex; i < Math.min(endIndex, articleListRes.length); ++i) articleList.push(articleListRes[i]);
        return articleList;
    },
    getArticleLength: async () => {
        var res = await ArticleModel.count();
        return res;
    }
}