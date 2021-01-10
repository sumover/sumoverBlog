const marked = require('marked');
const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
const ArticleModel = require("../models/article")(Sequelize, DataTypes);

const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');


module.exports = {
    fetchArticle: async (aid) => {
        var articleRes = await ArticleModel.findAll({
            where: {
                id: aid
            }
        });

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
    }
}