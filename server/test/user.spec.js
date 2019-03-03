import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

const signupURL = '/api/users';
const verifyURL =  '/api/users/verifyemail?email=nwabuzor.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';
const invalidVerifyURL =  '/api/users/verifyemail?email=invalid.obiora@gmail.com&hash=$2a$08$vu6Gwj1EgU7/6IJv6juphuraxOv6tOHaeNOvWmsjh0oYHOLRO8/9q';

describe('Test signup endpoint and email verification endpoint', () => {
  it("It should return a 404 if user don't exist during email verification", (done) => {
    chai
      .request(app)
      .get(verifyURL)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal("user doesn't exist");
        done();
      });
  });

  it('It should return a 201 and create a new user', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'nwabuzor.obiora@gmail.com',
      username: 'john45',
      password: '12345678'
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

  it('it should return a 409 if email exists', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'nwabuzor.obiora@gmail.com',
      username: 'john456',
      password: '12345678'
    };
    chai
      .request(app)
      .post(signupURL)
      .send(data)
      .end((err, res) => {
        const { email } = res.body.errors;
        expect(res.status).to.equal(409);
        expect(email[0]).to.equal('email already exists.');
        done(err);
      });
  });

  it('it should return a 409 if username exists', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'nwabuzor.obiora2@gmail.com',
      username: 'john45',
      password: '12345678'
    };
    chai
      .request(app)
      .post(signupURL)
      .send(data)
      .end((err, res) => {
        const { username } = res.body.errors;
        expect(res.status).to.equal(409);
        expect(username[0]).to.equal('username already exists.');
        done(err);
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

  it('should return 400 if email is empty', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'John',
        lastname: 'Doe',
        username: 'john45',
        password: '1234567'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        const { email } = res.body.errors;
        expect(email[0]).to.be.equal('Email field cannot be blank.');
        done(err);
      });
  });

  it('should return 400 if email is invalid', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'nwabuzor',
        username: 'john45',
        password: '1234567'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        const { email } = res.body.errors;
        expect(email[0]).to.be.equal('Email is invalid.');
        done(err);
      });
  });

  it('should return 400 if password is not alphanumeric', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'nwabuzor.obiora@gmail.com',
        username: 'john45',
        password: ''
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        const { password } = res.body.errors;
        expect(password[0]).to.be.equal('Password must be Alphanumeric.');
        done(err);
      });
  });

  it('should return 400 if password is less than 8 characters', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'nwabuzor.obiora@gmail.com',
        username: 'john45',
        password: '12345'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        const { password } = res.body.errors;
        expect(password[0]).to.be.equal(
          'Password cannot be less than 8 characters.'
        );
        done(err);
      });
  });
});
