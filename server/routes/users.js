import express from 'express';
import { Users } from '../controllers';
import AuthenticateUser from '../middlewares/AuthenticateUser';

const authRoute = express.Router();

authRoute.post('/users', Users.signupUser);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);
authRoute.get('/user', AuthenticateUser.verifyUser, Users.getUser);
authRoute.put('/user', AuthenticateUser.verifyUser, Users.updateUser);
authRoute.get('/profiles/:username', Users.getUser);

export default authRoute;
