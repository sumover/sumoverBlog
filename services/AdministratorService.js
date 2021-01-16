const {QueryTypes, DataTypes} = require('sequelize');
const db = require("../db");
const Sequelize = db.sequelize;
//  model import
const ArticleModel = require('../models/article')(Sequelize, DataTypes);
const CommentModel = require('../models/comment')(Sequelize, DataTypes);
const InviteCodeModel = require("../models/invitecode")(Sequelize, DataTypes);
const LabelModel = require('../models/label')(Sequelize, DataTypes);
const UserModel = require("../models/user")(Sequelize, DataTypes);
const UserRoleModel = require('../models/userrole')(Sequelize, DataTypes);

// util import
const moment = require('moment');
const crypto = require('crypto');
const appConfig = require('../app-config');

module.exports = {
    /**
     * 上传文章
     * @param title : String 标题
     * @param content : String 正文
     * @param labels : [String] 标签
     * @returns {Promise<ArticleModel>}
     */
    uploadArticle: async (title, content, labels) => {
        var articleCreate = await ArticleModel.create({
            title: title,
            createTime: Date.now(),
            articleDetail: content
        });
        for (var label of labels) {
            await LabelModel.create({
                articleId: articleCreate.id,
                labelInfo: label
            });
        }
        return articleCreate;
    },
    /**
     * 用户拉满(逻辑)
     * @returns {Promise<[UserModel]>}
     */
    getAllUser: async () => {
        const allUserList = await UserModel.findAll();
        var ListRes = [];
        for (const user of allUserList) {
            // 找一下inviteCode是啥
            var inviteCode = await InviteCodeModel.findOne({
                where: {
                    code: user.invitecode
                }
            });
            // 找出是谁邀请的
            var inviter = await UserModel.findOne({
                where: {
                    id: inviteCode.inviteBy
                }
            });
            ListRes.push({
                id: user.id,
                username: user.username,
                lastLoginTime: moment(Number(user.last_login_time)).format("YYYY-MM-DD HH:mm:ss"),
                registerTime: moment(Number(user.register_time)).format("YYYY-MM-DD HH:mm:ss"),
                invitedBy: inviter.username
            });
        }
        return ListRes;
    },
    /**
     * 文章拉满
     *
     * @returns {Promise<[{
     *     id: Number,
     *     title:String,
     *     publishedTime:String,
     *     status:String,
     *     readCount:Number
     * }]>}
     */
    getAllArticle: async () => {
        // 拉满
        const allArticleList = await ArticleModel.findAll();
        var listRes = [];
        for (const article of allArticleList) {
            listRes.push({
                id: article.id,
                title: article.title,
                publishedTime: moment(Number(article.createTime)).format("YYYY-MM-DD HH:mm:ss"),
                status: article.showStatus,
                readCount: article.readCount
            });
        }
        return listRes;
    },

    /**
     * 评论拉满
     * @returns {Promise<>}
     */
    getAllComment: async () => {
        // |id|articleId|articleTitle|publicUser|detail|publishedTime|
        var allCommentList = await CommentModel.findAll({
            order: [
                ['publishedTime', 'DESC']
            ]
        });
        var commentRes = [];
        for (const comment of allCommentList) {
            //  把评论整过来
            var article = await ArticleModel.findOne({where: {id: comment.articleId}});
            //  把发布者整过来
            var publishUser = await UserModel.findOne({where: {id: comment.userId}});

            commentRes.push({
                id: comment.Id,
                articleId: article.id,
                articleTitle: article.title,
                publishUser: publishUser.username,
                detail: comment.content,
                publishedTime: moment(Number(comment.publishedTime)).format("YYYY-MM-DD HH:mm:SS")
            });
        }
        return commentRes;
    },
    /**
     * 改变文章显示状态
     * @param aid
     * @returns {Promise<{publishedTime: string, id: Number, title: String, readCount: Number, status: (string|*)}>}
     */
    changeStatus: async (aid) => {
        var article = await ArticleModel.findOne({where: {id: aid}});
        if (article.showStatus === "show") {
            article.showStatus = "close";
        } else {
            article.showStatus = "show";
        }
        await ArticleModel.update({showStatus: article.showStatus}, {
            where: {id: article.id}
        });
        article = await ArticleModel.findOne({where: {id: aid}});
        return {
            id: article.id,
            title: article.title,
            publishedTime: moment(Number(article.createTime)).format("YYYY-MM-DD HH:mm:ss"),
            status: article.showStatus,
            readCount: article.readCount
        };
    },
    deleteComment: async (cid) => {
        await CommentModel.destroy({where: {Id: cid}});
    }
}
