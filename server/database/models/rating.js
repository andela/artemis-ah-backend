export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL,
  }, {});
  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Rating.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Rating;
};
