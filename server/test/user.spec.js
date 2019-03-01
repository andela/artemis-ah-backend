import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

const signupURL = '/api/users';
const verifyURL = '/api/users/verifyemail?email=nwabuzor.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const invalidVerifyURL = '/api/users/verifyemail?email=invalid.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';

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

describe('Social Login with Google', () => {
  it('should return the google authentication webpage', (done) => {
    chai
      .request(app)
      .get(`${signupURL}/auth/google`)
      .end((err, res) => {
        expect(res.redirects[0]).to.contain('https://accounts.google.com/o/oauth2');
        done();
      });
  });
});

describe('Social Login with Facebook', () => {
  it('should return the facebook authentication webpage', (done) => {
    chai
      .request(app)
      .get(`${signupURL}/auth/facebook`)
      .end((err, res) => {
        expect(res.redirects[0]).to.contain('https://www.facebook.com');
        expect(res.redirects[0]).to.contain('oauth');
        done();
      });
  });
});
