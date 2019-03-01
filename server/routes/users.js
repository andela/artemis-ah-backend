import express from 'express';
import { Users } from '../controllers';

const authRoute = express.Router();

authRoute.post('/users', Users.signupUser);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);

export default authRoute;
