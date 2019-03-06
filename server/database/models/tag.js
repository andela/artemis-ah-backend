export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = (models) => {
    // associations can be defined here
    Tag.hasMany(models.Article, {
      foreignKey: 'tagId',
      as: 'articles',
      onDelete: 'CASCADE'
    });
  };
  return Tag;
};
