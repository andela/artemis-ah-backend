import express from 'express';
import { Profile } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const profileRoutes = express.Router();

// Fetch all users following you
profileRoutes.get(
  '/profiles/followers',
  AuthenticateUser.verifyUser,
  Profile.fetchFollowers
);

// Fetch all users your're following
profileRoutes.get(
  '/profiles/following',
  AuthenticateUser.verifyUser,
  Profile.fetchFollowing
);

// Follow a particular user
profileRoutes.post(
  '/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  Profile.followUser
);

// Unfollow a particular user
profileRoutes.delete(
  '/profiles/:username/follow',
  AuthenticateUser.verifyUser,
  Profile.unfollowUser
);

export default profileRoutes;
