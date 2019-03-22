import express from 'express';
import { Users } from '../controllers';
import { ValidateUser, AuthenticateUser, ValidatePasswordReset } from '../middlewares';
import passport from '../config/passport';

const authRoute = express.Router();

// signup a new user
authRoute.post('/users',
  ValidateUser.validateMethods(),
  ValidateUser.validateUserDetails,
  Users.signupUser);

// login an existing user
authRoute.post('/users/login',
  ValidateUser.validateLoginFields(),
  ValidateUser.validateLogin,
  Users.loginUser);

// verifies new users email
authRoute.get('/users/verifyemail', Users.verifyUserEmail);

// Sends Password reset link to a verified users email address
authRoute.post('/users/reset-password', Users.resetPasswordEmail);

// Resets password
authRoute.patch('/users/reset-password',
  ValidatePasswordReset.checkResetPassword(),
  ValidatePasswordReset.checkForErrors,
  Users.resetPassword);

authRoute.get('/users/auth/google',
  passport.authenticate('google', {
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

// Get users stats
authRoute.get('/users/stats',
  AuthenticateUser.verifyUser,
  Users.getStats);

// Send Timed Reactivation Link To Users Email
authRoute.post('/users/reactivate', Users.sendReactivationLink);

// Reactivate users account
authRoute.get('/users/reactivate', Users.reactivateUser);

export default authRoute;
