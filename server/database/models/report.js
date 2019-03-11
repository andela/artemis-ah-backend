export default (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    report: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Unresolved',
      allowNull: false
    }
  }, {});
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Report.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Report;
};
