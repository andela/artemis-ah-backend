import express from 'express';
import { authUser } from '../controllers';

const authRoute = express.Router();

authRoute.post('/users', authUser.signupUser);
authRoute.get('/users/verifyemail', authUser.verifyUserEmail);

export default authRoute;
