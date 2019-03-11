export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.TEXT,
    primaryImageUrl: DataTypes.STRING,
    totalClaps: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    tagId: DataTypes.INTEGER,
    rating: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: false
    },
  }, {});
  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      onDelete: 'CASCADE'
    });
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Article.hasMany(models.ArticleComment, {
      foreignKey: 'id',
    });
    Article.hasMany(models.Report, {
      foreignKey: 'articleId',
      as: 'reports'
    });
    Article.hasMany(models.ArticleClap, {
      foreignKey: 'articleId',
      as: 'claps'
    });
  };
  return Article;
};
