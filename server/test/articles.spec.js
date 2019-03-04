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
chai.Assertion.addMethod('number', (value) => {
  return typeof value === 'number';
});

let token = null;

describe('Testing articles endpoint', () => {

  // Register a user to get jwt token.
  it('It should create a new user', (done) => {
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

        token = body.user.token;

        done();
      });
  });

  // Test creating article.
  it('It should create a new article', (done) => {
    const data = {
      title: 'This is an article',
      description: 'This is the description of the article',
      body: 'This is the body of the article',
    };
    chai
      .request(app)
      .post('/api/articles')
      .set('authorization', `Bearer ${token}`)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        
        const { article } = res.body;
        expect(article.id).to.be.a.number();
        expect(article.title).to.equal('This is an article');
        expect(article.slug).to.equal(`${slugify(data.title, { lower: true })}-${article.id}`);
        expect(article.description).to.equal('This is the description of the article');
        expect(article.body).to.equal('This is the body of the article');

        done();
      });
  });
});
