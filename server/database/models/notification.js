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
      type: DataTypes.TEXT
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});
  Notification.associate = () => {
    // associations can be defined here
  };
  return Notification;
};
