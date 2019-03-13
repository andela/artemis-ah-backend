import express from 'express';
import { Follow, Users } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const profileRoutes = express.Router();

// Fetch all users
profileRoutes.get('/profiles',
  AuthenticateUser.verifyUser,
  Follow.profileList);

// Fetch all users following you
profileRoutes.get('/profiles/followers',
  AuthenticateUser.verifyUser,
  Follow.fetchFollowers);

// Fetch all users your're following
profileRoutes.get('/profiles/following',
  AuthenticateUser.verifyUser,
  Follow.fetchFollowing);

// Follow a particular user
profileRoutes.post('/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyUsername,
  Follow.followUser);

// Unfollow a particular user
profileRoutes.delete('/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyUsername,
  Follow.unfollowUser);

// Get current profile
profileRoutes.get('/user',
  AuthenticateUser.verifyUser,
  Users.getUser);

// Update user profile
profileRoutes.put('/user',
  AuthenticateUser.verifyUser,
  Users.updateUser);

// Get user profile
profileRoutes.get('/profiles/:username',
  AuthenticateUser.verifyUsername,
  Users.getUser);

export default profileRoutes;
