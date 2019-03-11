export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Tags',
      [
        {
          name: 'Food'
        },
        {
          name: 'Technology'
        },
        {
          name: 'Art'
        },
        {
          name: 'Finance'
        },
        {
          name: 'Health'
        }
      ],
      {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Tags', null, {});
  }
};
