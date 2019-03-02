import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

const QueryURL = '?email=nwabuzor.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const invalidQueryURL = '?email=invalid.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const signupURL = '/api/users';
const resetPassword = '/api/users/reset-password';
const resetPasswordURL = '/api/users/reset-password' + QueryURL;
const invalidResetPasswordURL = '/api/users/reset-password' + invalidQueryURL;
const verifyURL = '/api/users/verifyemail' + QueryURL;
const invalidVerifyURL = '/api/users/verifyemail' + invalidQueryURL;


describe('Test signup endpoint and email verification endpoint', () => {
  it('It should return a 404 if user don\'t exist during email verification', (done) => {
    chai
      .request(app)
      .get(verifyURL)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user doesn\'t exist');
        done();
      });
  });

  it('It should return a 201 and create a new user', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'nwabuzor.obiora@gmail.com',
      username: 'john45',
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
        done();
      });
  });

  it('It should return 400 if email is not verified successfully', (done) => {
    chai
      .request(app)
      .get(invalidVerifyURL)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('invalid email');
        done();
      });
  });

  it('It should return 200 if email is verified successfully', (done) => {
    chai
      .request(app)
      .get(verifyURL)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('email verified successfully');
        done();
      });
  });
});

describe('Test reset password mail endpoint and password link endpoint', () => {
  it('It should return a 404 if user records not found', (done) => {
    const data = {email: 'ayo-oluwa.adebayo@andela.com'}
    chai
      .request(app)
      .post(resetPassword)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('user not found in our records');
        done();
      });
  });

  it('It should return a 200 if user email is found in the database', (done) => {
    const data = {email: 'nwabuzor.obiora@gmail.com'}
    chai
      .request(app)
      .post(resetPassword)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Please, verify password reset link in your email box');
        done();
      });
  });

  it('It should return a 400 if user passwords do not match', (done) => {
    const data = {newPassword: 'hello', confirmPassword: 'hell'}
    chai
      .request(app)
      .patch(resetPasswordURL)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('The supplied passwords do not match');
        done();
      });
  });

  it('It should return a 200 if user passwords match', (done) => {
    const data = {newPassword: 'hello', confirmPassword: 'hello'}
    chai
      .request(app)
      .patch(resetPasswordURL)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Password reset successful. Please, login using your new password.');
        done();
      });
  });

  it('It should return a 400 if reset link is invalid', (done) => {
    const data = {newPassword: 'hello', confirmPassword: 'hello'}
    chai
      .request(app)
      .patch(invalidResetPasswordURL)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Invalid password reset link');
        done();
      });
  });
});
