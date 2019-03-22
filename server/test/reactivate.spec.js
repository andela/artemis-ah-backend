import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import { HelperUtils } from '../utils';
import app from '../app';

dotenv.config();

chai.use(chaiHttp);

const testEmail = 'nwabuzor.obiora@gmail.com';
const QueryURL = `?email=${testEmail}&token=${HelperUtils.timedToken(HelperUtils.hashPassword(testEmail), 900)}`;
const reactivationURL = `/api/users/reactivate${QueryURL}`;
const sentReactivationLinkURL = '/api/users/reactivate';
const expiredURL = `/api/users/reactivate?email=${testEmail}&token=${HelperUtils.timedToken(HelperUtils.hashPassword(testEmail), 0)}`;
const invalidURL = `/api/users/reactivate?email=${'xyz@yahoo.com'}&token=${HelperUtils.timedToken(HelperUtils.hashPassword('wontmatch@gmail.com'), 900)}`;


describe('Test Reactivation of account endpoint', () => {
  it('It should return 200 if email is sent', (done) => {
    chai
      .request(app)
      .post(sentReactivationLinkURL)
      .send({ email: testEmail })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Please, check your mail box for your reactivation link');
        done();
      });
  });


  it('It should return 200 if account has been reactivated', (done) => {
    chai
      .request(app)
      .get(reactivationURL)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Your account has been reactivated, please login now');
        done();
      });
  });

  it('It should return 400 and not send email if account is active', (done) => {
    chai
      .request(app)
      .post(sentReactivationLinkURL)
      .send({ email: testEmail })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Your account is active already');
        done();
      });
  });

  it('It should return 400 if account is active already', (done) => {
    chai
      .request(app)
      .get(reactivationURL)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('You have been reactivated already');
        done();
      });
  });

  it('It should return 400 if reactivation link has expired', (done) => {
    chai
      .request(app)
      .get(expiredURL)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('reactivation link has expired');
        done();
      });
  });

  it('It should return 400 if reactivation link is invalid', (done) => {
    chai
      .request(app)
      .get(invalidURL)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('invalid reactivation link');
        done();
      });
  });
});
