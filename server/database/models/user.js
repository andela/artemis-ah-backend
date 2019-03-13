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
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false
    },
    emailNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    inAppNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
  }, {});
  User.associate = (models) => {
    const {
      Follower,
      Bookmark,
      Article,
      ArticleClap,
      ArticleComment,
      ArticleCommentLike,
      History,
      Report
    } = models;

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
    User.hasMany(Article, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.hasMany(ArticleComment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    User.hasMany(ArticleCommentLike, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });

    // Relations for reports.
    User.hasMany(Report, {
      foreignKey: 'userId',
      as: 'reports'
    });

    User.belongsToMany(Article, {
      through: 'Bookmark',
      foreignKey: 'userId'
    });

    User.hasMany(History, {
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
