import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('test search', () => {
  // Test search
  it('should return an article', (done) => {
    chai
      .request(app)
      .get('/api/search?title= This')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return error', (done) => {
    chai
      .request(app)
      .get('/api/search?title= moon')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('no article found, redefine keyword');
        done();
      });
  });
});

// Test filter
describe('test filter', () => {
  it('should return an article', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=This is an article')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return error', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=bland morning')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('no article found with title \'bland morning\'');
        done();
      });
  });
});
