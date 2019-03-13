export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentEditHistories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    previousComment: {
      type: Sequelize.TEXT,
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
  }),
  down: queryInterface => queryInterface.dropTable('CommentEditHistories')
};
