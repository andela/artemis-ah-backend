export default (sequelize, DataTypes) => {
  const ArticleClap = sequelize.define('ArticleClap', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clap: {
      type: DataTypes.BOOLEAN,
    }
  }, {});
  ArticleClap.associate = (models) => {
    // associations can be defined here
    const { User, Article } = models;

    ArticleClap.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    ArticleClap.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return ArticleClap;
};
