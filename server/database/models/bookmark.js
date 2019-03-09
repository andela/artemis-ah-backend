export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleAuthor: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Bookmark.associate = (models) => {
    const { User, Article } = models;
    Bookmark.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Bookmark.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
