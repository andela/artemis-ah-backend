export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
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
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://res.cloudinary.com/shaolinmkz/image/upload/v1544370726/iReporter/avatar.png'
    },
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'id',
    });
    User.hasMany(models.ArticleComment, {
      foreignKey: 'id',
    });
    User.hasMany(models.ArticleCommentLike, {
      foreignKey: 'id',
    });
  };
  return User;
};
