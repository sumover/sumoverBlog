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
    /**
     * 获取文章评论列表
     * @param articleId 文章id
     * @returns {Promise<[]>}
     */
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
                publishedTime: moment(Number(com.publishedTime)).format("YYYY-MM-DD HH:mm"),
                publisher: (publishedUser === null) ? "用户已注销" : publishedUser.username,
            });
        }
        return commentListRes;
    },
    /**
     * 增加一个评论
     * @param articleId         文章id
     * @param userId            用户id
     * @param commentContent    评论内容
     * @returns {Promise<{publishedTime: string, publisher, content}>}  刚刚添加的评论实体
     */
    publishComment: async (articleId, userId, commentContent) => {
        var commentCreated = await CommentModel.create({
            articleId: articleId,
            userId: userId,
            content: commentContent,
            publishedTime: Date.now()
        });
        return {
            content: commentContent,
            publishedTime: moment(Number(commentCreated.publishedTime)).format("YYYY-MM-DD HH:mm"),
            publisher: (await UserModel.findOne({where: {id: userId}})).username
        };
    }
}