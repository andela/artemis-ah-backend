export default (sequelize, DataTypes) => {
  const ArticleCommentLike = sequelize.define('ArticleCommentLike',
    {
      articleId: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {});
  ArticleCommentLike.associate = (models) => {
    ArticleCommentLike.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    ArticleCommentLike.belongsTo(models.ArticleComment, {
      foreignKey: 'commentId'
    });
  };
  return ArticleCommentLike;
};
