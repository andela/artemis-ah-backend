export default (sequelize, DataTypes) => {
  const UserNotification = sequelize.define('UserNotification', {
    userId: {
      type: DataTypes.INTEGER
    },
    notificationId: {
      type: DataTypes.INTEGER
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValues: false
    },
  }, {});
  UserNotification.associate = (models) => {
    // associations can be defined here
    const { User, Notification } = models;

    UserNotification.belongsTo(User, {
      foreignKey: 'userId'
    });
    UserNotification.belongsTo(Notification, {
      foreignKey: 'notificationId'
    });
  };
  return UserNotification;
};
