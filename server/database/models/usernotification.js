export default (sequelize, DataTypes) => {
  const UserNotification = sequelize.define('UserNotification', {
    userId: DataTypes.INTEGER,
    notificationId: DataTypes.INTEGER
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
