import supertest from 'supertest';
import { expect } from 'chai';
import app from '../app';

describe('Testing articles endpoint', () => {
  // Test creating article.
  it('It should create a new article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article',
    };
    supertest(app)
      .post('/api/articles')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
