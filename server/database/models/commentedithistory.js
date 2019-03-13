export default (sequelize, DataTypes) => {
  const CommentEditHistory = sequelize.define('CommentEditHistory', {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previousComment: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  CommentEditHistory.associate = (models) => {
    const { ArticleComment } = models;

    CommentEditHistory.belongsTo(ArticleComment, {
      foreignKey: 'commentId',
    });
  };
  return CommentEditHistory;
};
