export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Follower.associate = (models) => {
    const { User } = models;

    Follower.belongsTo(User, {
      foreignKey: 'userId',
      as: 'following',
      onDelete: 'CASCADE'
    });

    Follower.belongsTo(User, {
      foreignKey: 'followerId',
      as: 'follower',
      onDelete: 'CASCADE'
    });
  };
  return Follower;
};
