export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Email already exists'
      },
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'n/a'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://res.cloudinary.com/shaolinmkz/image/upload/v1544370726/iReporter/avatar.png'
    },
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {});
  User.associate = (models) => {
    const { Follower } = models;
    User.hasMany(Follower, {
      foreignKey: 'userId',
      as: 'following'
    });

    User.hasMany(Follower, {
      foreignKey: 'followerId',
      as: 'followers'
    });
  };
  return User;
};
