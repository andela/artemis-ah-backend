import express from 'express';
import { Users } from '../controllers';

const authRoute = express.Router();

authRoute.post('/users', Users.signupUser);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);
authRoute.post('/users/reset-password', Users.resetPasswordEmail);
authRoute.patch('/users/reset-password', Users.resetPassword);

export default authRoute;
