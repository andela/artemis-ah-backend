import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
// import HelperUtils from '../utils';
import app from '../app';

dotenv.config();

const signupURL = '/api/users';
const userURL = '/api/user';
const profileURL = '/api/profiles';
const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJBZGFlemUiLCJsYXN0bmFtZSI6Ik9kdXJ1a3dlIiwidXNlcm5hbWUiOiJtZW93d3d3d3ciLCJlbWFpbCI6ImRhaXp5b2R1cnVrd2VAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkMWtBNDh4SmtDSTQ4ME15d3c1TlBDdU1Ma1pnekxiMjZUZnQ3NDF0ZDVkdTl0ek1WcS5BMC4iLCJpYXQiOjE1NTE1MjAxODl9.aCGlw9rbj_PRTMhxQJE0kM1cSUzUbygfzVW8bjtNAUQ';
let userToken;
chai.use(chaiHttp);

describe('Get user data', () => {
  before('It should return a 201 and create a new user', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'obiora@gmail.com',
      username: 'john46',
      password: '1234567'
    };
    chai
      .request(app)
      .post(signupURL)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user created successfully');
        userToken = res.body.user.token;
        done();
      });
  });
  describe('Get current user', () => {
    it('It should return 200 if user exists', (done) => {
      chai
        .request(app)
        .get(userURL)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('user found');
          expect(res.body.user).to.be.a('object');
          done();
        });
    });
    it('It should return 401 if user is not authorized', (done) => {
      chai
        .request(app)
        .get(userURL)
        .set('Authorization', `Bearer ${wrongToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('object');
          done();
        });
    });

    it('It should return 401 if token is missing', (done) => {
      chai
        .request(app)
        .get(userURL)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('object');
          done();
        });
    });

    describe('Get user profile', () => {
      it('It should return 200 if user exists', (done) => {
        chai
          .request(app)
          .get(`${profileURL}/john45`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('user found');
            expect(res.body.user).to.be.a('object');
            done();
          });
      });

      it('It should return 404 if user is not found', (done) => {
        chai
          .request(app)
          .get(`${profileURL}/john70`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('user not found');
            done();
          });
      });
    });

    describe('Update user profile', () => {
      it('It should return 200 if user data is updated', (done) => {
        const data = {
          bio: 'John',
          image: 'new image'
        };
        chai
          .request(app)
          .put(userURL)
          .set('Authorization', `Bearer ${userToken}`)
          .send(data)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('user updated');
            expect(res.body.user).to.have.a('object');
            done();
          });
      });

      it('It should return 401 for unauthorized user', (done) => {
        chai
          .request(app)
          .get(userURL)
          .set('Authorization', `Bearer ${wrongToken}`)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('object');
            done();
          });
      });

      it('It should return 401 if token is missing', (done) => {
        chai
          .request(app)
          .get(userURL)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('object');
            done();
          });
      });
    });
  });
});
