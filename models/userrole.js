const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "userid"
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "role"
    }
  };
  const options = {
    tableName: "userrole",
    comment: "",
    indexes: []
  };
  const UserroleModel = sequelize.define("userrole_model", attributes, options);
  return UserroleModel;
};