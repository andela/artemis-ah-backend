export default (sequelize, DataTypes) => {
  const UserPushNotificationChannel = sequelize.define('UserPushNotificationChannel',
    {
      userId: DataTypes.INTEGER,
      channel: DataTypes.STRING
    },
    {});
  UserPushNotificationChannel.associate = () => {
    // associations can be defined here
  };
  return UserPushNotificationChannel;
};
