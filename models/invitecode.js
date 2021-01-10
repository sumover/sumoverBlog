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
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "code"
    },
    inviteBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "inviteBy"
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "0000-00-00",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createDate"
    }
  };
  const options = {
    tableName: "invitecode",
    comment: "",
    indexes: []
  };
  const InvitecodeModel = sequelize.define("invitecode_model", attributes, options);
  return InvitecodeModel;
};