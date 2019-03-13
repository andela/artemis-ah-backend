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
    const { Notification } = models;

    UserNotification.belongsTo(Notification, {
      foreignKey: 'notificationId',
    });
  };
  return UserNotification;
};
