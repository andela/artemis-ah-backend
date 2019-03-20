export default {
  /* eslint no-unused-vars: "off" */
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('ArticleComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      highlighted: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'N/A',
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalLikes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
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
  down: queryInterface => queryInterface.dropTable('ArticleComments')
};
