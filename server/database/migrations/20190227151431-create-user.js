import dotenv from 'dotenv';

dotenv.config();

export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'n/a'
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: process.env.DEFAULT_PROFILE_IMAGE
    },
    verifiedEmail: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'user'
    },
    emailNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    inAppNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
