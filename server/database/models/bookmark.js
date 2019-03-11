export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    articleId: {
      type: DataTypes.INTEGER,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      defaultValue: false
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Bookmark.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
