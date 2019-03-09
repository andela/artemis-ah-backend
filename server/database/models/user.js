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
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {});
  User.associate = (models) => {
    const { Follower, Bookmark, Article, ArticleClap } = models;
    User.belongsToMany(User, {
      through: Follower,
      foreignKey: 'userId',
      as: 'following'
    });

    User.belongsToMany(User, {
      through: Follower,
      foreignKey: 'followerId',
      as: 'followers'
    });

    User.hasMany(ArticleClap, {
      foreignKey: 'userId',
    });

    // Relations for articles.
    User.hasMany(models.Article, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ArticleComment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ArticleCommentLike, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });

    User.belongsToMany(Article, {
      through: 'Bookmark',
      foreignKey: 'userId'
    });

    User.hasMany(models.History, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });

    User.belongsToMany(models.Article, {
      through: 'ArticlaClaps',
      foreignKey: 'userId',
      as: 'clapped'
    });

    User.hasMany(Bookmark, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};
