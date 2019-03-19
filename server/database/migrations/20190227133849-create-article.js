import dotenv from 'dotenv';

dotenv.config();

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      coverUrl: {
        type: Sequelize.STRING,
        defaultValue: process.env.DEFAULT_ARTICLE_COVER
      },
      totalClaps: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      slug: {
        type: Sequelize.STRING
      },
      tagId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tags',
          key: 'id',
          as: 'tagId'
        }
      },
      rating: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('Articles')
};
