export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.STRING,
    primaryImageUrl: DataTypes.STRING,
    totalClaps: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    tagId: DataTypes.INTEGER
  }, {});
  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      as: 'category'
    });
  };
  return Article;
};
