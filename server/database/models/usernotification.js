export default (sequelize, DataTypes) => {
  const UserNotification = sequelize.define('UserNotification',
    {
      userId: DataTypes.INTEGER,
      notificationId: DataTypes.INTEGER
    },
    {});
  UserNotification.associate = () => {
    // associations can be defined here
  };
  return UserNotification;
};
