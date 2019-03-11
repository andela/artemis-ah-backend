export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [{
      firstname: 'admin',
      lastname: 'admin',
      username: 'admin',
      email: 'ayooluwabayo@gmail.com',
      password: '$2a$08$G/5b9Oq3rla2pjb/imcZ8u.m0EQlbKfG.gwGJG6iOfPVm9rZqNVmC',
      verifiedEmail: true,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'ayo',
      lastname: 'ayo',
      username: 'ayo',
      email: 'ayo-oluwa.adebayo@andela.com',
      password: '$2a$08$G/5b9Oq3rla2pjb/imcZ8u.m0EQlbKfG.gwGJG6iOfPVm9rZqNVmC',
      verifiedEmail: true,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'bayo',
      lastname: 'bayo',
      username: 'bayo',
      email: 'uniqueayo@yahoo.com',
      password: '$2a$08$G/5b9Oq3rla2pjb/imcZ8u.m0EQlbKfG.gwGJG6iOfPVm9rZqNVmC',
      verifiedEmail: true,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
