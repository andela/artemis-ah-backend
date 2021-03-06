import dotenv from 'dotenv';
import { HelperUtils } from '../../utils';

dotenv.config();

const password = process.env.ADMIN_PASSWORD;

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
      role: 'user',
      active: true,
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
      role: 'user',
      active: true,
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
      role: 'user',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'obi',
      lastname: 'ora',
      username: 'obiora',
      email: 'nwabuzor.obiora@gmail.com',
      password: HelperUtils.hashPassword(password),
      verifiedEmail: true,
      isAdmin: false,
      role: 'user',
      active: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'Pre',
      lastname: 'Sident',
      username: process.env.SUPER_ADMIN_USERNAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: HelperUtils.hashPassword(process.env.SUPER_ADMIN_PASSWORD),
      verifiedEmail: true,
      isAdmin: true,
      role: 'superadmin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
