export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = (models) => {
    // associations can be defined here
    Tag.hasMany(models.Article, {
      foreingKey: 'tagId',
      as: 'articles'
    });
  };
  return Tag;
};
