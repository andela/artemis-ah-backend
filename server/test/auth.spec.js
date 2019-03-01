import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET articles', () => {
  it('should return an error if no token is specified', (done) => {
    chai
      .request(app)
      .get('/api/articles')
      .set('authorization', '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        const { token } = res.body.error;
        expect(token[0]).to.equal('No authorization header was specified.');
        done(err);
      });
  });

  it('should return an error if token is invalid', (done) => {
    chai
      .request(app)
      .get('/api/articles')
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        const { token } = res.body.error;
        expect(token[0]).to.equal('The provided token is invalid.');
        done(err);
      });
  });
});
