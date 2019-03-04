export default {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Tags', [{
      name: 'Food'
    }, {
      name: 'Technology'
    }, {
      name: 'Art'
    }, {
      name: 'Finance'
    }, {
      name: 'Health'
    }], {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tags', null, {});
  }
};
