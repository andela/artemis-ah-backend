import express from 'express';
import { Follow, Users } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const profileRoutes = express.Router();

// Fetch all users
profileRoutes.get('/profiles',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  Follow.profileList);

// Fetch all users followers
profileRoutes.get('/profiles/:username/followers',
  AuthenticateUser.verifyUsername,
  Follow.fetchFollowers);

// Fetch all users following
profileRoutes.get('/profiles/:username/following',
  AuthenticateUser.verifyUsername,
  Follow.fetchFollowing);

// Follow a particular user
profileRoutes.post('/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  AuthenticateUser.verifyUsername,
  Follow.followUser);

// Unfollow a particular user
profileRoutes.delete('/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  AuthenticateUser.verifyUsername,
  Follow.unfollowUser);

// Get current profile
profileRoutes.get('/user',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  Users.getUser);

// Update user profile
profileRoutes.put('/user',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  Users.updateUser);

// Get user profile
profileRoutes.get('/profiles/:username',
  AuthenticateUser.identifyUser,
  AuthenticateUser.verifyUsername,
  Users.getUser);

export default profileRoutes;
