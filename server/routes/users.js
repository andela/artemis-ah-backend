import express from 'express';
import { Users } from '../controllers';
import ValidateUser from '../middlewares/ValidateUser';

const authRoute = express.Router();

authRoute.post(
  '/users',
  ValidateUser.validateMethods(),
  ValidateUser.validateUserDetails,
  Users.signupUser
);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);

export default authRoute;
