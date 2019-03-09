export default (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    readingTime: DataTypes.STRING,
  }, {});
  History.associate = (models) => {
    // associations can be defined here
    History.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    History.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return History;
};
