import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';

chai.use(chaiHttp);

const userDetails = {
  name: 'ayo',
  password: 'admin123456'
};

let userToken;
const userRoute = '/api/users';

describe('User Deactivation Endpoint', () => {
  before((done) => {
    chai
      .request(app)
      .post(`${userRoute}/login`)
      .send(userDetails)
      .end((err, res) => {
        userToken = res.body.user.token;
        done();
      });
  });

  it('should fail if password is wrong', (done) => {
    chai
      .request(app)
      .post(`${userRoute}/deactivate`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ password: 'dddffds' })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('Password is invalid');
        done();
      });
  });

  it('should fail if password is not provided', (done) => {
    chai
      .request(app)
      .post(`${userRoute}/deactivate`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Password is required for deactivation');
        done();
      });
  });

  it('should work if password is correct', (done) => {
    chai
      .request(app)
      .post(`${userRoute}/deactivate`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Deactivation Successful');
        chai
          .request(app)
          .post(`${userRoute}/login`)
          .send(userDetails)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Your account is inactive');
            chai
              .request(app)
              .get(`/api/profiles/${userDetails.name}`)
              .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal(`User with username ${userDetails.name} does not exist`);
                done();
              });
          });
      });
  });
});
