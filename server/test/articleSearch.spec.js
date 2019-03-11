import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('test search', () => {
  // Test search
  it('should return 200 status and an article', (done) => {
    chai
      .request(app)
      .get('/api/search?title= This')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });

  it('should return 404 error when keyword is not found on any article', (done) => {
    chai
      .request(app)
      .get('/api/search?title= moon')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('no article found, redefine keyword');
        done();
      });
  });
});

// Test filter
describe('test filter', () => {
  it('should return 200 error and an article', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=This is an article')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });

  it('should return 404 error wen title is not found', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=bland morning')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('no article found with title \'bland morning\'');
        done();
      });
  });
});
