export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: {
      type: DataTypes.STRING
    },
    metaId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
  }, {});
  Notification.associate = (models) => {
    const { UserNotification } = models;

    Notification.hasMany(UserNotification, {
      foreignKey: 'id'
    });
  };
  return Notification;
};
