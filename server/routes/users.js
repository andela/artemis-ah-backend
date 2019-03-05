import express from 'express';
import { Users } from '../controllers';
import passport from '../config/passport';

const authRoute = express.Router();

authRoute.post('/users', Users.signupUser);
authRoute.get('/users/verifyemail', Users.verifyUserEmail);
authRoute.post('/users/reset-password', Users.resetPasswordEmail);
authRoute.patch('/users/reset-password', Users.resetPassword);
authRoute.get('/users/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

authRoute.get('/users/auth/google/redirect',
  passport.authenticate('google', { session: false }),
  Users.socialLogin);
authRoute.get('/users/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  }));

authRoute.get('/users/auth/facebook/redirect',
  passport.authenticate('facebook', { session: false }),
  Users.socialLogin);

authRoute.get('/users/auth/twitter',
  passport.authenticate('twitter', {
    scope: ['include_email=true']
  }));

authRoute.get('/users/auth/twitter/redirect',
  passport.authenticate('twitter', { session: false }),
  Users.socialLogin);

export default authRoute;
