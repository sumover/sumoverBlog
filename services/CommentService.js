const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
//  import model
const ArticleModel = require("../models/article")(Sequelize, DataTypes);
const CommentModel = require("../models/comment")(Sequelize, DataTypes);
const UserModel = require('../models/user')(Sequelize, DataTypes);
// util import
const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');

module.exports = {
    getArticleCommentList: async (articleId) => {
        var commentList = await CommentModel.findAll({
            where: {
                articleId: articleId
            },
            order: ['publishedTime'],
        });
        var commentListRes = [];
        for (var com of commentList) {
            var publishedUser = await UserModel.findOne({where: {id: com.userId}});
            commentListRes.push({
                content: com.content,
                publishedTime: moment(Number(com.publishedTime)).format("YYYY-MM-DD"),
                publisher: (publishedUser === null) ? "用户已注销" : publishedUser.username,
            });
        }
        return commentListRes;
    }
}