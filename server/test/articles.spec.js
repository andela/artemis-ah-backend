import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import slugify from 'slug';
import app from '../app';

chai.use(chaiHttp);

/**
 * Method to check if a value is a number.
 *
 * USAGE: expect(..).to.be.a.number()
 */
chai.Assertion.addMethod('number', value => typeof value === 'number');

let userToken = null;

describe('Testing articles endpoint', () => {
  // Register a user to get jwt token.
  it('should create a new user', (done) => {
    const data = {
      firstname: 'Great',
      lastname: 'Author',
      email: 'greatauthor@gmail.com',
      username: 'greatauthor',
      password: '1234567'
    };
    chai
      .request(app)
      .post('/api/users')
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        const { body } = res;
        expect(body.message).to.be.a('string');
        expect(body.message).to.equal('user created successfully');

        userToken = body.user.token;

        done();
      });
  });

  // Test creating article.
  it('should create a new article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article',
      tagId: 1
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);

        const { article } = res.body;
        expect(article.id).to.be.a.number();
        expect(article.title).to.equal('This is an article');
        expect(article.slug).to.equal(`${slugify(data.title, { lower: true })}-${article.id}`);
        expect(article.description).to.equal('This is the description of the article');
        expect(article.body).to.equal('This is the body of the article');
        expect(article.tagId).to.equal(1);
        done();
      });
  });
});

// Test endpoint to get all articles.
describe('Test endpoint to get all articles.', () => {
  let pageOneFirstArticle = null;

  it('should get an array containing the article created above', (done) => {
    chai
      .request(app)
      .get('/api/articles')
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { articles } = res.body;
        expect(articles).to.be.an('array');
        expect(articles.length).to.be.at.least(1);
        const [article] = articles;
        pageOneFirstArticle = article;

        done();
      });
  });

  // Test limit.
  it('should return an empty array given limit is 0', (done) => {
    chai
      .request(app)
      .get('/api/articles?limit=0')
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { articles } = res.body;
        expect(articles).to.be.an('array');
        expect(articles.length).to.equal(0);

        done();
      });
  });

  // The second article article will be used to test pagination
  it('should create another article', (done) => {
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        title: 'The second article',
        description: 'This is the description of the second article',
        body: 'Welcome to the second article'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);

        done();
      });
  });

  // Test pagination.
  it('should return the articles on page 2', (done) => {
    chai
      .request(app)
      .get('/api/articles?page=2&limit=1')
      .end((err, res) => {
        expect(res.status).to.equal(200);

        const { articles } = res.body;
        expect(articles).to.be.an('array');

        expect(articles).to.satisfy((arr) => {
          if (arr.length === 0) {
            // Assuming there is nothing on page 2
            return true;
          }
          // Given that page=2 and limit=1, the id of first item on page 2 should 1 greater than
          // the id of the first element on page 1 since the table contains only the 2
          // articles created in this test file.
          return arr[0].id === pageOneFirstArticle.id + 1;
        });

        done();
      });
  });
});

describe('Testing Tags Endpoint', () => {
  it('should return all tags', (done) => {
    chai
      .request(app)
      .get('/api/articles/tags')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.tags[0].name).to.equal('Food');
        expect(res.body.tags[1].name).to.equal('Technology');
        expect(res.body.tags[2].name).to.equal('Art');
        expect(res.body.tags[3].name).to.equal('Finance');
        expect(res.body.tags[4].name).to.equal('Health');
        done();
      });
  });

  it('should associate a tag with an article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article',
      tagId: 1
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${userToken}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { article } = res.body;
        expect(article.tagId).to.equal(1);
        done();
      });
  });
});
