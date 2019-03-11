export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: DataTypes.STRING,
    metaId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  Notification.associate = () => {
    // associations can be defined here
  };
  return Notification;
};
