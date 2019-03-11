import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import app from '../app';
import { HelperUtils } from '../utils';

dotenv.config();
chai.use(chaiHttp);

let token1 = '';
let token2 = '';
const email1 = 'mcemie4eva@gmail.com';
const email2 = 'ireporter18@gmail.com';
const followUserUrl = '/api/profiles';
const unfollowUserURL = '/api/profiles';
const getUsersFollowersURL = '/api/profiles/followers';
const getUsersFollowingURL = '/api/profiles/following';
const signupURL = '/api/users';
const verifyURL1 = `/api/users/verifyemail?email=${email1}&hash=${HelperUtils.hashPassword(email1)}`;
const verifyURL2 = `/api/users/verifyemail?email=${email2}&hash=${HelperUtils.hashPassword(email2)}`;

describe('Test user follow and unfollow on user profile endpoint', () => {
  it(`Insert user ${email1}`, (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'Emie',
        lastname: 'Mark',
        email: 'mcemie4eva@gmail.com',
        username: 'Mekus',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        expect(res.status).to.equal(201);
        token1 = token;
        done();
      });
  });

  it(`verify email ${email1}`, (done) => {
    chai
      .request(app)
      .get(verifyURL1)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it(`Insert user ${email2}`, (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'iReport',
        lastname: 'Everything',
        email: 'ireporter18@gmail.com',
        username: 'iSeeiReport',
        password: '12345678'
      })
      .end((err, res) => {
        const { token } = res.body.user;
        expect(res.status).to.equal(201);
        token2 = token;
        done();
      });
  });

  it(`verify email ${email2}`, (done) => {
    chai
      .request(app)
      .get(verifyURL2)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('It should return a 201 if a user is been followed successfully', (done) => {
    chai
      .request(app)
      .post(`${followUserUrl}/iSeeiReport/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you just followed iSeeiReport');
        done();
      });
  });

  it('It should return a 403 if you are already following a user', (done) => {
    chai
      .request(app)
      .post(`${followUserUrl}/iSeeiReport/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you are already following iSeeiReport');
        done();
      });
  });

  it('It should return a 403 if a user tries to follow his/her self', (done) => {
    chai
      .request(app)
      .post(`${followUserUrl}/Mekus/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you cannot follow yourself');
        done();
      });
  });

  it('It should return a 403 if a user tries to unfollow his/her self', (done) => {
    chai
      .request(app)
      .delete(`${unfollowUserURL}/Mekus/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you cannot unfollow yourself');
        done();
      });
  });

  it('It should return a 200 if a user gets his/her followers successfully', (done) => {
    chai
      .request(app)
      .get(getUsersFollowersURL)
      .set('authorization', `Bearer ${token2}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('these are your followers');
        done();
      });
  });

  it('It should return a 200 if nobody is following a user', (done) => {
    chai
      .request(app)
      .get(getUsersFollowersURL)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('nobody is currently following you');
        done();
      });
  });

  it('It should return a 200 if a user gets all the users they are following', (done) => {
    chai
      .request(app)
      .get(getUsersFollowingURL)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('people you are following');
        done();
      });
  });

  it("It should return a 200 if a user isn't following anyone", (done) => {
    chai
      .request(app)
      .get(getUsersFollowingURL)
      .set('authorization', `Bearer ${token2}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you are not following anyone');
        done();
      });
  });

  it('It should return a 200 if a user has been unfollowed', (done) => {
    chai
      .request(app)
      .delete(`${unfollowUserURL}/iSeeiReport/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('iSeeiReport has been unfollowed');
        done();
      });
  });

  it("It should return 404 if user isn't found", (done) => {
    chai
      .request(app)
      .delete(`${unfollowUserURL}/iSeeiReport/follow`)
      .set('authorization', `Bearer ${token1}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user not found');
        done();
      });
  });
});
