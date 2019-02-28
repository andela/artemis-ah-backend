import supertest from 'supertest';
import app from '../app';
import { expect } from 'chai';

describe('Testing articles endpoint', () => {

  // Test creating article.
  it('It should create a new article', (done) => {
    const data = {
      'title': 'This is an article',
      'description': 'This is the description of the article',
      'body': 'This is the body of the article',
    };
    supertest(app)
      .post('/api/articles')
      .send(data)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);

        expect(res.body.data.title).to.equal('This is an article');
        expect(res.body.data.description).to.equal('This is the description of the article');
        expect(res.body.data.body).to.equal('This is the body of the article');

        done();
      });
  });
  
});

/**
 * {
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
 */