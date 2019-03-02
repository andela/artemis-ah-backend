export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.STRING,
    primaryImageUrl: DataTypes.STRING,
    totalClaps: DataTypes.INTEGER,
    slug: DataTypes.STRING,
  }, {});
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Article;
};
