import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;
const userData = {
  firstname: 'Chris',
  lastname: 'James',
  email: 'chreez@gmail.com',
  username: 'Chreez',
  password: '12345678'
};

let userToken;

describe('POST comment /api/articles/:id/comment', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/users')
      .send(userData)
      .end((err, res) => {
        const { token } = res.body.user;
        userToken = token;
        done(err);
      });
  });

  it('should create a new comment', (done) => {
    chai.request(app)
      .post('/api/articles/this-is-an-article-1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'This is a random comment'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        done(err);
      });
  });
});
