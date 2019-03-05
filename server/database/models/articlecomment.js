export default (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define('ArticleComment', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    totalLikes: DataTypes.INTEGER
  }, {});
  ArticleComment.associate = (models) => {
    ArticleComment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    ArticleComment.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
  };
  return ArticleComment;
};
