import express from 'express';
import { Admin } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const adminRoute = express.Router();

// Grant user admin priviledges
adminRoute.patch('/admin/:username/upgrade',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifySuperAdmin,
  AuthenticateUser.verifyUsername,
  Admin.upgradeUser);


// Remove user admin priviledges
adminRoute.patch('/admin/:username/downgrade',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifySuperAdmin,
  AuthenticateUser.verifyUsername,
  Admin.downgradeUser);

export default adminRoute;
