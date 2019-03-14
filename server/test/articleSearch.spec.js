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
        expect(res.body.allResults).to.be.an('array');
        done();
      });
  });

  it('should return a 200 if author is found in filter result', (done) => {
    chai
      .request(app)
      .get('/api/filter/authors?title=Great')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        const { users } = res.body;
        expect(users[0].firstname).to.be.equal('Great');
        done(err);
      });
  });

  it('should return a 404 if author is not found in filter result', (done) => {
    chai
      .request(app)
      .get('/api/filter/authors?title=Rhaegal')
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.equal('No such author exists.');
        done(err);
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
  it('should return 200 success and an article', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=This is an article&tag=Food&author=greatauthor')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array');
        const { tagId } = res.body.articles[0];
        const { userId } = res.body.articles[0];
        expect(tagId).to.be.a('number');
        expect(userId).to.be.a('number');
        done();
      });
  });

  it('should return 200 error and an article', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=This is an article&tag=&author=')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });

  it('should return 404 error when article is not found', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=bland morning&tag=tech&author=nameless')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('No article found with that match');
        done();
      });
  });

  it('should return 404 error when there is no parameter for tag', (done) => {
    chai
      .request(app)
      .get('/api/filter?title=bland morning&tag=&author=nameless')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('No article found with that match');
        done();
      });
  });
});
