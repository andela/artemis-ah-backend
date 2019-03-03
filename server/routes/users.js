import express from 'express';
import { Users } from '../controllers';

const userRoutes = express.Router();

// Signup/Register a new user
userRoutes.post('/users', Users.signupUser);

// Verify a new users email
userRoutes.get('/users/verifyemail', Users.verifyUserEmail);

export default userRoutes;
