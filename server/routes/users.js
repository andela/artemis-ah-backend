import express from 'express';
import { Users } from '../controllers';
import Auth from '../middlewares/auth';

const authRoute = express.Router();

authRoute.post('/users', Users.signupUser);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);
authRoute.get('/user', Auth, Users.getUser);
authRoute.put('/user', Auth, Users.updateUser);
authRoute.get('/profiles/:username', Users.getUser);

export default authRoute;
