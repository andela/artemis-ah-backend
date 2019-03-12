import { HelperUtils } from '../../utils';

const password = 'admin123456';

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [{
      firstname: 'admin',
      lastname: 'admin',
      username: 'admin',
      email: 'ayooluwabayo@gmail.com',
      password: HelperUtils.hashPassword(password),
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
      password: HelperUtils.hashPassword(password),
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
      password: HelperUtils.hashPassword(password),
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
