import dotenv from 'dotenv';

dotenv.config();
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
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
        defaultValue: process.env.DEFAULT_PROFILE_IMAGE
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
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {});
  User.associate = (models) => {
    const {
      Follower,
      Bookmark,
      Article,
      ArticleClap,
      ArticleComment,
      ArticleCommentLike,
      History,
      Report,
      UserNotification
    } = models;

    User.belongsToMany(User, {
      through: Follower,
      foreignKey: 'userId',
      as: 'following'
    });

    User.belongsToMany(User, {
      through: Follower,
      foreignKey: 'followerId',
      as: 'follower'
    });

    User.hasMany(ArticleClap, {
      foreignKey: 'id',
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

    User.hasMany(Bookmark, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    User.hasMany(UserNotification, {
      foreignKey: 'id'
    });
  };
  return User;
};
