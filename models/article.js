const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "title"
    },
    createTime: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createTime"
    },
    articleDetail: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "articleDetail"
    },
    showStatus: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "show",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "showStatus"
    },
    readCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "readCount"
    }
  };
  const options = {
    tableName: "article",
    comment: "",
    indexes: []
  };
  const ArticleModel = sequelize.define("article_model", attributes, options);
  return ArticleModel;
};