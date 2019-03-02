import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

const signupURL = '/api/users';
const verifyURL = '/api/users/verifyemail?email=nwabuzor.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const invalidVerifyURL = '/api/users/verifyemail?email=invalid.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const userURL = '/api/user';
const profileURL = '/api/profiles';
const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJBZGFlemUiLCJsYXN0bmFtZSI6Ik9kdXJ1a3dlIiwidXNlcm5hbWUiOiJtZW93d3d3d3ciLCJlbWFpbCI6ImRhaXp5b2R1cnVrd2VAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkMWtBNDh4SmtDSTQ4ME15d3c1TlBDdU1Ma1pnekxiMjZUZnQ3NDF0ZDVkdTl0ek1WcS5BMC4iLCJpYXQiOjE1NTE1MjAxODl9.aCGlw9rbj_PRTMhxQJE0kM1cSUzUbygfzVW8bjtNAUQ';
let userToken;

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

describe('Get user data', () => {
  it('It should return a 201 and create a new user', (done) => {
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
  describe('get endpoints', () => {
    it('It should return 200 if user exists', (done) => {
      chai
        .request(app)
        .get(userURL)
        .set('x-access-token', userToken)
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
        .set('x-access-token', wrongToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.be.a('string');
          done();
        });
    });

    it('It should return 401 if token is missing', (done) => {
      chai
        .request(app)
        .get(userURL)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('unauthorized');
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
          .set('x-access-token', userToken)
          .send(data)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('user updated');
            expect(res.body.user).to.have.a('object');
            done();
          });
      });

      it('It should return 401 for wrong jwt', (done) => {
        chai
          .request(app)
          .get(userURL)
          .set('x-access-token', wrongToken)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.be.a('string');
            done();
          });
      });

      it('It should return 401 if token is missing', (done) => {
        chai
          .request(app)
          .get(userURL)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('unauthorized');
            done();
          });
      });
    });
  });
});
