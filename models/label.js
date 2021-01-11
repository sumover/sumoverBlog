const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "articleId"
    },
    labelInfo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "labelInfo"
    }
  };
  const options = {
    tableName: "label",
    comment: "",
    indexes: []
  };
  const LabelModel = sequelize.define("label_model", attributes, options);
  return LabelModel;
};