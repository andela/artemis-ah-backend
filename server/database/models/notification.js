export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: DataTypes.STRING,
    metaId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  Notification.associate = (models) => {
    // associations can be defined here
    const { UserNotification } = models;
    Notification.hasMany(UserNotification, {
      foreignKey: 'id',
    });
  };
  return Notification;
};
