import express from 'express';
import { Follow, Users } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const profileRoutes = express.Router();

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
  Follow.followUser);

// Unfollow a particular user
profileRoutes.delete('/profiles/:username/follow',
  AuthenticateUser.verifyUser,
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
  Users.getUser);

export default profileRoutes;
