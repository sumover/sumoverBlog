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
}
