export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followee: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Follower.associate = (models) => {
    const { User } = models;

    Follower.belongsTo(User, {
      foreignKey: 'userId',
      as: 'follower',
      onDelete: 'CASCADE'
    });

    Follower.belongsTo(User, {
      foreignKey: 'followerId',
      as: 'following',
      onDelete: 'CASCADE'
    });
  };
  return Follower;
};
