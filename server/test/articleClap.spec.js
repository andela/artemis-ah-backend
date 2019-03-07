import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();


const articleURL = '/api/articles';
const signupURL = '/api/users';
let userToken;
let secondUserToken;
let anArticleSlug = '';
const data = {
  firstUser: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'obiora44@gmail.com',
    username: 'john466',
    password: '1234567122'
  },
  secondUser: {
    firstname: 'adaeze',
    lastname: 'Doe',
    email: 'adaezeboo@gmail.com',
    username: 'john500',
    password: '1234536719'
  },
  createArticle: {
    title: 'some title',
    description: 'some weird talk',
    body: 'article body'
  }
};

chai.use(chaiHttp);

describe('Clap endpoint test', () => {
  // SignUp first user
  before('should create user', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send(data.firstUser)
      .end((err, res) => {
        userToken = res.body.user.token;
        done();
      });
  });
  // SignUp second user
  before('should create user', (done) => {
    chai
      .request(app)
      .post(signupURL)
      .send(data.secondUser)
      .end((err, res) => {
        secondUserToken = res.body.user.token;
        done();
      });
  });
  // Create article

  it('should create an article', (done) => {
    chai
      .request(app)
      .post(articleURL)
      .set('Authorization', `Bearer ${userToken}`)
      .send(data.createArticle)
      .end((err, res) => {
        anArticleSlug = res.body.article.slug;
        done();
      });
  });
  // Test for article not found
  it('should return 404 for article not found', (done) => {
    chai
      .request(app)
      .post(`${articleURL}/somenewarticleSlug/clapToggle`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('article not found');
        done();
      });
  });

  // Test article clap
  it('should like an article and return 200', (done) => {
    chai
      .request(app)
      .post(`${articleURL}/${anArticleSlug}/clapToggle`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you just clapped for this article');
        done();
      });
  });

  // Test for article belonging to the user
  it('user should be unable to clap for own article', (done) => {
    chai
      .request(app)
      .post(`${articleURL}/${anArticleSlug}/clapToggle`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you cannot clap for your own article');
        done();
      });
  });

  // Test clap retrieval
  it('should retrieve clap from an article and return 200', (done) => {
    chai
      .request(app)
      .post(`${articleURL}/${anArticleSlug}/clapToggle`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('you just retrieved your clap');
        done();
      });
  });
});
