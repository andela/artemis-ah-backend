import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { HelperUtils } from '../utils';
import app from '../app';


chai.use(chaiHttp);

const testEmail = 'thatemail@yahoo.com';
const signupURL = '/api/users';
const verifyURL = `/api/users/verifyemail?email=${testEmail}&hash=${HelperUtils.hashPassword(testEmail)}`;
const invalidVerifyURL = `/api/users/verifyemail?email=${'invalid.email@gmail.com'}&hash=${HelperUtils.hashPassword('iamEvenmoreInvalid@rocketmail.com')}`;

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
      email: testEmail,
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
