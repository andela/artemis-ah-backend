import express from 'express';
import { Follow } from '../controllers';
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

export default profileRoutes;
