import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportTwitter from 'passport-twitter';
import passportFacebook from 'passport-facebook';
import dotenv from 'dotenv';
import db from '../database/models';

const { User } = db;

const GoogleStrategy = passportGoogle.Strategy;
const TwitterStrategy = passportTwitter.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

dotenv.config();

let trustProxy = false;

if (process.env.DYNO) {
  trustProxy = true;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleReturnUrl = process.env.GOOGLE_RETURN_URL;
const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const twitterReturnUrl = process.env.TWITTER_RETURN_URL;
const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
const facebookReturnUrl = process.env.FACEBOOK_RETURN_URL;

/**
 * @description Function to increment the number added to the username (e.g bisi1 returns bisi2)
 * @param {string} username - username that failed validation because it wasnt unique
 * @returns {string} - new username
 */
export const generateNewUsername = (username) => {
  const letterPart = username.match(/\D+/g)[0];
  const numberPart = username.match(/\d+/g) ? username.match(/\d+/g)[0] : 0;
  return `${letterPart}${Number(numberPart) + 1}`;
};

/**
 * @description Function to check if a username is unique
 * @param {string} username - username to validate
 * @returns {string} - unique username
 */
export const validateUsername = async (username) => {
  try {
    const existingUser = await User.findOne({ where: { username } });
    return validateUsername(generateNewUsername(existingUser.dataValues.username));
  } catch (err) {
    return username;
  }
};
/**
 *
 * @param {string} email - User email
 * @param {string} firstname - User's firstname
 * @param {string} lastname - User's lastname
 * @param {string} username - User's username
 * @param {string} photo - Link to User's image
 * @param {callback} cb - Callback function\
 * @returns {method} - A callback function
 */
export const handleSocialLogin = async (email, firstname, lastname, username, photo, cb) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    return cb(null, {
      data: existingUser.dataValues
    });
  } catch (error) {
    try {
      const user = await User.create({
        email,
        firstname,
        lastname,
        username: username
          ? await validateUsername(username)
          : `${
            firstname
              ? await validateUsername(firstname.toLowerCase())
              : await validateUsername(email.split('@')[0].split('.')[0])
          }`,
        image: photo
      });
      return cb(null, { data: { ...user.dataValues, newUser: true } });
    } catch (err) {
      return cb(null, { error: 'Could not authenticate user' });
    }
  }
};

passport.use(new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: googleReturnUrl
},
(accessToken, refreshToken, profile, cb) => {
  const { name, emails, photos } = profile;
  handleSocialLogin(emails[0].value,
    name.givenName,
    name.familyName,
    null,
    photos[0].value,
    cb);
}));

passport.use(new TwitterStrategy({
  consumerKey: twitterConsumerKey,
  consumerSecret: twitterConsumerSecret,
  callbackURL: twitterReturnUrl,
  userProfileURL:
        'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  includeEmail: true,
  proxy: trustProxy
},
(token, tokenSecret, profile, cb) => {
  const { username, emails, photos } = profile;
  handleSocialLogin(emails[0].value, null, null, username, photos[0].value, cb);
}));

passport.use(new FacebookStrategy({
  clientID: facebookAppId,
  clientSecret: facebookAppSecret,
  callbackURL: facebookReturnUrl,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
(accessToken, refreshToken, profile, cb) => {
  const { displayName, photos, emails } = profile;
  const splitnames = displayName.split(' ');
  const firstname = splitnames[0];
  const lastname = splitnames.length > 1 ? splitnames[1] : '';
  handleSocialLogin(emails[0].value, firstname, lastname, null, photos[0].value, cb);
}));

export default passport;
